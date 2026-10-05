import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requirePermission } from "../auth.js";
import { writeAuditEvent } from "../audit.js";

const router = Router();
const ClaimPayload = z.object({
  id: z.string().min(1),
  insured: z.string().optional().default(""),
  property: z.string().optional().default(""),
  carrier: z.string().optional().default(""),
  claimNumber: z.string().optional().default(""),
  dateOfLoss: z.string().optional().default(""),
  causeOfLoss: z.string().optional().default(""),
  representationStatus: z.string().optional().default(""),
  mortgageServicer: z.string().optional().default(""),
  valuation: z.string().optional().default(""),
  valuationSource: z.string().optional().default(""),
  valuationReviewer: z.string().optional().default(""),
  notes: z.string().optional().default("")
}).passthrough();

router.get("/", requirePermission("claims:read"), async (req,res,next)=>{
  try{
    const r=await query("SELECT data_json FROM claims WHERE organization_id=$1 ORDER BY updated_at DESC",[req.user.organization_id]);
    res.json({claims:r.rows.map(x=>x.data_json)});
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
    const parsed=ClaimPayload.parse({...req.body,id:req.params.id});
    const before=await query("SELECT data_json,version FROM claims WHERE id=$1 AND organization_id=$2",[req.params.id,req.user.organization_id]);
    const nextVersion=(before.rows[0]?.version||0)+1;
    await query(
      `INSERT INTO claims
       (id,organization_id,insured,property,carrier,claim_number,date_of_loss,cause_of_loss,representation_status,mortgage_servicer,valuation,valuation_source,valuation_reviewer,notes,data_json,version,created_by,updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,NULLIF($7,'')::date,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$17)
       ON CONFLICT (id) DO UPDATE SET
        insured=EXCLUDED.insured, property=EXCLUDED.property, carrier=EXCLUDED.carrier,
        claim_number=EXCLUDED.claim_number, date_of_loss=EXCLUDED.date_of_loss, cause_of_loss=EXCLUDED.cause_of_loss,
        representation_status=EXCLUDED.representation_status, mortgage_servicer=EXCLUDED.mortgage_servicer,
        valuation=EXCLUDED.valuation, valuation_source=EXCLUDED.valuation_source, valuation_reviewer=EXCLUDED.valuation_reviewer,
        notes=EXCLUDED.notes, data_json=EXCLUDED.data_json, version=EXCLUDED.version,
        updated_by=EXCLUDED.updated_by, updated_at=now()`,
      [parsed.id,req.user.organization_id,parsed.insured,parsed.property,parsed.carrier,parsed.claimNumber,parsed.dateOfLoss,parsed.causeOfLoss,parsed.representationStatus,parsed.mortgageServicer,parsed.valuation,parsed.valuationSource,parsed.valuationReviewer,parsed.notes,parsed,nextVersion,req.user.id]
    );
    await writeAuditEvent({actorUserId:req.user.id,claimId:parsed.id,action:before.rowCount?"claim.update":"claim.create",entityType:"claim",entityId:parsed.id,before:before.rows[0]?.data_json||null,after:parsed,metadata:{version:nextVersion,organizationId:req.user.organization_id}});
    res.json({claim:parsed,version:nextVersion});
  }catch(e){next(e);}
});

export default router;
