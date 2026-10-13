# Equipment quantities and duration review — 2026-10-13

Module 31 cleanup completed.

- Equipment review source key version 2 includes original filename, MIME type, size, category and creation date, including the assigned room originals. Older source keys require a fresh review.
- Corrected field visits are excluded from supporting records even when a correction is outside the company view. The company sees the correction gap without the private correction facts.
- Review submissions must carry the current prior review ID. An outdated review token cannot append another review over newer history.
- Equipment drafts and review notes participate in unsaved navigation protection. Copy and Clear remain available if supporting records change, while further saves pause.
- Switching periods or starting a new edit cannot silently discard review notes. Supporting summaries are bound to current room, claim number, originals and records before copy/download.

Regression checks cover metadata, room originals, hidden correction privacy, outdated review tokens and draft freshness. TypeScript, full preparation test suite and production build are required for this release.

Actual elapsed hours, fixed-count unit-days, DST offsets, entered ongoing cutoffs and billing explanations remain the calculation basis. Missing visit dates remain review prompts, with no automatic charge deduction. No automatic equipment sizing, drying certification, Xactimate export, money approval or external sending was added.

Arman field validation and browser/phone walkthrough remain deferred. Jose provider activation is separate. Ledger: 18/52 reviewed; 34 remaining. Next: contents inventory and treatment.
