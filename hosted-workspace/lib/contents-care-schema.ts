import {z} from 'zod';
import {careTimestamp} from './contents-care-review.js';
const text=z.string().max(2000),short=z.string().max(200),ref=z.string().max(200),optional=(s:any)=>s.optional();
const number=z.union([z.string().max(30),z.number().finite()]).refine(v=>v===''||/^\d{1,9}(\.\d{1,4})?$/.test(String(v)),'Use a nonnegative quantity');
const money=z.union([z.string().max(20),z.number().finite()]).refine(v=>v===''||/^\d{1,9}(\.\d{1,2})?$/.test(String(v)),'Use nonnegative dollars and cents');
const timestamp=z.string().max(50).refine(v=>!v||/(Z|[+-]\d{2}:\d{2})$/.test(v)&&Number.isFinite(Date.parse(v)),'Include a timezone offset');
const base={id:short.min(1),documentId:optional(ref),locator:optional(short),createdAt:optional(timestamp),updatedAt:optional(timestamp)};
const strings=(keys:string[],s=short)=>Object.fromEntries(keys.map(k=>[k,optional(s)]));
export const careRows={
 items:z.object({...base,...strings(['tag','room','description','brand','model','serial','material','unit','status','currentLocation','sourceReportId','authorizationDocumentId','authorizationLocator','specialistReviewer','specialistDocumentId','specialistLocator','repairDocumentId','repairLocator','reviewer']),...strings(['countBasis','priorCondition','lossDamage','reason'],text),quantity:optional(number),disposition:z.enum(['','Needs review','Retain','Clean / restore','Repair','Nonrestorable','Dispose']).optional(),specialistNeeded:z.boolean().optional()}).strict(),
 cleaning:z.object({...base,...strings(['itemId','material','contractor','result','reviewer','beforeDocumentId','beforeLocator','afterDocumentId','afterLocator']),...strings(['method','compatibilityBasis','remainingDamage'],text)}).strict(),
 custody:z.object({...base,...strings(['itemId','event','from','to','person','containerId','returnReviewer','readinessDocumentId','readinessLocator']),acceptanceNotes:optional(text),quantity:optional(number),observedAt:optional(timestamp)}).strict(),
 storage:z.object({...base,...strings(['periodType','containerId','location','unit']),...strings(['billingBasis','extensionReason'],text),startedAt:optional(timestamp),endedAt:optional(timestamp),billedUnits:optional(number),extension:z.boolean().optional()}).strict(),
 invoices:z.object({...base,...strings(['contractor','invoiceNumber','invoiceLine','status','serviceType','itemId','cleaningId','custodyId','storageId','paymentDocumentId','paymentLocator','workKey','unit','priceSourceDocumentId','priceSourceLocator','supersedesId']),...strings(['billingBasis','relationshipBasis','priceBasis','voidReason'],text),amount:optional(money),approvedAmount:optional(money),issuedAmount:optional(money),receivedAmount:optional(money),quantity:optional(number),unitPrice:optional(money),voided:z.boolean().optional()}).strict(),
 reportVersions:z.object({...base,...strings(['inventoryGroupId','format','sourceClaimNumber']),versionBasis:optional(text)}).strict()
};
export const careSchema=z.object({applicable:z.boolean().optional(),...strings(['contractor','carrierStatus','carrierDocumentId','carrierLocator','contaminationStatus','assessmentReviewer','assessmentDocumentId','assessmentLocator','authorizationDocumentId','authorizationLocator','workPlanDocumentId','workPlanLocator']),...strings(['carrierScope','assessmentBasis','nextAction','waitingOn'],text),followUp:z.string().max(10).refine(v=>!v||/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v).optional(),...Object.fromEntries(Object.entries(careRows).map(([k,s])=>[k,z.array(s).max(2000).optional()])),review:z.unknown().optional(),documentReviews:z.unknown().optional()}).strict();
export function validateCare(next:any,prior:any,files:any[]){
 careSchema.parse(next);
 for(const [kind,schema] of Object.entries(careRows)){
  const rows=next[kind]||[],ids=new Set();for(const row of rows){schema.parse(row);const old=(prior[kind]||[]).find((r:any)=>r.id===row.id);for(const key of ['observedAt','startedAt','endedAt','createdAt','updatedAt'])if(row[key]&&row[key]!==old?.[key]&&!careTimestamp(row[key]))throw Error('Use a real calendar timestamp with its timezone offset.');if(ids.has(row.id))throw Error('Record IDs must be unique.');ids.add(row.id);for(const [key,value] of Object.entries(row))if((key==='documentId'||/DocumentId$/.test(key))&&value&&!files.some(f=>f.id===value))throw Error('Supporting evidence must belong to this claim.');}
  if((prior[kind]||[]).some((r:any)=>!ids.has(r.id)))throw Error('Keep existing records for history. Correct a record or void a service line with a reason.');
 }
 for(const [key,value] of Object.entries(next))if(/DocumentId$/.test(key)&&value&&!files.some(f=>f.id===value))throw Error('Supporting evidence must belong to this claim.');
 const links:any={itemId:'items',cleaningId:'cleaning',custodyId:'custody',storageId:'storage',sourceReportId:'reportVersions',supersedesId:'invoices'};
 for(const kind of Object.keys(careRows))for(const row of next[kind]||[])for(const [key,list] of Object.entries(links))if(row[key]&&!(next[list as string]||[]).some((x:any)=>x.id===row[key]))throw Error('Linked records must belong to this workstream.');
}
