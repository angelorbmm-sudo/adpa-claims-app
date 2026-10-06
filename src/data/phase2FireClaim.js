import { emptyClaim } from "./seed.js";

export function phase2CaliforniaFireClaim(){
 const c=emptyClaim();
 c.id="phase2-ca-fire-001";
 c.insured="Phase 2 Fire Test Household";
 c.property="100 Test Ridge Drive, Sample City, CA";
 c.carrier="Synthetic Mutual Insurance";
 c.claimNumber="SYN-FIRE-2026-001";
 c.dateOfLoss="2026-09-15";
 c.causeOfLoss="Residential fire / smoke";
 c.jurisdiction="CA";
 c.representationStatus="Active";
 c.compliance={...c.compliance,licenseStatus:"Verified",contractStatus:"Executed",disclosureStatus:"Delivered before contract",cancellationStatus:"Expired",policyStatus:"Collected",licensedReviewer:"Synthetic Licensed PA",notes:"SYNTHETIC TEST ONLY"};
 c.policyAnalysis={...c.policyAnalysis,reviewStatus:"Reviewed",reviewer:"Synthetic Licensed PA",reviewedAt:"2026-09-20",declarations:[{id:"p2-dec",coverage:"A",label:"Dwelling",limit:500000,deductible:2500,page:"2",sourceRef:"Synthetic declarations"}],endorsements:[{id:"p2-code",formNumber:"SYN-CODE",title:"Ordinance or Law",coverage:"CODE",page:"14",sourceRef:"Synthetic policy",summary:"Synthetic test endorsement",status:"Reviewed"}]};
 c.valuation="RCV";c.valuationSource="Synthetic HO policy";c.valuationReviewer="Synthetic Licensed PA";
 const vals={A:[500000,340000,285000,210000,210000],B:[50000,18000,15000,15000,15000],C:[250000,125000,98000,80000,80000],D:[120000,36000,30000,24000,24000],CODE:[50000,22000,12000,0,0]};
 c.coverages=c.coverages.map(x=>{const v=vals[x.key];return {...x,limit:v[0],requested:v[1],carrier:v[2],issued:v[3],received:v[4]};});
 c.documents=[
  {id:"p2-policy",name:"SYNTHETIC Policy.pdf",category:"Policy / Declarations",size:100000,createdAt:"2026-09-16T12:00:00Z",reviewStatus:"Verified",sha256:"synthetic-policy-hash"},
  {id:"p2-fire",name:"SYNTHETIC Fire Report.pdf",category:"Cause / Origin",size:80000,createdAt:"2026-09-17T12:00:00Z",reviewStatus:"Verified",sha256:"synthetic-fire-hash"},
  {id:"p2-carrier-est",name:"SYNTHETIC Carrier Estimate.pdf",category:"Carrier Estimate",size:120000,createdAt:"2026-09-20T12:00:00Z",reviewStatus:"Verified",sha256:"synthetic-carrier-hash"},
  {id:"p2-pa-est",name:"SYNTHETIC PA Estimate.pdf",category:"ADPA Estimate",size:130000,createdAt:"2026-09-25T12:00:00Z",reviewStatus:"Verified",sha256:"synthetic-pa-hash"}
 ];
 c.contents=[{id:"p2-c1",room:"Living Room",category:"Furniture",item:"Sectional sofa",quantity:1,unitRcv:4200,depreciationType:"Percentage",depreciationPercent:20,carrierRcv:2800,replacementSource:"Synthetic retailer",status:"Reviewed",lkqStatus:"Reviewed"},{id:"p2-c2",room:"Kitchen",category:"Appliance",item:"Refrigerator",quantity:1,unitRcv:2600,depreciationType:"Percentage",depreciationPercent:15,carrierRcv:1900,replacementSource:"Synthetic retailer",status:"Reviewed",lkqStatus:"Reviewed"}];
 c.estimateComparisons=[{id:"p2-est",name:"Dwelling scope comparison",coverage:"A",carrierTotal:285000,adpaTotal:340000,variance:55000,status:"Reviewed"}];
 c.payments=[
  {id:"p2-pay-a",coverage:"A",allocation:"Dwelling",amount:210000,status:"Received",receivedDate:"2026-09-28",checkNumber:"SYN-A"},
  {id:"p2-pay-b",coverage:"B",allocation:"Other Structures",amount:15000,status:"Received",receivedDate:"2026-09-28",checkNumber:"SYN-B"},
  {id:"p2-pay-c",coverage:"C",allocation:"Contents",amount:80000,status:"Received",receivedDate:"2026-09-28",checkNumber:"SYN-C"},
  {id:"p2-pay-d",coverage:"D",allocation:"ALE",amount:24000,status:"Received",receivedDate:"2026-09-28",checkNumber:"SYN-D"}
 ];
 c.ale={...c.ale,startDate:"2026-09-16",expectedEndDate:"2027-03-15",carrierApprovedMonthly:6000,expenses:[{id:"p2-ale",category:"Temporary Housing",vendor:"Synthetic Housing",description:"Temporary residence",expenseDate:"2026-10-01",amount:6500,normalExpense:2000,requested:4500,approved:4000,paid:4000,status:"Partially Paid"}]};
 c.issues=[{id:"p2-i1",type:"Scope",coverage:"A",title:"Dwelling scope variance",carrierAmount:285000,adpaAmount:340000,status:"Open",nextAction:"Document disputed scope",escalationLevel:"Evidence / clarification"},{id:"p2-i2",type:"Code / Ordinance",coverage:"CODE",title:"Code upgrade support",carrierAmount:12000,adpaAmount:22000,status:"Open",nextAction:"Obtain code support",escalationLevel:"Evidence / clarification"}];
 c.supplements=[{id:"p2-s1",coverage:"A",issueType:"Scope",issue:"Dwelling scope supplement",requested:55000,approvedAmount:0,status:"Under Review",responseDueDate:"2026-10-20"}];
 c.receipts=[{id:"p2-r1",coverage:"C",description:"Synthetic replacement purchases",recoverableDepreciation:18000,released:5000,disposition:"Open"}];
 c.mortgage={...c.mortgage,servicer:"Synthetic Mortgage Servicer",claimCheckAmount:210000,heldBalance:120000,initialRelease:30000,endorsementStatus:"Complete",draws:[{id:"p2-draw",drawNumber:"1",requestedAmount:40000,releasedAmount:25000,status:"Partially Released"}]};
 c.communications=[{id:"p2-com1",date:"2026-09-16",direction:"Inbound",party:"Synthetic carrier",subject:"Claim acknowledged",summary:"Synthetic acknowledgment for workflow testing"}];
 c.deadlineClocks=[{id:"p2-clock1",ruleKey:"proof_decision",label:"Synthetic proof decision",triggerDate:"2026-09-20",dueDate:"2026-10-30",verifiedDueDate:"2026-10-30",status:"Open"}];
 c.evidencePlan={status:"In progress",notes:"Synthetic fire master test: policy, cause, dwelling, contents, ALE, code and payment evidence."};
 c.routing={currentBucket:"B4 Resolution Desk",events:[]};
 c.recovery=[{id:"p2-rec1",coverage:"C",amount:13000,condition:"Recoverable depreciation documentation",dueDate:"2026-10-31",status:"Open"},{id:"p2-rec2",coverage:"A",amount:65000,condition:"Mortgage loss-draft release",dueDate:"2026-11-15",status:"Open"}];
 c.notes="PHASE 2 SYNTHETIC MASTER FIRE CLAIM — NO REAL CLIENT DATA.";
 c.updatedAt="2026-10-06T12:00:00Z";
 return c;
}
