import {z} from 'zod';
export const agreementPurposes=['Service agreement','ADPA representation','Change order','Amendment','Contents disposition','Completion acknowledgment','Other agreement'] as const;
export const signingFieldTypes=['Signature','Initials','Date signed','Text','Checkbox'] as const;
const id=z.string().min(1).max(180),version=z.number().int().positive(),short=z.string().trim().min(1).max(200),text=z.string().trim().max(3000),numId=z.string().regex(/^[1-9]\d{0,2}$/);
export const agreementDraft=z.object({id:z.string().uuid(),purpose:z.enum(agreementPurposes),title:short,subject:short,message:text,relatedId:z.string().max(180),documents:z.array(z.object({id:numId,assetId:id}).strict()).min(1).max(5),signers:z.array(z.object({id:numId,name:short,email:z.string().trim().email().max(254).transform(v=>v.toLowerCase()),role:z.enum(['Client','Company representative','Other authorized signer']),order:z.number().int().min(1).max(8),permissionBasis:short}).strict()).min(1).max(8),fields:z.array(z.object({id:z.string().uuid(),type:z.enum(signingFieldTypes),signerId:numId,documentId:numId,page:z.number().int().min(1).max(10000),x:z.number().int().min(0).max(1500),y:z.number().int().min(0).max(1500),label:short,value:z.string().max(500),required:z.boolean()}).strict()).min(1).max(100),reminders:z.object({enabled:z.boolean(),delay:z.number().int().min(1).max(30),frequency:z.number().int().min(1).max(30),expires:z.number().int().min(7).max(120)}).strict(),reviewed:z.literal(true)}).strict().superRefine((r,c)=>{
 const unique=(vs:string[])=>new Set(vs).size===vs.length;
 if(!unique(r.documents.map(d=>d.id))||!unique(r.documents.map(d=>d.assetId))||!unique(r.signers.map(s=>s.id))||!unique(r.signers.map(s=>s.email))||!unique(r.fields.map(f=>f.id)))c.addIssue({code:'custom',message:'Use distinct documents, signer emails and field IDs.'});
 for(const f of r.fields){if(f.type==='Checkbox'&&f.value&&f.value!=='false')c.addIssue({code:'custom',message:'Acknowledgment checkboxes must begin unchecked.'});}
 for(const f of r.fields)if(!r.documents.some(d=>d.id===f.documentId)||!r.signers.some(s=>s.id===f.signerId))c.addIssue({code:'custom',message:'Every field needs an included document and signer.'});
 for(const s of r.signers)if(!r.fields.some(f=>f.signerId===s.id&&f.type==='Signature'&&f.required))c.addIssue({code:'custom',message:'Every signer needs a required signature field.'});
 if(r.reminders.enabled&&r.reminders.delay>=r.reminders.expires)c.addIssue({code:'custom',message:'Reminders must start before expiration.'});
});
export const signingInput=z.discriminatedUnion('action',[
 z.object({action:z.literal('prepare'),version,companyVersion:version,draft:agreementDraft}).strict(),
 z.object({action:z.literal('send'),version,companyVersion:version,agreementId:id,reviewed:z.literal(true)}).strict(),
 z.object({action:z.literal('cancelDraft'),version,companyVersion:version,agreementId:id,reason:short}).strict(),
 z.object({action:z.literal('void'),version,companyVersion:version,agreementId:id,reason:short}).strict(),
 z.object({action:z.literal('refresh'),version,companyVersion:version,agreementId:id,providerId:z.string().uuid().optional()}).strict(),
 z.object({action:z.literal('sign'),agreementId:id}).strict()
]);
export const terminalSigning=(status:string)=>['Completed','Declined','Voided','Cancelled'].includes(status);
export function signerAccess(a:any,actor:any){return a.signers.find((s:any)=>s.email===actor.email.trim().toLowerCase()&&(!s.userId||s.userId===actor.userId));}
export function signingHistory(a:any,action:string,actorId:string,at:string,note=''){return [...(a.history||[]),{action,actorId,at,note}];}
export function busySigning(state:any){return ['Sending','Unknown'].includes(state.dispatch?.status)||(state.signing?.agreements||[]).some((a:any)=>['Sending','Unknown'].includes(a.status));}
export function prepareAgreement(state:any,draft:any,assets:any[],actor:any,now:string){
 if(state.stage==='Cancelled'||busySigning(state))throw Error('Resolve any pending delivery before preparing another agreement.');
 const existing=state.signing?.agreements||[];if(existing.length>=50||existing.some((a:any)=>a.id===draft.id))throw Error('Agreement limit reached or draft already saved. Refresh.');
 if(!state.contact.email||!draft.signers.some((s:any)=>s.email===state.contact.email.toLowerCase()&&s.role==='Client'))throw Error('Include the recorded client as a signer and confirm each signer’s contact permission.');
 if(draft.purpose==='Service agreement'&&(state.contract&&['Sent','Completed','Unknown','Sending'].includes(state.contract.status)||existing.some((a:any)=>a.purpose==='Service agreement'&&!['Cancelled','Voided','Declined'].includes(a.status))))throw Error('A service agreement already exists. Use an amendment or change order.');
 const legacy=state.contract?.status==='Completed'?{id:'legacy-service-contract',purpose:'Service agreement',signedAssetId:state.contract.signedAssetId,certificateAssetId:state.contract.certificateAssetId,completedAt:state.contract.completedAt||'',requestId:state.contract.requestId}:null;
 const parent=draft.relatedId==='legacy-service-contract'?legacy:existing.find((a:any)=>a.id===draft.relatedId&&a.status==='Completed');
 if((draft.relatedId&&!parent)||['Change order','Amendment','Contents disposition','Completion acknowledgment'].includes(draft.purpose)&&!parent)throw Error('Choose the completed agreement this approval relates to.');
 const docs=draft.documents.map((d:any)=>{const asset=assets.find(a=>a.id===d.assetId&&a.mime==='application/pdf'&&['Contract template','Client document'].includes(a.kind));if(!asset)throw Error('Use this company’s reviewed PDF templates or this client’s PDFs.');return {...d,filename:asset.filename,title:asset.title,revision:asset.revision,digest:asset.digest,sourceCreated:asset.created};});
 const contactSnapshot=Object.fromEntries(['name','email','address','service'].map(k=>[k,state.contact[k]]));
 return {...draft,documents:docs,signers:draft.signers.map((s:any)=>({...s,status:'Pending',clientUserId:draft.id+':'+s.id})),status:'Draft',contactSnapshot,parentSnapshot:parent?{id:parent.id,purpose:parent.purpose,signedAssetId:parent.signedAssetId,certificateAssetId:parent.certificateAssetId,completedAt:parent.completedAt}:null,history:signingHistory({},'Prepared',actor.userId,now),at:now};
}
export function signingProjection(a:any,actor:any,manage:boolean){const own=manage?null:signerAccess(a,actor);if(!manage&&!own)return null;const {contactSnapshot,history,signers,documents,providerId,accountId,baseUri,reviewed,...safe}=a;return {...safe,documents:documents.map(({snapshotKey,...d}:any)=>manage?d:{id:d.id,title:d.title,filename:d.filename}),signers:signers.map(({clientUserId,userId,permissionBasis,...s}:any)=>manage?s:{id:s.id,name:s.name,role:s.role,status:s.status,email:s.id===own.id?s.email:undefined}),history:history.map(({actorId,...h}:any)=>h),...(manage?{providerId}:{}),mySignerId:own?.id||''};}
