# Module review 1 - Industry/services and onboarding essentials

Reviewed the 16-industry, multi-service setup, guided onboarding, company classification and downstream readiness behavior.

## Changes
- Both `/company-setup` and `/getting-started?role=company` use a shared service picker. Selected industries appear first; existing selected services outside those industries remain visible. Search finds services across all industries and Show every industry expands the catalog. Filtering never clears selected services.
- Selection count and service names remain visible. Other restoration has an explicit custom-service/search path, rather than an unexplained empty catalog.
- Both screens show a review summary before accuracy confirmation and explain missing/duplicate/oversized custom services. Guided onboarding also identifies missing company name/service area.
- Setup and guided onboarding guard unsaved internal-link navigation and browser unload. Company/role switches retain their existing safeguards; saving remains explicit.
- Stored company classification requires valid services and industry facts before a prior confirmation date can mark it complete. Incomplete/unsupported stored records are flagged for re-review without rewriting company records. Malformed service-array data no longer crashes the profile projection.
- Private onboarding drafts reject duplicate custom names and do not overwrite earlier saved progress on validation failure.
- Provider checklist accurately describes signatures/email/texting activation; calling requires separate integration work.

## Preserved behavior
Changing industry keeps service selections, including services outside the selected industries. Primary/secondary industry choices describe the business; they do not migrate its legacy specialist job category, create an assignment, grant claim access or verify qualifications. Existing company membership, job/evidence permissions, marketing profiles and provider credentials are not modified. No new required field was added to industry-only setup; service area remains required in guided essentials.

## Verification and remaining review
388 domain/API regression tests pass, including search across industries, secondary/out-of-industry selection retention, readiness for invalid saved classifications and draft overwrite protection. TypeScript and production build checked before publication. Browser/phone walkthrough and real-user acceptance remain deferred. No actual company/client data changed by this build.

Remaining operational review: default industry choice with real companies, full mobile form interaction, draft-resume after later company changes, first-job contract handoff and broader company access/provider activation. This completes the first code cleanup pass; it is not a declaration that all onboarding and all specialist industries are production-certified.
