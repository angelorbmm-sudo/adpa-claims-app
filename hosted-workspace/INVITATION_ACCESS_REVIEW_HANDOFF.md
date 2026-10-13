# Module review 2 - Invitation and access recovery

Reviewed company staff invitations, policyholder dashboard invitations, account switching, renewal/correction/revocation, and the destination after acceptance.

## Changes
- Company navigation's `companyId` query now selects the intended company in the invitation hub. Canonical `id` takes precedence; policyholder selection never inherits a company ID.
- All company staff acceptance routes to the selected company's My Jobs page. Industry and technician access remain enforced by existing job APIs, rather than sending every non-contents company to the mitigation dashboard.
- Authorized live recipients see the company/property, assigned role and their own signed-in email before confirming. Company recipients receive no property address. Wrong accounts receive no invitation/workspace identity. Expired/revoked links expose no current property details.
- Recipient refresh/retry and manager refresh controls recover stale versions and transient load failures. Acceptance rechecks current invitation/version before mutation and clears its confirmation on failure/change. Successful acceptance navigates directly after the protected API commit; it no longer requires a second successful read before navigating.
- Status filters help managers find pending, accepted, expired and revoked records. Prepared links remain visibly selectable for manual copying; copying/preparing never becomes a delivery receipt. Refresh, record changes and new recovery actions clear the old prepared-link display.
- Unsaved correction entries use the existing navigation guard. The hub distinguishes a saved mutation followed by a failed refresh from an unsaved mutation.
- Invalid recorded pending expiration fails closed and requires renewal. Accepted access still follows revocation rather than pending expiry; legacy records with no expiry keep their prior behavior.
- Duplicate-recipient checks and renewed legacy addresses normalize email case. Renewal still refuses the acting account's own email. Replacement history and old identity/file isolation remain preserved.

## Limits and checks
394 regression tests pass, including destinations across company types, query selection, recipient-specific property disclosure, malformed expiry, normalized duplicate/renewal identities and existing permission/privacy workflows. TypeScript and production build checked before publication. Browser/iPhone acceptance testing remains deferred; provider invitation delivery and broader Site access are not activated. New filters, clipboard behavior, account switching and visual layout still need the live walkthrough.

No new recipients were invited, no email was sent, and no real company/claim records were changed by this build. App audience remains owner-private. Staff invitation acceptance does not sign a contract, hire a provider, grant every job, share evidence or approve settlement. Shared-job participation remains its separate signed-agreement/homeowner-approval workflow.
