// ADPA state compliance knowledge: operational guardrails, not legal conclusions.
// Last reviewed against primary regulator/statutory sources: 2026-10-06.
export const STATE_COMPLIANCE = {
  CA: {
    name: "California",
    regulator: "California Department of Insurance",
    publicAdjusterAuthority: "California Insurance Code §§15000 et seq.",
    licenseRule: "Public-adjuster activity requires an applicable California public-adjuster license.",
    contractRule: "Before acting as a public insurance adjuster, use a written Commissioner-approved contract executed in duplicate; provide the separate §15027(v) disclosure before contract signing.",
    recordRule: "Preserve the executed representation file and claim records under applicable California requirements and ADPA retention policy.",
    legalAdviceRule: "Coverage/legal conclusions that require legal advice must be escalated to counsel; ADPA AI prepares claim analysis, not legal advice.",
    sources: [
      { label: "CDI Public Adjuster licensing / approved contract requirements", url: "https://www.insurance.ca.gov/0200-industry/0050-renew-license/0200-requirements/public-adjuster/App-Procedures-Individual-Residents.cfm" },
      { label: "CDI §15027(v) disclosure", url: "https://www.insurance.ca.gov/0200-industry/0050-renew-license/0200-requirements/upload/DISCLOSURE.pdf" },
      { label: "CDI Fair Claims Settlement Practices Regulations", url: "https://www.insurance.ca.gov/01-consumers/130-laws-regs-hearings/05-CCR/fair-claims-regs.cfm" }
    ]
  },
  NV: {
    name: "Nevada",
    regulator: "Nevada Division of Insurance",
    publicAdjusterAuthority: "NRS Chapter 684A; NAC Chapter 684A",
    licenseRule: "A person acting as a public adjuster in Nevada must hold the applicable Nevada public-adjuster license; a public adjuster represents solely the insured's financial interests.",
    contractRule: "Representation authority and compensation documentation must be verified before regulated public-adjuster work. Nevada-specific contract requirements must be confirmed against the current approved business process before release.",
    recordRule: "NRS 684A.180 requires adjustment/investigation records to be retained at least three years after claim closure.",
    legalAdviceRule: "NRS 684A.165 prohibits an adjuster from giving legal advice and restricts direct dealings with represented persons without counsel consent.",
    sources: [
      { label: "Nevada DOI Public Adjuster", url: "https://doi.nv.gov/Licensing/License_Types/Adjuster/Public_Adjuster/" },
      { label: "NRS Chapter 684A", url: "https://www.leg.state.nv.us/NRS/NRS-684A.html" },
      { label: "NAC Chapter 686A claim practices", url: "https://www.leg.state.nv.us/NAC/NAC-686A.html" }
    ]
  }
};

export const LIFECYCLE_STAGES = [
  "Intake / Jurisdiction",
  "Representation / Contract",
  "Policy Collection & Analysis",
  "Coverage / Causation",
  "Evidence / Inspection",
  "Dwelling / Other Structures",
  "Contents / LKQ",
  "ALE / Loss of Use",
  "Mitigation",
  "Code / Ordinance",
  "Proof of Loss",
  "Estimate / Valuation",
  "Carrier Response / Negotiation",
  "Payments / Depreciation",
  "Supplement / Dispute",
  "Appraisal / Regulatory / Counsel Escalation",
  "Mortgage / Loss Draft",
  "Recovery / Replacement",
  "Settlement / Release",
  "Closure / Retention"
];

export const ISSUE_TYPES = [
  "Coverage","Causation","Scope","Quantity","Quality / LKQ","Pricing","Depreciation",
  "Code / Ordinance","Contents","ALE / Loss of Use","Mitigation","Payment","Proof of Loss",
  "Mortgage / Loss Draft","Other"
];

export const ESCALATION_LEVELS = [
  "Evidence / clarification",
  "Written reconsideration",
  "Supervisor review",
  "Formal dispute / supplement",
  "Licensed PA escalation review",
  "DOI complaint consideration",
  "Appraisal consideration",
  "Counsel review"
];

export function complianceStatus(claim) {
  const c = claim.compliance || {};
  const blockers = [];
  if (!claim.jurisdiction) blockers.push("Jurisdiction not confirmed");
  if (c.licenseStatus !== "Verified") blockers.push("PA license not verified for claim jurisdiction");
  if (c.contractStatus !== "Executed") blockers.push("Representation contract not executed/verified");
  if (claim.jurisdiction === "CA" && c.disclosureStatus !== "Delivered before contract") blockers.push("California pre-contract disclosure sequence not verified");
  if (c.cancellationStatus === "Open") blockers.push("Client cancellation period still open — review before irreversible action");
  if (!c.policyStatus || c.policyStatus === "Missing") blockers.push("Policy not collected");
  return { cleared: blockers.length === 0, blockers };
}
