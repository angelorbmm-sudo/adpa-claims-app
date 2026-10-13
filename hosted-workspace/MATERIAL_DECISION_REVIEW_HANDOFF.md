# Material decision review — 2026-10-13

Reviewed module 30: contractor material drying, removal and cleaning decisions.

- Current reviews now invalidate when original filename, MIME type, size, category or creation date changes. Source-key version 2 makes older reviews require fresh source review.
- Losing access to the latest linked scope task cannot resurrect an older reviewed assessment. Authorized users see a review gap; inaccessible task links, reviewer notes and actor details are withheld.
- Review submissions carry the prior review ID; a newer recorded review rejects an outdated submission without overwriting history.
- Supporting explanations recompute gaps for the selected readings and scope tasks, distinguish those links from the saved review, and refuse superseded material decisions.
- Unsaved notes can be copied or cleared, navigation warns about edits, and generated drafts disappear when their inputs change.

Validation: complete preparation test suite, TypeScript and production build. Added regression coverage for source metadata, inaccessible latest review privacy, changed draft links, superseded decisions, concurrent review tokens and draft fingerprints. See release results for exact passing count.

No provider activation or automatic restoration judgment is included. Arman field validation and live browser/phone walkthrough remain deferred. Source review records contractor judgment; it does not certify safety, coverage, prices, Xactimate mapping or drying completion.

Ledger: 17 of 52 review areas completed; 35 remain. Next: equipment quantities and duration.
