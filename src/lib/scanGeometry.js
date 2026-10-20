import { z } from 'zod';
const coordinate=z.number().finite().min(-10000).max(10000);
const point=z.object({x:coordinate,z:coordinate}).strict();
export const NativeScanSchema=z.object({
 version:z.literal(2),scanId:z.string().min(1).max(150),provider:z.string().trim().min(1).max(100),
 captureMethod:z.enum(['apple_roomplan','android_arcore','manual_polygon']),units:z.enum(['m','ft']),
 capturedAt:z.string().datetime(),warnings:z.array(z.string().max(500)).max(30).default([]),
 rooms:z.array(z.object({
  name:z.string().trim().min(1).max(150),points:z.array(point).min(3).max(100),
  height:z.number().finite().positive().max(100),openingsArea:z.number().finite().nonnegative().max(10000).default(0),
  heightSource:z.string().trim().min(1).max(500),
  notes:z.string().max(3000).default('')
 }).strict()).min(1).max(100)
}).strict();
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const cross=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
const epsilon=1e-8;
function onSegment(a,b,p){return Math.abs(cross(a,b,p))<epsilon&&p.x>=Math.min(a.x,b.x)-epsilon&&p.x<=Math.max(a.x,b.x)+epsilon&&p.z>=Math.min(a.z,b.z)-epsilon&&p.z<=Math.max(a.z,b.z)+epsilon;}
function intersects(a,b,c,d){
 const abC=cross(a,b,c),abD=cross(a,b,d),cdA=cross(c,d,a),cdB=cross(c,d,b);
 return ((abC>0&&abD<0||abC<0&&abD>0)&&(cdA>0&&cdB<0||cdA<0&&cdB>0))||onSegment(a,b,c)||onSegment(a,b,d)||onSegment(c,d,a)||onSegment(c,d,b);
}
export function polygonMetrics(points){
 if(!Array.isArray(points)||points.length<3||points.length>100)return null;
 if(points.some(p=>!p||![p.x,p.z].every(v=>typeof v==='number'&&Number.isFinite(v)&&Math.abs(v)<=100000)))return null;
 let signedArea=0,perimeter=0;
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length];
  if(distance(a,b)<0.01)return null;
  // Reject backtracking or duplicated collinear edges, including adjacent ones.
  const previous=points[(i+points.length-1)%points.length];
  if(Math.abs(cross(previous,a,b))<epsilon&&((previous.x-a.x)*(b.x-a.x)+(previous.z-a.z)*(b.z-a.z))>0)return null;
  signedArea+=a.x*b.z-b.x*a.z;perimeter+=distance(a,b);
  for(let j=i+1;j<points.length;j++){
   if(j===i+1||(i===0&&j===points.length-1))continue;
   if(intersects(a,b,points[j],points[(j+1)%points.length]))return null;
  }
 }
 const area=Math.abs(signedArea)/2;
 return area>0.01?{area,perimeter}:null;
}
export function normalizeNativeScan(input){
 const scan=NativeScanSchema.parse(input),factor=scan.units==='m'?1/0.3048:1;
 return scan.rooms.map((room,index)=>{
  if(!polygonMetrics(room.points))throw new Error(`Room ${index+1}: scan corners must describe a simple, closed, nonzero floor outline without repeated endpoints.`);
  const points=room.points.map(p=>({x:p.x*factor,z:p.z*factor})),height=room.height*factor,openingsArea=room.openingsArea*factor*factor;
  const metrics=polygonMetrics(points);
  if(openingsArea>metrics.perimeter*height)throw new Error(`Room ${index+1}: opening deductions exceed wall area.`);
  return {name:room.name,length:'',width:'',height,openingsArea,measurementMode:'polygon',
   scanGeometry:{points,sourceScanId:scan.scanId,captureMethod:scan.captureMethod,capturedAt:scan.capturedAt,heightSource:room.heightSource,warnings:scan.warnings},
   measurementSource:`${scan.provider} (${scan.captureMethod}) · ${scan.capturedAt}; height: ${room.heightSource}`,
   measurementVerified:false,transcript:room.notes};
 });
}
export function polygonQuantities(room){
 const metrics=polygonMetrics(room.scanGeometry?.points),height=Number(room.height),openings=Number(room.openingsArea||0);
 if(!metrics||!Number.isFinite(height)||height<=0||height>100000||!Number.isFinite(openings)||openings<0||openings>metrics.perimeter*height)return null;
 return {floor:metrics.area,ceiling:metrics.area,walls:metrics.perimeter*height-openings,perimeter:metrics.perimeter};
}
export function sketchPoints(points){
 if(!polygonMetrics(points))return '';
 const xs=points.map(p=>p.x),zs=points.map(p=>p.z),minX=Math.min(...xs),minZ=Math.min(...zs);
 const width=Math.max(...xs)-minX,depth=Math.max(...zs)-minZ,scale=Math.min(240/width,140/depth);
 return points.map(p=>`${40+(240-width*scale)/2+(p.x-minX)*scale},${25+(140-depth*scale)/2+(p.z-minZ)*scale}`).join(' ');
}
// Browser brand strings cannot establish LiDAR or ARCore compatibility.
export function captureOptions(){
 return [
  {id:'manual',title:'Any phone or computer',status:'Available now',description:'Photos, video and voice with entered laser/tape measurements or a manual polygon sketch.'},
  {id:'apple',title:'Apple RoomPlan / LiDAR',status:'Native source prepared; device testing pending',description:'Use the iOS companion on a supported LiDAR device, export its ADPA scan JSON, then import it here.'},
  {id:'android',title:'Samsung / Google Android',status:'Native source prepared; device testing pending',description:'Use the Android ARCore companion for guided floor-corner measurements. Depth is checked on the device; unsupported devices retain manual capture.'}
 ];
}
