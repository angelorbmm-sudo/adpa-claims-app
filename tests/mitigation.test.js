import test from 'node:test';
import assert from 'node:assert/strict';
import { equipmentUsage, mitigationReview, mitigationBlockers, mitigationSnapshot, scopeMeasurement } from '../src/lib/mitigationReview.js';
import { closureBlockers } from '../src/lib/claimReconciliation.js';
const doc={id:'doc',name:'Synthetic evidence',reviewStatus:'Verified'};
const source={documentId:'doc',locator:'p1'};
function fixture(){return {documents:[doc],mitigation:{applicable:true,lossType:'Fire / Smoke',contractor:'Synthetic contractor',authorizationDocumentId:'doc',authorizationLocator:'p1',workPlanDocumentId:'doc',workPlanLocator:'p2',zones:[{id:'z',name:'Room',material:'Wall',...source}]}};}
test('elapsed equipment arithmetic preserves hours and requires explicit offsets',()=>{
 assert.equal(equipmentUsage({count:30,startedAt:'2025-12-18T09:00:00-08:00',removedAt:'2025-12-20T09:00:00-08:00'}).unitDays,60);
 assert.equal(equipmentUsage({count:1,startedAt:'2025-12-18T09:00:00',removedAt:'2025-12-20T09:00:00'}).valid,false);
 assert.equal(equipmentUsage({count:1,startedAt:'2025-12-20T09:00:00Z',removedAt:'2025-12-18T09:00:00Z'}).valid,false);
});
test('inactive legacy claims are unaffected; existing records cannot bypass review',()=>{
 assert.deepEqual(mitigationBlockers({}),[]);
 assert.equal(mitigationReview({mitigation:{applicable:false,zones:[{id:'z'}]}}).applicable,true);
});
test('only verified claim evidence supports readiness',()=>{
 const c=fixture();assert.equal(mitigationReview(c).evidenceReady,true);
 for(const status of [undefined,'Rejected','Needs clarification','Unreviewed']) {c.documents=[{...doc,reviewStatus:status}];assert.equal(mitigationReview(c).evidenceReady,false);}
 c.documents=[{...doc,processingStatus:'Quarantine'}];assert.equal(mitigationReview(c).evidenceReady,false);
});
test('human acknowledgment is version bound and invalidates on evidence or scope change',()=>{
 const c=fixture();c.mitigation.review={reviewer:'Reviewer',reviewedAt:new Date().toISOString(),snapshot:mitigationSnapshot(c)};
 assert.equal(mitigationReview(c).ready,true);c.documents[0]={...doc,sha256:'changed'};
 assert.equal(mitigationReview(c).stale,true);assert.equal(mitigationReview(c).ready,false);
 assert.ok(closureBlockers(c).blockers.some(x=>x.includes('Mitigation')));
});
test('relative scales cannot substitute for comparable moisture readings',()=>{
 const c=fixture();Object.assign(c.mitigation,{lossType:'Water',sourceStatus:'Controlled',sourceDocumentId:'doc',sourceLocator:'p1',waterCategory:'1',categoryReviewer:'Contractor',categoryBasis:'Inspected',categoryDocumentId:'doc',categoryLocator:'p2'});
 Object.assign(c.mitigation.zones[0],{dryGoal:15,goalBasis:'Dry reference',pointId:'p',instrument:'meter',method:'Pin',units:'WME'});
 c.mitigation.readings=[{id:'r',zoneId:'z',observedAt:'2026-10-08T12:00:00Z',pointId:'p',instrument:'meter',method:'Scan',units:'Relative',material:'Wall',value:10,...source}];
 assert.ok(mitigationReview(c).issues.some(x=>x.code==='drying'));
 Object.assign(c.mitigation.readings[0],{method:'Pin',units:'WME'});assert.equal(mitigationReview(c).evidenceReady,true);
});
test('scope geometry and invoice support do not auto-adjust carrier totals',()=>{
 assert.equal(scopeMeasurement({unit:'SF',length:10,height:2,quantity:25}).mismatch,true);
 const c=fixture();c.mitigation.invoices=[{id:'i',amount:'100',...source}];
 assert.ok(mitigationReview(c).issues.some(x=>x.code==='invoice-support'));
 assert.equal(c.coverages,undefined);
});
test('return before pack-out is flagged even when final counts match',()=>{
 const c=fixture();c.mitigation.contents=[{id:'item',zoneId:'z',description:'Chair',quantity:1,currentLocation:'Home',status:'Returned',...source}];
 c.mitigation.custody=[{id:'out',itemId:'item',event:'Pack-out',quantity:1,observedAt:'2026-10-09T09:00:00Z',from:'Home',to:'Storage',person:'Contractor',...source},{id:'in',itemId:'item',event:'Return',quantity:1,observedAt:'2026-10-08T09:00:00Z',from:'Storage',to:'Home',person:'Contractor',...source}];
 assert.ok(mitigationReview(c).issues.some(x=>x.code==='custody-order'));
});
