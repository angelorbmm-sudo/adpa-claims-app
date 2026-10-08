# ADPA mitigation and cleaning research / implementation

Prepared October 8, 2026. Reviewable prototype implementation; not deployed to the older hosted app. Real-client production remains on HOLD pending the existing readiness work.

## Research completed

Located 169 emails involving Arman Darbinyan / A&S Water Restoration. Verified business email: aswaterrestoration23@gmail.com; website: https://www.callaswater.com/. The supplied email omitted an r. Reviewed selected correspondence and attachments, not every email or attachment. Gmail intermittently rate-limited additional reads.

Primary examples included a final mitigation package, initial and revised scopes, moisture charts, signed service/completion records, before/after demolition photographs and a carrier bill review. Private claim photographs and documents are not embedded in the repository. Dates and conclusions from those examples must never be imported into another claim.

Observed strengths: room/test-point labels, visible instrument readings, protected furniture/cabinets, equipment-placement photographs, demolition progression, documentation of authorization and completion. Photographs prove only what they show; they do not establish all quantities, equipment duration, water category, hidden damage, safety or payment entitlement.

Recurring proof gaps: added affected rooms need dated discovery support; wet-damage removal must be distinguished from access and reconstruction matching; scope narratives must reconcile with measured quantities; equipment deployment/removal timestamps and counts must reconcile with billed days; disputed detach/reset work needs item-specific necessity and extent. Carrier objections are recorded positions requiring review, not universal estimating rules or automatic deductions.

## Public guidance and implications

| Primary source | Finding used in the design |
| --- | --- |
| [IICRC S500](https://iicrc.org/s500/) | Public water-restoration scope includes assessment, psychrometry, equipment, documentation and specialist needs. Track project-specific goals and evidence; do not claim full-standard compliance from a checklist. |
| [IICRC weather position statement](https://iicrc.org/wp-content/uploads/2026/04/Weather-Related-Position-Statement_2026.pdf) | Weather/top-down intrusion does not automatically determine Category 3. Require qualified factual assessment. |
| [IICRC S520](https://iicrc.org/s520/) | Mold remediation involves qualified assessment, procedures and verification; capture specialist reports and disposition. |
| [IICRC S700](https://iicrc.org/s700/) | Fire/smoke work requires loss-specific assessment; unusual events and materials may need additional expertise. |
| [IICRC S320](https://iicrc.org/s320/) | Still in draft development/public review on the research date; do not represent it as a published standard. |
| [EPA mold guide](https://www.epa.gov/mold/mold-remediation-schools-and-commercial-buildings-guide-chapter-3) | Clean-water drying guidance is preventive guidance, not a coverage deadline or automatic disposal rule. Biocides do not substitute for removal of contamination. |
| [CDC/NIOSH mold assessment](https://www.cdc.gov/niosh/mold/testing-remediation/index.html) | No health-based indoor mold standards; routine air sampling has limits. A negative sample alone does not establish a safe environment. |
| [OSHA flood response](https://www.osha.gov/flood/response) | Electrical, structural, chemical and other hazards require appropriate worker safeguards and qualified review. |
| [EPA asbestos](https://www.epa.gov/asbestos/protect-your-family-exposures-asbestos) | A photograph cannot identify asbestos; suspected materials require appropriate professional assessment before disturbance. |
| [EPA lead RRP](https://www.epa.gov/lead/lead-renovation-repair-and-painting-program) | Review applicability to older painted buildings and the actual work; do not presume a blanket emergency exemption. |
| [EPA ozone](https://www.epa.gov/indoor-air-quality-iaq/ozone-generators-are-sold-air-cleaners) | Ozone presents respiratory risks; odor removal is not a safety or decontamination certification. |

Public summaries and agency guidance were accessed. Full paid IICRC standards were not accessed. These sources inform evidence controls; this work does not constitute a standards compliance audit or legal coverage opinion.

## Implemented

Dedicated Mitigation & Cleaning module with affected zones, comparable moisture logs, equipment duration, measured demolition/service scope, cleaning QA, contents inventory/custody, specialist reports and invoice support. All sources must reference verified documents belonging to the same claim and specify a page/photo/record locator.

Drying comparison preserves material, test point, instrument, method and scale. Material removal cannot be treated as a comparable drywall reading. Equipment time uses explicit UTC/offset timestamps and elapsed hours; billed differences require explanation rather than automatic rounding or deduction. Scope quantities reconcile with recorded dimensions; no universal two-foot flood cut. Antimicrobial records require label/SDS and applicability review. Contents disposal requires supporting authorization; returns require documented counts and ordered custody.

Invoices are service records only. They do not automatically alter coverage allocations, payment totals, settlement or depreciation. Owner authorization, contractor QA, carrier position and payment remain distinct.

Unresolved records feed the work queue, deterministic AI preparation, closure and server release/closure checks. Package snapshots preserve the mitigation record. Human review binds to the recorded evidence version and becomes stale when records or document manifest change. Claims without this workstream remain unaffected.

## Limits and next operational checks

This module organizes evidence; it does not direct hazardous field work, certify worker qualifications, prove a safe environment, determine legal entitlement or authenticate a typed reviewer name. Existing production controls, evidence custody, professional permissions and external integrations remain separate readiness requirements. No outbound email or new e-sign integration was activated.

The GitHub React/Vite application and the older hosted Vinext app have different source trees. Changes are preserved in a separate GitHub review branch rather than overwriting the hosted app. Merge/deployment requires selecting the correct app lineage and the existing deployment/readiness process.

Validation: 94 automated tests passed; Vite production build passed. Tests cover elapsed equipment usage, explicit timezone requirements, verified-source gating, version-bound reviews, comparable moisture scales, scope arithmetic, invoice support and custody event order. Local runtime was Node 24; repository declares Node 22. Node 22 CI and device/browser acceptance remain deployment checks. Existing large-bundle warning remains.
