# ADPA Company Marketing Center — first release and handoff

## Purpose

Independent mitigation, contents, contractor, roofing, handyman and restoration companies can enter their business information once and prepare useful digital marketing without learning a complicated marketing system. ADPA remains the one public adjusting firm. Service companies remain independent.

## What is built

Open `/marketing` from a company dashboard, Clients & contracts, Shared Recovery Jobs or the ADPA dashboard.

1. **Company profile:** business name, trade, headline, description, services, service areas, phone, email, website, hours, company-provided license reference and its internal substantiation, and official social profile URLs. These fields stay separate from client/job records. The internal license basis is omitted from prospect-facing pages and exports. Credentials remain company-reported rather than automatically verified.
2. **Logo upload:** managers can upload a logo they own or are authorized to use. PNG/JPEG/WebP only, up to 3 MB, with raster signature checks. SVG/documents and references to client evidence are not accepted. Storage keys are not exposed to prospect JSON responses. Images still need production malware/content scanning; signature checks do not prove a complete valid image or ownership.
3. **Industry designs:** Service spotlight, Emergency contact and Care journey layouts. Trade-specific copy provides general process steps and guidance. There are no invented testimonials, review ratings, insurance-payment promises, automatic credential certifications or invented emergency availability.
4. **Review and in-app publication:** the manager confirms accuracy and content rights. A frozen page snapshot retains that profile, template and logo revision. Later profile/logo edits do not alter the published snapshot; the manager reviews and publishes again. Withdrawal blocks future app access, but cannot recall already downloaded exports.
5. **Service-page export:** download standalone responsive HTML with working phone/email/social links, title, description and LocalBusiness structured data. Print styles support a printable service page. This is an export for hosting; the app does not silently publish it on the open internet or guarantee SEO rankings.
6. **Service-journey infographic:** download a company-filled SVG showing the trade's service steps, contact and service areas. It contains no customer/job photos. It can be shared or printed manually.
7. **Social drafts:** service introduction, helpful checklist and company introduction templates for six network labels. Managers edit and explicitly review the text, then copy it for manual posting. Drafts show when their source profile changes. The module never claims a draft was posted or scheduled. Social profile links are links, not authenticated publishing connections.
8. **Company page and inquiry widget:** `/company-pages/<company-id>` presents the reviewed service page and a form to approved signed-in site visitors. The form uses the verified account email, explicit request-to-contact consent, current publication ID, company-listed service choice and a general needs description. It does not request insurance documents or financial records. Requests are private to company managers, not public page visitors.
9. **Inquiry inbox:** managers can record contact notes, close/reopen an inquiry, or convert it into their company's client intake after review. Conversion preserves the inquiry and consent source, does not create a signed contract, ADPA claim, representation agreement, marketing opt-in or SMS consent. Phone numbers without a validated international format go into a note for follow-up rather than becoming a send-ready SMS number. Matching email/address client records are held for review to avoid duplicate intake. Use Clients & contracts for the company's next steps, then Shared Recovery Jobs when appropriate.

## Access and verification

- Same accepted manager/company access checks used by existing company workspaces; technicians and unrelated company managers cannot edit profiles, export drafts, read leads or convert another company's inquiry.
- Published business information is visible only to authenticated visitors already approved for this private site. Publishing within the app does not widen site sharing.
- Server-side company/profile/inquiry version guards, request origin checks, strict inputs and escaped HTML/SVG output.
- Official HTTPS host allowlist for social links; credential-bearing or executable links are rejected. Website links are not fetched server-side.
- Inquiry request IDs make retries idempotent for the same verified identity and company. Ten inquiries per identity per UTC day are permitted in this foundation; distributed abuse protection and broader rate limits remain launch work.
- No client evidence, photos, video, audio or claim records are automatically queried or copied into marketing. Manually entered text must be reviewed for sensitive information. Future customer stories/images/testimonials require a separate marketing-permission record; shared-job evidence consent is not sufficient.
- New D1 migration: `0009_unknown_master_mold.sql`; tables `company_marketing` and `marketing_inquiries`.
- Automated checks cover tenant isolation, consent, social/website URL validation, frozen publication snapshots, escaping/exports, logo rights/type/version rules, stale post reviews, private inquiries, idempotency, intake conversion, revocation and rate/origin/authentication guards. All records are synthetic and in-memory. Browser/mobile visual QA was unavailable in this environment and remains required.

## Jose's remaining work

1. **Public hosting:** select a separate public marketing surface or deploy the exported pages with a company domain. Preserve privacy of the existing ADPA claim workspace. Configure HTTPS, canonical URLs, sitemap/indexing, routing and public business-logo delivery. The current company page requires site-approved sign-in and is intentionally marked noindex.
2. **Public inquiry endpoint:** add a narrowly scoped public form API separate from private company/claim APIs, with abuse protection, bot controls, retention/disclosure choices, endpoint authorization and delivery monitoring. The downloaded HTML currently uses phone/email contact buttons; it does not pretend to have a working public lead form.
3. **Social publishing:** choose an existing service or supported network APIs before custom building a Hootsuite-style integration. Configure each company's consent and account authorization, renewable credentials, account selection, network-specific format/length checks, queues, timezone-aware scheduling, provider receipts, retry/reconciliation and revocation. No service or live account has been activated in this release.
4. **Alerts and analytics:** connect the configured company email/SMS services for inquiry alerts with appropriate permissions. Add real campaign referral attribution and privacy-conscious analytics. Current counts reflect saved app inquiries and drafts, not invented reach, impressions or external conversion rates.
5. **Profile management:** business name/trade here belongs to the marketing profile and does not silently rename or reclassify existing company job records. Decide how a reviewed company master profile should synchronize those administrative fields without changing historical job snapshots.
6. **Production readiness:** add company approval/credential verification, scanning, registration/form abuse controls, backups/retention, load tests, inquiry pagination beyond the latest 200 records, real multi-account/browser/mobile tests and content review workflows. Test public pages and external provider integrations before calling the Marketing Center commercially ready.
7. **Later content workflows:** add separately authorized customer projects, before/after layouts, testimonials, more flyer/infographic designs and campaign scheduling only after the permission model is implemented and tested. Maintain the distinction between requested service contact, SMS consent, marketing consent and ADPA representation.

No posts, ads, email campaigns or SMS messages were sent. No new public site was created. Runtime configuration and live integration activation remain pending.

### Template selection and incomplete profiles
All three templates are alternative designs of one company page. Selecting a design changes its preview; explicit reviewed publication replaces the previous published snapshot. Draft profiles can be saved without a description or hours, but publication requires them. The Templates & page tab now lists missing details beside publication and offers an inline Save details and continue action, preserving the selected design. Changing templates resets publication review confirmations.
