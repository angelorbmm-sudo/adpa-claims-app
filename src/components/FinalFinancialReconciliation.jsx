import React,{useMemo} from "react";
import {reconciliationForClaim,receivedPayment} from "../lib/claimReconciliation.js";
const n=v=>Number(v||0), money=v=>n(v).toLocaleString(undefined,{style:"currency",currency:"USD"});
export default function FinalFinancialReconciliation({claim}){
 const r=useMemo(()=>reconciliationForClaim(claim),[claim]);
 const payments=claim.payments||[], coverages=claim.coverages||[];
 const byCoverage=coverages.map(c=>{
   const ps=payments.filter(p=>p.coverage===c.key&&p.status!=="Void");
   const issued=ps.reduce((s,p)=>s+n(p.amount),0),received=ps.filter(receivedPayment).reduce((s,p)=>s+n(p.amount),0);
   return {...c,ledgerIssued:issued,ledgerReceived:received,difference:received-n(c.received)};
 });
 const possibleDuplicates=[];
 payments.forEach((p,i)=>payments.slice(i+1).forEach(q=>{
   if(p.status!=="Void"&&q.status!=="Void"&&n(p.amount)===n(q.amount)&&p.coverage===q.coverage&&((p.checkNumber&&p.checkNumber===q.checkNumber)||(p.issuedDate&&p.issuedDate===q.issuedDate))) possibleDuplicates.push([p,q]);
 }));
 const unreceived=payments.filter(p=>p.status!=="Void"&&!receivedPayment(p));
 const unallocated=payments.filter(p=>p.status!=="Void"&&!String(p.allocation||"").trim());
 return <section><h1>Final Financial Reconciliation</h1><p>One money-control view across coverage totals, individual carrier payments, recoverable depreciation and lender-controlled proceeds. This is the financial source for closure review.</p>
 <div className="stats"><div className="stat"><small>Requested</small><b>{money(r.requested)}</b></div><div className="stat"><small>Carrier position</small><b>{money(r.carrier)}</b></div><div className="stat"><small>Ledger received</small><b>{money(r.ledgerReceived)}</b></div><div className="stat"><small>Coverage/ledger difference</small><b>{money(r.ledgerDifference)}</b></div><div className="stat"><small>Depreciation outstanding</small><b>{money(r.depreciationOutstanding)}</b></div><div className="stat"><small>Lender held</small><b>{money(r.lenderHeld)}</b></div></div>
 <div className="table-wrap"><table><thead><tr><th>Coverage</th><th>Requested</th><th>Carrier</th><th>Coverage received</th><th>Ledger received</th><th>Difference</th></tr></thead><tbody>{byCoverage.map(c=><tr key={c.key}><td><b>{c.key}</b> {c.name}</td><td>{money(c.requested)}</td><td>{money(c.carrier)}</td><td>{money(c.received)}</td><td>{money(c.ledgerReceived)}</td><td>{money(c.difference)}</td></tr>)}</tbody></table></div>
 <div className="panel"><h2>Exception checks</h2><div className="release-gates"><Gate label="Coverage totals reconcile to received ledger" ok={Math.abs(r.ledgerDifference)<=0.01}/><Gate label="No issued/unreceived payments" ok={!unreceived.length}/><Gate label="All payments allocated/explained" ok={!unallocated.length}/><Gate label="No possible duplicate payments" ok={!possibleDuplicates.length}/><Gate label="Recoverable depreciation resolved" ok={r.depreciationOutstanding<=0.01}/><Gate label="Lender-held proceeds resolved" ok={r.lenderHeld<=0.01}/></div>
 {unreceived.length>0&&<p className="notice">{unreceived.length} payment(s) are recorded as issued but not received/deposited.</p>}
 {unallocated.length>0&&<p className="notice">{unallocated.length} payment(s) lack an allocation/explanation.</p>}
 {possibleDuplicates.length>0&&<p className="notice">{possibleDuplicates.length} possible duplicate payment pair(s) require human reconciliation. No record was removed automatically.</p>}</div>
 <p className="notice">Financial reconciliation does not infer entitlement solely from totals. Coverage, policy terms, deductible, valuation basis, depreciation conditions, payee/lender controls and disputed amounts remain separately reviewable.</p></section>
}
function Gate({label,ok}){return <div className={ok?"gate ok":"gate no"}><b>{ok?"PASS":"HOLD"}</b><span>{label}</span></div>}
