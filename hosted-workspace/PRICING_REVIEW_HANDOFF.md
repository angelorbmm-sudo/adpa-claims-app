# Replacement and service pricing review — 2026-10-13

Module 36 code cleanup completed.

- Pricing source triage and candidate/quote snapshots bind filename, MIME type, size, category and creation date. Legacy triage without the new source key must be repeated.
- Source review submits the file version opened by the reviewer. Candidate review and replacement approval submit the opened candidate snapshot; refreshed claim versions cannot silently authorize an older comparison.
- Final writes also require exact evidence metadata to remain unchanged throughout the operation. Inventory export reads the same metadata so approved proposals stay consistent across the pricing-to-package workflow.
- Malformed quantities (scientific notation, hex, whitespace and excess decimal precision) remain incomplete rather than displaying misleading totals. Pricing note inputs pause during saves to preserve the submitted review.
- Duplicate active pricing candidates for one destination record are flagged even when their physical keys differ. Invalid or unsafe extended quantities display incomplete totals.
- Price dates require real calendar timestamps with timezones, alongside the existing future/30-day freshness checks.
- Editing a public query resets its privacy confirmation. Unsaved pricing rows, queries and review notes have navigation protection and Copy; refreshing warns before discarding them.

Regression cases cover metadata changes, stale confirmations after claim refresh, duplicate targets, invalid dates/totals and source changes during approval. Full preparation suite, TypeScript and production build verify code behavior. The existing inventory-export/submission chain is included in the suite.

Integration pending: server AI/provider activation, Xactimate and Jose deployment/integration work. Live public lookup is conditional on server credentials. No live replacement prices were researched or certified in this cleanup, and proposals do not change claim values or payments.

Real-user validation pending: Angelo/Arman/Ana/Peter walkthroughs after Jose's prerequisites; independent code/security review, mobile/recovery/performance checks and a controlled pilot remain launch gates.

Ledger: 23 of 52 reviewed; 29 remain. Next: construction scope comparison.
