import { roomQuantities, lineQuantity, reviewBlockers } from './inspectionScope.js';
export function scopeReviewExport(claim,room){
 return {format:'adpa-scope-review',version:1,status:'Working draft - not a Xactimate estimate file',claimId:claim.id,room:{...room,quantities:roomQuantities(room)},
  operations:(room.lines||[]).map(l=>({...l,calculatedQuantity:lineQuantity(room,l),pricingStatus:'Licensed Xactimate mapping and pricing pending'})),
  reviewBlockers:reviewBlockers(room,claim.documents||[]),
  evidence:(claim.documents||[]).filter(d=>room.evidenceIds.includes(d.id)).map(d=>({id:d.id,name:d.name,sha256:d.sha256,storageStatus:d.storageStatus})),
  limitations:['This file contains metadata and scope notes, not original media.','Not an SKX/ESX file. No Xactimate catalog, prices or carrier acceptance are implied.']};
}
export function downloadJSON(value,name){
 const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));
 const anchor=document.createElement('a');anchor.href=url;anchor.download=name;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
