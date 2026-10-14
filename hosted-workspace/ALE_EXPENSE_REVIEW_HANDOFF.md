# ALE expense ledger review — 2026-10-13

The saved claim navigation now includes ALE expenses and the related Payment ledger. Legacy accounting source fragments were present but absent from the current served workspace; they are now integrated without replacing unrelated modules. `/claim?id=<claim-id>&view=ale` opens ALE directly.

Expense cost, normal deduction, reported submission, carrier approval/denial, actual vendor payment and assigned reimbursement remain separate. Current reviewed additional-cost subtotals deduct documented normal expenses and exclude unresolved/stale/duplicate records. Blank amounts stay unknown, explicit zero needs a basis, and real ordered period dates and whole-cent amounts are enforced on the server.

Expense, policy conditions, reported submission, carrier response and actual vendor payment each have separate original files, locators and human check controls. Normal-expense and displacement bases, owner, next action and follow-up are retained. A review snapshot binds current record, claim, bucket, linked payment/check and original metadata. New form changes or refreshed original metadata clear source checks; checked source keys bind the originals actually opened rather than silently taking new keys during submission. Coverage is not inferred.

Positive reimbursement assignments require checked linked-payment evidence and a separately documented received ALE reimbursement allocation. Issued money, unrelated categories, missing originals, stale managed checks and duplicate payment identities do not provide available capacity. Aggregate assignments cannot exceed received capacity. Source-backed differences above the related expense basis require explanation. Payment changes that strand assignments are rejected. No expense subtotal is added to payment totals or promoted to an amount owed.

Existing expenses cannot be deleted. Corrections require a reason and appended history; voids retain original facts and a reason. Server-stamped ALE audit records retain actor, time and previous version. Existing owner, origin, version and final evidence metadata guards remain. Preparation, package and authority views identify unresolved ALE records. Packages include the independent source/basis references.

ALE and payment form drafts cannot be omitted by clicking Save claim. Clear/edit actions guard unrecorded changes; ALE work can be copied. No carrier email, payment or submission is sent by this module.

Validation: 545 automated tests, TypeScript and inline script parsing must pass before publication; production build is required. Live browser/mobile and real-workflow walkthroughs with Angelo remain pending. Specialist verification and commercial release gates remain separate.
