import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeScan,roomQuantities,lineQuantity,reviewBlockers,comparisonLines,mergeComparisonLines} from '../src/lib/inspectionScope.js';
import {AnalysisRequest,suggestInspection} from '../server/inspectionAI.js';
const docs=[{id:'photo-1'}];
const room=()=>({id:'r1',name:'Bedroom',length:12,width:10,height:8,openingsArea:20,measurementSource:'Laser measurement',measurementVerified:true,reviewer:'Peter',transcript:'Replace entire water damaged ceiling drywall. Protect wood floor.',evidenceIds:['photo-1'],lines:[{id:'l1',material:'Drywall',description:'Remove ceiling drywall',basis:'ceiling',unit:'SF',reviewed:true,rationale:'Observed water damage; extent verified',evidenceIds:['photo-1']}]});
test('rectangular quantities deduct wall openings only and reject impossible geometry',()=>{
 assert.deepEqual(roomQuantities(room()),{floor:120,ceiling:120,walls:332,perimeter:44});
 for(const bad of [{length:-1},{height:Infinity},{openingsArea:353},{width:''},{openingsArea:-1}])assert.equal(roomQuantities({...room(),...bad}),null);
 assert.equal(lineQuantity(room(),{basis:'manual',quantity:'-2'}),null);
 assert.equal(lineQuantity(room(),{basis:'manual',quantity:''}),null);
 assert.equal(lineQuantity(room(),{basis:'manual',quantity:24}),24);
});
test('normalized metric scans convert lengths and areas and require field verification',()=>{
 const [r]=normalizeScan({version:1,units:'m',provider:'Test native adapter',capturedAt:'2026-10-20T00:00:00Z',rooms:[{name:'Bedroom',length:3.048,width:6.096,height:2.4384,openingsArea:0.9290304}]});
 assert.ok(Math.abs(r.length-10)<1e-8);assert.ok(Math.abs(r.openingsArea-10)<1e-8);assert.equal(r.measurementVerified,false);
 assert.throws(()=>normalizeScan({version:1,units:'in',rooms:[]}));
});
test('transfer requires evidence, measurements, reviewer, and per-line review',()=>{
 assert.deepEqual(reviewBlockers(room(),docs),[]);
 for(const changes of [{measurementVerified:false},{reviewer:''},{lines:[]},{measurementSource:''}])assert.throws(()=>comparisonLines({...room(),...changes},docs,'now'));
 assert.throws(()=>comparisonLines(room(),[],'now'));
 const r=room();r.lines[0].unit='LF';assert.ok(reviewBlockers(r,docs).some(x=>x.includes('units')));
 r.lines[0].unit='SF';r.lines[0].reviewed=false;assert.ok(reviewBlockers(r,docs).length);
});
test('comparison transfer preserves provenance, remains unpriced, and replaces only this room',()=>{
 const lines=comparisonLines(room(),docs,'2026-10-20T00:00:00Z');
 assert.equal(lines[0].quantity,120);assert.equal(lines[0].pricingPending,true);assert.equal(lines[0].adpaUnitPrice,'');assert.equal(lines[0].scopeReviewer,'Peter');
 const other={id:'manual'}, removed={id:'old',inspectionRoomId:'r1'};
 const once=mergeComparisonLines([other,removed],lines,'r1');
 assert.deepEqual(mergeComparisonLines(once,lines,'r1'),once);assert.equal(once.length,2);assert.equal(once[0],other);
});
const goodOutput={observations:['Ceiling damage visible'],questions:['Confirm insulation condition'],lines:[{material:'Drywall',trade:'Drywall',description:'Remove damaged ceiling',basis:'manual',rationale:'User reports water damage',evidenceIds:['photo-1']}]};
function responder(suggestion=goodOutput) {return async(url,options)=>{
 assert.equal(url,'https://api.openai.com/v1/responses');const body=JSON.parse(options.body);assert.equal(body.store,false);assert.equal(body.text.format.strict,true);
 return {ok:true,json:async()=>({id:'response1',status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(suggestion)}]}]})};
};}
test('AI provider is explicitly unconfigured without credentials; payload has no arbitrary image URLs',async()=>{
 await assert.rejects(()=>suggestInspection({room:room(),frames:[],apiKey:'',model:'test'}),{status:503});
 assert.throws(()=>AnalysisRequest.parse({roomId:'r1',frames:[{evidenceId:'photo-1',dataUrl:'http://localhost/private',timestampSeconds:null}]}));
});
test('AI returns validated proposals and rejects invented evidence and provider failures',async()=>{
 const result=await suggestInspection({room:room(),frames:[],apiKey:'fake-test-key',model:'test',fetcher:responder()});assert.equal(result.suggestion.lines[0].material,'Drywall');
 const bad={...goodOutput,lines:[{...goodOutput.lines[0],evidenceIds:['other-claim-photo']}]};
 await assert.rejects(()=>suggestInspection({room:room(),frames:[],apiKey:'fake',model:'test',fetcher:responder(bad)}),{status:502});
 await assert.rejects(()=>suggestInspection({room:room(),frames:[],apiKey:'fake',model:'test',fetcher:async()=>({ok:false,status:429})}),{status:502});
 await assert.rejects(()=>suggestInspection({room:room(),frames:[],apiKey:'fake',model:'test',fetcher:responder({unstructured:true})}),{status:502});
});
