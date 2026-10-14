# Company My Jobs and focused navigation review — 2026-10-14

Canonical area 12 completed. Ledger: 45 of 52 canonical areas covered; 7 dedicated reviews remain. Next: area 17 In-app conversations and appointments.

## Changes

- Automatic and manual job refreshes share a request-generation gate. Older responses/errors cannot replace a newer refresh or a different company/page. Manual refresh is locked against duplicate operations; pagination is disabled during it. Auto refresh continues only while the page is visible and a manual refresh is not in progress.
- The Start here card and job list use the same stable order: actionable jobs, valid earlier task due dates, next visits, name and identity. Invalid legacy dates stay outside due priority and invalid displayed timestamps say Time needs review instead of crashing the page. Work summaries choose earlier valid actionable due dates within their existing request/crew priorities.
- Shared cards only include specialist task summaries when that company has the supported specialist workspace. Unavailable specialist tasks cannot be advertised with a misleading shared Tasks link. Approved shared tasks and inspection answers keep their existing focused destinations.
- Duplicate active shared participation no longer suppresses a valid independent specialist assignment. Such duplicated participation still grants no company access. Technician assignments retain member-specific task filtering.
- Before returning job cards, the server rechecks selected company owner/version/material state and displayed shared/claim material snapshots. Revocation or same-version facts/permissions changes during projection reject the response instead of returning an outdated card set.
- Existing bounded independent cursors, authorization, invitation/approval privacy, current engagement deduplication and loaded-page count/search wording remain intact. No new permissions or work authority is granted.

## Validation

685 automated tests passed, including seven new regressions for obsolete refresh/page results, consistent stable priority and invalid timestamps, valid due-date summary selection, same-version company revocation, changed shared property snapshots, duplicate-participation assignment fallback and unavailable specialist destinations. Existing company isolation, manager/technician routing, before-approval withholding and multi-page job tests pass. TypeScript passed; production build runs during packaging.

## Pending

Browser/iPhone navigation and real multi-user/performance validation remain pending because supported browser QA is unavailable. Counts and searches cover the loaded pages; the page is not a whole-company reporting engine or real-time revocation monitor. Provider activation and deeper workflows for additional trades remain separate work. No real assignment, message, invitation or payment was changed. Owner-private access is preserved.
