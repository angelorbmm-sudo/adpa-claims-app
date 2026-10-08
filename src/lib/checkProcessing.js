export const PAYEE_TYPES = ["ADPA", "Client", "Mortgage company", "Other named payee"];
export const ENDORSEMENT_STATES = ["Pending", "Requested", "Reported endorsed"];
export const BANK_EVENTS = ["Submitted to lender", "Lender funds held", "Deposit reported", "Clearing reported", "Cleared reported", "Returned", "Void"];
export function cents(value) {
  const text=String(value ?? "").trim();
  if(!/^\d+(?:\.\d{1,2})?$/.test(text)) return null;
  const [whole,fraction=""]=text.split(".");
  const result=Number(whole)*100+Number(fraction.padEnd(2,"0"));
  return Number.isSafeInteger(result)?result:null;
}
export const dollars = value => (value/100).toFixed(2);
export const totalCents = (items,key="amount") => items.reduce((sum,x)=>sum+(cents(x[key])||0),0);
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value||"") && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value;
export function checkStatus(check) { return check.events?.at(-1)?.type || "Received / recorded"; }
export function checkTotals(check) {
  const amount=cents(check.amount)||0;
  const available=totalCents(check.funding||[]);
  const paid=totalCents(check.payouts||[]);
  const planned=totalCents(check.allocations||[]);
  const status=checkStatus(check);
  return {amount,available,paid,planned,remaining:available-paid,blocked:["Returned","Void"].includes(status)};
}
export function validateCheck(check,checks=[],payments=[]) {
  const errors=[];
  const previous=checks.find(c=>c.id===check.id);
  if(previous?.events?.length){
    for(const key of ["checkNumber","issuer","amount","issuedDate","coverage","route"]){if(check[key]!==previous[key])errors.push("Recorded check identity cannot change after bank/lender events.");}
    const identity=payees=>JSON.stringify((payees||[]).map(p=>[p.id,p.type,p.name]));
    if(identity(check.payees)!==identity(previous.payees))errors.push("Retain the recorded named payees after bank/lender events.");
  }
  if(!String(check.checkNumber||"").trim())errors.push("Enter a check reference.");
  if(!String(check.issuer||"").trim())errors.push("Enter the issuing carrier or lender.");
  if(cents(check.amount)===null || cents(check.amount)<=0)errors.push("Enter a positive amount with no more than two decimal places.");
  if(!["Unknown","No mortgage payee","Lender endorsement","Lender monitored"].includes(check.route))errors.push("Choose a valid lender route.");
  const payees=check.payees||[];
  if(check.kind!=="Lender draw"&&!payees.some(p=>p.type==="ADPA"&&p.name.trim()))errors.push("ADPA must be a named payee on an original insurance check.");
  if(check.kind!=="Lender draw"&&!payees.some(p=>p.type==="Client"&&p.name.trim()))errors.push("Enter at least one client payee.");
  if(!payees.length)errors.push("Enter the exact named payees on this check.");
  errors.push(...drawErrors(check,checks));
  if(previous?.events?.length&&(check.kind!==previous.kind||check.parentCheckId!==previous.parentCheckId))errors.push("Keep the recorded check type and original-check link.");
  if(payees.some(p=>!p.name.trim()||!PAYEE_TYPES.includes(p.type)))errors.push("Complete every payee name and type.");
  if(new Set(payees.map(p=>p.name.trim().toLowerCase())).size!==payees.length)errors.push("Remove duplicate payee names.");
  if(payees.some(p=>!ENDORSEMENT_STATES.includes(p.status)))errors.push("Choose valid endorsement states.");
  if(payees.some(p=>p.status==="Reported endorsed"&&(!p.method?.trim()||!p.reference?.trim())))errors.push("Recorded endorsements need a method and supporting reference.");
  const mortgage=payees.some(p=>p.type==="Mortgage company");
  if(check.route==="No mortgage payee"&&mortgage)errors.push("A mortgage payee is listed; choose the lender route.");
  if(["Lender endorsement","Lender monitored"].includes(check.route)&&!mortgage)errors.push("The lender route needs a mortgage-company payee.");
  if(checks.some(c=>c.id!==check.id&&c.issuer.trim().toLowerCase()===check.issuer.trim().toLowerCase()&&c.checkNumber.trim().toLowerCase()===check.checkNumber.trim().toLowerCase()))errors.push("This issuer/check reference is already recorded.");
  if(check.ledgerPaymentId){
    const p=payments.find(p=>p.id===check.ledgerPaymentId);
    if(!p)errors.push("The linked ledger entry is unavailable.");
    else if(cents(p.amount)!==cents(check.amount))errors.push("The check amount must match its linked ledger entry.");
    if(checks.some(c=>c.id!==check.id&&c.ledgerPaymentId===check.ledgerPaymentId))errors.push("That ledger entry is already linked to another check.");
  }
  const totals=checkTotals(check);
  if(totals.available>totals.amount)errors.push("Reported available funds exceed the check amount.");
  if(totals.planned>totals.amount)errors.push("Proposed distributions exceed the check amount.");
  if(totals.paid>totals.available)errors.push("Reported payouts exceed reported available funds.");
  if((check.payouts||[]).some(p=>!(check.allocations||[]).some(a=>a.id===p.allocationId&&a.payeeId===p.payeeId)))errors.push("A reported payout must retain its linked distribution.");
  if((check.allocations||[]).some(a=>!checkRecipients(check).some(p=>p.id===a.payeeId)))errors.push("Keep recipients referenced by proposed distributions.");
  const participants=check.participants||[];
  if(new Set([...payees,...participants].map(p=>p.id)).size!==payees.length+participants.length)errors.push("Participant identifiers must be unique.");
  if(participants.some(p=>!p.name?.trim()||!["Contractor","ADPA","Client","Other recipient"].includes(p.type)))errors.push("Complete recipient names and roles.");
  if(new Set(checkRecipients(check).map(p=>p.name.trim().toLowerCase())).size!==checkRecipients(check).length)errors.push("Use a single participant record for each named party.");
  if(Object.values(check.contacts||{}).some(p=>p.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)))errors.push("Enter valid participant email addresses.");
  if((previous?.participants||[]).some(p=>(previous.allocations||[]).some(a=>a.payeeId===p.id)&&!participants.some(n=>n.id===p.id&&n.name===p.name&&n.type===p.type)))errors.push("Retain identities of recipients with recorded allocations.");
  if((check.allocations||[]).some(a=>totalCents((check.payouts||[]).filter(p=>p.allocationId===a.id))>(cents(a.amount)||0)))errors.push("A proposed distribution cannot be reduced below its reported payouts.");
  if(check.events?.length&&((check.route!==(check.recordedRoute||check.route)) || cents(check.amount)!==(check.recordedAmountCents ?? cents(check.amount))))errors.push("After bank/lender events, retain the recorded route and check amount. Create a new record for a reissued check.");
  return errors;
}
export function bankEventErrors(check,event) {
  const errors=[];
  if(!BANK_EVENTS.includes(event.type))errors.push("Choose a supported event.");
  if(!event.reference?.trim())errors.push("Enter the bank/lender confirmation or supporting reference.");
  if(!validDate(event.date))errors.push("Enter a valid reported event date.");
  if(checkStatus(check)==="Void")errors.push("This check is void. Record a replacement separately.");
  if(["Deposit reported","Clearing reported","Cleared reported"].includes(event.type)){
    if(check.route==="Unknown")errors.push("Confirm the lender route first.");
    if(!(check.payees||[]).length || check.payees.some(p=>p.status!=="Reported endorsed"||!p.reference?.trim()||!p.method?.trim()))errors.push("Record supporting endorsements for every named payee.");
    if(!check.frontRef?.trim()||!check.backRef?.trim())errors.push("Add front and back check-image references.");
    if(!check.bankInstructions?.trim())errors.push("Record the bank/lender deposit instructions.");
  }
  const latestReset=Math.max(-1,(check.events||[]).findLastIndex(e=>e.type==="Returned"));
  const current=(check.events||[]).slice(latestReset+1);
  if(["Clearing reported","Cleared reported"].includes(event.type)&&!current.some(e=>e.type==="Deposit reported"))errors.push("Record the deposit confirmation before clearing or clearance.");
  if(event.type==="Lender funds held"&&check.route!=="Lender monitored")errors.push("Held funds require a lender-monitored route.");
  if(event.type==="Submitted to lender"&&!["Lender monitored","Lender endorsement"].includes(check.route))errors.push("Choose a lender route before submission.");
  if(event.date && check.events?.at(-1)?.date && event.date<check.events.at(-1).date)errors.push("Reported events must follow the previous event date.");
  if(["Submitted to lender","Lender funds held"].includes(event.type)&&current.some(e=>["Deposit reported","Clearing reported","Cleared reported"].includes(e.type)))errors.push("Lender intake events must precede bank-deposit events.");
  if(event.type==="Clearing reported"&&current.some(e=>e.type==="Cleared reported"))errors.push("Clearance is already recorded.");
  if(event.type==="Deposit reported" && current.some(e=>e.type==="Deposit reported"))errors.push("Deposit already reported; do not record a second deposit unless a return is recorded.");
  if(event.type==="Cleared reported" && current.some(e=>e.type==="Cleared reported"))errors.push("Clearance is already recorded.");
  if(event.type==="Deposit reported" && checkTotals(check).available>0)errors.push("Funds are already recorded; reconcile them before considering another deposit.");
  return errors;
}
export function fundingErrors(check,row) {
  const errors=[];
  const amount=cents(row.amount),t=checkTotals(check);
  if(amount===null||amount<=0)errors.push("Enter a positive funds amount with no more than two decimal places.");
  if(t.blocked||checkStatus(check)!=="Cleared reported")errors.push("Funds can be recorded only after reported clearance and with no return or void.");
  if(amount!==null&&t.available+amount>t.amount)errors.push("Available-funds reports cannot exceed the check amount.");
  if(!row.reference?.trim()||!validDate(row.date))errors.push("Enter a valid funding date and bank/lender confirmation reference.");
  if(row.date<check.events?.at(-1)?.date)errors.push("Funding cannot precede reported clearance.");
  if((check.funding||[]).some(r=>(r.reference||"").trim().toLowerCase()===row.reference?.trim().toLowerCase()))errors.push("This funds confirmation is already recorded.");
  return errors;
}
export function allocationErrors(check,row) {
  const errors=[];
  const amount=cents(row.amount);
  if(amount===null||amount<=0)errors.push("Enter a positive distribution amount with no more than two decimal places.");
  if(!checkRecipients(check).some(p=>p.id===row.payeeId))errors.push("Select a distribution recipient.");
  if(amount!==null&&checkTotals(check).planned+amount>checkTotals(check).amount)errors.push("Proposed distributions exceed the check amount.");
  return errors;
}
export function payoutErrors(check,row) {
  const errors=[];
  const t=checkTotals(check),amount=cents(row.amount);
  const allocation=(check.allocations||[]).find(a=>a.id===row.allocationId);
  if(!allocation)errors.push("Select a proposed distribution.");
  if(amount===null||amount<=0)errors.push("Enter a positive payout amount with no more than two decimal places.");
  if(t.blocked||checkStatus(check)!=="Cleared reported")errors.push("A returned, void, or uncleared check cannot support a reported payout.");
  if(amount!==null&&amount>t.remaining)errors.push("Reported payout exceeds funds recorded available.");
  const prior=totalCents((check.payouts||[]).filter(p=>p.allocationId===row.allocationId));
  if(allocation&&amount!==null&&prior+amount>(cents(allocation.amount)||0))errors.push("Reported payout exceeds this payee's proposed distribution.");
  if(!check.clientAuthorizationRef?.trim()||!check.paReviewRef?.trim())errors.push("Record client authorization and licensed-PA review references.");
  const payee=checkRecipients(check).find(p=>p.id===allocation?.payeeId);
  if(payee?.type==="ADPA"&&!check.feeAgreementRef?.trim())errors.push("ADPA fee distributions require the fee-agreement reference.");
  if(!row.reference?.trim()||!validDate(row.date))errors.push("Enter a valid payout date and bank transfer reference.");
  if(row.date<check.events?.at(-1)?.date || row.date<(check.funding||[]).map(f=>f.date).sort().at(-1))errors.push("Payout cannot precede reported clearance or funding.");
  if((check.payouts||[]).some(p=>(p.reference||"").trim().toLowerCase()===row.reference?.trim().toLowerCase()))errors.push("This payout confirmation is already recorded.");
  return errors;
}
export function reconciliationChecks(check,claimsPayments=[],checks=[]) {
  const p=claimsPayments.find(p=>p.id===check.ledgerPaymentId), t=checkTotals(check);
  const drawAvailable=checks.filter(c=>c.kind==="Lender draw"&&c.parentCheckId===check.id).reduce((sum,c)=>sum+checkTotals(c).available,0);
  return {linked:!!p,amountMatches:!!p&&cents(p.amount)===t.amount,unplanned:t.amount-t.planned,remainingAvailable:t.remaining,
    lenderUnreleased:check.route==="Lender monitored"?Math.max(0,t.amount-t.available-drawAvailable):0,
    returnExposure:t.blocked?t.paid:0};
}

