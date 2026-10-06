import React from "react";
import { STATE_COMPLIANCE, complianceStatus } from "../lib/stateCompliance.js";

export default function ComplianceCenter({ claim, onChange }) {
  const state = claim.jurisdiction || "CA";
  const rules = STATE_COMPLIANCE[state];
  const c = claim.compliance || {};
  const status = complianceStatus(claim);
  const patch = (key, value) => onChange({ ...c, [key]: value, lastReviewedAt: new Date().toISOString() });

  return <section>
    <h1>State Compliance & Authority Center</h1>
    <p>Operational gate for jurisdiction, licensing, representation authority, policy collection, and regulated-action review.</p>
    <div className="stats">
      <div className="stat"><small>Jurisdiction</small><b>{rules.name}</b></div>
      <div className="stat"><small>External-action gate</small><b>{status.cleared ? "CLEAR" : "HOLD"}</b></div>
      <div className="stat"><small>Open blockers</small><b>{status.blockers.length}</b></div>
      <div className="stat"><small>Rule set</small><b>2026-10-06</b></div>
    </div>
    {!status.cleared && <div className="notice"><b>HOLD:</b> {status.blockers.join(" · ")}</div>}
    <div className="grid">
      <label>PA license status<select value={c.licenseStatus || "Unverified"} onChange={e=>patch("licenseStatus",e.target.value)}><option>Unverified</option><option>Verified</option><option>Not applicable</option></select></label>
      <label>Representation contract<select value={c.contractStatus || "Pending"} onChange={e=>patch("contractStatus",e.target.value)}><option>Pending</option><option>Executed</option><option>Terminated</option><option>Needs review</option></select></label>
      {state === "CA" && <label>§15027(v) disclosure<select value={c.disclosureStatus || "Pending"} onChange={e=>patch("disclosureStatus",e.target.value)}><option>Pending</option><option>Delivered before contract</option><option>Needs review</option></select></label>}
      <label>Cancellation period<select value={c.cancellationStatus || "Needs review"} onChange={e=>patch("cancellationStatus",e.target.value)}><option>Needs review</option><option>Open</option><option>Expired</option><option>Waiver / exception requires review</option></select></label>
      <label>Policy status<select value={c.policyStatus || "Missing"} onChange={e=>patch("policyStatus",e.target.value)}><option>Missing</option><option>Requested</option><option>Received</option><option>Analyzed</option></select></label>
      <label>Licensed PA reviewer<input value={c.licensedReviewer || ""} onChange={e=>patch("licensedReviewer",e.target.value)}/></label>
      <label>Contract / disclosure evidence ref<input value={c.authorityEvidenceRef || ""} onChange={e=>patch("authorityEvidenceRef",e.target.value)}/></label>
      <label>State compliance notes<textarea value={c.notes || ""} onChange={e=>patch("notes",e.target.value)}/></label>
    </div>
    <div className="panel">
      <h2>{rules.name} guardrails</h2>
      <p><b>Authority:</b> {rules.publicAdjusterAuthority}</p>
      <p><b>License:</b> {rules.licenseRule}</p>
      <p><b>Representation:</b> {rules.contractRule}</p>
      <p><b>Records:</b> {rules.recordRule}</p>
      <p><b>Legal boundary:</b> {rules.legalAdviceRule}</p>
      <small>Primary sources are recorded in the code rule set. Legal/counsel review remains required where a claim turns on legal advice, litigation strategy, or unsettled interpretation.</small>
    </div>
  </section>;
}
