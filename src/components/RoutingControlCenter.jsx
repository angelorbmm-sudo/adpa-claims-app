import React, { useMemo } from "react";
import { nowIso } from "../lib/storage.js";
import { complianceStatus } from "../lib/stateCompliance.js";

const BUCKETS=[
 ["B0","Intake Hold","Missing contract/authority/license/policy/safety essential"],
 ["B1","Evidence Build","Policy/evidence incomplete or high-impact fact unverified"],
 ["B2","AI Prepared","Comparison/draft prepared; awaiting human verification"],
 ["B3","Licensed Approval","Material output awaiting licensed PA decision"],
 ["B4","Resolution Desk","Bounded evidence-supported variance/feasibility clarification"],
 ["B5","True PA Adjustment","Material dispute, negotiation, inspection, supplement or coverage issue"],
 ["B6","Specialist / Legal / Critical","Expert, EUO, SIU/fraud, litigation, privacy, safety, major deadline or legal trigger"],
 ["CLOSED","Closed / Audit","Reconciled and authorized closure; reopen reason required"]
];

function remainingMortgage(m={}){
 const released=(m.draws||[]).reduce((s,x)=>s+Number(x.releasedAmount||0),0)+Number(m.initialRelease||0);
 return Math.max(0,Number(m.heldBalance||0)-released);
}
function route(claim){
 const reasons=[]; const gate=complianceStatus(claim); const rep=claim.representation||{};
 if(!gate.cleared||!rep.templateVerified||!rep.signedDate){reasons.push("Authority/compliance/representation gate incomplete");return {bucket:"B0",reasons};}
 const critical=(claim.issues||[]).some(x=>x.status!=="Resolved"&&["DOI complaint consideration","Appraisal consideration","Counsel review"].includes(x.escalation))||
   (claim.communications||[]).some(x=>/EUO|examination under oath|SIU|fraud|litigation|attorney|counsel/i.test((x.subject||"")+" "+(x.summary||"")));
 if(critical){reasons.push("Specialist/legal/critical trigger recorded");return {bucket:"B6",reasons};}
 const docs=claim.documents||[]; const policyReady=(claim.compliance||{}).policyStatus&&claim.compliance.policyStatus!=="Missing";
 if(!policyReady||docs.length===0){reasons.push("Policy/evidence build incomplete");return {bucket:"B1",reasons};}
 const open=(claim.issues||[]).filter(x=>x.status!=="Resolved");
 const unapproved=open.filter(x=>x.licensedReview!=="Approved");
 if(unapproved.length){reasons.push(unapproved.length+" issue position(s) await licensed approval");return {bucket:"B3",reasons};}
 const material=open.some(x=>["Formal dispute / supplement","Licensed PA escalation review"].includes(x.escalation));
 if(material){reasons.push("Material dispute requires active licensed adjustment");return {bucket:"B5",reasons};}
 if(open.length){reasons.push("Open bounded issue(s) require resolution");return {bucket:"B4",reasons};}
 if((claim.aiPrep||{}).lastRun){reasons.push("AI preparation exists; human QA path");return {bucket:"B2",reasons};}
 reasons.push("No stronger automatic trigger; evidence/AI preparation path");return {bucket:"B1",reasons};
}
export default function RoutingControlCenter({claim,onChange}){
 const routing=claim.routing||{events:[]}; const recommended=useMemo(()=>route(claim),[claim]);
 const dep=(claim.receipts||[]).reduce((s,x)=>s+Number(x.recoverableDepreciation||0)-Number(x.released||0),0);
 const mortgage=remainingMortgage(claim.mortgage||{});
 const openIssues=(claim.issues||[]).filter(x=>x.status!=="Resolved").length;
 const late=(claim.deadlineClocks||[]).filter(x=>x.status!=="Satisfied"&&(x.verifiedDueDate||x.dueDate)&&new Date((x.verifiedDueDate||x.dueDate)+"T23:59:59")<new Date()).length;
 const closeBlockers=[]; if(dep>0)closeBlockers.push("recoverable depreciation outstanding");if(mortgage>0)closeBlockers.push("mortgage funds still held");if(openIssues)closeBlockers.push("open issue files");if(late)closeBlockers.push("late carrier clocks unresolved");if(!complianceStatus(claim).cleared)closeBlockers.push("compliance HOLD");
 function assign(bucket,reason){
  if(bucket==="CLOSED"&&closeBlockers.length)return;
  const event={at:nowIso(),from:routing.currentBucket||"",to:bucket,reason:reason||"Manual reviewed assignment",ruleVersion:"ADPA routing v1 — 2026-10-06"};
  onChange({...routing,currentBucket:bucket,events:[...(routing.events||[]),event],updatedAt:nowIso()});
 }
 return <section><h1>Seven-Bucket Routing & Closure Control</h1><p>Workflow routing is multi-factor. Percentage variance is a triage signal only; compliance, evidence, safety, deadlines, client instructions and model risk can override it.</p>
 <div className="stats"><div className="stat"><small>Current bucket</small><b>{routing.currentBucket||"Not assigned"}</b></div><div className="stat"><small>Recommended</small><b>{recommended.bucket}</b></div><div className="stat"><small>Open issues</small><b>{openIssues}</b></div><div className="stat"><small>Closure blockers</small><b>{closeBlockers.length}</b></div></div>
 <div className="notice"><b>Routing reason:</b> {recommended.reasons.join(" · ")}</div>
 <button className="primary" onClick={()=>assign(recommended.bucket,"System recommendation accepted: "+recommended.reasons.join("; "))}>Accept recommended bucket</button>
 <div className="records">{BUCKETS.map(([id,name,desc])=><div className="record" key={id}><b>{id} — {name}</b><span>{desc}</span><button disabled={id==="CLOSED"&&closeBlockers.length>0} onClick={()=>assign(id,"Manual assignment after review")}>Assign</button></div>)}</div>
 {closeBlockers.length>0&&<div className="release-banner blocked"><b>CLOSURE BLOCKED</b><span>{closeBlockers.join(" · ")}</span></div>}
 <div className="panel"><h2>Routing audit</h2>{(routing.events||[]).slice().reverse().map((e,i)=><div className="record" key={i}><b>{e.from||"Unassigned"} → {e.to}</b><span>{e.reason}</span><small>{e.at} · {e.ruleVersion}</small></div>)}</div>
 </section>
}
