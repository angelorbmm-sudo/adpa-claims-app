import React, { useMemo } from "react";
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
 return <section><h1>ADPA Portfolio Command Center</h1><p>Cross-claim management view for money, compliance, deadlines, evidence-driven disputes, and recovery.</p>
 <div className="stats"><div className="stat"><small>Active claims</small><b>{claims.length}</b></div><div className="stat"><small>Requested</small><b>{money(m.requested)}</b></div><div className="stat"><small>Received</small><b>{money(m.received)}</b></div><div className="stat"><small>Open issues</small><b>{m.openIssues}</b></div><div className="stat"><small>Late clocks</small><b>{m.lateClocks}</b></div><div className="stat"><small>Compliance holds</small><b>{m.holds}</b></div><div className="stat"><small>Depreciation outstanding</small><b>{money(m.depreciation)}</b></div></div>
 <div className="table-wrap"><table><thead><tr><th>Claim</th><th>State</th><th>Bucket</th><th>Compliance</th><th>Open issues</th><th>Late clocks</th><th>Requested</th><th>Received</th><th></th></tr></thead><tbody>{claims.map(c=>{const req=(c.coverages||[]).reduce((s,x)=>s+Number(x.requested||0),0);const rec=(c.coverages||[]).reduce((s,x)=>s+Number(x.received||0),0);const issues=(c.issues||[]).filter(x=>x.status!=="Resolved").length;const late=(c.deadlineClocks||[]).filter(x=>x.status!=="Satisfied"&&(x.verifiedDueDate||x.dueDate)&&new Date((x.verifiedDueDate||x.dueDate)+"T23:59:59")<new Date()).length;return <tr key={c.id}><td><b>{c.insured||"Unnamed"}</b><br/><small>{c.carrier} {c.claimNumber}</small></td><td>{c.jurisdiction||"?"}</td><td>{c.routing?.currentBucket||"—"}</td><td>{complianceStatus(c).cleared?"CLEAR":"HOLD"}</td><td>{issues}</td><td>{late}</td><td>{money(req)}</td><td>{money(rec)}</td><td><button onClick={()=>onOpenClaim(c.id,"overview")}>Open</button></td></tr>})}</tbody></table></div></section>
}
