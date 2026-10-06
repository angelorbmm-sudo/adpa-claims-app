import { claimWorkflowIntelligence } from "./workflowIntelligence.js";
import { reconciliationForClaim } from "./claimReconciliation.js";
import { complianceStatus } from "./stateCompliance.js";

const money=v=>Number(v||0).toLocaleString(undefined,{style:"currency",currency:"USD"});
const ref=(kind,id,label)=>({kind,id,label:label||id});
const item=(type,severity,title,detail,nextAction,sourceRefs=[],coverage="General",requiresPA=false)=>({type,severity,title,detail,nextAction,sourceRefs,coverage,requiresPA});

export function prepareClaimReview(claim){
 const out=[], workflow=claimWorkflowIntelligence(claim), r=reconciliationForClaim(claim), gate=complianceStatus(claim);
 if(workflow.next?.status!=="Complete") out.push(item("Workflow",workflow.next.status==="Needs PA Review"||workflow.next.status.includes("Blocked")?"High":"Normal","Recommended next step — "+workflow.next.label,workflow.next.detail,workflow.next.nextAction,[],"General",workflow.next.status==="Needs PA Review"));
 if(!gate.cleared) out.push(item("Compliance","High","ABSTAIN — compliance gate is on HOLD","Substantive external claim action remains withheld: "+gate.blockers.join("; ")+".","Resolve and verify compliance blockers before substantive external use.",[],"General",true));
 const docs=claim.documents||[], issues=claim.issues||[], estimates=claim.estimateComparisons||[], contents=claim.contents||[], supplements=claim.supplements||[];
 const unsupported=issues.filter(x=>x.status!=="Resolved"&&(!x.evidenceRefs||!x.policyRef));
 if(unsupported.length) out.push(item("Evidence Gap","High",unsupported.length+" open issue position(s) lack source support","Issue positions should be linked to policy language and evidence.","Link supporting policy/evidence before negotiation.",unsupported.map(x=>ref("issue",x.id,x.title)),"General",true));
 const unreviewedDocs=docs.filter(x=>["Unreviewed","Needs review","Quarantine"].includes(x.reviewStatus));
 if(unreviewedDocs.length) out.push(item("Evidence Review","Normal",unreviewedDocs.length+" evidence record(s) need review","Evidence exists but is not ready to support a substantive position.","Review, classify and verify the evidence.",unreviewedDocs.map(x=>ref("document",x.id,x.name))));
 const estimateReview=estimates.filter(x=>x.status==="Needs review");
 if(estimateReview.length) out.push(item("Estimate Review","High",estimateReview.length+" estimate comparison(s) need review","Carrier-versus-ADPA estimate work is unfinished.","Complete scope/quantity/price review before relying on the variance.",estimateReview.map(x=>ref("estimate",x.id)),"A/B/CODE",true));
 const contentReview=contents.filter(x=>["Needs review","Unreviewed"].includes(x.status)||x.lkqStatus==="Needs review");
 if(contentReview.length) out.push(item("Contents Review",contentReview.length>=100?"High":"Normal",contentReview.length+" contents item(s) need valuation/LKQ review","Contents valuation is incomplete.","Finish replacement-source/LKQ and depreciation review.",contentReview.slice(0,25).map(x=>ref("content",x.id,x.item)),"C"));
 if(Math.abs(r.ledgerDifference)>0.01) out.push(item("Accounting","High","Payment ledger does not reconcile","Received ledger differs from coverage received by "+money(r.ledgerDifference)+".","Reconcile payment records before package/closure.",(claim.payments||[]).map(x=>ref("payment",x.id,x.checkNumber||x.id))));
 if(r.depreciationOutstanding>0.01) out.push(item("Recovery","Normal","Recoverable depreciation remains outstanding",money(r.depreciationOutstanding)+" remains tracked as recoverable.","Verify replacement proof and advance eligible depreciation recovery.",(claim.receipts||[]).map(x=>ref("receipt",x.id)),"A/C"));
 if(r.lenderHeld>0.01) out.push(item("Mortgage","High","Mortgage/loss-draft funds remain held",money(r.lenderHeld)+" remains lender-held in the current claim record.","Advance documented draw/release requirements.",(claim.mortgage?.draws||[]).map(x=>ref("mortgage-draw",x.id)),"A"));
 const openSupp=supplements.filter(x=>!["Resolved","Closed","Approved","Paid"].includes(x.status));
 if(openSupp.length) out.push(item("Supplement","Normal",openSupp.length+" supplement/dispute item(s) remain open","Open supplement work prevents the claim from being treated as resolved.","Obtain response, document position and disposition each supplement.",openSupp.map(x=>ref("supplement",x.id,x.issue))));
 const critical=(claim.criticalEvents||[]).filter(x=>x.status!=="Resolved");
 if(critical.length) out.push(item("Critical Event","High",critical.length+" critical event(s) require specialist/licensed review","Critical events remain outside routine automation.","Route to the appropriate licensed/specialist reviewer.",critical.map(x=>ref("critical-event",x.id,x.type)),"General",true));
 const code=(claim.coverages||[]).find(x=>x.key==="CODE");
 if(Number(code?.requested||0)>0&&!docs.some(x=>x.category==="Code / Permit")) out.push(item("Evidence Gap","High","Code/ordinance request lacks code/permit evidence","A Code/Ordinance amount is requested without a recorded supporting code/permit evidence item.","Collect and verify supporting code/permit documentation.",[],"CODE",true));
 if(!out.length) out.push(item("Readiness","Low","No major deterministic exception found","Structured review found no major exception. This is not a coverage, settlement or legal conclusion.","Complete human review before any external substantive action."));
 return {findings:out,workflow,reconciliation:r,gate,metrics:{high:out.filter(x=>x.severity==="High").length,pa:out.filter(x=>x.requiresPA).length,evidence:out.filter(x=>x.type.includes("Evidence")).length,total:out.length}};
}

export function claimPreparationSummary(claim,prepared){
 const p=prepared||prepareClaimReview(claim), requested=(claim.coverages||[]).reduce((s,x)=>s+Number(x.requested||0),0), received=(claim.coverages||[]).reduce((s,x)=>s+Number(x.received||0),0);
 return ["Claim preparation summary — DRAFT / HUMAN REVIEW REQUIRED","","Insured: "+(claim.insured||"Not entered"),"Carrier: "+(claim.carrier||"Not entered"),"Claim #: "+(claim.claimNumber||"Not entered"),"Jurisdiction: "+(claim.jurisdiction||"Not entered"),"Date of loss: "+(claim.dateOfLoss||"Not entered"),"Cause of loss: "+(claim.causeOfLoss||"Not entered"),"","Recorded requested total: "+money(requested),"Recorded received total: "+money(received),"Evidence records: "+(claim.documents||[]).length,"Prepared findings: "+p.metrics.total+" ("+p.metrics.high+" high priority; "+p.metrics.pa+" PA review)","Recommended next step: "+p.workflow.next.label+" — "+p.workflow.next.status,"Next action: "+p.workflow.next.nextAction,"","This draft is generated from structured claim records only. It is not a coverage opinion, settlement authority, legal advice, or an autonomous public-adjuster decision."].join("\n");
}
