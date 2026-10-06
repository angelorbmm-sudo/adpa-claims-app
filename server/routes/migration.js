import { Router } from "express";
import { z } from "zod";
import { query, withTransaction } from "../db.js";
import { requirePermission } from "../auth.js";

const router=Router();
const Claim=z.object({
  id:z.string().min(1), insured:z.string().optional().default(""), property:z.string().optional().default(""),
  carrier:z.string().optional().default(""), claimNumber:z.string().optional().default(""), dateOfLoss:z.string().optional().default(""),
  causeOfLoss:z.string().optional().default(""), jurisdiction:z.enum(["CA","NV"]).optional().default("CA"),
  representationStatus:z.string().optional().default(""), mortgageServicer:z.string().optional().default(""),
  valuation:z.string().optional().default(""), valuationSource:z.string().optional().default(""),
  valuationReviewer:z.string().optional().default(""), notes:z.string().optional().default("")
}).passthrough();
const Preflight=z.object({claims:z.array(Claim).max(500)});
const ImportPayload=Preflight.extend({confirm:z.literal(true),mode:z.enum(["skip_existing","replace_existing"]).default("skip_existing")});

function readiness(claim){
  const warnings=[];
  if(!claim.jurisdiction) warnings.push("jurisdiction missing");
  if(!claim.insured) warnings.push("insured missing");
  if(!claim.carrier) warnings.push("carrier missing");
  if(!claim.claimNumber) warnings.push("claim number missing");
  if(!claim.dateOfLoss) warnings.push("date of loss missing");
  return warnings;
}

router.post("/preflight", requirePermission("claims:write"), async (req,res,next)=>{
  try{
    const body=Preflight.parse(req.body);
    const ids=body.claims.map(x=>x.id);
    const existing=ids.length?(await query("SELECT id FROM claims WHERE organization_id=$1 AND id=ANY($2::text[])",[req.user.organization_id,ids])).rows.map(x=>x.id):[];
    const claims=body.claims.map(c=>({id:c.id,jurisdiction:c.jurisdiction,warnings:readiness(c),alreadyExists:existing.includes(c.id)}));
    res.json({ready:claims.every(x=>!x.warnings.length),claimCount:claims.length,existingCount:existing.length,claims});
  }catch(e){next(e);}
});

router.post("/workspace", requirePermission("claims:write"), async (req,res,next)=>{
  try{
    const body=ImportPayload.parse(req.body); let imported=0,skipped=0,replaced=0;
    await withTransaction(async client=>{
      for(const claim of body.claims){
        const before=await client.query("SELECT data_json FROM claims WHERE id=$1 AND organization_id=$2",[claim.id,req.user.organization_id]);
        if(before.rowCount&&body.mode==="skip_existing"){skipped++;continue;}
        await client.query(
          `INSERT INTO claims (id,organization_id,insured,property,carrier,claim_number,date_of_loss,cause_of_loss,jurisdiction,representation_status,mortgage_servicer,valuation,valuation_source,valuation_reviewer,notes,data_json,created_by,updated_by)
           VALUES ($1,$2,$3,$4,$5,$6,NULLIF($7,'')::date,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$17)
           ON CONFLICT (organization_id, id) DO UPDATE SET insured=EXCLUDED.insured, property=EXCLUDED.property, carrier=EXCLUDED.carrier,
             claim_number=EXCLUDED.claim_number,date_of_loss=EXCLUDED.date_of_loss,cause_of_loss=EXCLUDED.cause_of_loss,
             jurisdiction=EXCLUDED.jurisdiction,representation_status=EXCLUDED.representation_status,mortgage_servicer=EXCLUDED.mortgage_servicer,
             valuation=EXCLUDED.valuation,valuation_source=EXCLUDED.valuation_source,valuation_reviewer=EXCLUDED.valuation_reviewer,
             notes=EXCLUDED.notes,data_json=EXCLUDED.data_json,updated_by=EXCLUDED.updated_by,updated_at=now(),version=claims.version+1`,
          [claim.id,req.user.organization_id,claim.insured,claim.property,claim.carrier,claim.claimNumber,claim.dateOfLoss,claim.causeOfLoss,claim.jurisdiction,claim.representationStatus,claim.mortgageServicer,claim.valuation,claim.valuationSource,claim.valuationReviewer,claim.notes,claim,req.user.id]
        );
        before.rowCount?replaced++:imported++;
        await client.query("INSERT INTO audit_events (organization_id,actor_user_id,claim_id,action,entity_type,entity_id,before_json,after_json,metadata_json) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
          [req.user.organization_id,req.user.id,claim.id,before.rowCount?"migration.claim_replaced":"migration.claim_imported","claim",claim.id,before.rows[0]?.data_json||null,claim,{source:"browser-localStorage",mode:body.mode}]);
      }
      await client.query("INSERT INTO migration_imports (organization_id,actor_user_id,source,claim_count,details_json) VALUES ($1,$2,$3,$4,$5)",
        [req.user.organization_id,req.user.id,"browser-localStorage",imported+replaced,{key:"adpa-claims-workspace-v1",mode:body.mode,imported,replaced,skipped}]);
    });
    res.json({imported,replaced,skipped,total:body.claims.length});
  }catch(e){next(e);}
});

export default router;
