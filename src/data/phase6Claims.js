import { emptyClaim } from "./seed.js";

function base(id, insured, state, cause){
 const c=emptyClaim(); c.id=id;c.insured=insured;c.property="Synthetic Test Property, "+state;c.carrier="Synthetic Test Insurance";c.claimNumber="SYN-"+id.toUpperCase();c.dateOfLoss="2026-08-15";c.causeOfLoss=cause;c.jurisdiction=state;c.representationStatus="Active";
 c.compliance={...c.compliance,licenseStatus:"Verified",contractStatus:"Executed",disclosureStatus:"Delivered before contract",cancellationStatus:"Expired",policyStatus:"Collected",licensedReviewer:"Synthetic Licensed PA"};
 c.policyAnalysis={...c.policyAnalysis,reviewStatus:"Reviewed",reviewer:"Synthetic Licensed PA",declarations:[{id:id+"-dec",coverage:"A",limit:400000,sourceRef:"Synthetic declarations"}]};
 c.documents=[{id:id+"-policy",name:"SYNTHETIC Policy.pdf",category:"Policy / Declarations",reviewStatus:"Verified",size:1000,createdAt:"2026-08-16T12:00:00Z"}];
 c.notes="PHASE 6 SYNTHETIC TEST CLAIM — NO REAL CLIENT DATA.";return c;
}
function setCoverage(c,key,requested,carrier,issued,received,limit=500000){c.coverages=c.coverages.map(x=>x.key===key?{...x,limit,requested,carrier,issued,received}:x);}
function payment(c,id,key,amount,status="Received"){c.payments.push({id,coverage:key,allocation:key,amount,status,receivedDate:status==="Received"?"2026-09-01":""});}

export function phase6CaliforniaWaterClaim(){
 const c=base("p6-water","Phase 6 Water Test Household","CA","Sudden water discharge");
 setCoverage(c,"A",95000,70000,45000,45000);setCoverage(c,"C",18000,12000,8000,8000,150000);payment(c,"p6w-a","A",45000);payment(c,"p6w-c","C",8000);
 c.documents.push({id:"p6w-mit",name:"SYNTHETIC Mitigation.pdf",category:"Mitigation",reviewStatus:"Needs review",size:1000,createdAt:"2026-08-18T12:00:00Z"});
 c.estimateComparisons=[{id:"p6w-est",coverage:"A",carrierTotal:70000,adpaTotal:95000,status:"Needs review"}];
 c.supplements=[{id:"p6w-sup",coverage:"A",issue:"Cabinet/flooring supplement",requested:25000,status:"Under Review"}];
 c.receipts=[{id:"p6w-r",coverage:"C",recoverableDepreciation:4000,released:1000,disposition:"Open"}];
 return c;
}
export function phase6CaliforniaDenialClaim(){
 const c=base("p6-denial","Phase 6 Denial Test Household","CA","Wind / tree impact disputed causation");
 setCoverage(c,"A",145000,0,0,0);c.documents.push({id:"p6d-denial",name:"SYNTHETIC Denial Letter.pdf",category:"Carrier Decision",reviewStatus:"Verified",size:1000,createdAt:"2026-09-01T12:00:00Z"});
 c.estimateComparisons=[{id:"p6d-est",coverage:"A",carrierTotal:0,adpaTotal:145000,status:"Reviewed"}];
 c.issues=[{id:"p6d-i",type:"Coverage / Causation",coverage:"A",title:"Coverage denial / causation dispute",carrierAmount:0,adpaAmount:145000,status:"Open",nextAction:"Licensed review of policy, causation evidence and carrier basis"}];
 c.criticalEvents=[{id:"p6d-critical",type:"Denial",status:"Open",summary:"Synthetic denial requires licensed review"}];return c;
}
export function phase6ContentsHeavyClaim(){
 const c=base("p6-contents","Phase 6 Contents Test Household","CA","Smoke damage");
 setCoverage(c,"C",210000,135000,90000,90000,250000);payment(c,"p6c-c","C",90000);
 c.contents=Array.from({length:2000},(_,i)=>({id:"p6c-"+(i+1),room:"Room "+(i%12+1),category:i%3===0?"Furniture":"Household",item:"Synthetic item "+(i+1),quantity:1,unitRcv:50+(i%200),carrierRcv:35+(i%120),status:i<1850?"Reviewed":"Needs review",lkqStatus:i<1850?"Reviewed":"Needs review",replacementSource:"Synthetic source"}));
 c.receipts=[{id:"p6c-r",coverage:"C",recoverableDepreciation:45000,released:12000,disposition:"Open"}];return c;
}
export function phase6MortgageLossDraftClaim(){
 const c=base("p6-mortgage","Phase 6 Mortgage Test Household","CA","Residential fire");
 setCoverage(c,"A",320000,290000,220000,220000);payment(c,"p6m-a","A",220000);
 c.estimateComparisons=[{id:"p6m-est",coverage:"A",carrierTotal:290000,adpaTotal:320000,status:"Reviewed"}];
 c.mortgage={...c.mortgage,servicer:"Synthetic Mortgage Servicer",claimCheckAmount:220000,heldBalance:180000,initialRelease:30000,endorsementStatus:"Complete",draws:[{id:"p6m-d1",drawNumber:"1",requestedAmount:50000,releasedAmount:35000,status:"Partially Released"}]};
 c.recovery=[{id:"p6m-rec",coverage:"A",amount:115000,condition:"Remaining lender-held funds",status:"Open"}];return c;
}
export function phase6NevadaClaim(){
 const c=base("p6-nevada","Phase 6 Nevada Test Household","NV","Wind and rain intrusion");
 setCoverage(c,"A",110000,76000,40000,40000);payment(c,"p6n-a","A",40000);
 c.documents.push({id:"p6n-estdoc",name:"SYNTHETIC NV Estimate.pdf",category:"Estimate",reviewStatus:"Verified",size:1000,createdAt:"2026-08-20T12:00:00Z"});
 c.estimateComparisons=[{id:"p6n-est",coverage:"A",carrierTotal:76000,adpaTotal:110000,status:"Reviewed"}];
 c.deadlineClocks=[{id:"p6n-clock",ruleKey:"claim_ack",label:"NV synthetic acknowledgment",triggerDate:"2026-08-16",dueDate:"2026-09-14",verifiedDueDate:"",status:"Open"}];
 c.issues=[{id:"p6n-i",type:"Scope",coverage:"A",title:"NV scope variance",carrierAmount:76000,adpaAmount:110000,status:"Open",nextAction:"Verify Nevada rule applicability and resolve scope"}];return c;
}
export function phase6SyntheticClaims(){return [phase6CaliforniaWaterClaim(),phase6CaliforniaDenialClaim(),phase6ContentsHeavyClaim(),phase6MortgageLossDraftClaim(),phase6NevadaClaim()];}
