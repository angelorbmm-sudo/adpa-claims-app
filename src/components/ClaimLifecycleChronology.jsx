import { mitigationReview } from "../lib/mitigationReview.js";
import React, { useMemo } from "react";
import { LIFECYCLE_STAGES, complianceStatus } from "../lib/stateCompliance.js";

function dateOf(x){return x?.createdAt||x?.receivedSentDate||x?.triggerDate||x?.issuedDate||x?.date||x?.assembledAt||"";}
export default function ClaimLifecycleChronology({ claim,onChange }) {
  const stages=claim.lifecycle||{};
  const events=useMemo(()=>{
    const out=[];
    (claim.communications||[]).forEach(x=>out.push({date:dateOf(x),type:"Communication",title:x.subject||x.summary||x.type||"Communication",detail:`${x.direction||""} ${x.party||""}`}));
    (claim.deadlineClocks||[]).forEach(x=>out.push({date:x.triggerDate,type:"Deadline",title:x.ruleLabel||x.subject,detail:`Due ${x.verifiedDueDate||x.dueDate||"review"} · ${x.authority||""}`}));
    (claim.payments||[]).forEach(x=>out.push({date:dateOf(x),type:"Payment",title:`${x.coverage||""} ${x.type||"Payment"}`,detail:`$${Number(x.amount||0).toLocaleString()}`}));
    (claim.supplements||[]).forEach(x=>out.push({date:dateOf(x),type:"Dispute",title:x.issue||x.title||"Supplement / dispute",detail:x.status||""}));
    (claim.packages||[]).forEach(x=>out.push({date:dateOf(x),type:"Package",title:x.name||"Claim package",detail:x.snapshotHash||""}));
    (claim.issues||[]).forEach(x=>out.push({date:dateOf(x),type:"Issue",title:x.title||x.type,detail:`${x.status||""} · ${x.escalation||""}`}));
    return out.filter(x=>x.date).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  },[claim]);
  const gate=complianceStatus(claim), mitigation=mitigationReview(claim);
  function setStage(stage,status){onChange({...stages,[stage]:{...(stages[stage]||{}),status,updatedAt:new Date().toISOString()}});}
  return <section><h1>Claim Lifecycle & Litigation-Ready Chronology</h1><p>One lifecycle from intake through closure, plus a factual chronology assembled from the claim record.</p>
    <div className="notice"><b>External-action compliance gate:</b> {gate.cleared?"CLEAR":"HOLD — "+gate.blockers.join(" · ")}</div>
    <div className="panel"><h2>Lifecycle</h2><div className="records">{LIFECYCLE_STAGES.map(stage=>{const s=stages[stage]?.status||"Not started";return <div className="record" key={stage}><b>{stage}</b><span>{s}</span><div className="comm-actions"><button onClick={()=>setStage(stage,"In progress")}>In progress</button><button disabled={stage==="Mitigation" && !mitigation.ready} title={stage==="Mitigation"&&!mitigation.ready?"Complete mitigation evidence review first":""} onClick={()=>setStage(stage,"Complete")}>Complete</button><button onClick={()=>setStage(stage,"Blocked")}>Blocked</button></div></div>})}</div></div>
    <div className="panel"><h2>Claim conduct chronology</h2>{events.length===0?<p className="muted">No dated events yet.</p>:<div className="timeline">{events.map((x,i)=><div className="timeline-item" key={i}><div className="timeline-head"><span className="pill">{x.type}</span><b>{String(x.date).slice(0,10)}</b></div><b>{x.title}</b><small>{x.detail}</small></div>)}</div>}</div>
    <p className="notice">This chronology records claim facts and workflow history. It does not label conduct as bad faith or make a legal conclusion.</p>
  </section>;
}

