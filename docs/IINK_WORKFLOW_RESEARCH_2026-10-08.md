# iink workflow research and ADPA requirements

Research date: October 8, 2026. Primary sources: iink's current help center, product pages, pricing, homeowner guide and webinar descriptions. These are descriptions of iink, not confirmation that ADPA's bank supports the same capabilities. Webinar pages were located; the underlying recordings/transcripts were not accessible through the research results. Findings below are grounded in written documentation, not claimed video viewing.

## Angelo's intended experience

ADPA operates one public adjusting firm and processes its own represented claims. A $96,000 check payable to ADPA/Angelo and the insured is the two-party example. Existing claim information should carry into processing. Capture front and back images, identify each party and contact, propose percentage or dollar allocations, and show the insured their expected proceeds before enrollment/acceptance. Each recipient should securely connect their own bank account. Desired delivery is direct to the designated accounts after confirmed clearance/availability and required approvals, without a customer wallet withdrawal step. Amounts, transfer timing and any fees must be transparent. These are product requirements, not implemented bank functionality.

## Verified mechanics

### 1. Parties, signatures and recipients are separate concepts

iink defines a stakeholder as a person/entity on the check or receiving funds. Professionals can be signers, approvers or viewers. A mortgage company named on the check needs to endorse but can have a zero-dollar allocation. The issuing carrier is informational and does not approve. A contractor absent from the payee line may receive an allocation with other stakeholders' approval. Their example allocates 10% to the public adjuster and 90% to a roofer, with zero to homeowners and mortgage company. This is an example, not a prescribed ADPA split. Dollar or percentage entry is supported. [1][2]

### 2. Client review precedes connected-bank delivery

The professional uploads the check or requests images from the homeowner. The homeowner receives email/text links to review and approve, creates an account, connects a bank account if receiving funds and tracks progress. Funds are electronically distributed after clearance and approvals. [3]

### 3. Mortgage handling branches

The servicer determines whether to monitor. In the non-monitored route, the lender endorses/returns the original check, the endorsement image is uploaded, and the check proceeds to deposit and distribution. Monitored funds go to restricted escrow and are released by repair milestones; inspection and release cycles repeat. Published $40,000 and milestone examples must not become automatic eligibility or release rules. Requirements vary by lender. [4]

### 4. Original checks and draw checks need different records

iink explicitly distinguishes the already-endorsed insurance check from a new lender draw check. For the first, upload the endorsed back image for deposit. For a draw, add a new disbursement-check record. [5]

### 5. Contractor paperwork and ADPA fees remain distinct

Monitored claims may need the carrier scope/estimate or settlement documentation, contractor agreement, W-9, license/insurance information, lien waivers and draw schedules. Inspections support later releases. A contractor can request inclusion on draw checks through its agreement/direction of payment, but inclusion is not guaranteed. iink notes that public adjusters are often absent from lender-issued disbursement checks; their representation agreement supports the fee owed. ADPA's fee treatment therefore needs a separate authorized plan rather than assuming its name or fee automatically carries onto each draw. [6]

### 6. Wallets and direct transfers coexist in iink's present documentation

Current pricing lists standard ACH and automatic bank transfers on selected plans; instant RTP has a separate plan-dependent percentage charge. A separate wallet guide describes verified bank linking and withdrawal via ACH/RTP. This supports Angelo's wallet experience while also showing direct-transfer capabilities in today's product. It does not establish which options his previous plan offered. ADPA's provider must confirm its own pricing and supported routes. [7][8]

## Changes required in ADPA — design recommendations

The deployed October 8 module is a tracking prototype. It does not yet provide the full customer process above.

| Area | Required extension |
| --- | --- |
| Participants | Separate stakeholder directory from each check's exact named payees. Add contractor role, email/phone, signer/approver/viewer responsibilities and recipient status. Do not label an unnamed contractor as a printed payee. |
| Claim reuse | Prefill insured(s), carrier, claim number, property, loss details, lender contacts and existing document references. Require a review of imported facts. |
| Allocations | Percentage and dollar inputs; exact-cent rounding; explicit gross amount, fee treatment and net share; full allocation validation before requesting acceptance. Never imply a proposed split is available money. |
| Acceptance | Versioned distribution statement, individual identity-bound approvals, decline/dispute path and renewed approval after changes. Keep processing consent, check endorsement, client distribution consent and licensed-PA release authority distinct. |
| Banking | Provider-hosted verification/tokenized destinations, identity matching and confirmed available funds. No raw account credentials in browser storage or public demo. Separate permissions for preparing, approving and executing disbursements. |
| Lender handling | Confirmed monitored/non-monitored route, configurable requirements, permission to communicate, shipping/receipt tracking, inspections, draw requests and lender-issued checks linked to their original claim payment. |
| Accounting | Original face amount, lender-held balance, individual cleared draw, available amount and completed payouts must reconcile without counting draw proceeds twice as new carrier money. Preserve revisions and exceptions. |
| Fee recovery | Preserve ADPA's contractual receivable and approved fee treatment when absent from a draw; prevent repeated application of the full original-check fee to every installment. |
| Delivery | Direct-bank delivery as the intended default. Show actual provider fees, expected arrival, failed-transfer handling and confirmation. No promise of universal instant/free transfers. |

## José's concrete dependencies

iink identifies itself as an authorized third-party sender of Avidia Bank and attributes money transmission to that bank. Operating an ADPA app with an existing ADPA bank account does not, by itself, establish equivalent multi-payee deposit or transfer functionality. José must confirm a bank/provider arrangement supporting ADPA's intended custody, endorsed-check capture, lender routing and authorized distributions. [4]

The prototype must gain server-owned state, identity/claim access enforcement, verified licensed-PA authority, secure image custody, bank/lender confirmations, immutable actor-attributed approvals, idempotent posting and return/reversal handling before live transactions. A typed reference is not a bank-confirmed endorsement, clearance or approval. Staff recording activity does not grant settlement-release authority.

## Source links

1. [Who should be listed as a Stakeholder?](https://help.iink.com/en/knowledge-base/who-should-be-listed-as-a-stakeholder)
2. [Non-payees may be recipients with approval](https://desk.iink.com/portal/en/kb/articles/can-someone-who-is-not-listed-as-a-payee-on-the-check-be-added-as-a-stakeholder)
3. [Homeowner process](https://iink.com/resources/homeowners)
4. [Guided process and banking attribution](https://iink.com/resources/how-it-works)
5. [Handling lender-endorsed checks and draw checks](https://help.iink.com/en/knowledge-base/handling-checks-received-from-the-mortgage-company)
6. [Loss draft requirements and contractor/PA treatment](https://help.iink.com/en/knowledge-base/what-is-a-loss-draft)
7. [Current pricing and bank-transfer options](https://iink.com/pricing)
8. [Wallet withdrawals](https://help.iink.com/en/knowledge-base/how-to-transfer-money-out-of-your-iink-wallet)
9. [Check submission practices](https://help.iink.com/en/knowledge-base/best-practices-for-submitting-a-check)

Further viewing located: [P&C Insurance Claims Payments Best Practices for PAs](https://blog.iink.com/webinars/pc-insurance-claims-payments-best-practices-for-pas) (April 14, 2025); [Reconnect with iink — Customer Insights](https://blog.iink.com/webinars/reconnecting-with-iink) (October 1, 2025); [Public Adjuster Best Practices in 2026](https://blog.iink.com/webinars/public-adjuster-best-practices-2026) (March 18, 2026). Their descriptions were reviewed; recording content was not verified.
