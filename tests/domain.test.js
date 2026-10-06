import test from "node:test";
import assert from "node:assert/strict";
import {reconciliationForClaim,closureBlockers,mortgageRemaining,receivedPayment} from "../src/lib/claimReconciliation.js";
import {complianceStatus} from "../src/lib/stateCompliance.js";
import {DEADLINE_RULES,addCalendarDays,addWorkingDays,calculateDueDate,ruleFor} from "../src/lib/deadlineRules.js";

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
