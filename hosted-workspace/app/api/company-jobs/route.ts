import {getChatGPTUser} from '@/app/chatgpt-auth';
import {database} from '@/db/store';
import {ADPA_OWNER,companyAccess,companyState,companyView,jobAccess,companyCorrectionQueue} from '@/lib/company';
import {companyActor} from '@/lib/shared-jobs';
import {engagement,inspectionView} from '@/app/api/shared-jobs/route';
export const dynamic='force-dynamic';
const json=(d:any,status=200)=>Response.json(d,{status,headers:{'Cache-Control':'private, no-store'}});
const link=(path:string,cid:string,id:string)=>path+'?companyId='+encodeURIComponent(cid)+'&id='+encodeURIComponent(id);
function workSummary(assignment:any,sharedTasks:any[]=[]){
 const requests=companyCorrectionQueue(assignment?.tasks||[],assignment?.responses||[]).filter((r:any)=>r.status==='Open');
 const crew=(assignment?.tasks||[]).filter((t:any)=>t.kind!=='ADPA request'&&t.status==='Open');
 const needed=requests.find((r:any)=>r.stage==='Needs company response'),next=needed||crew[0]||sharedTasks.find((t:any)=>t.status==='Open')||requests[0];
 return {needsAction:!!next&&next.stage!=='Awaiting ADPA review',nextTask:next?{title:next.title,due:next.due||'',detail:next.stage||'Open task',source:needed||crew.includes(next)||requests.includes(next)?'specialist':'shared'}:null,adpaRequests:requests.length,awaitingReview:requests.filter((r:any)=>r.stage==='Awaiting ADPA review').length};
}
export async function GET(request:Request){
 const actor=await getChatGPTUser();if(!actor)return json({error:'Please sign in.'},401);
 try{
 const db=database(),q=new URL(request.url).searchParams;
 const rows=(await db.prepare("SELECT * FROM companies WHERE owner=? AND EXISTS(SELECT 1 FROM json_each(state,'$.members') m WHERE lower(json_extract(m.value,'$.email'))=? AND COALESCE(json_extract(m.value,'$.revoked'),0)=0) ORDER BY name,id").bind(ADPA_OWNER,actor.email.trim().toLowerCase()).all()).results;
 // This is the visitor's company page, not ADPA's all-company administration view.
 const companies=rows.map((r:any)=>({...r,state:companyState(JSON.parse(r.state))})).filter(c=>!c.state.archived&&companyAccess(c,actor)&&c.state.members.some((m:any)=>!m.revoked&&m.acceptedAt&&m.email.toLowerCase()===actor.email.trim().toLowerCase()&&(!m.userId||m.userId===actor.userId)));
 const companyId=q.get('companyId')||companies[0]?.id||'',c=companies.find(c=>c.id===companyId);
 if(q.has('companyId')&&!c)return json({error:'Company workspace is unavailable.'},404);
 if(!c)return json({companies:[],company:null,jobs:[],specialistJobs:[]});
 const member=c.state.members.find((m:any)=>!m.revoked&&m.acceptedAt&&m.email.toLowerCase()===actor.email.trim().toLowerCase()&&(!m.userId||m.userId===actor.userId)),isManager=member.role==='Manager';
 const cursor=q.get('cursor')||'',specialistCursor=q.get('specialistCursor')||'';
 if(cursor.length>180||specialistCursor.length>180)return json({error:'Invalid job cursor.'},400);
 const rawShared=isManager?(await db.prepare("SELECT j.* FROM shared_jobs j WHERE EXISTS(SELECT 1 FROM shared_job_companies p WHERE p.job_id=j.id AND p.company_id=?) AND j.id>? ORDER BY j.id LIMIT 51").bind(c.id,cursor).all()).results:[];
 const jobs=[];const now=Date.now();
 for(const r of rawShared.slice(0,50)){
  const j:any={...r,state:JSON.parse(String(r.state))},p=companyActor(j,[c],actor,false)[0]?.p;if(!p)continue;
  const active=!!p.acceptedAt&&!!p.approvedAt&&!!j.state.homeowner.acceptedAt,sharedHref='/shared-jobs?companyId='+encodeURIComponent(c.id)+'&job='+encodeURIComponent(j.id);
  const linked=active&&j.state.adpa?.status==='Connected'?await engagement(j):null,assignment=linked?jobAccess(linked.claim,c,actor)?.job:null;
  const specialist=assignment&&['Water mitigation','Contents care'].includes(c.state.serviceType);
  const ordinaryTasks=active?(j.state.tasks||[]).filter((t:any)=>t.companyId===c.id&&t.kind!=='Inspection question'):[];
  const inspectionQuestions=active&&(j.state.tasks||[]).some((t:any)=>t.companyId===c.id&&t.kind==='Inspection question'&&t.status==='Open')?(await inspectionView(j,[c],actor)).filter((r:any)=>r.companyId===c.id&&r.questionTask&&!r.questionTask.paused&&r.questionTask.status==='Open'):[];
  const questionTasks=inspectionQuestions.filter((r:any)=>r.questionTask.stage==='Answered — company review').map((r:any)=>({...r.questionTask,stage:'Review ADPA answer'}));
  const summary=workSummary(assignment,[...questionTasks,...ordinaryTasks]);summary.awaitingReview+=inspectionQuestions.filter((r:any)=>r.questionTask.stage==='Awaiting ADPA answer').length;const taskHref=summary.nextTask?.source==='specialist'&&specialist?link(c.state.serviceType==='Contents care'?'/contents-company':'/company',c.id,linked!.claim.id)+'&tab='+encodeURIComponent(c.state.serviceType==='Contents care'?'Requests':'Tasks & requests'):summary.nextTask?.detail==='Review ADPA answer'?sharedHref+'&tab=Inspection':sharedHref+'&tab=Tasks';
  const visit=active?(j.state.appointments||[]).filter((v:any)=>v.companyId===c.id&&v.status==='Scheduled'&&Date.parse(v.startsAt)>=now).sort((a:any,b:any)=>Date.parse(a.startsAt)-Date.parse(b.startsAt))[0]:null;
  jobs.push({id:j.id,name:j.name,address:active?j.address:'Available after participation and homeowner approval',status:!p.acceptedAt?'Accept company invitation':!active?'Awaiting homeowner approval':'Connected job',...summary,nextTaskHref:summary.nextTask?taskHref:'',nextVisit:visit?{title:visit.title,startsAt:visit.startsAt,assignedTo:visit.assignedTo||''}:null,href:specialist?link(c.state.serviceType==='Contents care'?'/contents-company':'/company',c.id,linked!.claim.id):sharedHref,action:specialist?(c.state.serviceType==='Contents care'?'Open contents work':'Open mitigation work'):'Open shared job',sharedHref,inspectionHref:active?sharedHref+'&tab=Inspection':''});
 }
 // Show independent specialist assignments too; active explicit shared links are represented above.
 const rawClaims=(await db.prepare("SELECT cl.* FROM claims cl WHERE cl.owner=? AND cl.id>? AND EXISTS(SELECT 1 FROM json_each(cl.state,'$.companyJobs') a WHERE json_extract(a.value,'$.companyId')=? AND COALESCE(json_extract(a.value,'$.revoked'),0)=0) AND NOT EXISTS(SELECT 1 FROM shared_jobs j WHERE json_extract(j.state,'$.adpa.status')='Connected' AND json_extract(j.state,'$.adpa.claimId')=cl.id AND lower(trim(j.name))=lower(trim(cl.name)) AND lower(trim(j.address))=lower(trim(cl.address)) AND json_extract(j.state,'$.homeowner.acceptedAt') IS NOT NULL AND json_extract(j.state,'$.adpa.engagementFileId')=json_extract(cl.state,'$.authority.controls.engagementFileId') AND EXISTS(SELECT 1 FROM evidence e WHERE e.id=json_extract(j.state,'$.adpa.engagementFileId') AND e.claim_id=cl.id AND e.owner=cl.owner) AND EXISTS(SELECT 1 FROM json_each(j.state,'$.companies') p WHERE json_extract(p.value,'$.companyId')=? AND json_extract(p.value,'$.acceptedAt') IS NOT NULL AND json_extract(p.value,'$.approvedAt') IS NOT NULL AND json_extract(p.value,'$.removedAt') IS NULL) AND ?=1) ORDER BY cl.id LIMIT 51").bind(ADPA_OWNER,specialistCursor,c.id,c.id,isManager?1:0).all()).results;
 const specialistJobs=[];
 for(const r of rawClaims.slice(0,50)){
  const cl:any={...r,state:JSON.parse(String(r.state))},access=jobAccess(cl,c,actor);if(!access||!['Water mitigation','Contents care'].includes(c.state.serviceType))continue;
  const a=access.job,allowedTasks=(a.tasks||[]).filter((t:any)=>access.manage||!t.memberId||t.memberId===access.member.id);
  specialistJobs.push({id:cl.id,name:cl.name,address:cl.address,status:a.status||'Assigned',...workSummary({...a,tasks:allowedTasks}),nextTaskHref:link(c.state.serviceType==='Contents care'?'/contents-company':'/company',c.id,cl.id)+'&tab='+encodeURIComponent(c.state.serviceType==='Contents care'?'Requests':'Tasks & requests'),nextVisit:null,href:link(c.state.serviceType==='Contents care'?'/contents-company':'/company',c.id,cl.id),action:c.state.serviceType==='Contents care'?'Open contents work':'Open mitigation work'});
 }
 return json({companies:companies.map(c=>{const v=companyView(c,actor);return {id:v.id,name:v.name,industries:v.industries,role:v.role};}),owner:actor.userId===ADPA_OWNER,company:{id:c.id,name:c.name,role:member.role,manager:isManager,primaryIndustry:companyView(c,actor).primaryIndustry,industries:companyView(c,actor).industries,services:companyView(c,actor).services},jobs,specialistJobs,hasMore:rawShared.length>50,nextCursor:rawShared.length>50?rawShared[49].id:null,specialistHasMore:rawClaims.length>50,specialistNextCursor:rawClaims.length>50?rawClaims[49].id:null,checkedAt:new Date().toISOString()});
 }catch{return json({error:'Your jobs could not load. Refresh to check your current access.'},503);}
}
