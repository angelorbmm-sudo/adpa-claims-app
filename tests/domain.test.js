import test from "node:test";
import assert from "node:assert/strict";
import {reconciliationForClaim,closureBlockers,mortgageRemaining,receivedPayment} from "../src/lib/claimReconciliation.js";
import {complianceStatus} from "../src/lib/stateCompliance.js";
import {DEADLINE_RULES,addCalendarDays,addWorkingDays,calculateDueDate,ruleFor} from "../src/lib/deadlineRules.js";
import {phase2CaliforniaFireClaim} from "../src/data/phase2FireClaim.js";
import {claimWorkflowIntelligence} from "../src/lib/workflowIntelligence.js";
import {phase6CaliforniaWaterClaim,phase6CaliforniaDenialClaim,phase6ContentsHeavyClaim,phase6MortgageLossDraftClaim,phase6NevadaClaim,phase6SyntheticClaims} from "../src/data/phase6Claims.js";
import {prepareClaimReview,claimPreparationSummary} from "../src/lib/claimPreparation.js";
import {draftCommunicationOptions,communicationDraftByType} from "../src/lib/draftCommunications.js";
import {estimateLineAnalysis,estimateIntelligence,contentsIntelligence,estimatingSummary} from "../src/lib/estimatingIntelligence.js";

const base=()=>({coverages:[],payments:[],receipts:[],issues:[],supplements:[],recovery:[],criticalEvents:[],deadlineClocks:[],packages:[],mortgage:{},compliance:{},representation:{}});

test("received payment recognizes explicit receipt/deposit states",()=>{assert.equal(receivedPayment({status:"Issued"}),false);assert.equal(receivedPayment({status:"Received"}),true);assert.equal(receivedPayment({receivedDate:"2026-10-01"}),true)});

test("reconciliation totals coverage and received ledger",()=>{const c=base();c.coverages=[{requested:1000,carrier:900,received:800,issued:800}];c.payments=[{amount:800,status:"Received"}];const r=reconciliationForClaim(c);assert.equal(r.requested,1000);assert.equal(r.carrier,900);assert.equal(r.ledgerDifference,0)});

test("waived depreciation is not an outstanding closure amount",()=>{const c=base();c.receipts=[{recoverableDepreciation:500,released:0,disposition:"Documented unrecoverable/waived"}];assert.equal(reconciliationForClaim(c).depreciationOutstanding,0)});

test("mortgage remaining subtracts initial and draw releases",()=>{assert.equal(mortgageRemaining({heldBalance:10000,initialRelease:2000,draws:[{releasedAmount:3000}]}),5000)});

test("Paid supplement is terminal",()=>{const c=base();c.supplements=[{status:"Paid"}];assert.equal(reconciliationForClaim(c).openSupplements.length,0)});

test("stale package blocks closure",()=>{const c=base();c.packages=[{status:"Stale — claim changed"}];const x=closureBlockers(c,{cleared:true});assert.ok(x.blockers.some(v=>v.includes("missing or stale")))});

test("ledger mismatch blocks closure",()=>{const c=base();c.packages=[{status:"Current"}];c.coverages=[{received:100}];c.payments=[{amount:90,status:"Received"}];assert.ok(closureBlockers(c,{cleared:true}).blockers.some(v=>v.includes("does not reconcile")))});

test("open issue and overdue clock block closure",()=>{const c=base();c.packages=[{status:"Current"}];c.issues=[{status:"Open"}];c.deadlineClocks=[{status:"Open",dueDate:"2000-01-01"}];const b=closureBlockers(c,{cleared:true}).blockers;assert.ok(b.some(v=>v.includes("issue file")));assert.ok(b.some(v=>v.includes("overdue carrier clock")))});

test("CA compliance holds without verified authority",()=>{const c=base();c.jurisdiction="CA";c.compliance={licenseStatus:"Pending",contractStatus:"Missing",disclosureStatus:"Missing",policyStatus:"Missing"};assert.equal(complianceStatus(c).cleared,false)});

test("CA compliance can clear when required prototype controls are verified",()=>{const c=base();c.jurisdiction="CA";c.compliance={licenseStatus:"Verified",contractStatus:"Executed",disclosureStatus:"Delivered before contract",policyStatus:"Collected",cancellationStatus:"Expired"};assert.equal(complianceStatus(c).cleared,true)});

test("CA base acknowledgment rule is 15 calendar days",()=>{const r=ruleFor("CA","claim_ack");assert.equal(r.days,15);assert.equal(r.unit,"calendar");assert.equal(calculateDueDate("2026-10-01",r),"2026-10-16")});

test("NV acknowledgment is 20 working days and skips weekends",()=>{const r=ruleFor("NV","claim_ack");assert.equal(r.days,20);assert.equal(r.unit,"working");assert.equal(addWorkingDays("2026-10-02",1),"2026-10-05")});

