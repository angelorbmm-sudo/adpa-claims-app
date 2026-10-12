import {invitationLive,invitationExpiry} from './invitations';
import {z} from 'zod';
export const PORTAL_OWNER='57a641c7-7f54-4f15-8121-e53a65a2f33b';
const text=z.string().trim().max(3000),short=z.string().trim().max(200),id=z.string().min(1).max(180);
const date=z.string().refine(v=>!v||/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v,'Use a real date');
const dollars=z.string().max(20).refine(v=>!v||/^\d{1,9}(\.\d{1,2})?$/.test(v),'Use nonnegative dollars and cents');
export const stages=['Gathering documents','Reviewing your claim','Preparing your claim package','Working with your insurer','Repairs and recovery','Closing review'] as const;
export const workStatuses=['Update pending','Not needed','Planning','In progress','Waiting','Reported complete'] as const;
const work=z.object({status:z.enum(workStatuses),summary:text,nextStep:text}).strict();
const task=z.object({id,title:short.refine(Boolean),instruction:text.refine(Boolean),due:date,status:z.enum(['Open','Complete','Cancelled']),resolution:text}).strict();
const payment=z.object({id,group:short.refine(Boolean),coverage:z.enum(['Dwelling','Other structures','Personal property','Living expenses','Code upgrades','Other']),approved:dollars,issued:dollars,received:dollars,asOf:date,basis:text,fileId:id,locator:short.refine(Boolean)}).strict();
const contact=z.object({id,name:short.refine(Boolean),company:short,role:short.refine(Boolean),email:z.string().max(254).refine(v=>!v||z.string().email().safeParse(v).success),phone:z.string().max(40).refine(v=>!v||/^[+\d\s().-]+$/.test(v))}).strict();
export const dashboardSchema=z.object({stage:z.enum(stages),summary:text.refine(Boolean),nextMilestone:text,waitingOn:short,waitingFor:text,nextUpdate:date,repair:work,contents:work,tasks:z.array(task).max(30),payments:z.array(payment).max(20),contacts:z.array(contact).max(10),fileIds:z.array(id).max(100),reviewNote:text.refine(Boolean)}).strict();
const version=z.number().int().positive();
export const portalInput=z.discriminatedUnion('action',[
 z.object({action:z.literal('publish'),version,dashboard:dashboardSchema,sourceChecked:z.literal(true)}).strict(),
 z.object({action:z.literal('invite'),version,name:short.refine(Boolean),email:z.string().email().max(254)}).strict(),
 z.object({action:z.literal('revoke'),version,invitationId:id,reason:text.refine(Boolean)}).strict(),
 z.object({action:z.literal('accept'),version,consent:z.literal(true)}).strict(),
 z.object({action:z.literal('message'),version,body:text.refine(Boolean),taskId:z.string().max(180)}).strict(),
 z.object({action:z.literal('taskResponse'),version,taskId:id,note:text.refine(Boolean),fileIds:z.array(id).max(10)}).strict()
]);
export const emptyPortal=()=>({schema:1,invitations:[] as any[],published:null as any,history:[] as any[],messages:[] as any[],responses:[] as any[],audit:[] as any[]});
export const portalState=(s:any):ReturnType<typeof emptyPortal>=>({...emptyPortal(),...(s.clientPortal||{})});
export function portalAccess(claim:any,actor:any){if(claim.owner===actor.userId&&actor.userId===PORTAL_OWNER)return {owner:true,invitation:null as any};const p=portalState(claim.state).invitations.find(p=>invitationLive(p)&&p.email===actor.email.trim().toLowerCase()&&(!p.userId||p.userId===actor.userId));return p?{owner:false,invitation:p}:null;}
export function uploaderInvitation(file:any){try{return JSON.parse(file.sources||'[]').find((s:any)=>s.portalInvitationId)?.portalInvitationId;}catch{return null;}}
export function portalVisibleFiles(claim:any,actor:any,files:any[]){const a=portalAccess(claim,actor);if(!a||!a.owner&&!a.invitation.acceptedAt)return [];if(a.owner)return files;const p=portalState(claim.state).published;return files.filter(f=>(p?.fileIds||[]).includes(f.id)||uploaderInvitation(f)===a.invitation.id);}
export const safeFile=(f:any)=>({id:f.id,filename:f.filename,mime:f.mime,size:f.size,category:f.category,created:f.created});
export function initialDashboard(claim:any,actor:any){return {stage:'Gathering documents',summary:'',nextMilestone:'',waitingOn:'',waitingFor:'',nextUpdate:'',repair:{status:'Update pending',summary:'',nextStep:''},contents:{status:'Update pending',summary:'',nextStep:''},tasks:[],payments:[],contacts:[{id:'adpa',name:'Angelo Daniel',company:'Angelo Daniel Public Adjusting',role:'Your claim contact',email:actor.email,phone:''}],fileIds:[],reviewNote:''};}
export function portalView(claim:any,files:any[],actor:any){
 const a=portalAccess(claim,actor);if(!a)throw Error('Dashboard not found.');const p=portalState(claim.state),pending=!a.owner&&!a.invitation.acceptedAt;
 if(pending)return {claim:{id:claim.id,name:'Your ADPA claim',version:claim.version},owner:false,accepted:false,inviteName:a.invitation.name,published:null,files:[],messages:[],responses:[]};
 const publicClaim={id:claim.id,name:claim.name,address:claim.address,version:claim.version,carrier:String(claim.state.profile?.carrier||''),claimNumber:String(claim.state.profile?.claimNumber||'')};
 // Published header is frozen with the client's update; internal profile changes remain private until publication.
 const snap=p.published,publicSnapshot=snap?{...snap,reviewNote:undefined,actorId:undefined,sourceFiles:undefined,payments:snap.payments.map((r:any)=>{const ref=snap.sourceFiles.find((f:any)=>f.id===r.fileId),current=files.find(f=>f.id===r.fileId),stale=!current||current.created!==ref?.created;return {...r,approved:stale?'':r.approved,issued:stale?'':r.issued,received:stale?'':r.received,sourceStale:stale};})}:null;
 const allowed=portalVisibleFiles(claim,actor,files),ids=new Set(allowed.map(f=>f.id));
 return {claim:a.owner?publicClaim:snap?{...publicClaim,...snap.claim,id:claim.id,version:claim.version}:{id:claim.id,name:claim.name,version:claim.version},owner:a.owner,accepted:true,published:publicSnapshot,files:allowed.map(safeFile),messages:p.messages.filter((m:any)=>a.owner||m.kind==='ADPA'||m.invitationId===a.invitation.id).map(({actorId,actorEmail,invitationId,...m}:any)=>m),responses:p.responses.filter((r:any)=>a.owner||r.invitationId===a.invitation.id).map(({actorId,invitationId,...r}:any)=>({...r,fileIds:r.fileIds.filter((id:string)=>ids.has(id))})),...(a.owner?{draft:snap?dashboardSchema.parse(Object.fromEntries(Object.keys(initialDashboard(claim,actor)).map(k=>[k,snap[k]]))):initialDashboard(claim,actor),invitations:p.invitations,history:p.history.map((r:any)=>({id:r.id,publishedAt:r.publishedAt,stage:r.stage})),audit:p.audit,clientEmailSuggestion:claim.state.water?.intake?.homeownerEmail||''}: {})};
}
export function applyPortal(claim:any,files:any[],actor:any,input:z.infer<typeof portalInput>,now:string){
 const a=portalAccess(claim,actor);if(!a)throw Error('Dashboard not found.');const p=structuredClone(portalState(claim.state));const owner=()=>{if(!a.owner)throw Error('Only ADPA can manage shared dashboard updates.');};const accepted=()=>{if(!a.owner&&!a.invitation.acceptedAt)throw Error('Accept the dashboard invitation first.');};const stamp={at:now,actorId:actor.userId,actorEmail:actor.email};
 if(input.action==='publish'){
  owner();const d=input.dashboard;
  for(const key of ['tasks','payments','contacts'] as const)if(new Set((d[key] as any[]).map(r=>r.id)).size!==d[key].length)throw Error('Record IDs must be unique.');
  if(new Set(d.fileIds).size!==d.fileIds.length||d.fileIds.some(id=>!files.some(f=>f.id===id)))throw Error('Select distinct originals from this claim.');
  const groups=new Set();for(const r of d.payments){if(groups.has(r.group.trim().toLowerCase()))throw Error('Reconcile repeated financial groups before sharing.');groups.add(r.group.trim().toLowerCase());if(!d.fileIds.includes(r.fileId))throw Error('Financial source files must be selected for client sharing.');if((r.approved||r.issued||r.received)&&(!r.asOf||!r.basis))throw Error('Reported figures require an as-of date and factual basis.');if(r.asOf&&r.asOf>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now)))throw Error('Financial as-of date cannot be in the future.');}
  for(const old of p.published?.tasks||[])if(p.responses.some(r=>r.taskId===old.id)&&!d.tasks.some(t=>t.id===old.id))throw Error('Keep requests with client responses; complete or cancel them with a reason.');
  for(const t of d.tasks){if(t.status!=='Open'&&!t.resolution)throw Error('Explain completed or cancelled client tasks.');const old=p.published?.tasks.find((x:any)=>x.id===t.id);if(old&&JSON.stringify({title:old.title,instruction:old.instruction})!==JSON.stringify({title:t.title,instruction:t.instruction})&&p.responses.some(r=>r.taskId===t.id))throw Error('A task with responses keeps its original wording. Create a new task for a different request.');}
  const snapshot={...d,id:crypto.randomUUID(),publishedAt:now,actorId:actor.userId,claim:{name:claim.name,address:claim.address,carrier:String(claim.state.profile?.carrier||''),claimNumber:String(claim.state.profile?.claimNumber||'')},sourceFiles:files.filter(f=>d.fileIds.includes(f.id)).map(safeFile)};
  if(p.published)p.history=[...p.history,p.published].slice(-10);p.published=snapshot;
 }else if(input.action==='invite'){
  owner();const email=input.email.trim().toLowerCase();if(email===actor.email.trim().toLowerCase())throw Error('Invite the policyholder’s email, not your own account.');if(p.invitations.some(i=>!i.revoked&&i.email===email))throw Error('This client already has an active invitation.');if(p.invitations.length>=30)throw Error('Invitation record limit reached.');p.invitations.push({id:crypto.randomUUID(),name:input.name,email,userId:null,acceptedAt:null,revoked:false,expiresAt:invitationExpiry(now),...stamp});
 }else if(input.action==='revoke'){
  owner();const i=p.invitations.find(i=>i.id===input.invitationId&&!i.revoked);if(!i)throw Error('Active invitation not found.');i.revoked=true;i.revokedAt=now;i.reason=input.reason;
 }else if(input.action==='accept'){
  if(a.owner)throw Error('ADPA does not accept a client invitation.');const i=p.invitations.find(i=>i.id===a.invitation.id);if(i.acceptedAt)throw Error('Invitation already accepted.');i.userId=actor.userId;i.acceptedAt=now;
 }else if(input.action==='message'){
  accepted();if(!p.published)throw Error('ADPA has not shared a dashboard update yet.');if(input.taskId&&!p.published.tasks.some((t:any)=>t.id===input.taskId))throw Error('Choose a current shared task.');if(p.messages.length>=300)throw Error('Message limit reached.');p.messages.push({id:crypto.randomUUID(),body:input.body,taskId:input.taskId,from:a.owner?'ADPA':a.invitation.name,kind:a.owner?'ADPA':'Policyholder',invitationId:a.invitation?.id||'',...stamp});
 }else if(input.action==='taskResponse'){
  accepted();if(a.owner)throw Error('Only the invited client submits a task response.');const t=p.published?.tasks.find((t:any)=>t.id===input.taskId&&t.status==='Open');if(!t)throw Error('This request is no longer open.');const allowed=portalVisibleFiles(claim,actor,files);if(new Set(input.fileIds).size!==input.fileIds.length||input.fileIds.some(id=>!allowed.some(f=>f.id===id)))throw Error('Choose evidence available in your dashboard.');if(p.responses.length>=300)throw Error('Response limit reached.');p.responses.push({id:crypto.randomUUID(),taskId:t.id,publishedId:p.published.id,note:input.note,fileIds:input.fileIds,invitationId:a.invitation.id,...stamp});
 }
 p.audit=[...p.audit,{action:input.action,target:'invitationId' in input?input.invitationId:'taskId' in input?input.taskId:'',...stamp}].slice(-300);return {...claim.state,clientPortal:p};
}
