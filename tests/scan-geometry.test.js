import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {polygonMetrics,normalizeNativeScan,captureOptions,sketchPoints} from '../src/lib/scanGeometry.js';
import {normalizeScan,roomQuantities,comparisonLines,reviewBlockers} from '../src/lib/inspectionScope.js';
import {scopeReviewExport} from '../src/lib/scopeExport.js';
const apple=JSON.parse(readFileSync(new URL('../native/fixtures/apple-roomplan-example.json',import.meta.url)));
const android=JSON.parse(readFileSync(new URL('../native/fixtures/android-arcore-example.json',import.meta.url)));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
test('Apple native fixture imports real outline coordinates and remains unverified',()=>{
 const [room]=normalizeScan(apple);assert.equal(room.measurementMode,'polygon');assert.equal(room.length,'');assert.equal(room.measurementVerified,false);
 const q=roomQuantities(room);near(q.floor,120);near(q.ceiling,120);near(q.perimeter,44);near(q.walls,352);
 assert.equal(room.scanGeometry.sourceScanId,apple.scanId);assert.equal(room.scanGeometry.captureMethod,'apple_roomplan');
});
test('Android concave room is calculated as an L shape rather than a bounding rectangle',()=>{
 const [room]=normalizeNativeScan(android),q=roomQuantities(room);near(q.floor,90);near(q.perimeter,44);near(q.walls,352);
 room.openingsArea=20;near(roomQuantities(room).walls,332);
 assert.equal(room.scanGeometry.captureMethod,'android_arcore');
});
test('polygon calculations preserve winding and translation invariance',()=>{
 const points=android.rooms[0].points,expected=polygonMetrics(points);
 assert.deepEqual(polygonMetrics([...points].reverse()),expected);
 const moved=points.map(p=>({x:p.x-120,z:p.z+200}));assert.deepEqual(polygonMetrics(moved),expected);
 assert.equal(sketchPoints(points).split(' ').length,6);
});
test('self-crossing, repeated, touching, backtracking and nonfinite outlines are refused',()=>{
 const invalid=[[],[{x:0,z:0},{x:1,z:1}],
 [{x:0,z:0},{x:2,z:2},{x:0,z:2},{x:2,z:0}],
 [{x:0,z:0},{x:2,z:0},{x:2,z:2},{x:0,z:0}],
 [{x:0,z:0},{x:3,z:0},{x:1,z:0},{x:1,z:2},{x:0,z:2}],
 [{x:0,z:0},{x:2,z:0},{x:1,z:1},{x:2,z:2},{x:0,z:2},{x:1,z:1}],
 [{x:0,z:0},{x:Infinity,z:0},{x:0,z:1}],
 [{x:'',z:0},{x:1,z:0},{x:0,z:1}]];
 for(const points of invalid)assert.equal(polygonMetrics(points),null,JSON.stringify(points));
});
test('native imports reject invalid outlines, unknown versions, impossible deductions and secret extra fields',()=>{
 for(const mutation of [s=>s.version=3,s=>s.rooms[0].height=-1,s=>s.rooms[0].openingsArea=9999,s=>s.captureMethod='lidar_guessed_from_browser',s=>s.token='secret',s=>s.rooms[0].points=[{x:0,z:0},{x:1,z:1},{x:0,z:1},{x:1,z:0}]]){
  const scan=structuredClone(apple);mutation(scan);assert.throws(()=>normalizeScan(scan));
 }
});
test('invalid imported polygon cannot fall back silently to rectangle quantities',()=>{
 const [room]=normalizeScan(apple);room.length=12;room.width=10;room.scanGeometry.points=[];assert.equal(roomQuantities(room),null);
});
test('all three capture choices remain available without inferred brand support or a sensor claim',()=>{
 assert.deepEqual(captureOptions().map(x=>x.id),['manual','apple','android']);assert.match(captureOptions()[1].status,/testing pending/);
});
test('scope review packet preserves native provenance without claiming Xactimate export or storing media bytes',()=>{
 const [base]=normalizeScan(android);
 const room={...base,id:'room',reviewer:'Test reviewer',measurementVerified:true,evidenceIds:['photo'],lines:[{id:'operation',material:'Drywall',description:'Remove damaged ceiling',rationale:'Inspector verified extent',basis:'ceiling',unit:'SF',reviewed:true,evidenceIds:['photo']}]};
 const claim={id:'claim',documents:[{id:'photo',name:'test.jpg',sha256:'fingerprint',dataUrl:'must-not-export'}]};
 assert.deepEqual(reviewBlockers(room,claim.documents),[]);
 const [line]=comparisonLines(room,claim.documents,'now');near(line.quantity,90);assert.equal(line.measurementSnapshot.scanGeometry.captureMethod,'android_arcore');
 const packet=scopeReviewExport(claim,room);assert.match(packet.status,/not a Xactimate/);assert.equal(packet.operations[0].calculatedQuantity,90);assert.ok(!JSON.stringify(packet).includes('must-not-export'));
 room.scanGeometry.points=[];assert.ok(reviewBlockers(room,claim.documents).length);
});
