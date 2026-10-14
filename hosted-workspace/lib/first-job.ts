import {z} from 'zod';
export const firstJobDraft=z.object({clientId:z.string().max(180),step:z.number().int().min(0).max(4),name:z.string().trim().max(200),email:z.string().trim().max(254),address:z.string().trim().max(400),service:z.string().trim().max(5000),templateId:z.string().max(180)}).strict();
export const firstJobKey=(actorId:string,companyId:string)=>'first-job/'+encodeURIComponent(actorId)+'/'+encodeURIComponent(companyId)+'.json';
export function firstJobReadiness(client:any,assets:any[],job:any){const s=client?.state,k=s?.contract;
 const contact=!!s&&['name','address','service'].every(k=>typeof s.contact?.[k]==='string'&&!!s.contact[k].trim())&&z.string().email().safeParse(s.contact?.email).success;
 const signed=!!client&&s.stage!=='Cancelled'&&k?.status==='Completed'&&!!k.verifiedAt&&assets.some(a=>a.id===k.signedAssetId&&a.company_id===client.company_id&&a.client_id===client.id&&a.kind==='Signed contract'&&a.originalCurrent!==false)&&assets.some(a=>a.id===k.certificateAssetId&&a.company_id===client.company_id&&a.client_id===client.id&&a.kind==='Signature certificate'&&a.originalCurrent!==false);
 const participants=(job?.state.companies||[]).filter((p:any)=>p.companyId===client?.company_id&&p.clientId===client?.id&&!p.removedAt),p=participants[0],approved=participants.length===1&&!!job?.state.homeowner.acceptedAt&&!!p?.acceptedAt&&!!p.approvedAt;
 const identity=!!client&&!!job&&String(s.contact.email).trim().toLowerCase()===String(job.state.homeowner.email||'').trim().toLowerCase()&&String(s.contact.address).trim().toLowerCase()===String(job.address||'').trim().toLowerCase();
 const blockers=[];if(job&&!identity)blockers.push('Reconcile the client identity and property with the recovery job.');if(!client)blockers.push('Choose or add a client.');else{if(s.stage==='Cancelled')blockers.push('This client inquiry is cancelled.');if(!contact)blockers.push('Confirm the client email, property and requested services.');if(!signed)blockers.push('Verify the company’s signed agreement and retain its signature certificate.');if(!job)blockers.push('Create the recovery workspace invitation.');else if(!approved)blockers.push('The policyholder must accept and approve this company.');}
 return {contact,signed,approved,ready:!!client&&contact&&signed&&approved&&identity,blockers};
}

// Derived from current records: never persists a readiness override or grants work authority.
export function jobReadinessPlan(client:any,assets:any[],job:any,now=Date.now(),companyId=''){
 const r=firstJobReadiness(client,assets,job),cid=client?.company_id||companyId;
 const linked=job?.state.companies.some((p:any)=>p.companyId===cid&&p.clientId===client?.id&&!p.removedAt);
 const identity=!!client&&!!job&&client.state.contact.email.trim().toLowerCase()===job.state.homeowner.email?.trim().toLowerCase()&&client.state.contact.address.trim().toLowerCase()===job.address?.trim().toLowerCase();
 const own=linked&&identity&&r.approved;
 const visits=own?(job.state.appointments||[]).filter((v:any)=>v.companyId===cid&&v.status==='Scheduled'&&Date.parse(v.startsAt)>=now).sort((a:any,b:any)=>Date.parse(a.startsAt)-Date.parse(b.startsAt)):[];
 const visit=visits.find((v:any)=>v.assignedTo?.trim())||null;
 const tasks=own?(job.state.tasks||[]).filter((t:any)=>t.companyId===cid&&t.status==='Open'):[];
 const evidence=own?(job.state.evidence||[]).filter((e:any)=>!e.withdrawnAt&&(e.companyId===cid||e.companyIds?.includes(cid))):[];
 const clientUrl='/company-clients?companyId='+encodeURIComponent(cid||'')+(client?'&clientId='+encodeURIComponent(client.id):'');
 const jobUrl=job?'/shared-jobs?job='+encodeURIComponent(job.id):'/first-job?companyId='+encodeURIComponent(cid||'')+(client?'&clientId='+encodeURIComponent(client.id):'');
 const checks=[
 {id:'client',title:'Client and property confirmed',done:!!client&&r.contact&&client.state.stage!=='Cancelled'&&(!job||identity),detail:client?.state.stage==='Cancelled'?'This inquiry is cancelled. Reconcile the client record before proceeding.':job&&!identity?'Client identity or property changed. Reconcile the client and recovery job before planning work.':'Name, signer email, property and requested service must be recorded.',href:clientUrl,action:'Review client record'},
 {id:'agreement',title:'Company agreement verified',done:r.signed,detail:'Completed agreement, verification, signed PDF and signature certificate retained for this company and client.',href:clientUrl+'&tab=Contract',action:'Review agreement'},
 {id:'policyholder',title:'Policyholder connected',done:!!linked&&!!job?.state.homeowner.acceptedAt,detail:'The invited policyholder must accept this recovery job.',href:jobUrl,action:job?'Review invitation and acceptance':'Create recovery invitation'},
 {id:'consent',title:'Company participation approved',done:!!own,detail:'The policyholder approves this company separately. Individual evidence files still require their own sharing permission.',href:jobUrl,action:'Review people and consent'},
 {id:'visit',title:'First visit and responsible person planned',done:!!visit,detail:visit?visit.title+' · '+visit.assignedTo:'Save a future company visit with its purpose, time and responsible person or team.',href:'#visit-plan',action:'Plan the first visit'},
 {id:'tasks',title:'Initial work tasks recorded',done:tasks.length>0,detail:tasks.length?tasks.length+' open company task(s).':'Record at least one open task with clear instructions for your company.',href:'#task-plan',action:'Add an initial task'}
 ];
 return {ready:checks.every(c=>c.done),workspaceReady:r.ready&&identity,checks,completed:checks.filter(c=>c.done).length,total:checks.length,visit:visit?{title:visit.title,assignedTo:visit.assignedTo,startsAt:visit.startsAt}:null,openTasks:tasks.length,availableEvidence:evidence.length,jobUrl,jobVersion:job?.version||null};
}
