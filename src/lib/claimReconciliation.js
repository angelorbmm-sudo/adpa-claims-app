function n(v){return Number(v||0);}
export function receivedPayment(p){return !!(p.receivedDate||p.depositedDate||p.status==="Received"||p.status==="Deposited");}
export function mortgageRemaining(m={}){
  const drawReleased=(m.draws||[]).reduce((s,x)=>s+n(x.releasedAmount),0);
  return Math.max(0,n(m.heldBalance)-n(m.initialRelease)-drawReleased);
}
export function reconciliationForClaim(claim){
  const payments=claim.payments||[], coverages=claim.coverages||[], receipts=claim.receipts||[];
  const ledgerReceived=payments.filter(receivedPayment).reduce((s,p)=>s+n(p.amount),0);
  const ledgerIssued=payments.filter(p=>p.status!=="Void").reduce((s,p)=>s+n(p.amount),0);
  const coverageReceived=coverages.reduce((s,c)=>s+n(c.received),0);
  const coverageIssued=coverages.reduce((s,c)=>s+n(c.issued),0);
  const requested=coverages.reduce((s,c)=>s+n(c.requested),0);
  const carrier=coverages.reduce((s,c)=>s+n(c.carrier),0);
  const depreciationRecoverable=receipts.reduce((s,x)=>s+n(x.recoverableDepreciation),0);
  const depreciationReleased=receipts.reduce((s,x)=>s+n(x.released),0);
  const depreciationOutstanding=receipts.reduce((s,x)=>s+(x.disposition==="Documented unrecoverable/waived"?0:Math.max(0,n(x.recoverableDepreciation)-n(x.released))),0);
  const lenderHeld=mortgageRemaining(claim.mortgage||{});
  const openIssues=(claim.issues||[]).filter(x=>x.status!=="Resolved");
  const openSupplements=(claim.supplements||[]).filter(x=>!["Resolved","Closed","Paid"].includes(x.status));
  const openRecovery=(claim.recovery||[]).filter(x=>x.status!=="Closed");
  const openCritical=(claim.criticalEvents||[]).filter(x=>x.status!=="Resolved");
  const lateClocks=(claim.deadlineClocks||[]).filter(x=>x.status!=="Satisfied"&&(x.verifiedDueDate||x.dueDate)&&new Date((x.verifiedDueDate||x.dueDate)+"T23:59:59").getTime()<Date.now());
  const latestPackage=(claim.packages||[]).at(-1)||null;
  const packageCurrent=!!latestPackage&&latestPackage.status!=="Superseded"&&!String(latestPackage.status||"").startsWith("Stale");
  const ledgerDifference=ledgerReceived-coverageReceived;
  return {requested,carrier,coverageIssued,coverageReceived,ledgerIssued,ledgerReceived,ledgerDifference,depreciationRecoverable,depreciationReleased,depreciationOutstanding,lenderHeld,openIssues,openSupplements,openRecovery,openCritical,lateClocks,latestPackage,packageCurrent};
}
export function closureBlockers(claim,complianceGate){
  const r=reconciliationForClaim(claim), blockers=[];
  if(complianceGate&&!complianceGate.cleared) blockers.push("Compliance gate is HOLD");
  if(!r.packageCurrent) blockers.push("Final claim package is missing or stale");
  if(Math.abs(r.ledgerDifference)>0.01) blockers.push("Payment ledger does not reconcile to coverage received totals");
  if(r.depreciationOutstanding>0.01) blockers.push("Recoverable depreciation remains outstanding");
  if(r.lenderHeld>0.01) blockers.push("Mortgage/loss-draft funds remain held");
  if(r.openIssues.length) blockers.push(r.openIssues.length+" issue file(s) remain open");
  if(r.openSupplements.length) blockers.push(r.openSupplements.length+" supplement/dispute record(s) remain open");
  if(r.openRecovery.length) blockers.push(r.openRecovery.length+" recovery follow-up(s) remain open");
  if(r.openCritical.length) blockers.push(r.openCritical.length+" critical event(s) remain open");
  if(r.lateClocks.length) blockers.push(r.lateClocks.length+" overdue carrier clock(s) remain unresolved");
  return {reconciliation:r,blockers};
}
