import React, { useMemo } from "react";
import { REPRESENTATION_RULES, caCancellationDue, caInsurerNoticeDue } from "../lib/representationRules.js";

export default function RepresentationContractCenter({claim,onChange}){
  const state=claim.jurisdiction||"CA";
  const r=claim.representation||{};
  const rules=REPRESENTATION_RULES[state];
  const cancellationDue=state==="CA"&&r.signedDate?caCancellationDue(r.signedDate,!!r.catastrophicDisaster):"";
  const carrierNoticeDue=state==="CA"&&cancellationDue?caInsurerNoticeDue(cancellationDue):"";
  const blockers=useMemo(()=>{
    const b=[];
    if(!r.templateVerified)b.push("Approved/current contract template not verified");
    if(!r.signedDate)b.push("Contract signing date missing");
    if(!r.insuredCopyDelivered)b.push("Insured copy delivery not verified");
    if(state==="CA"&&!r.disclosureBeforeSigning)b.push("§15027(v) disclosure-before-signing not verified");
    if(state==="CA"&&!r.cancellationNoticeDelivered)b.push("Notice of Cancellation delivery not verified");
    if(!r.feeTermsVerified)b.push("Fee terms / required initials not verified");
    if(state==="CA"&&r.cancellationExpired&&!r.carrierRepresentationNoticeSent)b.push("Carrier representation notice not recorded");
    return b;
  },[r,state]);
  const patch=(k,v)=>onChange({...r,[k]:v,lastReviewedAt:new Date().toISOString()});
  return <section><h1>Representation Contract & Cancellation Control</h1>
    <p>State-aware engagement gate. California uses the CDI-approved ADPA contract/disclosure workflow; Nevada remains separately controlled and must not inherit California terms.</p>
    <div className="stats"><div className="stat"><small>State</small><b>{state}</b></div><div className="stat"><small>Representation gate</small><b>{blockers.length?"HOLD":"CLEAR"}</b></div><div className="stat"><small>Cancellation due</small><b>{cancellationDue||"Review"}</b></div><div className="stat"><small>Carrier notice due</small><b>{carrierNoticeDue||"Review"}</b></div></div>
    {blockers.length>0&&<div className="notice"><b>HOLD:</b> {blockers.join(" · ")}</div>}
    <div className="grid panel">
      <label>Contract signed<input type="date" value={r.signedDate||""} onChange={e=>patch("signedDate",e.target.value)}/></label>
      <label>Contract template ID / version<input value={r.templateVersion||""} onChange={e=>patch("templateVersion",e.target.value)} placeholder={state==="CA"?"ADPA CDI-approved form":"Nevada form/version"}/></label>
      <label className="checkbox-label"><input type="checkbox" checked={!!r.templateVerified} onChange={e=>patch("templateVerified",e.target.checked)}/>Approved/current template verified</label>
      {state==="CA"&&<label className="checkbox-label"><input type="checkbox" checked={!!r.disclosureBeforeSigning} onChange={e=>patch("disclosureBeforeSigning",e.target.checked)}/>§15027(v) disclosure delivered before signing</label>}
      <label className="checkbox-label"><input type="checkbox" checked={!!r.insuredCopyDelivered} onChange={e=>patch("insuredCopyDelivered",e.target.checked)}/>Signed original/copy delivered to insured</label>
      {state==="CA"&&<label className="checkbox-label"><input type="checkbox" checked={!!r.cancellationNoticeDelivered} onChange={e=>patch("cancellationNoticeDelivered",e.target.checked)}/>Notice of Cancellation delivered</label>}
      {state==="CA"&&<label className="checkbox-label"><input type="checkbox" checked={!!r.catastrophicDisaster} onChange={e=>patch("catastrophicDisaster",e.target.checked)}/>Property loss in qualifying catastrophic disaster area</label>}
      <label>Fee / compensation terms<input value={r.feeTerms||""} onChange={e=>patch("feeTerms",e.target.value)} placeholder="e.g. approved contract percentage/base"/></label>
      <label className="checkbox-label"><input type="checkbox" checked={!!r.feeTermsVerified} onChange={e=>patch("feeTermsVerified",e.target.checked)}/>Fee provision and required insured initials verified</label>
      <label>Contract evidence reference<input value={r.contractEvidenceRef||""} onChange={e=>patch("contractEvidenceRef",e.target.value)}/></label>
      <label>Disclosure evidence reference<input value={r.disclosureEvidenceRef||""} onChange={e=>patch("disclosureEvidenceRef",e.target.value)}/></label>
      {state==="CA"&&<label className="checkbox-label"><input type="checkbox" checked={!!r.cancellationExpired} onChange={e=>patch("cancellationExpired",e.target.checked)}/>Cancellation period verified expired</label>}
      {state==="CA"&&<label className="checkbox-label"><input type="checkbox" checked={!!r.carrierRepresentationNoticeSent} onChange={e=>patch("carrierRepresentationNoticeSent",e.target.checked)}/>Insurer/adjuster/attorney representation notice sent</label>}
      <label>Representation notice evidence / message ID<input value={r.carrierNoticeEvidenceRef||""} onChange={e=>patch("carrierNoticeEvidenceRef",e.target.value)}/></label>
      <label>Third-party compensation disclosure / conflict review<textarea value={r.thirdPartyCompensationNotes||""} onChange={e=>patch("thirdPartyCompensationNotes",e.target.value)}/></label>
    </div>
    <div className="panel"><h2>Controlling guardrails</h2>{rules.requirements.map((x,i)=><p key={i}>• {x}</p>)}<small>{rules.contractAuthority} · {rules.disclosureAuthority} · {rules.cancellationAuthority} · {rules.carrierNoticeAuthority}</small></div>
    <p className="notice">Calculated dates are operational aids. California business-day/holiday treatment and disaster status must be verified before relying on a deadline. The approved contract wording itself should be stored as a versioned, read-only template rather than regenerated by AI.</p>
  </section>
}
