import {getChatGPTUser} from '@/app/chatgpt-auth';
import {database} from '@/db/store';
import {z} from 'zod';
import {mitigationClaim,mitigationReview} from '@/lib/mitigation-adapter';
import {mitigationSnapshot,MITIGATION_LISTS} from '@/lib/mitigation-review.js';
export const dynamic='force-dynamic';
const input=z.discriminatedUnion('action',[
 z.object({action:z.literal('save'),version:z.number().int().positive(),mitigation:z.record(z.unknown())}).strict(),
 z.object({action:z.literal('documentReview'),version:z.number().int().positive(),fileId:z.string().max(200),status:z.enum(['Verified','Unreviewed']),note:z.string().trim().min(1).max(2000)}).strict(),
 z.object({action:z.literal('review'),version:z.number().int().positive(),reviewer:z.string().trim().min(1).max(200)}).strict()
]);
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
async function load(request:Request,owner:string){const id=new URL(request.url).searchParams.get('id');if(!id)return null;const db=database(),row=await db.prepare('SELECT id,name,state,version,updated FROM claims WHERE id=? AND owner=?').bind(id,owner).first();if(!row)return null;const result=await db.prepare('SELECT id,filename,category,created FROM evidence WHERE claim_id=? AND owner=? ORDER BY id').bind(id,owner).all();return {db,row,state:JSON.parse(String(row.state)),files:result.results};}
function response(data:any){const claim=mitigationClaim(data.state,data.files,String(data.row.name),String(data.row.id));return {claim,files:data.files,version:data.row.version,updated:data.row.updated,readiness:mitigationReview(claim)};}
export async function GET(request:Request){const actor=await getChatGPTUser();if(!actor)return json({error:'Please sign in.'},401);try{const data=await load(request,actor.userId);return data?json(response(data)):json({error:'Claim not found.'},404);}catch{return json({error:'Mitigation records could not load.'},503);}}
export async function POST(request:Request){const actor=await getChatGPTUser();if(!actor)return json({error:'Please sign in.'},401);const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Request origin rejected.'},403);try{
 const text=await request.text();if(text.length>500000)return json({error:'Mitigation request too large.'},413);const body=input.parse(JSON.parse(text)),data=await load(request,actor.userId);if(!data)return json({error:'Claim not found.'},404);if(Number(data.row.version)!==body.version)return json({error:'A newer claim version exists. Refresh before saving; your entries remain here.'},409);
 const now=new Date().toISOString(),prior=data.state.mitigation||{};let m={...prior};
 if(body.action==='save'){for(const key of MITIGATION_LISTS){const rows=body.mitigation[key];if(rows!==undefined&&(!Array.isArray(rows)||rows.length>2000||rows.some(x=>!x||typeof x!=='object'||Array.isArray(x))))return json({error:'Invalid or oversized mitigation records.'},400);}m={...body.mitigation,documentReviews:prior.documentReviews||{},review:prior.review||null};}
 if(body.action==='documentReview'){const f=data.files.find((x:any)=>x.id===body.fileId);if(!f)return json({error:'Evidence must belong to this claim.'},400);m.documentReviews={...(prior.documentReviews||{}),[body.fileId]:{status:body.status,note:body.note,sourceCreated:f.created,at:now,actor:actor.email}};}
 if(body.action==='review'){const current=mitigationClaim(data.state,data.files);const r=mitigationReview(current);if(!r.applicable||!r.evidenceReady)return json({error:'Resolve evidence gaps before final review.'},400);m.review={reviewer:body.reviewer,reviewedAt:now,actor:actor.email,snapshot:mitigationSnapshot(current)};}
 // Audits are outside the fact snapshot so a review does not invalidate itself.
 const next={...data.state,mitigation:m,mitigationAudit:[...(Array.isArray(data.state.mitigationAudit)?data.state.mitigationAudit:[]),{action:body.action,actor:actor.email,at:now,priorVersion:body.version}].slice(-500)};
 const serialized=JSON.stringify(next);if(serialized.length>1000000)return json({error:'Claim is too large.'},413);
 const changed=await data.db.prepare('UPDATE claims SET state=?,updated=?,version=version+1 WHERE id=? AND owner=? AND version=?').bind(serialized,now,data.row.id,actor.userId,body.version).run();if(!changed.meta.changes)return json({error:'Another save occurred. Refresh before retrying.'},409);
 return json(response({...data,state:next,row:{...data.row,version:body.version+1,updated:now}}));
 }catch(error){if(error instanceof z.ZodError||error instanceof SyntaxError)return json({error:'Check mitigation request fields.'},400);console.error('Mitigation save failed',error);return json({error:'Mitigation save failed. Entries remain here.'},503);}}
