# ADPA Check Processing — test module and integration handoff

Implemented for one adjusting firm processing its own represented claims' jointly payable checks. Not a customer onboarding service or a marketplace. Open a claim → Check Processing → Try a sample check. Use synthetic data in the public demo. Each record belongs to the selected claim and persists using the existing workspace mechanism.

## Available now

Check register, exact named payees, reported endorsement methods/evidence references, mortgage route, external image references, bank/lender instructions, append-only UI event history, reported available funds, proposed distributions, externally reported payouts, reconciliation, and package snapshots. Money validation uses integer cents. Duplicate issuer/check references and reused ledger linkage are rejected within the claim. Reports cannot overallocate the face amount or exceed reported available funds. Return/void reports block additional funds/payout reports and preserve earlier reported payouts for investigation. Identity and payees are frozen after lender/bank events; reissues are separate records. Endorsement fields remain editable during lender intake and lock after deposit reports.

Existing ledger rows can be linked only at matching amounts. Ledger linkage remains editable for later matching and retains amount/duplicate checks. Check registration does not create ledger payments, update coverage received totals, post accounting journals, change mortgage balances, or satisfy financial closure gates. Split coverage checks require later reconciliation design. Bank/lender-held amounts are not presented as available money. Lender-monitored unreleased figure is a comparison against face amount, not a verified lender balance.

## Tracking boundaries

No bank API, check signing, endorsement execution, remote deposit, money transmission, fee deduction, settlement approval, or outgoing transfer is implemented. A typed client-authorization, PA-review, or fee-agreement reference is supporting metadata and supplies no authority. Payout rows describe reports of completed external transfers. References are not validated by the app. Original check images are not uploaded/stored; use references to images held in an appropriate secure system. Demo records live in the testing browser and are not shared accounts or a secure evidence archive. UI history is not a tamper-proof audit log.

## José's production connection work

1. Confirm ADPA's bank/account arrangement and supported multi-payee endorsements, lender deposit rules and client-funds handling with the chosen institutions/provider. Configure lender-specific monitored/unmonitored requirements; no universal dollar threshold is assumed. Generic document e-signature is not a substitute for a bank-accepted endorsement.
2. Activate verified identities, organization and claim assignment enforcement. Jason remains Claims Staff with no licensed-PA approval/release authority. Separate operational recording, licensed PA approval, client authorization, fee review, and transfer execution permissions. Apply jurisdiction/license verification and current-package approval gates on the server before any future live release; client JSON cannot establish authorization.
3. Replace browser reports with server-owned state transitions, validated schemas, immutable actor-attributed event history and revisions. Protect check fields in generic claim JSON writes; enforce these invariants independently on the server. Harden concurrent saves and correction/reversal handling. Current frontend checks are workflow guidance, not a financial security boundary.
4. Implement private encrypted image custody, scoped access, retention rules, secure bank delivery, provider-confirmed signatures/endorsements, idempotency, organization-wide duplicate presentment detection and reissue relationships. Never embed actual check images, account numbers or banking secrets in public assets.
5. Verify provider webhooks and reconcile authoritative deposit, clearance, return, hold/release and transfer events. Distinguish provisional credit from funds actually released for disbursement. Handle out-of-order events, returns after payouts, failed transfers, reversals and reconciliation exceptions.
6. Integrate ledger/coverage splits, lender draws and inspections, fees/client settlement statements, bank-statement reconciliation, and closure checks through idempotent postings. Prevent double counting against existing payment records. A ledger link alone is not a posted accounting transaction.
7. Add production integration tests for tenant isolation, permissions, license/package/client gates, immutable approvals, tampered payloads, concurrency, duplicate presentment, partial lender releases and return/reversal recovery before enabling bank actions.

## Testing

`npm test` includes exact money, endorsements, routes, duplicate linkage, bank report order, allocation/funding/payout caps, reference gates, immutable identity, returns and reconciliation tests. `VITE_DEMO_MODE=true GITHUB_ACTIONS=true npm run build` builds the public testing deployment. A sample check is explicitly synthetic and does not add ledger money.
