import React, { useMemo } from "react";
import Icon from "./Icon.jsx";
import { complianceStatus } from "../lib/stateCompliance.js";
export default function PortfolioDashboard({claims,onOpenClaim}){
 const m=useMemo(()=>claims.reduce((a,c)=>{
  a.requested+=(c.coverages||[]).reduce((s,x)=>s+Number(x.requested||0),0);
  a.received+=(c.coverages||[]).reduce((s,x)=>s+Number(x.received||0),0);
  a.openIssues+=(c.issues||[]).filter(x=>x.status!=="Resolved").length;
  a.lateClocks+=(c.deadlineClocks||[]).filter(x=>x.status!=="Satisfied"&&(x.verifiedDueDate||x.dueDate)&&new Date((x.verifiedDueDate||x.dueDate)+"T23:59:59")<new Date()).length;
  a.holds+=complianceStatus(c).cleared?0:1;
  a.depreciation+=(c.receipts||[]).reduce((s,x)=>s+Number(x.recoverableDepreciation||0)-Number(x.released||0),0);
  return a;
 },{requested:0,received:0,openIssues:0,lateClocks:0,holds:0,depreciation:0}),[claims]);
 const money=v=>Number(v||0).toLocaleString(undefined,{style:"currency",currency:"USD"});
 const ratio = m.requested > 0 ? Math.round(m.received / m.requested * 100) : 0;
 const active = claims.filter(c => c.closure?.status !== "Closed").length;
 const coverage = [
  {key:"A",label:"A · Dwelling",color:"#0876ff"},
  {key:"B",label:"B · Other Structures",color:"#8336f4"},
  {key:"C",label:"C · Personal Property",color:"#ff980d"},
  {key:"D",label:"D · ALE / Loss of Use",color:"#0db5aa"},
  {key:"CODE",label:"Code / Ordinance",color:"#fa6770"}
 ].map(bucket=>({...bucket,value:claims.reduce((sum,claim)=>sum+(claim.coverages||[]).filter(x=>x.key===bucket.key).reduce((v,x)=>v+Math.max(0,Number(x.requested)||0),0),0)}));
 const chartTotal=coverage.reduce((sum,x)=>sum+x.value,0);
 let stop=0;
 const chartFill=chartTotal>0 ? "conic-gradient("+coverage.map(x=>{const start=stop;stop+=x.value/chartTotal*100;return x.color+" "+start+"% "+stop+"%";}).join(",")+")" : "#e4eaf3";
 return <section className="portfolio-dashboard">
   <div className="recovery-hero">
     <div className="hero-brand"><svg viewBox="0 0 100 54" aria-hidden="true"><path d="M4 42 49 6 96 42M17 44 49 19 82 44" fill="none" stroke="currentColor" strokeWidth="6"/><path d="M45 35h10v10H45z" fill="currentColor"/></svg><div><b>ADPA<span> Claims</span></b><small>PROPERTY RECOVERY. DONE RIGHT.</small></div></div>
     <h2>From Evidence<br/>to Settlement.<br/>A Smarter Way Forward.</h2>
   </div>
   <div className="page-heading"><div><span className="eyebrow">Property recovery. Done right.</span><h1>Portfolio overview</h1><p>Your claims, priorities, and recovery at a glance.</p></div><button onClick={()=>onOpenClaim(claims[0]?.id,"workqueue")}><Icon name="tasks"/>Work queue</button></div>
   <div className="stats">
     <div className="stat dashboard-stat"><span className="metric-icon blue"><Icon name="claim"/></span><div><b>{active}</b><small>Active Claims</small><em>{claims.length} total claim files</em></div></div>
     <div className="stat dashboard-stat"><span className="metric-icon green"><Icon name="money"/></span><div><b>{money(m.requested)}</b><small>Total Requested</small><em>Recorded coverage amounts</em></div></div>
     <div className="stat dashboard-stat"><span className="metric-icon purple"><Icon name="money"/></span><div><b>{money(m.received)}</b><small>Total Received</small><em>{ratio}% against requested</em></div></div>
     <div className="stat dashboard-stat"><span className="metric-icon orange"><Icon name="shield"/></span><div><b>{m.holds}</b><small>Compliance Holds</small><em>{m.holds ? "Needs your review" : "All claims cleared"}</em></div></div>
   </div>
   <div className="portfolio-signals">
     <div><small>Open issues</small><b>{m.openIssues}</b></div>
     <div><small>Late carrier clocks</small><b>{m.lateClocks}</b></div>
     <div><small>Depreciation outstanding</small><b>{money(m.depreciation)}</b></div>
     <div><small>Total claim files</small><b>{claims.length}</b></div>
   </div>
   <div className="recovery-progress"><div><b>{ratio}% received against requested</b><small>Based on recorded coverage amounts</small></div><div className="progress-track" role="progressbar" aria-label="Received against requested" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100,Math.max(0,ratio))}><span style={{width:`${Math.min(100,Math.max(0,ratio))}%`}}/></div></div>
   <div className="portfolio-detail-grid"><div className="portfolio-claims"><div className="table-wrap portfolio-desktop"><div className="table-heading"><h2>Claim portfolio</h2><span>{claims.length} claim files</span></div><table><thead><tr><th>Claim / Carrier</th><th>State</th><th>Bucket</th><th>Compliance</th><th>Open issues</th><th>Late clocks</th><th>Requested</th><th>Received</th><th><span className="sr-only">Open claim</span></th></tr></thead><tbody>{claims.map(c=>{const req=(c.coverages||[]).reduce((s,x)=>s+Number(x.requested||0),0);const rec=(c.coverages||[]).reduce((s,x)=>s+Number(x.received||0),0);const issues=(c.issues||[]).filter(x=>x.status!=="Resolved").length;const late=(c.deadlineClocks||[]).filter(x=>x.status!=="Satisfied"&&(x.verifiedDueDate||x.dueDate)&&new Date((x.verifiedDueDate||x.dueDate)+"T23:59:59")<new Date()).length;const clear=complianceStatus(c).cleared;return <tr key={c.id}><td><b>{c.insured||"Unnamed"}</b><br/><small>{c.carrier}<br/>{c.claimNumber}</small></td><td>{c.jurisdiction||"?"}</td><td>{c.routing?.currentBucket||"—"}</td><td><span className={`status-badge ${clear?"clear":"hold"}`}>{clear?"Clear":"Hold"}</span></td><td>{issues}</td><td>{late}</td><td>{money(req)}</td><td>{money(rec)}</td><td><button aria-label={`Open ${c.insured||"unnamed claim"}`} onClick={()=>onOpenClaim(c.id,"overview")}><Icon name="arrow"/></button></td></tr>})}</tbody></table></div>
   <div className="portfolio-mobile"><div className="table-heading"><h2>Claim portfolio</h2><span>{claims.length} claim files</span></div>{claims.map(c=>{const clear=complianceStatus(c).cleared;return <article className="claim-preview" key={c.id}><div className="claim-preview-head"><div><h3>{c.insured||"Unnamed claim"}</h3><small>{c.carrier}<br/>{c.claimNumber} · {c.jurisdiction||"State not set"}</small></div><span className={`status-badge ${clear?"clear":"hold"}`}>{clear?"Clear":"Hold"}</span></div><div className="claim-value"><span>Requested</span><b>{money((c.coverages||[]).reduce((v,x)=>v+Number(x.requested||0),0))}</b></div><button onClick={()=>onOpenClaim(c.id,"overview")}>Open claim<Icon name="arrow"/></button></article>})}</div>
 </div><div className="coverage-panel panel"><h2>Claim Value by Coverage</h2><div className="coverage-layout"><div className="coverage-donut" role="img" aria-label={"Total requested by coverage: "+coverage.map(x=>x.label+" "+money(x.value)).join("; ")} style={{background:chartFill}}><div><b>{money(chartTotal)}</b><small>Total Requested</small></div></div><ul className="coverage-legend">{coverage.map(x=><li key={x.key}><i style={{background:x.color}}/><span>{x.label}</span><b>{chartTotal>0 ? Math.round(x.value/chartTotal*100) : 0}%</b></li>)}</ul></div>{chartTotal===0&&<p className="muted">Add requested coverage amounts to see the breakdown.</p>}</div></div>
 </section>;
}