test("calendar helper crosses month boundary",()=>{assert.equal(addCalendarDays("2026-10-25",10),"2026-11-04")});

test("NV and CA rule registries remain separate",()=>{assert.notEqual(DEADLINE_RULES.CA,DEADLINE_RULES.NV);assert.equal(ruleFor("CA","investigation_complete"),undefined);assert.ok(ruleFor("NV","investigation_complete"))});

test("Phase 2 synthetic fire claim exercises major claim domains",()=>{const c=phase2CaliforniaFireClaim();assert.equal(c.jurisdiction,"CA");assert.ok(c.documents.length>=4);assert.ok(c.contents.length>=2);assert.ok(c.issues.length>=2);assert.ok(c.supplements.length>=1);assert.ok(c.payments.length>=4);assert.ok(c.receipts.length>=1);assert.ok(c.mortgage.draws.length>=1);assert.ok(c.recovery.length>=2);});
test("Phase 2 fire claim payment ledger reconciles received coverage",()=>{const r=reconciliationForClaim(phase2CaliforniaFireClaim());assert.equal(r.ledgerDifference,0);assert.equal(r.ledgerReceived,329000);assert.equal(r.coverageReceived,329000);});
test("Phase 2 fire claim correctly remains open with real workflow blockers",()=>{const c=phase2CaliforniaFireClaim();const b=closureBlockers(c,complianceStatus(c)).blockers;assert.ok(b.some(x=>x.includes("Final claim package")));assert.ok(b.some(x=>x.includes("depreciation")));assert.ok(b.some(x=>x.includes("Mortgage")));assert.ok(b.some(x=>x.includes("issue file")));assert.ok(b.some(x=>x.includes("supplement")));assert.ok(b.some(x=>x.includes("recovery")));});

test("Phase 5 distinguishes records present from stage resolved",()=>{const w=claimWorkflowIntelligence(phase2CaliforniaFireClaim());const by=Object.fromEntries(w.stages.map(s=>[s.key,s]));assert.equal(by.intake.status,"Complete");assert.equal(by.policy.status,"Complete");assert.equal(by.payments.status,"Complete");assert.equal(by.issues.status,"Blocked / Needs Attention");assert.equal(by.package.status,"Not Started");assert.equal(by.approvals.status,"Blocked / Needs Attention");assert.equal(by.recovery.status,"Blocked / Needs Attention");});
test("Phase 5 surfaces PA review separately from operational progress",()=>{const c=phase2CaliforniaFireClaim();c.policyAnalysis.reviewStatus="Pending";const w=claimWorkflowIntelligence(c);assert.equal(w.stages.find(s=>s.key==="policy").status,"Needs PA Review");});

test("Phase 6 library contains five distinct synthetic claim patterns",()=>{const x=phase6SyntheticClaims();assert.equal(x.length,5);assert.equal(new Set(x.map(c=>c.id)).size,5);assert.ok(x.every(c=>c.notes.includes("NO REAL CLIENT DATA")));});
test("Phase 6 water claim surfaces evidence/estimate work and depreciation",()=>{const c=phase6CaliforniaWaterClaim(),w=claimWorkflowIntelligence(c);assert.equal(w.stages.find(s=>s.key==="evidence").status,"In Progress");assert.equal(w.stages.find(s=>s.key==="estimates").status,"In Progress");assert.ok(reconciliationForClaim(c).depreciationOutstanding>0);});
test("Phase 6 denial claim keeps dispute and critical event open",()=>{const c=phase6CaliforniaDenialClaim(),r=reconciliationForClaim(c);assert.equal(r.openIssues.length,1);assert.equal(r.openCritical.length,1);assert.equal(claimWorkflowIntelligence(c).stages.find(s=>s.key==="issues").status,"Blocked / Needs Attention");});
test("Phase 6 contents-heavy claim carries 2000 items and unresolved review",()=>{const c=phase6ContentsHeavyClaim();assert.equal(c.contents.length,2000);assert.equal(claimWorkflowIntelligence(c).stages.find(s=>s.key==="estimates").status,"In Progress");});
test("Phase 6 mortgage claim exposes lender-held funds",()=>{const c=phase6MortgageLossDraftClaim();assert.equal(reconciliationForClaim(c).lenderHeld,115000);assert.equal(claimWorkflowIntelligence(c).stages.find(s=>s.key==="recovery").status,"Blocked / Needs Attention");});
test("Phase 6 Nevada claim remains jurisdiction-specific",()=>{const c=phase6NevadaClaim();assert.equal(c.jurisdiction,"NV");assert.equal(c.deadlineClocks[0].ruleKey,"claim_ack");assert.ok(ruleFor("NV","claim_ack"));});

