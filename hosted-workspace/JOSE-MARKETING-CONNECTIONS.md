# ADPA company marketing connections and creative workflow

## Implemented and available

`/marketing-connections` has three responsive views: Connections, Design library and Posting plan. It is linked from the Marketing Center's Connections tab and recommended company tools.

Accepted company managers / ADPA owner can download a company design brief, save owned Canva design links, record a visual review in Canva, combine a current reviewed design with a current reviewed social draft, approve a manual posting plan and record a manually published post URL. Setup requests for Canva and Metricool are company-private records, not messages or active provider connections.

All records are stored in the existing company_marketing JSON, protected by marketing and company version guards, same-origin POST validation and existing accepted-manager checks. New arrays default to empty for older records. No database migration is required. Provider account passwords or API tokens are not accepted by this UI or action schemas.

## Status semantics

- Company provider status: **Not connected in ADPA**. The owner's Canva connection in ChatGPT is separate and does not confer company provider access.
- Setup requested: an authorized manager's stored request only. No email/notification is sent.
- Design Draft / Reviewed: manager-confirmed link review, not automatic inspection or ownership verification by Canva.
- Draft plan / Approved for manual posting: private planning records. Dates use Pacific calendar dates; no timer, reminder delivery, scheduler or provider write occurs.
- Reported posted manually: manager attestation with a same-network HTTPS post URL. `providerVerified=false`. This is not an API receipt, verified success, or analytics result.

A reviewed plan stores the exact text and network plus profile / saved-design fingerprints. Edited company details, changed post text, removed design links or deleted posts make open plans stale and block approval or posting reports. Closed reports retain their original text and source link as history. External edits inside Canva cannot be detected, and the user is explicitly instructed to reopen and review the design before posting. Stored Canva URLs remove query/share tokens; users must have their own Canva access.

## Canva starter designs

A new three-page square editable draft pack was created through the owner's connected Canva account:
- Design ID: DAHXoWZhC-M
- Link: https://canva.link/doen9z624ii5f8p
- Pages: mitigation, contents care and reconstruction.

The pack uses company/contact placeholders and no client evidence. This is a draft creative resource in the owner's account, not a provisioned multi-company Brand Template or an embedded Canva integration. It was not auto-shared to companies. Text and three-page metadata were checked; visual polish and exact layout require review in Canva before production use. Generated visual UI mockups shown to the owner are illustrative, not browser screenshots or evidence of live integrations.

## Activation work remaining

Hosted visitor plugin eligibility tooling was not exposed during this session. Existing connector declarations were preserved. No hosted connector invocation, owner-credential sharing or unsupported provider authorization was added. Recheck Sites plugin eligibility and supported write consent before implementing a visitor-connector path.

For a production company integration, choose supported direct APIs or eligible visitor connectors, configure per-company identity / account-to-company mapping, handle authorization, revocation and secure token lifecycle, and prove tenant isolation with real accounts. Do not mark a stored account label or OAuth redirect as connected without a verified provider result. Define member access carefully when several managers use one company workspace.

Canva direct REST integration needs a registered developer app, explicit scopes and backend OAuth PKCE/token handling. See https://www.canva.dev/docs/apps/rest-apis/authentication/ . Blank placeholder text is not an autofill dataset: check supported Brand Template / autofill fields and account plan before promising automatic company substitution.

Metricool is still awaiting connection in ChatGPT. Custom app API access and embedded white label are separate. Official documentation currently lists API access on Advanced/Custom plans and white label for integrators on Custom plans; confirm current terms and pricing before purchasing. See https://help.metricool.com/mcp-vs-api-access-what-is-the-difference-5y3ib and https://help.metricool.com/metricool-white-label-for-integrators-u4jhq . Company-specific brand mapping, API scheduling, publication receipts, analytics, retries, reconnect/disconnect and callback handling are not implemented in this release.

Keep live publication gated by explicit manager approval of the exact design asset version, text, network account, date/time and timezone. Reserve dispatch before the external write, do not automatically replay unknown completion, and store provider receipts. Implement reliable asset export/versioning before treating a mutable Canva link as an immutable publication payload. Reject client evidence as marketing content unless a separate, explicit customer-marketing-consent workflow is built and approved.

## Verification

Automated tests cover strict owned-design inputs, URL restrictions and share-token stripping, per-company setup isolation, reviewed/current-source requirements, private plans, accurate manual-post status, unsupported proof URLs, stale approvals and manager-only brief export. Existing tests cover company/member revocation and version/origin guards. Build and TypeScript checks are required. Browser/mobile visual QA, live Canva visitor authorization, Metricool scheduling and real multi-company integration tests remain unverified.
