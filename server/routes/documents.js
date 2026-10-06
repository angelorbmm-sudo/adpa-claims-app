import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requirePermission } from "../auth.js";
import { createUploadIntent, storageStatus } from "../storage.js";
import { writeAuditEvent } from "../audit.js";

const router = Router();
const Metadata = z.object({
  id:z.string().min(1), fileName:z.string().min(1), mimeType:z.string().min(1),
  sizeBytes:z.number().int().nonnegative(), sha256:z.string().regex(/^[a-f0-9]{64}$/i),
  category:z.string().optional().default("Other"), coverageTag:z.string().optional().default("General"),
  source:z.string().optional().default("")
});

async function ownsClaim(req,res){
  const r=await query("SELECT 1 FROM claims WHERE organization_id=$1 AND id=$2",[req.user.organization_id,req.params.claimId]);
  if(!r.rowCount){res.status(404).json({error:"Claim not found."});return false;} return true;
}

router.get("/:claimId",requirePermission("documents:read"),async(req,res,next)=>{
 try{if(!(await ownsClaim(req,res)))return;
 const r=await query(`SELECT id,file_name,mime_type,size_bytes,sha256,category,coverage_tag,source,storage_status,review_status,metadata_json,created_at
 FROM claim_documents WHERE organization_id=$1 AND claim_id=$2 ORDER BY created_at DESC`,[req.user.organization_id,req.params.claimId]);
 res.json({documents:r.rows,storage:storageStatus()});}catch(e){next(e);}
});

router.post("/:claimId/upload-intent",requirePermission("documents:write"),async(req,res,next)=>{
 try{if(!(await ownsClaim(req,res)))return; const m=Metadata.parse(req.body);
 const dup=await query("SELECT id FROM claim_documents WHERE organization_id=$1 AND claim_id=$2 AND sha256=$3 LIMIT 1",[req.user.organization_id,req.params.claimId,m.sha256]);
 if(dup.rowCount)return res.status(409).json({error:"Duplicate evidence fingerprint already exists for this claim.",existingId:dup.rows[0].id});
 const objectKey=req.user.organization_id+"/"+req.params.claimId+"/"+m.id;
 const intent=await createUploadIntent({objectKey,contentType:m.mimeType,sizeBytes:m.sizeBytes,sha256:m.sha256});
 await query(`INSERT INTO claim_documents(id,claim_id,organization_id,category,coverage_tag,file_name,mime_type,size_bytes,sha256,object_key,storage_status,review_status,source,metadata_json,created_by)
 VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'upload_pending','Unreviewed',$11,$12,$13)`,
 [m.id,req.params.claimId,req.user.organization_id,m.category,m.coverageTag,m.fileName,m.mimeType,m.sizeBytes,m.sha256,objectKey,m.source,{original:true},req.user.id]);
 await writeAuditEvent({actorUserId:req.user.id,organizationId:req.user.organization_id,claimId:req.params.claimId,action:"evidence.upload_intent",entityType:"claim_document",entityId:m.id,after:{...m,objectKey,storageStatus:"upload_pending"}});
 res.status(201).json({documentId:m.id,objectKey,upload:intent});}catch(e){next(e);}
});

router.post("/:claimId/:documentId/complete",requirePermission("documents:write"),async(req,res,next)=>{
 try{if(!(await ownsClaim(req,res)))return;
 const r=await query(`UPDATE claim_documents SET storage_status='quarantine',metadata_json=metadata_json || $1::jsonb
 WHERE id=$2 AND claim_id=$3 AND organization_id=$4 AND storage_status='upload_pending'
 RETURNING id,sha256,object_key,storage_status`,[JSON.stringify({clientCompletedAt:new Date().toISOString()}),req.params.documentId,req.params.claimId,req.user.organization_id]);
 if(!r.rowCount)return res.status(409).json({error:"Evidence record is missing or not awaiting upload completion."});
 await writeAuditEvent({actorUserId:req.user.id,organizationId:req.user.organization_id,claimId:req.params.claimId,action:"evidence.upload_complete",entityType:"claim_document",entityId:req.params.documentId,after:r.rows[0]});
 res.json({document:r.rows[0],message:"Upload recorded in quarantine. Server-side object verification and malware scan must promote it to ready."});}catch(e){next(e);}
});

export default router;
