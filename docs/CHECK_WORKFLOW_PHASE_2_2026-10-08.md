# Check processing phase 2 — completed testing features

Open a selected claim → Check Processing. Register a check and save its details before editing parties or adding reports. The public demo accepts sample data only.

## Completed

- Original check records carry claim number, insured, property, carrier, date of loss, jurisdiction and document references from the selected claim. Review the imported summary before submission. Existing claims do not have structured insured contact fields; participant email/phone entry is available in the new tab.
- Named check payees remain separate from additional distribution recipients. Add contractors, ADPA, clients or other recipients without changing the printed payee line. Existing payment allocations and historical check records remain compatible. Recipient identities with recorded allocations cannot be replaced by another person.
- Parties & client review supports dollar or percentage split entry. Percentage calculation uses integer basis points and integer cents, rounding half up. Full allocation and valid email contacts are required before preparing a review preview; final cents can be assigned by dollar amount. No default ADPA fee percentage is assumed.
- Review previews preserve participant identities, contacts, each party's amount, and the allocation snapshot. Changed names, contacts, amounts, route or allocations mark earlier previews stale. Prior versions remain in the record. Public demo users can simulate acceptance or decline. These simulations are explicitly labeled and do not create verified approval, identity, signatures or settlement authority.
- The $96,000 two-party example is available as a dedicated synthetic sample. It has ADPA and homeowner payees, with no mortgage-company payee. All splits are entered by the tester.
- From a saved original lender-monitored check, Register lender draw creates a separate check linked to the original. The user confirms exact payees and amount. ADPA can be an additional recipient without being printed on the draw. Fees and allocations do not copy automatically. Draws cannot link to carrier-ledger rows; original face amount cannot be exceeded by linked draw amounts plus original availability reports. Original lender comparisons account for reported draw availability.
- Existing reported funding/payout workflow includes additional recipients. ADPA fee-evidence checks apply even when ADPA is an additional recipient instead of a printed payee.

## Connection boundaries

No emails or texts are sent. The disabled invitation control is intentional: José must connect verified identities, secure expiring invitation links, email delivery, version-bound consent and revocation/re-approval before real client invitations. Prepare preview is a local workflow action, not sending or collecting an enforceable signature. Operational recording by Claims Staff does not grant PA settlement-release authority.

Bank enrollment is visibly pending, with no editable bank account or password fields. The intended delivery model is direct transfers to recipient bank accounts after confirmed available funds and independent required approvals. Timing, supported rails and charges depend on ADPA's banking agreement. There is no customer wallet withdrawal flow in this prototype.

Original image capture/storage remains pending secure custody. Existing image-reference fields point to external secure records. The module never transmits a check, endorses for another person, deposits funds, deducts fees or initiates transfers. Frontend validation supports testing; production requires server-owned immutable state and approvals, tenant/claim access checks, provider event reconciliation, idempotency, return/reversal handling and accounting integration described in the original José handoff.

## Validation

`npm test`: existing regressions plus contractor/non-payee recipients, percentage rounding, full-split review readiness, contacts, stale review fingerprints, recipient identity preservation, monitored-parent draw links, draw/availability caps, carrier-ledger separation, ADPA fee evidence and linked-draw reconciliation. `VITE_DEMO_MODE=true GITHUB_ACTIONS=true npm run build` builds the demo.
