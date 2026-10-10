# ADPA shared recovery jobs — implementation and launch handoff

## What is built

Route: `/shared-jobs`. A recovery job begins in a company's client workspace before ADPA representation. A homeowner and several independent service companies can participate in that one property job, without creating separate copies of the original field evidence for each company.

1. A signed-in company manager registers a company, chooses its trade, and optionally lists its business name and service category in the signed-in directory. Profiles are self-reported, not verified endorsements. Supported categories: water mitigation, contents care, general contractor, roofing, handyman, other restoration.
2. The manager creates a client in Clients & contracts, records the homeowner email and property address, and sends the company's service contract through its configured signature provider. The existing provider verification retains the signed PDF and completion certificate.
3. The manager creates a shared job from that client. This preliminary record is not an ADPA claim and grants no ADPA representation or shared evidence access. A unique database index prevents duplicate originating client/job records.
4. The manager copies the invitation link and sends it to the homeowner. The link is a locator, not a bearer token. The invited verified email must sign in; the accepted identity is bound to its user ID. The originating company's verified signed contract is required for homeowner approval.
5. A homeowner or approved company manager proposes another listed company. That company accepts using its own client record, matching homeowner email/property address, and its own verified signed contract plus certificate. The homeowner separately approves participation. Pending participants cannot view evidence or tasks.
6. Approved managers contribute client document originals. Originals from other companies/clients, service contracts, and signature certificates are rejected. The contributor confirms the file contains job evidence rather than banking, private correspondence, or unrelated data. This confirmation is not automated sensitive-data detection; production file scanning and classification remain necessary.
7. The homeowner selects recipients for each evidence item. Contributions begin visible only to the contributor company and homeowner. There is no automatic broad sharing. Each item retains its source company, client, revision, SHA-256 digest, original upload timestamp, and description. Reuse can support several trades, but each company must check whether evidence is sufficient for its own work.
8. Company tasks stay scoped to the assigned company. Homeowners can see tasks across their job. This does not replace the existing specialist scope/contents modules.
9. ADPA is separately requested by the homeowner. ADPA proposes a matching existing claim whose authority controls reference reviewed engagement evidence. The homeowner downloads that separate agreement and confirms the connection. This is a record of reviewed existing representation evidence, not a new ADPA e-signature implementation or independent legal verification.
10. The homeowner separately shares specific originals with ADPA. ADPA can import those originals into the matching claim's existing Evidence & Pricing queue. Import verifies original bytes against their digest, retains a distinct R2 copy, and stores provenance and consent information in the existing source-reference array. Pricing research, extraction, and scope conclusions still require the existing configured tools and review; contribution alone does not invent prices or run background AI.
11. Revoking a company, member, individual file grant, or ADPA connection stops future job reads/downloads. Downloaded copies cannot be recalled. ADPA imports are separate retained claim records and require the claim's retention/deletion process; revoking collaboration does not terminate the representation agreement.

## Security and storage

- New D1 tables: `shared_jobs` and `shared_job_companies`; migration `0008_public_mongu.sql`. Existing migrations remain unchanged.
- Server authorization on detail, list, POST actions, and file downloads; no permission decisions delegated to UI controls.
- Homeowner consent requires the exact invited verified email/user binding. Platform administrator access to existing company management does not implicitly join the shared-job evidence workflow.
- Accepted managers only in the shared workspace. Technicians continue using existing specialist company dashboards; this release does not grant them shared-job access.
- Job/client/company/claim version guards prevent stale updates. Company membership changes are checked against current versions. Original-download authorization checks the current job/company versions again before returning a storage reference.
- Public-in-app directory projection includes business ID, name, trade only. No staff, homeowner, client, or file information.
- Portfolio pagination uses an updated-time/ID cursor; directory search returns at most 100 matches per query. Indexed membership projections support company/job lookup. Each job is capped at 50 company history entries, 500 evidence entries, and 300 tasks; this is not an unrestricted marketplace or a claim of thousand-company production capacity.
- Invitation locators do not authenticate or grant access. No emails/SMS/signature requests were sent while developing or testing this module.
- Contract and engagement controls are separate from permissions to share evidence. Removing collaboration does not cancel a contract or insurance representation.

## Jose's remaining activation and launch work

1. Follow `JOSE-COMPANY-CHANNELS.md` for company email/SMS/signature activation, renewable DocuSign authorization, and controlled live provider tests. Pending provider configuration deliberately blocks signature-dependent participation approval. No fake signed status was added to bypass setup.
2. Keep current site owner-private. For an approved pilot, grant site-level access to named testers separately from job invitations. Wider identity/login hosting for hundreds or thousands of independent businesses is a launch decision; do not silently make the current claim workspace public.
3. Add centralized company billing/usage, per-company sender onboarding, operational monitoring, abuse prevention, and registration throttling. Current registration permits up to ten self-registered companies per identity; it is not full business verification.
4. Add license/insurance/qualification verification, directory profile details, service areas, and search filters before presenting this as a vetted provider marketplace.
5. Test browser/mobile workflows with two companies and a homeowner on separate verified accounts. Managed browser QA was unavailable here, so no visual or real multi-account browser result is claimed.
6. Run load/concurrency tests and security review against realistic independent-company traffic. The synthetic test with 1000 directory companies proves bounded search/pagination logic, not production throughput, comprehensive tenant security, or compliance certification. Company membership currently uses the existing JSON member records; a normalized membership index is a sensible scaling follow-up.
7. Add malware scanning, media processing/range previews, sensitive-document detection/redaction, large-file/resumable upload support, retention and deletion policies, and backup/restore exercises. The existing manager upload remains capped at 30 MB per file.
8. Add automated invitation delivery through configured company channels, expiration/reminders/decline/re-invitation flows, and homeowner-originated evidence uploads in the shared workspace. This release uses manually delivered sign-in-bound job links and company client uploads.
9. Map permission-approved shared evidence into each trade's specialist scope workflows after user acceptance testing. The release supplies shared originals, company tasks, and the ADPA pricing import; it does not automatically assign claim scope records, synchronize Xactimate, or allow unapproved vendor access to claim financials.

## Verification

150 automated tests across the app pass, including 14 new shared-job tests: exact homeowner acceptance, verified-contract gates, independent participation/evidence permissions, tenant/client isolation, immediate revocation, digest/original checks, task boundaries, separate ADPA representation and retained pricing import, authentication/origin/version checks, duplicate creation, 125-job cursor pagination, and bounded directory search across 1000 synthetic companies. TypeScript and production build are checked before publication. All records and storage objects used by tests are synthetic and in-memory.
