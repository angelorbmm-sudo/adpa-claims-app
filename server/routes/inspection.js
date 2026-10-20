import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { requirePermission } from '../auth.js';
import { query } from '../db.js';
import { writeAuditEvent } from '../audit.js';
import { AnalysisRequest, suggestInspection } from '../inspectionAI.js';
export function createInspectionRouter({queryFn=query,audit=writeAuditEvent,suggest=suggestInspection}={}) {
const router=Router();
const inflight=new Set(), lastRequest=new Map();
router.get('/status',requirePermission('claims:write'),(req,res)=>res.json({configured:Boolean(process.env.OPENAI_API_KEY&&process.env.INSPECTION_AI_MODEL)}));
router.post('/:claimId/analyze',requirePermission('claims:write'),async(req,res,next)=>{
 const key=`${req.user.organization_id}/${req.user.id}`;
 let acquired=false;
 try{
  const input=AnalysisRequest.parse(req.body);
  const found=await queryFn('SELECT data_json FROM claims WHERE organization_id=$1 AND id=$2',[req.user.organization_id,req.params.claimId]);
  if(!found.rowCount)return res.status(404).json({error:'Claim not found.'});
  const claim=found.rows[0].data_json;
  const room=claim.inspection?.rooms?.find(r=>r.id===input.roomId);
  if(!room)return res.status(404).json({error:'Save the inspection room before requesting analysis.'});
  if(input.frames.some(f=>!room.evidenceIds.includes(f.evidenceId)||!(claim.documents||[]).some(d=>d.id===f.evidenceId)))return res.status(400).json({error:'Every frame must reference evidence linked to this saved room.'});
  if(inflight.has(key)||Date.now()-(lastRequest.get(key)||0)<15000)return res.status(429).json({error:'An analysis is running or was recently requested. Retry shortly.'});
  inflight.add(key);acquired=true;lastRequest.set(key,Date.now());
  for(const [id,time] of lastRequest)if(Date.now()-time>60000)lastRequest.delete(id);
  const model=process.env.INSPECTION_AI_MODEL;
  const output=await suggest({room,frames:input.frames,apiKey:process.env.OPENAI_API_KEY,model});
  const analysisId=randomUUID(),createdAt=new Date().toISOString();
  await audit({actorUserId:req.user.id,organizationId:req.user.organization_id,claimId:req.params.claimId,action:'inspection.ai_suggested',entityType:'inspection_room',entityId:room.id,after:{analysisId,model,createdAt,...output},metadata:{frameSources:input.frames.map(({dataUrl,...ref})=>ref),reviewRequired:true}});
  res.json({analysisId,createdAt,model,suggestion:output.suggestion});
 }catch(e){next(e);}finally{if(acquired)inflight.delete(key);}
});
return router;
}
export default createInspectionRouter();
