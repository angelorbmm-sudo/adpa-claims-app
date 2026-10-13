# Module review 3 - ADPA onboarding review board

Reviewed the owner-only board's readiness summaries, internal follow-up freshness, provider indicators and editing/retry workflow.

## Changes
- Company follow-up snapshots now include client/template counts, setup/manager checks and provider-configuration booleans, alongside the company version. Changed summarized readiness facts require re-review even when the company record version has not changed.
- Policyholder snapshots include invitation expiry and published/open-request state. A pending invitation that expires over time makes the earlier follow-up stale without requiring a claim edit.
- Job snapshots include retained signed-agreement readiness and matched recovery identity. A completed contract does not make a mismatched client/property recovery job ready. Existing six-check readiness logic supplies the identity condition; the board still describes recovery workspace readiness, not safety/work/funding approval.
- Company rows show configured email/signature/text providers as Configured; live verification pending, with unconfigured services marked Needs activation. Credentials are not returned. Calling still requires separate integration.
- Added a page-scoped No stage blocker reported filter, keeping global source counts separate from page filters.
- Refresh source, keep my edits loads current blockers without discarding typed follow-up notes. If a row moved off the page or became inactive, existing edits stay open for copying rather than silently attaching to a different record. Failed refresh keeps an open editor visible; navigation guards protect unsaved notes.
- Loading disables source/page changes and save controls, preventing refresh/page races while preserving typed input.

## Bounds and verification
398 tests pass, including changed company facts without a company-version bump, expiry-driven follow-up staleness, property mismatch and provider-state/credential privacy. TypeScript and production build checked before publication. Browser and real-user UI testing remain deferred.

Snapshots track the board's summarized readiness facts and source versions, not every private document's bytes. Older saved snapshots may now require one re-review; no prior follow-up/history is overwritten by these projections. Resolving a note never removes source blockers, grants permissions, signs a contract or activates a provider. App access remains owner-private. No real client/company records or saved follow-up notes were changed by this build; no email/reminders sent.
