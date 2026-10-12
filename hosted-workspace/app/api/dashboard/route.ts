import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from '@/db/store';
import { summarizeClaim } from '@/app/dashboard-summary';
export const dynamic='force-dynamic';
export async function GET(){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Please sign in.'},{status:401,headers:{'Cache-Control':'no-store'}});
 try{const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const result=await database().prepare(`SELECT c.id,c.name,c.address,c.updated,c.version,
 json_extract(c.state,'$.coverageRouting') AS routing,
 json_extract(c.state,'$.profile') AS profile,json_extract(c.state,'$.commTasks') AS tasks,
 json_extract(c.state,'$.receipts') AS receipts,json_extract(c.state,'$.supplements') AS supplements,json_extract(c.state,'$.draws') AS draws,
 json_extract(c.state,'$.savedDrafts') AS drafts,json_extract(c.state,'$.items') AS items,
 (SELECT json_group_array(json_object('name',json_extract(b.value,'$.name'),'limit',json_extract(b.value,'$.limit'),'requested',json_extract(b.value,'$.requested'),'received',json_extract(b.value,'$.received'),'policyStatus',json_extract(b.value,'$.policyStatus'))) FROM json_each(c.state,'$.buckets') b) AS buckets,
 COALESCE(json_array_length(c.state,'$.communications'),0) AS messageCount,
 (SELECT json_object('subject',json_extract(m.value,'$.subject'),'sender',json_extract(m.value,'$.sender'),'timestamp',json_extract(m.value,'$.timestamp'),'direction',json_extract(m.value,'$.direction')) FROM json_each(c.state,'$.communications') m ORDER BY json_extract(m.value,'$.timestamp') DESC LIMIT 1) AS latestMessage,
 (SELECT COUNT(*) FROM evidence e WHERE e.claim_id=c.id AND e.owner=c.owner) AS fileCount
 FROM claims c WHERE c.owner=? ORDER BY c.updated DESC`).bind(user.userId).all();
 return Response.json({today,claims:result.results.map(r=>summarizeClaim(r,today))},{headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error('Dashboard load failed',error);return Response.json({error:'The dashboard could not load. Please try again.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
