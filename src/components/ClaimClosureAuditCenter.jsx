import React,{useMemo,useState} from "react";
import {nowIso,uid} from "../lib/storage.js";
import {complianceStatus} from "../lib/stateCompliance.js";
import {closureBlockers} from "../lib/claimReconciliation.js";
const money=v=>Number(v||0).toLocaleString(undefined,{style:"currency",currency:"USD"});
export default function ClaimClosureAuditCenter({claim,onChange}){
 const [reason,setReason]=useState("");
 const gate=complianceStatus(claim);
 const {reconciliation:r,blockers}=useMemo(()=>closureBlockers(claim,gate),[claim]);
 const closure=claim.closure||{status:"Open",events:[]};
 const finalPackage=r.latestPackage;
 const hash=finalPackage?.snapshotHash||"";
 const approvals=claim.approvals||[];
 const paApproved=approvals.some(a=>a.packageHash===hash&&a.stage==="Licensed PA Approval"&&/approve/i.test(a.decision||"")&&!a.revokedAt);
 const clientAuthorized=approvals.some(a=>a.packageHash===hash&&a.stage==="Client Authorization"&&/author|approve/i.test(a.decision||"")&&!a.revokedAt);
 const allBlockers=[...blockers,...(!paApproved?["Licensed PA approval missing for final package"]:[]),...(!clientAuthorized?["Client authorization missing for final package"]:[])];
 function closeClaim(){
  if(allBlockers.length)return;
  const event={id:uid("closure"),type:"Closed",at:nowIso(),reason:reason||"Final reconciliation complete",packageHash:hash,summary:{requested:r.requested,received:r.ledgerReceived,depreciationOutstanding:r.depreciationOutstanding,lenderHeld:r.lenderHeld}};
  onChange({...closure,status:"Closed",closedAt:event.at,closedPackageHash:hash,events:[...(closure.events||[]),event]});
  setReason("");
 }
 function exportAudit(){
  const report={reportType:"ADPA_FINAL_CLAIM_AUDIT_V1",generatedAt:nowIso(),claim:{id:claim.id,insured:claim.insured,property:claim.property,carrier:claim.carrier,claimNumber:claim.claimNumber,dateOfLoss:claim.dateOfLoss,jurisdiction:claim.jurisdiction},closure,finalPackage:{version:finalPackage?.version||null,hash},financial:{requested:r.requested,carrier:r.carrier,coverageReceived:r.coverageReceived,ledgerReceived:r.ledgerReceived,depreciationOutstanding:r.depreciationOutstanding,lenderHeld:r.lenderHeld},approvals:{licensedPA:paApproved,client:clientAuthorized},blockers:allBlockers};
  const blob=new Blob([JSON.stringify(report,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="ADPA-final-audit-"+(claim.claimNumber||claim.id||"claim")+".json";a.click();URL.revokeObjectURL(url);
 }
 function reopen(){
  if(!reason.trim())return;
  const event={id:uid("closure"),type:"Reopened",at:nowIso(),reason:reason.trim(),priorClosedPackageHash:closure.closedPackageHash||""};
  onChange({...closure,status:"Reopened",reopenedAt:event.at,events:[...(closure.events||[]),event]});setReason("");
 }
 return <section><h1>Claim Closure & Final Audit Center</h1><p>Final control before a claim becomes Closed/Audit. ADPA must reconcile money, remaining rights/recoveries, lender funds, open disputes, critical events, deadlines and the exact approved package version.</p>
 <div className="stats"><div className="stat"><small>Closure status</small><b>{closure.status||"Open"}</b></div><div className="stat"><small>Requested</small><b>{money(r.requested)}</b></div><div className="stat"><small>Ledger received</small><b>{money(r.ledgerReceived)}</b></div><div className="stat"><small>Depreciation outstanding</small><b>{money(r.depreciationOutstanding)}</b></div><div className="stat"><small>Lender held</small><b>{money(r.lenderHeld)}</b></div><div className="stat"><small>Closure blockers</small><b>{allBlockers.length}</b></div></div>
 <div className="panel"><h2>Final money reconciliation</h2><div className="table-wrap"><table><thead><tr><th>Measure</th><th>Amount</th><th>Control</th></tr></thead><tbody>
 <tr><td>Coverage screen received</td><td>{money(r.coverageReceived)}</td><td>Compare to payment ledger</td></tr>
 <tr><td>Payment ledger received</td><td>{money(r.ledgerReceived)}</td><td>{Math.abs(r.ledgerDifference)<=0.01?"RECONCILED":"DIFFERENCE "+money(r.ledgerDifference)}</td></tr>
 <tr><td>Recoverable depreciation</td><td>{money(r.depreciationRecoverable)}</td><td>Released {money(r.depreciationReleased)}</td></tr>
 <tr><td>Mortgage/loss-draft remaining</td><td>{money(r.lenderHeld)}</td><td>{r.lenderHeld<=0.01?"CLEAR":"HOLD"}</td></tr>
 </tbody></table></div></div>
 <div className="panel"><h2>Final controls</h2><div className="release-gates"><Gate label="Compliance" ok={gate.cleared}/><Gate label="Current final package" ok={r.packageCurrent}/><Gate label="Money reconciled" ok={Math.abs(r.ledgerDifference)<=0.01}/><Gate label="Depreciation recovered/dispositioned" ok={r.depreciationOutstanding<=0.01}/><Gate label="Mortgage funds released/dispositioned" ok={r.lenderHeld<=0.01}/><Gate label="Licensed PA approval" ok={paApproved}/><Gate label="Client authorization" ok={clientAuthorized}/></div></div>
 {allBlockers.length>0?<div className="release-banner blocked"><b>CLOSURE BLOCKED</b><span>{allBlockers.join(" · ")}</span></div>:<div className="release-banner ready"><b>READY FOR FINAL CLOSURE</b><span>All recorded closure gates are clear for the current package.</span></div>}
 <label>Closure / reopen reason<textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Why this claim is closing, or exact reason it must be reopened"/></label>
 <div className="comm-actions"><button className="primary" disabled={allBlockers.length>0||closure.status==="Closed"} onClick={closeClaim}>Close claim & create audit event</button><button disabled={closure.status!=="Closed"||!reason.trim()} onClick={reopen}>Reopen with reason</button><button onClick={exportAudit}>Export final audit record</button></div>
 <div className="panel"><h2>Closure audit history</h2>{(closure.events||[]).slice().reverse().map(e=><div className="record" key={e.id}><b>{e.type} — {e.at}</b><span>{e.reason}</span><small>Package: {e.packageHash||e.priorClosedPackageHash||"—"}</small></div>)}</div>
 <p className="notice">Closure records facts and authorization; it does not waive rights by itself. Any release, settlement agreement, limitations issue, legal dispute or represented-party matter remains subject to the applicable approval/counsel controls.</p>
 </section>
}
function Gate({label,ok}){return <div className={ok?"gate ok":"gate no"}><b>{ok?"PASS":"HOLD"}</b><span>{label}</span></div>}
