import { Router } from "express";
import { z } from "zod";
import { query, withTransaction } from "../db.js";
import { requirePermission } from "../auth.js";

const router=Router();
const ImportPayload=z.object({claims:z.array(z.object({id:z.string().min(1)}).passthrough()).max(500)});

router.post("/workspace", requirePermission("claims:write"), async (req,res,next)=>{
  try{
    const body=ImportPayload.parse(req.body);
    await withTransaction(async client=>{
      for(const claim of body.claims){
        await client.query(
          `INSERT INTO claims (id,organization_id,insured,carrier,claim_number,data_json,created_by,updated_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$7)
           ON CONFLICT (id) DO UPDATE SET data_json=EXCLUDED.data_json, insured=EXCLUDED.insured,
             carrier=EXCLUDED.carrier, claim_number=EXCLUDED.claim_number, updated_by=EXCLUDED.updated_by,
             updated_at=now(), version=claims.version+1`,
          [claim.id,req.user.organization_id,claim.insured||"",claim.carrier||"",claim.claimNumber||"",claim,req.user.id]
        );
      }
      await client.query(
        "INSERT INTO migration_imports (organization_id,actor_user_id,source,claim_count,details_json) VALUES ($1,$2,$3,$4,$5)",
        [req.user.organization_id,req.user.id,"browser-localStorage",body.claims.length,{key:"adpa-claims-workspace-v1"}]
      );
    });
    res.json({imported:body.claims.length});
  }catch(e){next(e);}
});

export default router;
