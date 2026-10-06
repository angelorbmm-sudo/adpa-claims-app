import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requirePermission } from "../auth.js";
import { writeAuditEvent } from "../audit.js";
import { requireVerifiedPALicenseForClaim } from "../compliance.js";
import { financialInvariants } from "../financial.js";

const router = Router();
const ClaimPayload = z.object({
  id: z.string().min(1),
  insured: z.string().optional().default(""),
  property: z.string().optional().default(""),
  carrier: z.string().optional().default(""),
  claimNumber: z.string().optional().default(""),
  dateOfLoss: z.string().optional().default(""),
  causeOfLoss: z.string().optional().default(""),
  jurisdiction: z.enum(["CA","NV"]).optional().default("CA"),
  representationStatus: z.string().optional().default(""),
  mortgageServicer: z.string().optional().default(""),
  valuation: z.string().optional().default(""),
  valuationSource: z.string().optional().default(""),
  valuationReviewer: z.string().optional().default(""),
  notes: z.string().optional().default("")
}).passthrough();

router.get("/", requirePermission("claims:read"), async (req,res,next)=>{
  try{
    const r=await query("SELECT id,data_json,version FROM claims WHERE organization_id=$1 ORDER BY updated_at DESC",[req.user.organization_id]);
    res.json({claims:r.rows.map(x=>x.data_json),versions:Object.fromEntries(r.rows.map(x=>[x.id,x.version]))});
  }catch(e){next(e);}
});

router.get("/:id", requirePermission("claims:read"), async (req,res,next)=>{
  try{
    const r=await query("SELECT data_json, version FROM claims WHERE id=$1 AND organization_id=$2",[req.params.id,req.user.organization_id]);
    if(!r.rowCount) return res.status(404).json({error:"Claim not found."});
    res.json({claim:r.rows[0].data_json,version:r.rows[0].version});
  }catch(e){next(e);}
});

router.put("/:id", requirePermission("claims:write"), async (req,res,next)=>{
  try{
    const expectedVersion=req.body?._expectedVersion;
    const { _expectedVersion, ...body }=req.body||{};
    const parsed=ClaimPayload.parse({...body,id:req.params.id});
    const before=await query("SELECT data_json,version FROM claims WHERE id=$1 AND organization_id=$2",[req.params.id,req.user.organization_id]);
    const currentVersion=before.rows[0]?.version||0;
    if(expectedVersion!==undefined&&Number(expectedVersion)!==currentVersion){
      return res.status(409).json({error:"Claim changed since it was loaded. Refresh and reconcile before saving.",currentVersion});
    }
    const nextVersion=currentVersion+1;
    await query(
      `INSERT INTO claims
       (id,organization_id,insured,property,carrier,claim_number,date_of_loss,cause_of_loss,jurisdiction,representation_status,mortgage_servicer,valuation,valuation_source,valuation_reviewer,notes,data_json,version,created_by,updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,NULLIF($7,'')::date,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$18)
       ON CONFLICT (organization_id, id) DO UPDATE SET
        insured=EXCLUDED.insured, property=EXCLUDED.property, carrier=EXCLUDED.carrier,
        claim_number=EXCLUDED.claim_number, date_of_loss=EXCLUDED.date_of_loss, cause_of_loss=EXCLUDED.cause_of_loss,
        jurisdiction=EXCLUDED.jurisdiction, representation_status=EXCLUDED.representation_status, mortgage_servicer=EXCLUDED.mortgage_servicer,
        valuation=EXCLUDED.valuation, valuation_source=EXCLUDED.valuation_source, valuation_reviewer=EXCLUDED.valuation_reviewer,
        notes=EXCLUDED.notes, data_json=EXCLUDED.data_json, version=EXCLUDED.version,
        updated_by=EXCLUDED.updated_by, updated_at=now()`,
      [parsed.id,req.user.organization_id,parsed.insured,parsed.property,parsed.carrier,parsed.claimNumber,parsed.dateOfLoss,parsed.causeOfLoss,parsed.jurisdiction,parsed.representationStatus,parsed.mortgageServicer,parsed.valuation,parsed.valuationSource,parsed.valuationReviewer,parsed.notes,parsed,nextVersion,req.user.id]
    );
    await writeAuditEvent({actorUserId:req.user.id,organizationId:req.user.organization_id,claimId:parsed.id,action:before.rowCount?"claim.update":"claim.create",entityType:"claim",entityId:parsed.id,before:before.rows[0]?.data_json||null,after:parsed,metadata:{version:nextVersion,organizationId:req.user.organization_id}});
    res.json({claim:parsed,version:nextVersion});
  }catch(e){next(e);}
});

