// Representation/contract timing helpers. Operational calculations require reviewer verification.
function iso(d){return d.toISOString().slice(0,10);}
export function addBusinessDaysWeekendOnly(date, days){
  const d=new Date(date+"T12:00:00"); let n=Number(days||0);
  while(n>0){d.setDate(d.getDate()+1);if(d.getDay()!==0&&d.getDay()!==6)n--;}
  return iso(d);
}
export function addCalendarDays(date,days){const d=new Date(date+"T12:00:00");d.setDate(d.getDate()+Number(days||0));return iso(d);}
export function caCancellationDue(signedDate,isCatastrophicDisaster){
  if(!signedDate)return "";
  return isCatastrophicDisaster?addCalendarDays(signedDate,5):addBusinessDaysWeekendOnly(signedDate,3);
}
export function caInsurerNoticeDue(cancellationDue){
  if(!cancellationDue)return "";
  return addBusinessDaysWeekendOnly(cancellationDue,3);
}
export const REPRESENTATION_RULES={
  CA:{
    contractAuthority:"Cal. Ins. Code §15027(a)-(c)",
    disclosureAuthority:"Cal. Ins. Code §15027(v)",
    cancellationAuthority:"Cal. Ins. Code §15027(b), (y)",
    carrierNoticeAuthority:"Cal. Ins. Code §15027(w)",
    feeAuthority:"Cal. Ins. Code §15027(b)-(c), §15027.5",
    solicitationAuthority:"Cal. Ins. Code §15027(d)-(e), §15027.1",
    requirements:[
      "Commissioner-approved written contract executed in duplicate before acting.",
      "Separate §15027(v) disclosure delivered before contract signing.",
      "Original signed contract and notice of cancellation delivered when client signs.",
      "Ordinary cancellation: three business days; qualifying catastrophic-disaster contract: five calendar days.",
      "No later than three business days after cancellation expires, notify insurer/adjuster/attorney of representation.",
      "Fee/compensation must match approved contract terms; third-party claim-related compensation must be disclosed and conflicts avoided.",
      "Solicitation restrictions must be checked separately, including loss-producing occurrence, hours, and catastrophic-disaster rules."
    ]
  },
  NV:{
    contractAuthority:"NRS 684A.030, 684A.040, 684A.165, 684A.180",
    disclosureAuthority:"State-specific approved business process / counsel review",
    cancellationAuthority:"Contract/policy-specific — do not infer California rules",
    carrierNoticeAuthority:"Representation notice is an ADPA operational practice unless another controlling requirement applies",
    feeAuthority:"NRS 684A.180 record of fee/commission/compensation",
    solicitationAuthority:"Current Nevada law/rules must be verified before automated solicitation decisions",
    requirements:[
      "Verify applicable Nevada public-adjuster license before regulated activity.",
      "Public adjuster represents solely the insured's financial interests.",
      "Preserve investigations/adjustments and compensation records for at least three years after claim closure.",
      "Do not give legal advice; respect represented-party counsel restrictions.",
      "Do not import California contract/cancellation/solicitation rules into Nevada."
    ]
  }
};
