import { reconciliationForClaim } from "./claimReconciliation.js";

const terminal = s => ["Resolved","Closed","Approved","Paid","Satisfied"].includes(s);
const result=(key,label,status,nextAction,detail,targetTab)=>({key,label,status,nextAction,detail,targetTab});

export function claimWorkflowIntelligence(c){
 const r=reconciliationForClaim(c);
 const required=!!(c.insured&&c.property&&c.carrier&&c.claimNumber&&c.dateOfLoss&&c.causeOfLoss);
 const policyStarted=c.compliance?.policyStatus==="Collected"||(c.policyAnalysis?.declarations?.length||0)>0;
 const policyDone=c.compliance?.policyStatus==="Collected"&&c.policyAnalysis?.reviewStatus==="Reviewed";
 const docs=c.documents||[], evidenceDone=docs.length>0&&!docs.some(d=>["Unreviewed","Needs review"].includes(d.reviewStatus));
 const damageStarted=(c.estimateComparisons?.length||0)>0||(c.contents?.length||0)>0;
 const damageDone=damageStarted&&!(c.estimateComparisons||[]).some(x=>x.status==="Needs review")&&!(c.contents||[]).some(x=>x.status==="Needs review"||x.lkqStatus==="Needs review");
 const paymentStarted=(c.payments?.length||0)>0||(c.coverages||[]).some(x=>Number(x.issued||0)>0);
 const paymentDone=paymentStarted&&Math.abs(r.ledgerDifference)<=0.01;
 const issuesStarted=(c.issues?.length||0)>0||(c.supplements?.length||0)>0;
 const issuesDone=(c.issues||[]).every(x=>x.status==="Resolved")&&(c.supplements||[]).every(x=>terminal(x.status));
 const pkg=r.latestPackage, packageDone=r.packageCurrent;
 const hash=pkg?.snapshotHash||"";
 const pa=!!hash&&(c.approvals||[]).some(a=>a.packageHash===hash&&a.stage==="Licensed PA Approval"&&!a.revokedAt);
 const client=!!hash&&(c.approvals||[]).some(a=>a.packageHash===hash&&a.stage==="Client Authorization"&&!a.revokedAt);
 const recoveryStarted=(c.recovery?.length||0)>0||r.depreciationOutstanding>0.01||r.lenderHeld>0.01;
 const recoveryDone=r.openRecovery.length===0&&r.depreciationOutstanding<=0.01&&r.lenderHeld<=0.01;
 const stages=[
  result("intake","1 Intake",required?"Complete":c.insured||c.property?"In Progress":"Not Started",required?"Review policy and representation":"Complete required claim identity/loss fields",required?"Required intake fields complete.":"Insured, property, carrier, claim number, date and cause are required.","intake"),
  result("policy","2 Policy",policyDone?"Complete":policyStarted?"Needs PA Review":"Not Started",policyDone?"Continue evidence review":"Complete policy/declarations review",policyDone?"Policy collected and reviewed.":"Policy authority must be reviewed before relying on coverage conclusions.","policy"),
  result("evidence","3 Evidence",evidenceDone?"Complete":docs.length?"In Progress":"Not Started",evidenceDone?"Continue damages/estimates":docs.length?"Review remaining evidence":"Collect and classify evidence",docs.length+" evidence record(s).","evidence"),
  result("estimates","4 Damages & Estimates",damageDone?"Complete":damageStarted?"In Progress":"Not Started",damageDone?"Reconcile payments":damageStarted?"Finish estimate/contents review":"Document damages and estimate positions","Estimate and contents review must be resolved, not merely present.","estimates"),
  result("payments","5 Payments",paymentDone?"Complete":paymentStarted?"Blocked / Needs Attention":"Not Started",paymentDone?"Resolve issues and supplements":"Reconcile coverage received to payment ledger",paymentStarted?"Ledger difference: "+r.ledgerDifference:"No payment activity recorded.","payments"),
  result("issues","6 Issues & Supplements",issuesDone?(issuesStarted?"Complete":"Not Started"):"Blocked / Needs Attention",issuesDone?(issuesStarted?"Assemble current package":"Review whether issues/supplements are needed"):"Resolve or disposition open issues/supplements",r.openIssues.length+" open issue(s); "+r.openSupplements.length+" open supplement(s).","issues"),
  result("package","7 Claim Package",packageDone?"Complete":pkg?"Blocked / Needs Attention":"Not Started",packageDone?"Obtain protected PA/client authority":pkg?"Reassemble stale package":"Assemble current versioned package",pkg?(packageDone?"Current package exists.":"Latest package is stale/superseded."):"No package assembled.","package"),
  result("approvals","8 PA / Client Authority",pa&&client?"Complete":packageDone?"Needs PA Review":"Blocked / Needs Attention",pa&&client?"Continue recovery":"Obtain separate licensed PA approval and client authorization",(pa?"PA approval present. ":"PA approval missing. ")+(client?"Client authorization present.":"Client authorization missing."),"approvals"),
  result("recovery","9 Recovery",recoveryDone?(recoveryStarted?"Complete":"Not Started"):"Blocked / Needs Attention",recoveryDone?"Prepare final closure audit":"Resolve depreciation, mortgage and recovery follow-up","Depreciation outstanding: "+r.depreciationOutstanding+"; lender held: "+r.lenderHeld+"; open recovery: "+r.openRecovery.length+".","recovery"),
  result("closure","10 Close & Audit",c.closure?.status==="Closed"?"Complete":"Blocked / Needs Attention",c.closure?.status==="Closed"?"Closed":"Complete all closure gates","Closure is a final controlled state, not a progress shortcut.","closure")
 ];
 const priority=["Blocked / Needs Attention","Needs PA Review","In Progress","Not Started"];
 const next=stages.find(s=>priority.includes(s.status)&&s.key!=="closure")||stages.find(s=>s.status!=="Complete")||stages.at(-1);
 return {stages,next,reconciliation:r,counts:Object.fromEntries(["Complete","In Progress","Blocked / Needs Attention","Needs PA Review","Not Started"].map(s=>[s,stages.filter(x=>x.status===s).length]))};
}