router.post("/:id/release-check", requirePermission("claims:release"), requireVerifiedPALicenseForClaim, async (req,res,next)=>{
  try{
    const r=await query("SELECT data_json FROM claims WHERE id=$1 AND organization_id=$2",[req.params.id,req.user.organization_id]);
    if(!r.rowCount) return res.status(404).json({error:"Claim not found."});
    const claim=r.rows[0].data_json||{};
    const reasons=[];
    const compliance=claim.compliance||{}, representation=claim.representation||{};
    if(compliance.contractStatus!=="Executed") reasons.push("Representation contract not verified executed.");
    if(claim.jurisdiction==="CA"&&compliance.disclosureStatus!=="Delivered before contract") reasons.push("California pre-contract disclosure sequence not verified.");
    if(!representation.templateVerified||!representation.signedDate) reasons.push("Representation template/signing evidence incomplete.");
    const pkg=(claim.packages||[]).at(-1);
    if(!pkg) reasons.push("No claim package exists.");
    if(pkg&&(pkg.status==="Superseded"||String(pkg.status||"").startsWith("Stale"))) reasons.push("Latest claim package is not current.");
    const hash=pkg?.snapshotHash||"";
    const approvals=claim.approvals||[];
    for(const stage of ["Operational Review","Licensed PA Approval","Client Authorization"]){
      const ok=approvals.some(a=>a.packageHash===hash&&a.stage===stage&&/approve|author/i.test(a.decision||"")&&!a.revokedAt);
      if(!ok) reasons.push(stage+" missing for current package.");
    }
    const result={ready:reasons.length===0,reasons,packageHash:hash,jurisdiction:claim.jurisdiction,verifiedPALicense:req.verifiedPALicense};
    await writeAuditEvent({actorUserId:req.user.id,organizationId:req.user.organization_id,claimId:req.params.id,action:"claim.release_check",entityType:"claim",entityId:req.params.id,before:null,after:result,metadata:{organizationId:req.user.organization_id}});
    res.json(result);
  }catch(e){next(e);}
});

router.post("/:id/closure-check", requirePermission("claims:approve"), requireVerifiedPALicenseForClaim, async (req,res,next)=>{
  try{
    const db=await query("SELECT data_json FROM claims WHERE id=$1 AND organization_id=$2",[req.params.id,req.user.organization_id]);
    if(!db.rowCount) return res.status(404).json({error:"Claim not found."});
    const claim=db.rows[0].data_json||{}, reasons=[];
    const financial=financialInvariants(claim);
    reasons.push(...financial.reasons);
    if((claim.issues||[]).some(x=>x.status!=="Resolved")) reasons.push("Open issue files remain.");
    if((claim.criticalEvents||[]).some(x=>x.status!=="Resolved")) reasons.push("Open critical events remain.");
    if((claim.supplements||[]).some(x=>!["Resolved","Closed","Approved","Paid"].includes(x.status))) reasons.push("Open supplement/dispute records remain.");
    if((claim.recovery||[]).some(x=>x.status!=="Closed")) reasons.push("Open recovery follow-ups remain.");
    if((claim.deadlineClocks||[]).some(x=>x.status!=="Satisfied"&&(x.verifiedDueDate||x.dueDate)&&new Date((x.verifiedDueDate||x.dueDate)+"T23:59:59").getTime()<Date.now())) reasons.push("Overdue carrier clocks remain unresolved.");
    const compliance=claim.compliance||{}, representation=claim.representation||{};
    if(compliance.licenseStatus!=="Verified") reasons.push("Claim compliance record does not show verified PA license.");
    if(!(compliance.contractStatus==="Executed"||(representation.templateVerified&&representation.signedDate&&representation.insuredCopyDelivered&&representation.feeTermsVerified))) reasons.push("Representation contract is not verified.");
    if(claim.jurisdiction==="CA"&&!(compliance.disclosureStatus==="Delivered before contract"||representation.disclosureBeforeSigning)) reasons.push("California disclosure-before-contract sequence is not verified.");

    const pkg=(claim.packages||[]).at(-1), hash=pkg?.snapshotHash||"";
    if(!pkg||pkg.status==="Superseded"||String(pkg.status||"").startsWith("Stale")) reasons.push("Final package is missing or stale.");
    const approvals=claim.approvals||[];
    if(!approvals.some(a=>a.packageHash===hash&&a.stage==="Licensed PA Approval"&&/approve/i.test(a.decision||"")&&!a.revokedAt)) reasons.push("Licensed PA approval missing.");
    if(!approvals.some(a=>a.packageHash===hash&&a.stage==="Client Authorization"&&/author|approve/i.test(a.decision||"")&&!a.revokedAt)) reasons.push("Client authorization missing.");
    const result={ready:!reasons.length,reasons,packageHash:hash,financial:financial.dollars,financialExactCents:financial.cents,verifiedPALicense:req.verifiedPALicense};
    await writeAuditEvent({actorUserId:req.user.id,organizationId:req.user.organization_id,claimId:req.params.id,action:"claim.closure_check",entityType:"claim",entityId:req.params.id,before:null,after:result,metadata:{organizationId:req.user.organization_id}});
    res.json(result);
  }catch(e){next(e);}
});


export default router;
