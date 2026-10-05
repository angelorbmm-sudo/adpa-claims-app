import { Router } from "express";
import { query } from "../db.js";
import { requirePermission } from "../auth.js";

const router=Router();

router.get("/claims/:claimId", requirePermission("audit:read"), async (req,res,next)=>{
  try{
    const owns=await query("SELECT 1 FROM claims WHERE id=$1 AND organization_id=$2",[req.params.claimId,req.user.organization_id]);
    if(!owns.rowCount) return res.status(404).json({error:"Claim not found."});
    const r=await query(
      "SELECT id,actor_user_id,action,entity_type,entity_id,metadata_json,created_at FROM audit_events WHERE claim_id=$1 ORDER BY created_at DESC LIMIT 500",
      [req.params.claimId]
    );
    res.json({events:r.rows});
  }catch(e){next(e);}
});

export default router;
