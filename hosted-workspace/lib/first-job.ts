import {z} from 'zod';
export const firstJobDraft=z.object({clientId:z.string().max(180),step:z.number().int().min(0).max(4),name:z.string().trim().max(200),email:z.string().trim().max(254),address:z.string().trim().max(400),service:z.string().trim().max(5000),templateId:z.string().max(180)}).strict();
export const firstJobKey=(actorId:string,companyId:string)=>'first-job/'+encodeURIComponent(actorId)+'/'+encodeURIComponent(companyId)+'.json';
export function firstJobReadiness(client:any,assets:any[],job:any){const s=client?.state,k=s?.contract;
 const contact=!!s?.contact.name&&!!s?.contact.email&&!!s?.contact.address&&!!s?.contact.service;
 const signed=!!client&&s.stage!=='Cancelled'&&k?.status==='Completed'&&!!k.verifiedAt&&assets.some(a=>a.id===k.signedAssetId&&a.company_id===client.company_id&&a.client_id===client.id&&a.kind==='Signed contract')&&assets.some(a=>a.id===k.certificateAssetId&&a.company_id===client.company_id&&a.client_id===client.id&&a.kind==='Signature certificate');
 const p=job?.state.companies.find((p:any)=>p.companyId===client?.company_id&&!p.removedAt),approved=!!job?.state.homeowner.acceptedAt&&!!p?.acceptedAt&&!!p.approvedAt;
 const blockers=[];if(!client)blockers.push('Choose or add a client.');else{if(s.stage==='Cancelled')blockers.push('This client inquiry is cancelled.');if(!contact)blockers.push('Confirm the client email, property and requested services.');if(!signed)blockers.push('Verify the company’s signed agreement and retain its signature certificate.');if(!job)blockers.push('Create the recovery workspace invitation.');else if(!approved)blockers.push('The policyholder must accept and approve this company.');}
 return {contact,signed,approved,ready:!!client&&contact&&signed&&approved,blockers};
}
