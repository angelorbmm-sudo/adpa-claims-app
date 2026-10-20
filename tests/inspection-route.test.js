import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import {once} from 'node:events';
import {createInspectionRouter} from '../server/routes/inspection.js';
async function serve({role='claims_staff',found=true}={},fn) {
 const calls=[],audits=[], suggestions=[];
 const app=express();app.use(express.json());app.use((req,res,next)=>{if(role)req.user={id:'actor',organization_id:'org1',role};next();});
 app.use('/api/inspection',createInspectionRouter({
  queryFn:async(sql,args)=>{calls.push({sql,args});return {rowCount:found?1:0,rows:found?[{data_json:{documents:[{id:'photo1'}],inspection:{rooms:[{id:'room1',name:'Bedroom',transcript:'Water damaged ceiling',evidenceIds:['photo1']}]}}}]:[]};},
  suggest:async args=>{suggestions.push(args);return {suggestion:{observations:[],questions:[],lines:[]},providerResponseId:'test'};},
  audit:async event=>audits.push(event)
 }));
 app.use((err,req,res,next)=>res.status(err.name==='ZodError'?400:err.status||500).json({error:err.message}));
 const server=app.listen(0,'127.0.0.1');await once(server,'listening');
 const post=body=>fetch(`http://127.0.0.1:${server.address().port}/api/inspection/claim1/analyze`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 try{await fn({post,calls,audits,suggestions});}finally{await new Promise(resolve=>server.close(resolve));}
}
test('inspection endpoint denies anonymous and read-only users without accessing claims',async()=>{
 for(const role of [null,'read_only'])await serve({role},async({post,calls,suggestions})=>{assert.equal((await post({roomId:'room1',frames:[]})).status,403);assert.equal(calls.length,0);assert.equal(suggestions.length,0);});
});
test('inspection endpoint scopes claim retrieval to organization and returns 404 for foreign claims',async()=>{
 await serve({found:false},async({post,calls,suggestions})=>{assert.equal((await post({roomId:'room1',frames:[]})).status,404);assert.deepEqual(calls[0].args,['org1','claim1']);assert.equal(suggestions.length,0);});
});
test('inspection rejects unknown room or unrelated frame sources before provider invocation',async()=>{
 await serve({},async({post,suggestions})=>{
  assert.equal((await post({roomId:'unknown',frames:[]})).status,404);
  assert.equal((await post({roomId:'room1',frames:[{evidenceId:'foreign',dataUrl:'data:image/jpeg;base64,YQ==',timestampSeconds:null}]})).status,400);
  assert.equal(suggestions.length,0);
 });
});
test('inspection audits validated analysis without image bytes and rate-limits repeated calls',async()=>{
 await serve({},async({post,calls,audits,suggestions})=>{
  const request={roomId:'room1',frames:[{evidenceId:'photo1',dataUrl:'data:image/jpeg;base64,YQ==',timestampSeconds:1}]};
  const response=await post(request);assert.equal(response.status,200);assert.ok((await response.json()).analysisId);
  assert.equal(suggestions.length,1);assert.equal(audits[0].organizationId,'org1');assert.ok(!JSON.stringify(audits).includes('data:image'));
  assert.equal((await post(request)).status,429);
 });
});
