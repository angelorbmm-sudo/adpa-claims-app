import React, { useMemo } from "react";
import { nowIso } from "../lib/storage.js";
import { complianceStatus } from "../lib/stateCompliance.js";
import { closureBlockers } from "../lib/claimReconciliation.js";

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

function route(claim){
 const reasons=[];
 if(claim.closure?.status==="Closed"){reasons.push("Final closure audit completed");return {bucket:"CLOSED",reasons};} const gate=complianceStatus(claim); const rep=claim.representation||{};
 if(!gate.cleared||!rep.templateVerified||!rep.signedDate){reasons.push("Authority/compliance/representation gate incomplete");return {bucket:"B0",reasons};}
 const critical=(claim.criticalEvents||[]).some(x=>x.status!=="Resolved") || (claim.issues||[]).some(x=>x.status!=="Resolved"&&["DOI complaint consideration","Appraisal consideration","Counsel review"].includes(x.escalation)) || (claim.communications||[]).some(x=>/EUO|examination under oath|SIU|fraud|litigation|attorney|counsel/i.test((x.subject||"")+" "+(x.summary||"")));
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
 const openIssues=(claim.issues||[]).filter(x=>x.status!=="Resolved").length;
 const closeBlockers=closureBlockers(claim,complianceStatus(claim)).blockers;
 function assign(bucket,reason){
  if(bucket==="CLOSED"&&(closeBlockers.length||claim.closure?.status!=="Closed"))return;
  const event={at:nowIso(),from:routing.currentBucket||"",to:bucket,reason:reason||"Manual reviewed assignment",ruleVersion:"ADPA routing v1 — 2026-10-06"};
  onChange({...routing,currentBucket:bucket,events:[...(routing.events||[]),event],updatedAt:nowIso()});
 }
 return <section><h1>Seven-Bucket Routing & Closure Control</h1><p>Workflow routing is multi-factor. Percentage variance is a triage signal only; compliance, evidence, safety, deadlines, client instructions and model risk can override it.</p>
 <div className="stats"><div className="stat"><small>Current bucket</small><b>{routing.currentBucket||"Not assigned"}</b></div><div className="stat"><small>Recommended</small><b>{recommended.bucket}</b></div><div className="stat"><small>Open issues</small><b>{openIssues}</b></div><div className="stat"><small>Closure blockers</small><b>{closeBlockers.length}</b></div></div>
 <div className="notice"><b>Routing reason:</b> {recommended.reasons.join(" · ")}</div>
 <button className="primary" onClick={()=>assign(recommended.bucket,"System recommendation accepted: "+recommended.reasons.join("; "))}>Accept recommended bucket</button>
 <div className="records">{BUCKETS.map(([id,name,desc])=><div className="record" key={id}><b>{id} — {name}</b><span>{desc}</span><button disabled={id==="CLOSED"&&(closeBlockers.length>0||claim.closure?.status!=="Closed")} onClick={()=>assign(id,"Manual assignment after review")}>Assign</button></div>)}</div>
 {closeBlockers.length>0&&<div className="release-banner blocked"><b>CLOSURE BLOCKED</b><span>{closeBlockers.join(" · ")}</span></div>}<p className="notice">Closed/Audit is assigned through the Claim Closure & Final Audit Center after PA/client authorization; it cannot be used as a manual shortcut.</p>
 <div className="panel"><h2>Routing audit</h2>{(routing.events||[]).slice().reverse().map((e,i)=><div className="record" key={i}><b>{e.from||"Unassigned"} → {e.to}</b><span>{e.reason}</span><small>{e.at} · {e.ruleVersion}</small></div>)}</div>
 </section>
}