// Recipients can receive an approved distribution without being printed payees.
export function checkRecipients(check){return [...(check.payees||[]).map(p=>({...p,namedPayee:true})),...(check.participants||[]).map(p=>({...p,namedPayee:false}))].map(p=>({...p,email:check.contacts?.[p.id]?.email||"",phone:check.contacts?.[p.id]?.phone||""}));}
export function percentageAmount(amount,percentage){
  const face=cents(amount),bp=cents(percentage);
  if(face===null||bp===null||bp<=0||bp>10000)return null;
  return dollars(Number((BigInt(face)*BigInt(bp)+5000n)/10000n));
}
export function distributionFingerprint(check){return JSON.stringify({id:check.id,checkNumber:check.checkNumber,amount:check.amount,kind:check.kind||"Insurance check",parentCheckId:check.parentCheckId||"",route:check.route,parties:checkRecipients(check).map(p=>({id:p.id,name:p.name,type:p.type,namedPayee:p.namedPayee,email:p.email||"",phone:p.phone||""})),allocations:(check.allocations||[]).map(a=>({id:a.id,payeeId:a.payeeId,amount:a.amount,purpose:a.purpose||""}))});}
export function reviewErrors(check){
  const errors=[];
  if(checkTotals(check).planned!==checkTotals(check).amount)errors.push("Allocate the full check amount before preparing client review.");
  const required=checkRecipients(check).filter(p=>p.namedPayee||(check.allocations||[]).some(a=>a.payeeId===p.id));
  if(required.some(p=>!p.email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)))errors.push("Add a valid email for every named payee and distribution recipient.");
  return errors;
}
export function drawErrors(check,checks){
  const errors=[];
  if(check.kind==="Lender draw"){
    const parent=checks.find(c=>c.id===check.parentCheckId);
    if(!parent||parent.id===check.id||parent.kind==="Lender draw"||parent.route!=="Lender monitored")errors.push("Link a lender draw to an original lender-monitored check in this claim.");
    else{
      const draws=checks.filter(c=>c.kind==="Lender draw"&&c.parentCheckId===parent.id&&c.id!==check.id);
      if(totalCents(draws)+(cents(check.amount)||0)+checkTotals(parent).available>checkTotals(parent).amount)errors.push("Linked draw amounts and original availability reports exceed the original check amount.");
      if(checkStatus(parent)==="Void"||checkStatus(parent)==="Returned")errors.push("Resolve the blocked original check before recording a lender draw.");
    }
    if(check.ledgerPaymentId)errors.push("Lender draws do not link to carrier-payment ledger rows; use the original check link.");
  }else{
    const draws=checks.filter(c=>c.kind==="Lender draw"&&c.parentCheckId===check.id);
    if(draws.length&&check.route!=="Lender monitored")errors.push("Retain the monitored route for an original with linked draws.");
    if(totalCents(draws)+checkTotals(check).available>checkTotals(check).amount)errors.push("Original availability reports overlap linked draw amounts.");
  }
  return errors;
}
