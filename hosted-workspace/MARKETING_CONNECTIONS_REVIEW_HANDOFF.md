# Marketing design and posting connections review — 2026-10-14

Canonical inventory area 2 completed. Ledger: 41 of 52 canonical areas covered; 11 dedicated reviews remain. Next: area 7 Company clients and intake.

## Changes

- Setup-request account fields, design entries, posting plans and manual-post links protect against competing saves, navigation, company switching and refresh. Only the matching draft form may save while other forms are empty. Explicit discard/reload and browser unload protection are available.
- Confirmed writes clear only accepted entries before reloading. A subsequent refresh failure remains reported as saved; rejected writes retain entries. Synchronous mutation locking and disabled form controls prevent overlapping writes. Read results bind the active company and latest request.
- Editing design details resets rights confirmation. Canva links remain cleaned references, not copied design files or automatic account connections. Design changes made within Canva still require a manual recheck.
- Connection history retains before/after setup accounts, design details, review statuses, posting-plan approvals and manual reports, with actor/time. Deleted links and cancelled setup records remain in history. Private profile fingerprints are excluded from history snapshots. A readable history is available in the workspace.
- The shared marketing audit retains entries beyond its former 300-entry truncation. Both history collections have explicit 1,000-entry limits that reject additional updates while preserving old records. A 1 MB saved-state limit bounds record size.
- Final marketing writes bind exact original marketing state plus company owner/version/state, so same-version marketing edits or company-access changes cannot be overwritten.

## Validation

656 automated tests passed, including five new regressions for retained setup/design/plan details, frozen manual reports, history limits, concurrent material/access changes and competing connection drafts. Existing URL validation, stale-plan detection, rights checks, company isolation, post-network matching and no-provider-verification tests pass. TypeScript passed. Production build runs during packaging.

## Pending

Browser/iPhone walkthrough remains pending because supported browser QA is unavailable. Canva and Metricool company-specific activation, automatic publication/scheduling, analytics and provider-confirmed reports remain pending. A planned date is only a saved planning date; this workspace does not send reminders. No external post, setup notification or message was sent. Owner-private access is preserved.
