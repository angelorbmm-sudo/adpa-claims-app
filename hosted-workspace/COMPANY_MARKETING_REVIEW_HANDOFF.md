# Company marketing profiles and pages review — 2026-10-14

Canonical inventory area 1. The original inventory was recovered and read; area 1 is marketing profiles/pages, not industry setup. MODULE_REVIEW_STATUS.md now maps historical review sequence labels back to canonical workflow numbers. Conservative coverage: 40 of 52 canonical areas, 12 dedicated reviews remaining. Next: area 2 marketing design/posting connections.

## Changes

- Unfinished profile and social text block competing mutations that would replace them during refresh. Only the exact edited post can be saved/removed, and other edited posts must first be saved or discarded.
- Profile edits invalidate accuracy and publishing confirmations. Unsaved profile/social text guards navigation, company changes and refresh, with an explicit discard/reload action and browser unload warning.
- Synchronous mutation locking prevents repeated writes and edits during a write. Company selection is disabled during saves. Concurrent read results bind the active company and newest load request; both marketing and inquiry reads complete before replacing screen data.
- Confirmed saves, uploads and inquiry actions stay reported as saved if refresh subsequently fails. Submitted drafts clear after acceptance; rejected writes preserve them. Stale forms are hidden after accepted writes until an explicit successful refresh.
- Reviewed publication snapshots remain separate from draft profiles and logos. All three templates retain their reviewed content through profile edits and update only on explicit republication. Existing auth, company isolation, logo type/rights, inquiry consent and HTML/SVG escaping checks remain intact.

## Validation

651 automated tests passed, including three new regressions for competing drafts, write/refresh failure distinctions and frozen snapshots across all three templates. TypeScript passed; production build runs during publication packaging.

## Pending

Real browser/iPhone template review remains pending because supported browser QA is unavailable. Public hosting, company social connections, provider activation and marketing analytics are separate work. No outbound post, inquiry reply or client message was sent. The app remains owner-private.