test("workflow intelligence gives each Phase 6 claim an actionable next step",()=>{for(const c of phase6SyntheticClaims()){const w=claimWorkflowIntelligence(c);assert.ok(w.next);assert.ok(w.next.label);assert.ok(w.next.nextAction);assert.notEqual(w.next.status,"Complete");}});
test("Phase 6 denial workflow does not silently complete authority or recovery",()=>{const w=claimWorkflowIntelligence(phase6CaliforniaDenialClaim());assert.notEqual(w.stages.find(s=>s.key==="approvals").status,"Complete");assert.notEqual(w.stages.find(s=>s.key==="closure").status,"Complete");});

test("Phase 8A prepares actionable findings for every synthetic master claim",()=>{for(const c of [phase2CaliforniaFireClaim(),...phase6SyntheticClaims()]){const p=prepareClaimReview(c);assert.ok(p.findings.length>0);assert.ok(p.findings.every(f=>f.nextAction));assert.ok(p.workflow.next);}});
test("Phase 8A contents fixture identifies unfinished valuation work",()=>{const p=prepareClaimReview(phase6ContentsHeavyClaim());const f=p.findings.find(x=>x.type==="Contents Review");assert.ok(f);assert.equal(f.severity,"High");assert.ok(f.title.includes("150"));});
test("Phase 8A mortgage fixture identifies exact lender-held balance",()=>{const p=prepareClaimReview(phase6MortgageLossDraftClaim());const f=p.findings.find(x=>x.type==="Mortgage");assert.ok(f);assert.ok(f.title.includes("Mortgage"));assert.equal(p.reconciliation.lenderHeld,115000);});
test("Phase 8A denial fixture requires licensed handling for critical event",()=>{const p=prepareClaimReview(phase6CaliforniaDenialClaim());assert.ok(p.findings.some(x=>x.type==="Critical Event"&&x.requiresPA));});
test("Phase 8A summary remains explicitly draft and human-reviewed",()=>{const s=claimPreparationSummary(phase6CaliforniaWaterClaim());assert.ok(s.includes("DRAFT / HUMAN REVIEW REQUIRED"));assert.ok(s.includes("not a coverage opinion"));});

test("Phase 8B drafts are always human-review only and never send-enabled",()=>{for(const c of [phase2CaliforniaFireClaim(),...phase6SyntheticClaims()]){const d=draftCommunicationOptions(c).options;assert.ok(d.length>0);assert.ok(d.every(x=>x.status==="DRAFT / HUMAN REVIEW REQUIRED"&&x.sendAllowed===false));}});
test("Phase 8B water claim offers supplement and depreciation follow-ups",()=>{const d=draftCommunicationOptions(phase6CaliforniaWaterClaim()).options;assert.ok(d.some(x=>x.type==="Supplement Follow-up"));assert.ok(d.some(x=>x.type==="Depreciation Follow-up"));});
test("Phase 8B mortgage draft carries exact lender-held amount",()=>{const d=communicationDraftByType(phase6MortgageLossDraftClaim(),"Mortgage / Loss Draft");assert.ok(d);assert.ok(d.body.includes("$115,000"));});
test("Phase 8B substantive supplement draft requires PA review",()=>{const d=communicationDraftByType(phase6CaliforniaWaterClaim(),"Supplement Follow-up");assert.equal(d.requiresPAReview,true);assert.equal(d.sendAllowed,false);});
test("Phase 8B denial status draft remains review-gated",()=>{const d=communicationDraftByType(phase6CaliforniaDenialClaim(),"Status Follow-up");assert.ok(d);assert.equal(d.requiresPAReview,true);assert.equal(d.sendAllowed,false);});

test("Phase 9 classifies missing scope when carrier has zero line value",()=>{const x=estimateLineAnalysis({quantity:10,adpaUnitPrice:100,carrierQuantity:0,carrierUnitPrice:0,status:"Needs review"});assert.equal(x.variance,1000);assert.equal(x.varianceCategory,"Missing scope");});
test("Phase 9 supports total-level estimate fixtures as well as line items",()=>{const x=estimateIntelligence(phase2CaliforniaFireClaim().estimateComparisons);assert.equal(x.adpa,340000);assert.equal(x.carrier,285000);assert.equal(x.variance,55000);});
test("Phase 9 contents intelligence calculates RCV ACV depreciation and variance",()=>{const x=contentsIntelligence(phase2CaliforniaFireClaim().contents);assert.equal(x.count,2);assert.ok(x.rcv>0);assert.ok(x.calculatedAcv<x.rcv);assert.ok(x.variance>0);});
test("Phase 9 contents-heavy fixture keeps 150 items in review",()=>{const x=contentsIntelligence(phase6ContentsHeavyClaim().contents);assert.equal(x.count,2000);assert.equal(x.needsReview,150);});
test("Phase 9 summary exposes source and review gaps without making coverage conclusions",()=>{const x=estimatingSummary(phase6CaliforniaWaterClaim());assert.ok(x.estimate.needsReview>0);assert.ok(x.flags.length>0);});
