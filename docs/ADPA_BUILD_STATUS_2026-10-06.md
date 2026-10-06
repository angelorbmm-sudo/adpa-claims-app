# ADPA Build Status — 2026-10-06

## Claim-processing workflow now implemented in private master
- Intake and CA/NV jurisdiction.
- State compliance and representation/contract controls.
- Approved agreement packet workflow.
- Policy/endorsement analysis.
- Evidence engine and proof-plan standards.
- Coverage/valuation.
- Contents/LKQ.
- ALE/loss of use.
- Estimate comparison.
- Contractor commitment controls.
- Payment ledger.
- Final financial reconciliation.
- Communications.
- Carrier deadline clocks and warning windows.
- Issue files/negotiation.
- Critical events/EUO/appraisal/counsel gate.
- Supplements/disputes.
- Mortgage loss draft.
- Receipts/recoverable depreciation with disposition.
- Claim package version/hash and automatic stale-package invalidation.
- Operational/licensed/client approval and release gates.
- AI shadow preparation/abstention.
- Seven-bucket routing B0-B6 + Closed/Audit.
- Lifecycle/litigation-ready chronology.
- Claim Closure & Final Audit with reasoned reopen and exportable audit record.
- Portfolio command/work queue.

## Backend/security foundation implemented in code
- Express API and PostgreSQL schema.
- Organizations/users/members/RBAC.
- CA/NV jurisdiction persistence.
- Jurisdiction-specific PA-license records and server license gate.
- Audit events.
- Claim versioning and optimistic concurrency.
- Server release check and closure check.
- Migration preflight, explicit confirmation, skip-existing default and audited replacement mode.
- Object-storage abstraction remains disabled until provider is configured.
- Production data transition readiness screen and cutover/rollback runbook.
- CI frontend build plus backend syntax checks.
- Automatic private-repository Pages/demo deployment disabled.

## Intentionally NOT activated
- Live production PostgreSQL.
- Production identity provider.
- Production private evidence/object storage.
- Live client-data migration.
- Live outbound carrier email.
- Live DocuSign/e-sign integration.
- OpenAI API for autonomous claim decisions.
- Automatic settlement/release.
- Automatic legal conclusions or bad-faith accusations.

## Next production gate
Provision and validate the production infrastructure, then perform the staged cutover in docs/PRODUCTION_DATA_CUTOVER.md. Until that passes, localStorage remains the working data store and external delivery stays disabled.
