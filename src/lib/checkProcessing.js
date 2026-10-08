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
  if(!payees.some(p=>p.type==="ADPA"&&p.name.trim()))errors.push("ADPA must be a named payee for this module.");
  if(!payees.some(p=>p.type==="Client"&&p.name.trim()))errors.push("Enter at least one client payee.");
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
  if((check.allocations||[]).some(a=>!payees.some(p=>p.id===a.payeeId)))errors.push("Keep payees referenced by proposed distributions.");
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
  if(!(check.payees||[]).some(p=>p.id===row.payeeId))errors.push("Select a named payee.");
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
  const payee=check.payees?.find(p=>p.id===allocation?.payeeId);
  if(payee?.type==="ADPA"&&!check.feeAgreementRef?.trim())errors.push("ADPA fee distributions require the fee-agreement reference.");
  if(!row.reference?.trim()||!validDate(row.date))errors.push("Enter a valid payout date and bank transfer reference.");
  if(row.date<check.events?.at(-1)?.date || row.date<(check.funding||[]).map(f=>f.date).sort().at(-1))errors.push("Payout cannot precede reported clearance or funding.");
  if((check.payouts||[]).some(p=>(p.reference||"").trim().toLowerCase()===row.reference?.trim().toLowerCase()))errors.push("This payout confirmation is already recorded.");
  return errors;
}
export function reconciliationChecks(check,claimsPayments=[]) {
  const p=claimsPayments.find(p=>p.id===check.ledgerPaymentId), t=checkTotals(check);
  return {linked:!!p,amountMatches:!!p&&cents(p.amount)===t.amount,unplanned:t.amount-t.planned,remainingAvailable:t.remaining,
    lenderUnreleased:check.route==="Lender monitored"?t.amount-t.available:0,
    returnExposure:t.blocked?t.paid:0};
}
