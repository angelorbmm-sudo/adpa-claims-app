const n=v=>Number(v||0);
const money=v=>n(v).toLocaleString(undefined,{style:"currency",currency:"USD"});

export function estimateLineAnalysis(line){
 const explicitAdpa=n(line.adpaTotal), explicitCarrier=n(line.carrierTotal);
 const adpa=explicitAdpa||n(line.quantity)*n(line.adpaUnitPrice);
 const carrier=explicitCarrier||n(line.carrierQuantity)*n(line.carrierUnitPrice);
 const variance=adpa-carrier;
 let category="No material variance";
 if(carrier===0&&adpa>0) category="Missing scope";
 else if(n(line.quantity)!==n(line.carrierQuantity)&&(n(line.quantity)||n(line.carrierQuantity))) category="Quantity";
 else if(n(line.adpaUnitPrice)!==n(line.carrierUnitPrice)&&(n(line.adpaUnitPrice)||n(line.carrierUnitPrice))) category="Unit price";
 else if(Math.abs(variance)>0.01) category="Scope / pricing";
 return {...line,adpaTotal:adpa,carrierTotal:carrier,variance,varianceCategory:category,sourceReady:!!(line.source||line.sourceRef),needsReview:line.status!=="Resolved"&&line.status!=="Supported"&&line.status!=="Reviewed"};
}

export function estimateIntelligence(records=[]){
 const lines=records.map(estimateLineAnalysis);
 const byCategory={}; const byCoverage={};
 for(const x of lines){byCategory[x.varianceCategory]=(byCategory[x.varianceCategory]||0)+x.variance;byCoverage[x.coverage||"General"]=(byCoverage[x.coverage||"General"]||0)+x.variance;}
 return {lines,adpa:lines.reduce((s,x)=>s+x.adpaTotal,0),carrier:lines.reduce((s,x)=>s+x.carrierTotal,0),variance:lines.reduce((s,x)=>s+x.variance,0),needsReview:lines.filter(x=>x.needsReview).length,missingSources:lines.filter(x=>Math.abs(x.variance)>0.01&&!x.sourceReady).length,byCategory,byCoverage};
}

export function contentsIntelligence(items=[]){
 const rows=items.map(x=>{const qty=Math.max(1,n(x.quantity)||1),rcv=qty*n(x.unitRcv),carrier=qty*n(x.carrierRcv),depPct=Math.max(0,Math.min(100,n(x.depreciationPercent))),calculatedDep=rcv*depPct/100,dep=n(x.depreciationAmount)||calculatedDep,acv=Math.max(0,rcv-dep);return {...x,quantity:qty,rcv,carrierRcvTotal:carrier,variance:rcv-carrier,depreciation:dep,acv,sourceReady:!!x.replacementSource,needsReview:["Needs review","Unreviewed"].includes(x.status)||x.lkqStatus==="Needs review"};});
 return {rows,count:rows.length,rcv:rows.reduce((s,x)=>s+x.rcv,0),carrierRcv:rows.reduce((s,x)=>s+x.carrierRcvTotal,0),variance:rows.reduce((s,x)=>s+x.variance,0),calculatedAcv:rows.reduce((s,x)=>s+x.acv,0),calculatedDepreciation:rows.reduce((s,x)=>s+x.depreciation,0),needsReview:rows.filter(x=>x.needsReview).length,missingReplacementSource:rows.filter(x=>x.rcv>0&&!x.sourceReady).length};
}

export function estimatingSummary(claim){
 const estimate=estimateIntelligence(claim.estimateComparisons||[]),contents=contentsIntelligence(claim.contents||[]);
 const flags=[];
 if(estimate.needsReview) flags.push(estimate.needsReview+" estimate line(s) need review");
 if(estimate.missingSources) flags.push(estimate.missingSources+" estimate variance line(s) lack source support");
 if(contents.needsReview) flags.push(contents.needsReview+" contents item(s) need LKQ/valuation review");
 if(contents.missingReplacementSource) flags.push(contents.missingReplacementSource+" contents item(s) lack replacement source");
 return {estimate,contents,flags,summary:"Estimate variance "+money(estimate.variance)+"; contents RCV variance "+money(contents.variance)+"."};
}
