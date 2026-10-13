# Water mitigation workspace / company dashboard review — 2026-10-13

## Changes
Water Scope Studio and the mitigation company dashboard now distinguish a confirmed server write from its following read refresh. After a write receipt, committed drafts/reset callbacks clear and a refresh hold blocks further changes. If refresh fails, the UI states that the work was saved and offers Retry refresh; it does not ask the user to resubmit the same mutation. Failed writes preserve drafts. This is receipt-based recovery, not general idempotency for a lost network response before confirmation.

A shared browser-safe saveThenRefresh helper enforces write → committed callback → refresh ordering. Company refreshes retain the mitigation-versus-contents workspace filtering used by initial load. Existing company/job versions and server role checks are unchanged.

Water job reads track the selected job and latest read sequence. A late response for an earlier selection cannot replace the current screen. A mutation requires loaded records matching the currently selected job. Saved refresh holds disable navigation/mutation controls until the current saved records reload.

Water form navigation uses the existing internal-link and unload guard. Unsaved root forms can be copied as clearly labeled notes before discard/reconciliation. The detailed ADPA mitigation screen also protects unsaved source-review notes, provides an explicit clear action, resets the note after saving, and prevents navigation to another job/module while it remains unsaved.

Water progress uses only the current role’s authorized evidence and visible scope lines. Unshared originals or hidden accepted scope records cannot make a company’s progress indicators appear ready. The existing mitigation company dashboard retains its assigned-job and manager/technician access checks. No new access, sharing consent or company assignment is created.

## Validation
442 automated tests passed, including confirmed write with failed refresh, failed write without draft clearing/refresh, write/clear/refresh ordering and participant progress with hidden originals/lines. Existing company/water suites cover invitations, crew isolation, source consent, review and optimistic versions. TypeScript and production packaging must pass before publication. Live browser/phone interaction testing remains deferred.

## Review scope and limits
This pass covers workspace save/navigation/recovery and role-specific progress. Arman’s daily drying logs, material decisions, equipment quantities/duration and their professional documentation rules are separate next review areas. No drying prescription, restoration certification, inferred scope quantity or price is added. AI/search/Xactimate/provider activation and real field validation remain pending with Jose/Arman.

Review inventory: 52 module/feature areas; 15 completed in this cleanup pass, 37 remaining after this task. These are mostly existing features to inspect, not 37 new module builds. Related areas may be reviewed together. Integrations and live walkthroughs remain separate release steps.
