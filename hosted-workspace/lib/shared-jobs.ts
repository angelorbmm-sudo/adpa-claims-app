import {draftInputs,applyDraft} from './evidence-drafts';
import {missingInputs,applyMissing} from './missing-evidence';
import {z} from 'zod';
import {inboxInputs,applyInbox} from './evidence-inbox';
import {ADPA_OWNER,companyAccess} from './company';
export const jobTrades=['Water mitigation','Contents care','General contractor','Roofing','Handyman','Other restoration'] as const;
const id=z.string().min(1).max(180),short=z.string().trim().min(1).max(200),text=z.string().trim().min(1).max(3000),version=z.number().int().positive();
const dimension=z.string().trim().max(12).refine(v=>!v||/^\d{1,6}(\.\d{1,4})?$/.test(v)&&Number(v)>0,'Use a positive measured dimension or leave blank');
export const inspectionQuestionRevision=(t:any)=>1+(t.answers?.length||0)+(t.status==='Complete'?1:0);
export const inspectionRecord=z.object({id,area:short,areaType:z.enum(['Room','Roof','Exterior','Other']),observedAt:z.string().datetime({offset:true}),inspector:short,measurementStatus:z.enum(['Not measured','Measured']),length:dimension,width:dimension,height:dimension,unit:z.enum(['ft','m']),basis:z.string().trim().max(2000),condition:text,missing:z.string().trim().max(3000),question:z.string().trim().max(3000),sources:z.array(z.object({evidenceId:id,locator:short}).strict()).min(1).max(12).refine(v=>new Set(v.map(s=>s.evidenceId)).size===v.length),correctionOf:z.string().max(180),correctionReason:z.string().trim().max(2000)}).strict().refine(r=>r.measurementStatus==='Measured'?!!r.basis&&!!(r.length||r.width||r.height):!r.length&&!r.width&&!r.height,'Measured dimensions need a basis; unmeasured areas leave dimensions blank').refine(r=>!!r.correctionOf===!!r.correctionReason,'Corrections need the original record and a reason');
export const sharedInput=z.discriminatedUnion('action',[
 ...inboxInputs,
 ...missingInputs,
 ...draftInputs,
 z.object({action:z.literal('sendInspectionQuestion'),version,companyId:id,companyVersion:version,inspectionId:id,noSensitiveData:z.literal(true)}).strict(),
 z.object({action:z.literal('answerInspectionQuestion'),version,taskId:id,questionRevision:z.number().int().positive().max(52),sourceChecked:z.literal(true),answer:text}).strict(),
 z.object({action:z.literal('resolveInspectionQuestion'),version,companyId:id,companyVersion:version,taskId:id,questionRevision:z.number().int().positive().max(52),sourceChecked:z.literal(true),note:text}).strict(),
 z.object({action:z.literal('inspection'),version,companyId:id,companyVersion:version,record:inspectionRecord,sourceProofs:z.array(z.object({evidenceId:id,digest:z.string().regex(/^[a-f0-9]{64}$/),sourceCreated:z.string().min(1).max(100),revision:z.string().min(1).max(180)}).strict()).min(1).max(12),noSensitiveData:z.literal(true)}).strict(),
 z.object({action:z.literal('create'),companyId:id,companyVersion:version,clientId:id,clientVersion:version}).strict(),
 z.object({action:z.literal('acceptHomeowner'),version,consent:z.literal(true)}).strict(),
 z.object({action:z.literal('inviteCompany'),version,companyId:id}).strict(),
 z.object({action:z.literal('acceptCompany'),version,companyId:id,companyVersion:version,clientId:id,clientVersion:version,termsConfirmed:z.literal(true)}).strict(),
 z.object({action:z.literal('approveCompany'),version,companyId:id,consent:z.literal(true)}).strict(),
 z.object({action:z.literal('removeCompany'),version,companyId:id,reason:text}).strict(),
 z.object({action:z.literal('contribute'),version,companyId:id,companyVersion:version,assetId:id,category:z.enum(['Damage photos','Room measurements','Contents photos','Audio/video','Scope/estimate','Other job document']),description:text,noSensitiveData:z.literal(true)}).strict(),
 z.object({action:z.literal('share'),version,evidenceId:id,companyIds:z.array(id).max(50),includeADPA:z.boolean(),consent:z.literal(true)}).strict(),
 z.object({action:z.literal('withdrawEvidence'),version,evidenceId:id,reason:text}).strict(),
 z.object({action:z.literal('requestADPA'),version,consent:z.literal(true)}).strict(),
 z.object({action:z.literal('linkADPA'),version,claimId:id,claimVersion:version,engagementFileId:id,reviewed:z.literal(true)}).strict(),
 z.object({action:z.literal('confirmADPA'),version,consent:z.literal(true)}).strict(),
 z.object({action:z.literal('removeADPA'),version,reason:text}).strict(),
 z.object({action:z.literal('importEvidence'),version,evidenceId:id}).strict(),
 z.object({action:z.literal('jobMessage'),version,companyId:id.optional(),companyVersion:version.optional(),audience:z.string().min(1).max(200),body:text}).strict(),
 z.object({action:z.literal('appointment'),version,companyId:id.optional(),companyVersion:version.optional(),title:short,startsAt:z.string().datetime({offset:true}),note:text,assignedTo:z.string().trim().min(1).max(200).optional()}).strict(),
 z.object({action:z.literal('cancelAppointment'),version,companyId:id.optional(),companyVersion:version.optional(),appointmentId:id,reason:text}).strict(),
 z.object({action:z.literal('task'),version,companyId:id,companyVersion:version,title:short,due:z.string().refine(v=>!v||/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v),note:text}).strict(),
 z.object({action:z.literal('completeTask'),version,companyId:id,companyVersion:version,taskId:id,note:text}).strict()
]);
export function manager(c:any,actor:any){const a=companyAccess(c,actor);return !!a&&!c.state.archived&&(a.owner||a.member.acceptedAt&&a.member.role==='Manager');}
export function homeowner(j:any,actor:any){return j.state.homeowner.email===actor.email.trim().toLowerCase()&&(!j.state.homeowner.userId||j.state.homeowner.userId===actor.userId);}
export function acceptedHomeowner(j:any,actor:any){return homeowner(j,actor)&&!!j.state.homeowner.acceptedAt;}
export function participant(j:any,id:string){const matches=j.state.companies.filter((p:any)=>p.companyId===id&&!p.removedAt);return matches.length===1?matches[0]:null;}
export function companyActor(j:any,companies:any[],actor:any,active=true){return companies.filter(c=>manager(c,actor)&&(actor.userId!==ADPA_OWNER||c.state.members.some((m:any)=>!m.revoked&&m.acceptedAt&&m.role==='Manager'&&m.email===actor.email.toLowerCase()&&(!m.userId||m.userId===actor.userId)))).map(c=>({company:c,p:participant(j,c.id)})).filter(x=>x.p&&(!active||x.p.acceptedAt&&x.p.approvedAt));}
export function adpaActive(j:any,actor:any){return actor.userId===ADPA_OWNER&&j.state.adpa?.status==='Connected';}
export function canSee(j:any,companies:any[],actor:any){return homeowner(j,actor)||companyActor(j,companies,actor,false).length>0||actor.userId===ADPA_OWNER&&['Requested','Awaiting homeowner','Connected'].includes(j.state.adpa?.status);}
export function visibleEvidence(j:any,companies:any[],actor:any){if(!canSee(j,companies,actor))return [];const mine=companyActor(j,companies,actor).map(x=>x.company.id);return j.state.evidence.filter((e:any)=>!e.withdrawnAt&&(acceptedHomeowner(j,actor)||mine.includes(e.companyId)||e.companyIds.some((id:string)=>mine.includes(id))||adpaActive(j,actor)&&e.includeADPA));}
export function sharedView(j:any,companies:any[],actor:any){if(!canSee(j,companies,actor))throw Error('Job not found.');const h=homeowner(j,actor),accepted=acceptedHomeowner(j,actor),mine=companyActor(j,companies,actor),pending=companyActor(j,companies,actor,false),adpa=adpaActive(j,actor);const canWork=accepted||mine.length>0||adpa;return {id:j.id,name:j.name,address:canWork||h?j.address:'Available after joining and homeowner approval',version:j.version,...recoveryView(j,companies,actor),role:h?'Homeowner':actor.userId===ADPA_OWNER?'ADPA':'Company manager',homeownerAccepted:!!j.state.homeowner.acceptedAt,canConsent:accepted,needsHomeownerAcceptance:h&&!accepted,myCompanies:pending.map(x=>({id:x.company.id,name:x.company.name,version:x.company.version,accepted:!!x.p.acceptedAt,approved:!!x.p.approvedAt,clientId:x.p.clientId||''})),companies:canWork?j.state.companies.filter((p:any)=>!p.removedAt).map(({companyId,name,serviceType,acceptedAt,approvedAt}:any)=>({companyId,name,serviceType,accepted:!!acceptedAt,approved:!!approvedAt})):[],evidence:visibleEvidence(j,companies,actor).map(({assetId,originalKey,companyIds,includeADPA,...e}:any)=>({...e,companyIds:accepted||mine.some(x=>x.company.id===e.companyId)?companyIds:[],includeADPA:accepted?includeADPA:undefined,downloadUrl:'/api/shared-job-evidence?jobId='+encodeURIComponent(j.id)+'&id='+encodeURIComponent(e.id)})),tasks:canWork?j.state.tasks.filter((t:any)=>t.kind!=='Inspection question'&&(accepted||adpa||mine.some(x=>x.company.id===t.companyId))):[],adpa:canWork||h||actor.userId===ADPA_OWNER?{status:j.state.adpa?.status||'Not requested',claimId:adpa||h?j.state.adpa?.claimId||'':'',engagementFileId:h?j.state.adpa?.engagementFileId||'':''}:{status:'Not shared'},audit:accepted?j.state.audit:[],created:j.created};}
export function createShared(c:any,client:any,now:string,actor:any){const contact=client.state.contact;if(!contact.email||!contact.address||client.state.stage==='Cancelled')throw Error('Record the homeowner email and property address on an active client first.');return {name:contact.name,address:contact.address,state:{homeowner:{name:contact.name,email:contact.email.toLowerCase(),userId:null,acceptedAt:null},companies:[{companyId:c.id,name:c.name,serviceType:c.state.serviceType||'Water mitigation',clientId:client.id,acceptedAt:now,approvedAt:null,joinedBy:actor.userId}],evidence:[],tasks:[],adpa:{status:'Not requested'},audit:[{action:'create',actorId:actor.userId,at:now}]}};}
export function recoveryChannels(j:any,companies:any[],actor:any){
 const h=acceptedHomeowner(j,actor),mine=companyActor(j,companies,actor),adpa=adpaActive(j,actor);
 if(!h&&!mine.length&&!adpa)return [];
 return [{id:'team',name:'Everyone on this job'},...(j.state.adpa?.status==='Connected'&&(h||adpa)?[{id:'adpa',name:'ADPA only'}]:[]),...j.state.companies.filter((p:any)=>!p.removedAt&&p.acceptedAt&&p.approvedAt&&(h||mine.some(x=>x.company.id===p.companyId))).map((p:any)=>({id:'company:'+p.companyId,name:p.name+' + policyholder'}))];
}
export function recoveryView(j:any,companies:any[],actor:any){
 const channels=recoveryChannels(j,companies,actor),allowed=new Set(channels.map(c=>c.id));
 return {channels,messages:(j.state.messages||[]).filter((m:any)=>allowed.has(m.audience)).map(({actorId,...m}:any)=>m),appointments:channels.length?(j.state.appointments||[]).map(({actorId,...a}:any)=>a):[],canSchedule:!!companyActor(j,companies,actor).length||adpaActive(j,actor)};
}
export function applyShared(j:any,companies:any[],actor:any,input:any,context:any,now:string){const s=structuredClone(j.state);if((s.audit||[]).length>=1000)throw Error('Job history limit reached. Earlier decisions were retained.');const own=()=>{if(!acceptedHomeowner(j,actor))throw Error('The signed-in homeowner must authorize this action.');},work=(id:string)=>{const x=companyActor(j,companies,actor).find(x=>x.company.id===id);if(!x)throw Error('An approved company manager must perform this action.');return x;};
 if(['jobMessage','appointment','cancelAppointment'].includes(input.action)){
  const h=acceptedHomeowner(j,actor),adpa=adpaActive(j,actor);
  const sender=input.companyId?work(input.companyId):null;
  if(!sender&&!h&&!adpa)throw Error('An approved participant must perform this action.');
  if(sender&&!input.companyVersion)throw Error('Refresh the company before sending.');
  const from=sender?sender.company.name:h?j.state.homeowner.name:'ADPA';
  if(input.action==='jobMessage'){
   if(!recoveryChannels(j,companies,actor).some(c=>c.id===input.audience))throw Error('Choose an authorized conversation.');
   if(!sender&&!h&&!adpa)throw Error('Choose your sending company.');
   if((s.messages||[]).length>=500)throw Error('Conversation record limit reached.');
   s.messages=[...(s.messages||[]),{id:crypto.randomUUID(),audience:input.audience,body:input.body,from,companyId:sender?.company.id||'',actorId:actor.userId,at:now}];
  }else{
   if(!sender&&!adpa)throw Error('Only an assigned company or ADPA can schedule visits.');
   const cid=sender?.company.id||'adpa';
   if(input.action==='appointment'){
    if((s.appointments||[]).length>=100)throw Error('Appointment record limit reached.');
    if(Date.parse(input.startsAt)<Date.parse(now))throw Error('Choose a future appointment time.');
    s.appointments=[...(s.appointments||[]),{id:crypto.randomUUID(),companyId:cid,from,title:input.title,startsAt:input.startsAt,note:input.note,status:'Scheduled',assignedTo:input.assignedTo||'',at:now,actorId:actor.userId}];
   }else{const visit=(s.appointments||[]).find((v:any)=>v.id===input.appointmentId&&v.companyId===cid&&v.status==='Scheduled');if(!visit)throw Error('Choose your own scheduled visit.');visit.status='Cancelled';visit.cancelledAt=now;visit.reason=input.reason;}
  }
 }
 else if(input.action==='acceptHomeowner'){if(!homeowner(j,actor)||s.homeowner.acceptedAt)throw Error('Only the invited homeowner can accept once.');if(!context.initialContractVerified)throw Error('The originating company must have its own verified signed service contract before job approval.');s.homeowner.userId=actor.userId;s.homeowner.acceptedAt=now;const first=s.companies[0];first.approvedAt=now;first.contractRequestId=context.initialContractRequestId;}
 else if(input.action==='inviteCompany'){if(!acceptedHomeowner(j,actor)&&!companyActor(j,companies,actor).length)throw Error('Join this job before proposing another company.');const c=context.targetCompany;if(!c||c.state.archived||!c.state.directoryListed&&actor.userId!==ADPA_OWNER)throw Error('Choose an active company listed in the directory.');if(participant(j,c.id)||s.companies.some((p:any)=>p.companyId===c.id))throw Error('This company already has a job invitation or removal record.');s.companies.push({companyId:c.id,name:c.name,serviceType:c.state.serviceType||'Water mitigation',clientId:'',acceptedAt:null,approvedAt:null});}
 else if(input.action==='acceptCompany'){const c=context.targetCompany,p=participant({state:s},input.companyId);if(!p||p.acceptedAt||!c||!manager(c,actor))throw Error('Choose your pending company invitation.');const cl=context.client,k=cl?.state.contract;if(!cl||cl.company_id!==c.id||cl.state.stage==='Cancelled'||cl.state.contact.email.toLowerCase()!==s.homeowner.email||cl.state.contact.address.trim().toLowerCase()!==j.address.trim().toLowerCase()||k?.status!=='Completed'||!k.verifiedAt||!context.contractAssetsVerified)throw Error('This company needs its own matching homeowner client and verified signed contract plus certificate.');p.clientId=cl.id;p.acceptedAt=now;p.joinedBy=actor.userId;p.contractRequestId=k.requestId;}
 else if(input.action==='approveCompany'){own();const p=participant({state:s},input.companyId);if(!p?.acceptedAt||p.approvedAt||!context.approvalContractVerified)throw Error('The company must accept with its own signed contract before approval.');p.approvedAt=now;}
 else if(input.action==='removeCompany'){own();const p=participant({state:s},input.companyId);if(!p)throw Error('Company not found.');p.removedAt=now;p.reason=input.reason;for(const e of s.evidence)e.companyIds=e.companyIds.filter((id:string)=>id!==p.companyId);}
 else if(input.action==='sendInspectionQuestion'){
  work(input.companyId);const r=(s.inspections||[]).find((r:any)=>r.id===input.inspectionId&&r.companyId===input.companyId);
  if(!r?.question||!s.homeowner.acceptedAt||s.adpa?.status!=='Connected'||!context.questionAuthorized)throw Error('A current inspection question, ADPA engagement and homeowner-authorized originals are required.');
  if((s.inspections||[]).some((x:any)=>x.correctionOf===r.id))throw Error('Send the corrected inspection instead of an earlier record.');
  if(s.tasks.some((t:any)=>t.kind==='Inspection question'&&t.inspectionId===r.id))throw Error('This inspection question was already sent. Refresh to review its task.');
  s.tasks.push({id:crypto.randomUUID(),kind:'Inspection question',companyId:input.companyId,inspectionId:r.id,claimId:s.adpa.claimId,engagementFileId:s.adpa.engagementFileId,title:'Inspection question: '+r.area,note:r.question,due:'',status:'Open',stage:'Awaiting ADPA answer',at:now,submittedBy:actor.userId,answers:[]});
 }
 else if(input.action==='answerInspectionQuestion'){
  const t=s.tasks.find((t:any)=>t.id===input.taskId&&t.kind==='Inspection question'&&t.status==='Open');
  if(!adpaActive(j,actor)||!t||!context.questionAuthorized)throw Error('Only connected ADPA can answer a current authorized inspection question.');
  if(input.questionRevision!==inspectionQuestionRevision(t))throw Error('This question has a newer answer or resolution. Keep your notes and review the current thread.');
  if((t.answers||[]).length>=50)throw Error('Answer history limit reached.');
  t.answers.push({body:input.answer,at:now,actorId:actor.userId});t.stage='Answered — company review';
 }
 else if(input.action==='resolveInspectionQuestion'){
  work(input.companyId);const t=s.tasks.find((t:any)=>t.id===input.taskId&&t.companyId===input.companyId&&t.kind==='Inspection question'&&t.status==='Open');
  if(!t?.answers?.length||!context.questionAuthorized)throw Error('Review ADPA’s answer and current sources before resolving your company’s question.');
  if(input.questionRevision!==inspectionQuestionRevision(t))throw Error('Review the latest ADPA answer before resolving this question.');
  t.status='Complete';t.stage='Resolved';t.completedAt=now;t.completionNote=input.note;t.resolvedBy=actor.userId;t.resolvedAnswerCount=t.answers.length;
 }
 else if(input.action.startsWith('draft')){
  let role:string;if(input.companyId){work(input.companyId);if(!input.companyVersion)throw Error('Refresh the company first.');role=input.companyId;}else if(acceptedHomeowner(j,actor)){role='homeowner';}else if(adpaActive(j,actor)&&context.inboxAdpaVerified){role='adpa';}else throw Error('Only an approved participant may create evidence drafts.');
  Object.assign(s,applyDraft(s,input,role,actor.userId,context,now));
 }
 else if(input.action.startsWith('missing')){
  let role:string;if(input.companyId){work(input.companyId);if(!input.companyVersion)throw Error('Refresh the company first.');role=input.companyId;}else if(acceptedHomeowner(j,actor)){role='homeowner';}else if(adpaActive(j,actor)&&context.inboxAdpaVerified){role='adpa';}else throw Error('Only an approved participant can use this checklist.');
  Object.assign(s,applyMissing(s,input,role,actor.userId,context,now));
 }
 else if(['inboxArea','inboxSubject','inboxTag'].includes(input.action)){
  let role:string;if(input.companyId){work(input.companyId);if(!input.companyVersion)throw Error('Refresh the company before tagging.');role=input.companyId;}else if(acceptedHomeowner(j,actor)){role='homeowner';}else if(adpaActive(j,actor)&&context.inboxAdpaVerified){role='adpa';}else throw Error('Only an approved participant can organize evidence.');
  Object.assign(s,applyInbox(s,input,actor.userId,role,context,now));
 }
 else if(input.action==='inspection'){
  work(input.companyId);const r=input.record,existing=s.inspections||[];
  if(!s.homeowner.acceptedAt)throw Error('The policyholder must accept before inspection records are saved.');
  if(existing.length>=200||existing.some((v:any)=>v.id===r.id))throw Error('Inspection limit reached or record already saved. Refresh before retrying.');
  if(Date.parse(r.observedAt)>Date.parse(now))throw Error('Record the actual inspection time, not a future appointment.');
  if(r.correctionOf&&!existing.some((v:any)=>v.id===r.correctionOf&&v.companyId===input.companyId))throw Error('Correct an inspection from your own company.');
  if(r.correctionOf&&existing.some((v:any)=>v.correctionOf===r.correctionOf&&v.companyId===input.companyId))throw Error('This inspection already has a correction. Correct the latest record instead.');
  const sources=r.sources.map((source:any)=>{const e=context.inspectionSources?.find((e:any)=>e.id===source.evidenceId);if(!e)throw Error('Use current authorized job originals.');return {...source,digest:e.digest,sourceCreated:e.sourceCreated,revision:e.revision};});
  s.inspections=[...existing,{...r,sources,companyId:input.companyId,at:now,actorId:actor.userId}];
 }
 else if(input.action==='contribute'){const x=work(input.companyId),a=context.asset;if(!a||a.company_id!==x.company.id||a.client_id!==x.p.clientId||a.kind!=='Client document')throw Error('Choose this company’s original document for the job’s client. Contracts, certificates and other clients’ files cannot be shared here.');if(s.evidence.some((e:any)=>e.assetId===a.id&&!e.withdrawnAt))throw Error('This original is already in the job.');s.evidence.push({id:crypto.randomUUID(),assetId:a.id,companyId:x.company.id,companyName:x.company.name,clientId:x.p.clientId,title:a.title,filename:a.filename,mime:a.mime,size:a.size,digest:a.digest,revision:a.revision,sourceCreated:a.created,category:input.category,description:input.description,companyIds:[],includeADPA:false,at:now,contributedBy:actor.userId});}
 else if(input.action==='share'){own();const e=s.evidence.find((e:any)=>e.id===input.evidenceId&&!e.withdrawnAt);if(!e)throw Error('Evidence not found.');if(new Set(input.companyIds).size!==input.companyIds.length||input.companyIds.some((id:string)=>{const p=participant({state:s},id);return !p?.approvedAt||!p.acceptedAt;}))throw Error('Share only with approved companies.');if(input.includeADPA&&s.adpa.status!=='Connected')throw Error('Connect ADPA separately before sharing evidence with ADPA.');e.companyIds=input.companyIds;e.includeADPA=input.includeADPA;e.consentAt=now;e.consentBy=actor.userId;}
 else if(input.action==='withdrawEvidence'){own();const e=s.evidence.find((e:any)=>e.id===input.evidenceId&&!e.withdrawnAt);if(!e)throw Error('Evidence not found.');e.withdrawnAt=now;e.reason=input.reason;}
 else if(input.action==='requestADPA'){own();if(!['Not requested','Removed'].includes(s.adpa.status))throw Error('ADPA is already requested.');s.adpa={status:'Requested',requestedAt:now,requestedBy:actor.userId};}
 else if(input.action==='linkADPA'){if(actor.userId!==ADPA_OWNER||s.adpa.status!=='Requested')throw Error('ADPA can propose a claim link after homeowner request.');const cl=context.claim;if(!cl||cl.owner!==ADPA_OWNER||cl.address.trim().toLowerCase()!==j.address.trim().toLowerCase()||cl.name.trim().toLowerCase()!==j.name.trim().toLowerCase()||cl.state.authority?.controls?.engagementFileId!==input.engagementFileId||!context.engagementVerified)throw Error('Choose the matching ADPA claim with its separately reviewed engagement evidence.');s.adpa={...s.adpa,status:'Awaiting homeowner',claimId:cl.id,engagementFileId:input.engagementFileId,claimVersion:cl.version,proposedAt:now,proposedBy:actor.userId};}
 else if(input.action==='confirmADPA'){own();if(s.adpa.status!=='Awaiting homeowner'||!context.engagementVerified)throw Error('ADPA must provide current separate representation evidence before confirmation.');s.adpa.status='Connected';s.adpa.confirmedAt=now;s.adpa.confirmedBy=actor.userId;}
 else if(input.action==='removeADPA'){own();s.adpa={status:'Removed',reason:input.reason,removedAt:now};for(const e of s.evidence)e.includeADPA=false;}
 else if(input.action==='task'){work(input.companyId);s.tasks.push({id:crypto.randomUUID(),companyId:input.companyId,title:input.title,due:input.due,note:input.note,status:'Open',at:now});}
 else if(input.action==='completeTask'){work(input.companyId);const t=s.tasks.find((t:any)=>t.id===input.taskId&&t.companyId===input.companyId&&t.kind!=='Inspection question'&&t.status==='Open');if(!t)throw Error('Choose this company’s open task.');t.status='Complete';t.completedAt=now;t.completionNote=input.note;}
 else throw Error('Unsupported shared job action.');
 if(s.companies.length>50||s.evidence.length>500||s.tasks.length>300)throw Error('Shared job record limit reached.');s.audit=[...s.audit,{action:input.action,companyId:input.companyId||'',evidenceId:input.evidenceId||'',inspectionId:input.inspectionId||'',taskId:input.taskId||'',actorId:actor.userId,at:now,reason:input.reason||'',...(input.action==='share'?{companyIds:input.companyIds,includeADPA:input.includeADPA}:{}),...(input.action==='confirmADPA'?{claimId:s.adpa.claimId,engagementFileId:s.adpa.engagementFileId}:{}),...(input.action==='acceptHomeowner'?{contractRequestId:context.initialContractRequestId}:{}),...(input.action==='acceptCompany'?{contractRequestId:context.client?.state.contract?.requestId}:{} )}];return s;
}
