import React, { useMemo, useState } from "react";
import { nowIso, uid } from "../lib/storage.js";
import { ISSUE_TYPES, ESCALATION_LEVELS } from "../lib/stateCompliance.js";

const blank = { type:"Scope", coverage:"A", title:"", carrierPosition:"", adpaPosition:"", carrierAmount:"", adpaAmount:"", policyRef:"", evidenceRefs:"", stateRuleRef:"", missingEvidence:"", nextAction:"", escalation:"Evidence / clarification", status:"Open", licensedReview:"Pending" };

export default function IssueNegotiationCenter({ claim, onChange }) {
  const [row,setRow]=useState(blank);
  const issues=claim.issues || [];
  const totals=useMemo(()=>issues.reduce((a,x)=>({carrier:a.carrier+Number(x.carrierAmount||0),adpa:a.adpa+Number(x.adpaAmount||0)}),{carrier:0,adpa:0}),[issues]);
  function add(e){e.preventDefault(); onChange([...issues,{...row,id:uid("issue"),createdAt:nowIso(),history:[{at:nowIso(),action:"Issue opened"}]}]);setRow(blank);}
  function patch(id,changes,action){onChange(issues.map(x=>x.id===id?{...x,...changes,updatedAt:nowIso(),history:action?[...(x.history||[]),{at:nowIso(),action}]:x.history}:x));}
  const money=v=>Number(v||0).toLocaleString(undefined,{style:"currency",currency:"USD"});
  return <section>
    <h1>Issue Files & Negotiation Center</h1>
    <p>Break every disagreement into a defensible issue: carrier position, ADPA position, dollars, policy, evidence, missing proof, governing rule, next action, and licensed review.</p>
    <div className="stats"><div className="stat"><small>Open issues</small><b>{issues.filter(x=>x.status!=="Resolved").length}</b></div><div className="stat"><small>Carrier position</small><b>{money(totals.carrier)}</b></div><div className="stat"><small>ADPA position</small><b>{money(totals.adpa)}</b></div><div className="stat"><small>Variance</small><b>{money(totals.adpa-totals.carrier)}</b></div></div>
    <form className="grid panel" onSubmit={add}>
      <label>Issue type<select value={row.type} onChange={e=>setRow(r=>({...r,type:e.target.value}))}>{ISSUE_TYPES.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Coverage<input value={row.coverage} onChange={e=>setRow(r=>({...r,coverage:e.target.value}))}/></label>
      <label>Issue title<input value={row.title} onChange={e=>setRow(r=>({...r,title:e.target.value}))}/></label>
      <label>Carrier amount<input type="number" value={row.carrierAmount} onChange={e=>setRow(r=>({...r,carrierAmount:e.target.value}))}/></label>
      <label>ADPA amount<input type="number" value={row.adpaAmount} onChange={e=>setRow(r=>({...r,adpaAmount:e.target.value}))}/></label>
      <label>Policy / endorsement ref<input value={row.policyRef} onChange={e=>setRow(r=>({...r,policyRef:e.target.value}))}/></label>
      <label>Carrier position<textarea value={row.carrierPosition} onChange={e=>setRow(r=>({...r,carrierPosition:e.target.value}))}/></label>
      <label>ADPA position<textarea value={row.adpaPosition} onChange={e=>setRow(r=>({...r,adpaPosition:e.target.value}))}/></label>
      <label>Evidence references<textarea placeholder="Photo IDs, estimate lines, receipt IDs, report, email..." value={row.evidenceRefs} onChange={e=>setRow(r=>({...r,evidenceRefs:e.target.value}))}/></label>
      <label>Applicable state rule / authority<input value={row.stateRuleRef} onChange={e=>setRow(r=>({...r,stateRuleRef:e.target.value}))}/></label>
      <label>Missing evidence<textarea value={row.missingEvidence} onChange={e=>setRow(r=>({...r,missingEvidence:e.target.value}))}/></label>
      <label>Next action<textarea value={row.nextAction} onChange={e=>setRow(r=>({...r,nextAction:e.target.value}))}/></label>
      <label>Escalation<select value={row.escalation} onChange={e=>setRow(r=>({...r,escalation:e.target.value}))}>{ESCALATION_LEVELS.map(x=><option key={x}>{x}</option>)}</select></label>
      <div className="form-action"><button className="primary">Open issue file</button></div>
    </form>
    <div className="timeline">{issues.map(x=><div className="timeline-item" key={x.id}>
      <div className="timeline-head"><div><span className="pill">{x.type}</span><span className="pill secondary">{x.coverage}</span><span className="pill system">{x.status}</span></div><b>{money(Number(x.adpaAmount||0)-Number(x.carrierAmount||0))} variance</b></div>
      <b>{x.title || x.type}</b>
      <small><b>Carrier:</b> {x.carrierPosition || "Not recorded"} — {money(x.carrierAmount)}</small>
      <small><b>ADPA:</b> {x.adpaPosition || "Not recorded"} — {money(x.adpaAmount)}</small>
      <small><b>Policy:</b> {x.policyRef || "Missing"} · <b>Evidence:</b> {x.evidenceRefs || "Missing"}</small>
      <small><b>Missing proof:</b> {x.missingEvidence || "None recorded"}</small><small><b>Next:</b> {x.nextAction || "Not set"} · <b>Escalation:</b> {x.escalation}</small>
      <div className="comm-actions"><button onClick={()=>patch(x.id,{licensedReview:"Approved"},"Licensed PA approved issue position")}>PA approve</button><button onClick={()=>patch(x.id,{status:"Resolved"},"Issue resolved")}>Resolve</button><button onClick={()=>{const i=Math.min(ESCALATION_LEVELS.length-1,Math.max(0,ESCALATION_LEVELS.indexOf(x.escalation))+1);patch(x.id,{escalation:ESCALATION_LEVELS[i]},"Escalation advanced")}}>Advance escalation</button></div>
      <small>Licensed review: {x.licensedReview}</small>
    </div>)}</div>
  </section>;
}
