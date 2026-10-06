# ADPA Compliance & Claims Workflow Validation Tests

Run before production activation and after each material rule change.

## California
1. Ordinary contract: disclosure timestamp precedes contract signature; 3-business-day cancellation control; carrier representation notice due no later than 3 business days after cancellation expires.
2. Catastrophic-disaster contract: 5-calendar-day cancellation path; disaster status must be verified; solicitation restrictions tested.
3. Claim communication: 15-calendar-day clock only when communication reasonably suggests a response is expected; holiday/weekend end-date verification.
4. Claim notice: acknowledgment/forms/investigation clocks and exceptions.
5. Proof of claim: 40-calendar-day decision trigger and continuing-investigation notices.
6. Accepted payment: 30-calendar-day rule/exceptions.
7. First-party property: replacement-cost/LKQ/consequential damage and depreciation workflow tested against current policy/rules.
8. Disaster claim: loss/effective dates select correct current disaster rule set.

## Nevada
1. Verified active NV PA license required for regulated release action.
2. Pertinent claimant communication: 20-working-day clock.
3. Claim notice: 20-working-day acknowledgment/forms/investigation-start controls.
4. Investigation: 30-day completion standard with cannot-reasonably-complete exception.
5. Properly executed proof of loss: 30-working-day acceptance/denial; written policy basis for denial.
6. Additional investigation: initial 30-working-day notice, then 30-calendar-day continuing notices.
7. Accepted payment: 30-day payment/interest workflow.
8. Disputed claim: undisputed portion remains separately payable where payment can be made without prejudice.
9. Limitations warning: 60-day insurer-notice rule tested only in its applicable represented/unrepresented context; no AI legal conclusion.
10. Three-year post-closure retention control.

## Cross-state
- No California contract/cancellation rule leaks into Nevada.
- Every material issue has policy/evidence source or is marked unsupported.
- AI abstains on missing/conflicting policy/evidence.
- Critical events route to B6.
- 10% estimate variance is triage only, never auto-settlement.
- Client settlement authorization is separate from operational and PA approval.
- Substantive data change marks package stale and blocks release.
- Recoverable depreciation or lender-held funds block closure.
- Original evidence is preserved; corrections create versions.
- Every outbound material action has actor, role, authority, exact package/version, timestamp, and audit record.
- No automatic bad-faith/fraud accusation from missed clocks.
- Counsel gate activates for legal advice, litigation strategy, represented-party restrictions, privilege-sensitive work, and unsettled legal interpretation.
