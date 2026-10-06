const cents=v=>{
  if(v===null||v===undefined||v==="")return 0;
  const s=String(v).trim().replace(/[$,]/g,"");
  if(!/^-?\d+(\.\d{0,2})?$/.test(s)) throw new Error("Invalid currency amount: "+v);
  const neg=s.startsWith("-"), raw=neg?s.slice(1):s, [whole,frac=""]=raw.split(".");
  const n=Number(whole)*100+Number((frac+"00").slice(0,2));
  if(!Number.isSafeInteger(n)) throw new Error("Currency amount exceeds safe range.");
  return neg?-n:n;
};
const dollars=c=>c/100;
const sum=(xs,fn)=>xs.reduce((s,x)=>s+fn(x),0);
const received=p=>!!(p.receivedDate||p.depositedDate||p.status==="Received"||p.status==="Deposited");

export function financialInvariants(claim={}){
 const payments=claim.payments||[],coverages=claim.coverages||[],receipts=claim.receipts||[],m=claim.mortgage||{};
 const active=payments.filter(p=>p.status!=="Void");
 const ledgerIssued=sum(active,p=>cents(p.amount));
 const ledgerReceived=sum(active.filter(received),p=>cents(p.amount));
 const coverageIssued=sum(coverages,x=>cents(x.issued));
 const coverageReceived=sum(coverages,x=>cents(x.received));
 const depreciationOutstanding=sum(receipts,x=>x.disposition==="Documented unrecoverable/waived"?0:Math.max(0,cents(x.recoverableDepreciation)-cents(x.released)));
 const mortgageHeld=Math.max(0,cents(m.heldBalance)-cents(m.initialRelease)-sum(m.draws||[],x=>cents(x.releasedAmount)));
 const unreceived=active.filter(p=>!received(p));
 const unallocated=active.filter(p=>!String(p.allocation||"").trim());
 const duplicatePairs=[];
 active.forEach((p,i)=>active.slice(i+1).forEach(q=>{
   if(cents(p.amount)===cents(q.amount)&&p.coverage===q.coverage&&((p.checkNumber&&p.checkNumber===q.checkNumber)||(p.issuedDate&&p.issuedDate===q.issuedDate))) duplicatePairs.push([p.id||null,q.id||null]);
 }));
 const reasons=[];
 if(ledgerReceived!==coverageReceived) reasons.push("Payment ledger does not reconcile to coverage received totals.");
 if(ledgerIssued!==coverageIssued) reasons.push("Payment ledger does not reconcile to coverage issued totals.");
 if(unreceived.length) reasons.push("Issued/unreceived payments remain.");
 if(unallocated.length) reasons.push("Payments remain unallocated/unexplained.");
 if(duplicatePairs.length) reasons.push("Possible duplicate payment records require human reconciliation.");
 if(depreciationOutstanding>0) reasons.push("Recoverable depreciation remains outstanding.");
 if(mortgageHeld>0) reasons.push("Mortgage/loss-draft funds remain held.");
 return {ready:reasons.length===0,reasons,cents:{ledgerIssued,ledgerReceived,coverageIssued,coverageReceived,depreciationOutstanding,mortgageHeld},dollars:{ledgerIssued:dollars(ledgerIssued),ledgerReceived:dollars(ledgerReceived),coverageIssued:dollars(coverageIssued),coverageReceived:dollars(coverageReceived),depreciationOutstanding:dollars(depreciationOutstanding),mortgageHeld:dollars(mortgageHeld)},unreceivedCount:unreceived.length,unallocatedCount:unallocated.length,duplicatePairs};
}
export {cents as moneyToCents};
