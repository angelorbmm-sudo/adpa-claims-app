# Contents Care Studio — implementation and pilot handoff

Built on the existing hosted Vinext contents-care module, not the recovered GitHub React/Vite main application. Native hosted source remains authoritative. No database migration or claimant seed data added.

## Workflow

- Choose an owner-held saved claim at `/contents-care`. Dashboard navigation includes the studio.
- Job setup captures vendor, service authorization and work-plan originals, contamination assessment basis, written carrier position, next action, waiting party and follow-up date.
- Evidence locker accepts supported originals up to 30 MB each through existing authenticated evidence API. Multi-file selection/drop includes per-file success/error results and SHA deduplication. Save pending entries before upload. Uploaded audio/video is stored, not automatically transcribed, interpreted or priced.
- Inventory supports physical tags, rooms, brands/models/serials/materials, each/set/box counts, count basis, prior condition versus loss damage, dispositions and original-source locators. Unknown identity stays unresolved.
- Custody logs support pack-out, storage transfer, on-site relocation and return with item/count/container/time/person/from/to records. Returns require readiness source and reviewer plus acceptance/exception notes. Repeated pack-out/return uses simultaneous custody; quantities in different units are not combined.
- Cleaning records preserve contractor-selected methods, material compatibility/pretest basis, before/after evidence, reviewed outcomes and remaining damage. No automated treatment prescription or safety certification.
- Planned/actual storage periods and extensions require contractual units, location and evidence; overlapping actual dates for the same container are flagged.
- Service lines capture estimate/actual/supplement, invoice/line/work keys, billing and relationship basis, optional measured quantity/unit price, and separate approved/issued/received amounts. Voiding preserves the original with a reason; replacement invoice lines link the voided original. Repeated invoice lines and work keys are held out of the non-preliminary subtotal. Other unresolved evidence/relationship gaps remain explicit: subtotal is not a demand or an amount owed.
- One click creates a source-linked draft in existing Evidence & Pricing for either an inventory item or service charge. No replacement listing is invented. Duplicate active destination candidates are rejected. Changes to destination records stale pricing review through the existing source snapshot logic.
- Contents-care findings already feed Preparation, Claim Package assembly and approval blockers. Added morning dashboard review queue and next-action/waiting fields.
- Evidence-review acknowledgment requires resolved gaps, saved sources and optimistic concurrency. It does not authenticate a contractor qualification, create a licensed approval, client signature or release.
- CSV inventory and service worksheets plus browser Print/Save PDF are internal drafts. CSV cell quoting and formula protection included. These are manual exchange/reference worksheets, not native Xactimate ESX files.

## Controls

- Owner-only authenticated claim APIs, same-origin writes, claim-bound file and row links, validated cents/quantities/timezones, unique IDs and version checks.
- Saved rows cannot disappear from this endpoint. Corrections have server-assigned actor/date and changed-row before/after audit (bounded history). Audit and review fields cannot be forged by general claim writes. Imports cannot seed contents-care records/reviews.
- Persistence CAS also checks evidence count/latest timestamp, so uploads during a save/review invalidate the write.
- Existing contents valuation, payment buckets and approval authority are preserved. Service and replacement-price handoffs do not change financial ledgers.
- Unsaved record/job guards, busy/error states, responsive fields, keyboard focus and empty states.

## Remaining activation and production work

- This owner-private Site has no external vendor grant here. Ana's crew requires supported Site access and a scoped company/claim access implementation before independent use; no broad claim access was opened.
- AI extraction/price research and automatic audio/video interpretation are not activated. Existing Evidence & Pricing provider configuration remains unchanged.
- Native Xactimate integration/import/export must be implemented and tested using licensed supported interfaces. No direct ESX/API connection is claimed.
- No live professional job, billable AI request or browser/device visual QA performed. Managed Sites environment lacks the permitted browser-control capability.
- Ana's answers and permissioned straightforward/disputed packages will be used as reference cases, not automatic model retraining. Full paid IICRC standards not accessed or copied. Pilot with a known completed file before routine use.

## Public primary references checked October 10, 2026

- California Department of Insurance Home Inventory Guide: https://www.insurance.ca.gov/01-consumers/105-type/95-guides/03-res/home-inv.cfm
- CDI Residential Property Claims Guide: https://www.insurance.ca.gov/01-consumers/105-type/95-guides/03-res/res-prop-claim.cfm
- IICRC S300: https://iicrc.org/s300/
- IICRC S700: https://iicrc.org/s700/
- IICRC S320 development/public-review status: https://iicrc.org/s320/

These references inform documentation controls; they do not certify this application or resolve claim-specific coverage or treatment decisions.

## Verification

82 automated tests passed (including 7 new contents-care regression tests), TypeScript noEmit passed, and whitespace checks passed. Production build and deployment results are recorded in the delivery message.
