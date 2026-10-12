# Policy coverage and depreciation review

Open `/policy?id=<claim UUID>` from the dashboard or saved claim. The module supports dwelling, other structures, personal contents, ALE, and a separate Ordinance or Law / Code Upgrades bucket.

Human reviewers record coverage availability, ACV/RCV/other settlement terms, fixed or percentage limits, the reviewed base coverage amount, deductible, RCV and depreciation references, recoverability and proof conditions, policy deadlines and their date basis, endorsements/exclusions/duties, and original PDF/page/excerpt evidence. Unknowns remain unknown. The page does not infer coverage or recovery entitlement from a settlement label.

The percentage calculator has no default 10% or 20% assumption. Applying a percentage requires the current base bucket limit to match the saved reviewed basis. Base changes make the review stale and block application. RCV less depreciation is a valuation reference; the module does not turn it into a net payment or aggregate deductibles across coverages.

Saving preserves claim buckets and records a server-authenticated revision/history in `policyReview`. Applying is a separate action and changes only that bucket's limit/name/source metadata. Existing requested, issued, received and depreciation entries are preserved. The first four bucket positions remain stable; Ordinance or Law is appended fifth. The workspace hydrates all saved buckets rather than dropping entries after the fourth.

Policy writes enforce authenticated ownership, origin checks, source ownership/type, request/claim size limits, record validation and optimistic claim version checks. Normal claim editing cannot rewrite the server-recorded policy review history. Policy changes invalidate existing material approval-package hashes through the existing authority context mechanism. A source acknowledgment is a human review record, not a verified licensing or release grant.

Automatic extraction remains pending AI activation. The document preparation adapter can draft source-linked policy findings once its server key is configured; those findings require original-document checking and entry into this module. No live model extraction or policy interpretation accuracy was claimed during implementation.

Validation: `node scripts/test-preparation.mjs` runs 16 policy/preparation tests covering calculations, separate valuation/payment references, owner/origin isolation, source validation, history guards, draft/application separation, fifth-bucket preservation and stale-base blocking, as well as preparation safeguards.
