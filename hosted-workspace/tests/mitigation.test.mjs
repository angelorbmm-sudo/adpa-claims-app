import {test,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const base=pathToFileURL(process.env.ADPA_TEST_MODULE_DIR+'/'),api=await import(new URL('mitigation-route.mjs',base)),m=await import(new URL('mocks.mjs',base)),lib=await import(new URL('mitigation-review.js',base)),authority=await import(new URL('authority.mjs',base)),pkg=await import(new URL('claim-package.mjs',base)),prep=await import(new URL('preparation.mjs',base));
for(const file of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())m.sqlite.exec(readFileSync('drizzle/'+file,'utf8'));
const id='11111111-1111-4111-8111-111111111111';
const original={profile:{claimNumber:'TEST-1'},items:[{name:'Synthetic chair'}],buckets:[{requested:900,received:200}],authority:{packages:[]}};
const draft={applicable:true,lossType:'Fire / Smoke',contractor:'Synthetic contractor',authorizationDocumentId:'source',authorizationLocator:'p1',workPlanDocumentId:'source',workPlanLocator:'p2',zones:[{id:'z',name:'Room',material:'Wall',documentId:'source',locator:'p3'}]};
const req=body=>new Request('https://claims.test/api/mitigation?id='+id,{method:'POST',headers:{origin:'https://claims.test','Content-Type':'application/json'},body:JSON.stringify(body)});
const get=()=>api.GET(new Request('https://claims.test/api/mitigation?id='+id));
beforeEach(()=>{m.sqlite.exec('DELETE FROM preparation_runs;DELETE FROM claim_packages;DELETE FROM evidence;DELETE FROM claims;');m.setUser({userId:'owner',email:'owner@example.test'});m.sqlite.prepare('INSERT INTO claims VALUES (?,?,?,?,?,1,?,?)').run(id,'owner','Synthetic claim','Address',JSON.stringify(original),'2026-01-01','2026-01-01');m.sqlite.prepare('INSERT INTO evidence (id,claim_id,owner,filename,mime,size,category,note,sources,object_key,created) VALUES (?,?,?,?,?,?,?,?,?,?,?)').run('source',id,'owner','Scope.pdf','application/pdf',5,'Construction and mitigation','','[]','key','2026-01-01');});
test('mitigation endpoint requires owner sign-in, same origin and current version',async()=>{
 m.setUser(null);assert.equal((await get()).status,401);m.setUser({userId:'other'});assert.equal((await get()).status,404);m.setUser({userId:'owner',email:'owner@example.test'});
 assert.equal((await api.POST(new Request('https://claims.test/api/mitigation?id='+id,{method:'POST',headers:{origin:'https://outside.test'},body:'{}'}))).status,403);
 assert.equal((await api.POST(req({action:'save',version:2,mitigation:draft}))).status,409);
});
test('save preserves other modules and cannot forge source or final reviews',async()=>{
 const r=await api.POST(req({action:'save',version:1,mitigation:{...draft,review:{reviewer:'Forged',snapshot:'fake'},documentReviews:{source:{status:'Verified'}}}}));assert.equal(r.status,200);const d=await r.json();assert.equal(d.claim.mitigation.review,null);assert.equal(d.claim.documents[0].reviewStatus,'Unreviewed');
 const state=JSON.parse(m.sqlite.prepare('SELECT state FROM claims').get().state);assert.deepEqual(state.buckets,original.buckets);assert.deepEqual(state.items,original.items);assert.deepEqual(state.authority,original.authority);assert.equal(state.mitigationAudit[0].actor,'owner@example.test');assert.match(authority.ordinaryWriteError(original,state),/Mitigation/);
 assert.equal((await api.POST(req({action:'review',version:2,reviewer:'Reviewer'}))).status,400);
});
test('source review is claim-bound and final acknowledgment stays current until evidence changes',async()=>{
 await api.POST(req({action:'save',version:1,mitigation:draft}));
 assert.equal((await api.POST(req({action:'documentReview',version:2,fileId:'outside',status:'Verified',note:'Inspected'}))).status,400);
 let r=await api.POST(req({action:'documentReview',version:2,fileId:'source',status:'Verified',note:'Inspected pages 1–3'}));assert.equal(r.status,200);
 r=await api.POST(req({action:'review',version:3,reviewer:'Responsible reviewer'}));const d=await r.json();assert.equal(r.status,200);assert.equal(d.readiness.ready,true);assert.equal(d.claim.mitigation.review.actor,'owner@example.test');
 r=await api.POST(req({action:'documentReview',version:4,fileId:'source',status:'Unreviewed',note:'Needs clarification'}));const reopened=await r.json();assert.equal(reopened.readiness.ready,false);assert.equal(reopened.readiness.stale,true);
});
test('equipment and moisture checks retain measurement context',()=>{
 assert.equal(lib.equipmentUsage({count:30,startedAt:'2025-12-18T09:00:00-08:00',removedAt:'2025-12-20T09:00:00-08:00'}).unitDays,60);
 assert.equal(lib.equipmentUsage({count:1,startedAt:'2025-12-18T09:00:00',removedAt:'2025-12-20T09:00:00'}).valid,false);
 assert.equal(lib.scopeMeasurement({unit:'SF',length:10,height:2,quantity:25}).mismatch,true);
 assert.deepEqual(lib.mitigationBlockers({}),[]);
});
test('package includes mitigation facts and preparation flags unresolved evidence',()=>{
 const claim={id,name:'Synthetic',address:'Address',version:1,state:{...original,mitigation:draft}};
 assert.equal(pkg.sectionRecords(claim).mitigation.length,2);
 assert.ok(prep.recordChecks(claim,[]).proposals.some(p=>p.title.includes('Mitigation')));
 assert.ok(pkg.packageWarnings(claim,[]).some(p=>p.includes('Mitigation')));
 assert.ok(lib.mitigationBlockers({mitigation:{applicable:false,zones:[{id:'z'}]}}).length);
});
