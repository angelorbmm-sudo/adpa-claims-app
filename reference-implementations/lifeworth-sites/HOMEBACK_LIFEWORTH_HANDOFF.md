# HomeBack / LifeWorth working foundation - October 23, 2026

This increment extends the existing private Sites ADPA Claims Workspace. It does not modify Jose's dev.adpa.claims or the separate GitHub repository.

## Implemented

- Authenticated `/lifeworth` with nine workspaces: properties; inventory/materials; supplier quotes; reconstruction; policy comparison; assessment questions; ITEL; recovery-team coordination; plans/connections.
- Owner-scoped durable D1 records, validated mutations, optimistic version checks, audit history, JSON export, editing and deletion with property-link protection.
- GOOD everyday pricing, BETTER verified individual-loss discounts, BEST disaster recovery with partner commitment and confirmed actual-cost/no-profit basis. Price tiers do not define merchandise quality. Missing eligibility/commitments hold quotes for review.
- Dated manual product/work quotes calculate quantity, delivery, tax and installation in cents. Source and exclusions remain visible. No retailer feed/checkout implied.
- Reconstruction line items by trade/cost category; comparable existing quality and optional upgrades separated; missing cost categories flagged. Dwelling-limit gap, deductible, conditional extension and code limit displayed independently. Coverage/payment not determined.
- Screening review tasks based on age, disturbance, suspect materials, paint and contamination. No diagnosis or automatic clearance. Qualified review remains necessary.
- ITEL sample/report stages with report provenance and reviewer/findings requirements.
- Private provider/task coordination; manual planning records for storage/subscriptions, phone setup, calls, partners, orders/receipts, transfer plans and story/referrals. These do not perform those external operations.
- Explicit company onboarding classifications and services for asbestos/lead/bacteria testing and asbestos/lead abatement. Existing company membership and job security are unchanged.
- Navigation links from claims list and company/homeowner navigation.

## Boundaries and remaining work

- LifeWorth data is private per signed-in user; company/household sharing is not added by this increment. Existing shared jobs remains the collaboration/evidence workflow.
- Evidence fields contain references/HTTPS links. LifeWorth original-file upload, automatic receipt matching and cross-device media acceptance testing remain separate work; existing ADPA/shared-job upload systems are preserved.
- No live retailer/wholesale catalogs, product matching automation, checkout/orders/returns, ITEL API, managed toll-free numbers/recording, payment processing/subscription enforcement or storage billing is activated.
- Operation records are manual plans/logs, not completed integrations. No automated transfer, claim-close verification, recovery-story generation/publication, referral delivery or invitation sending is implemented here.
- Detailed new specialist field dashboards, chain of custody, trade verification and automatic professional assignment remain outstanding; taxonomy is not a complete specialist portal.
- LiDAR, Matterport, Xactimate, video/audio understanding, AI domain tool integrations and provider agreements remain separate dependencies.
- ADPA originals and restricted records are untouched; no automatic migration/sharing occurs.

## Validation

- TypeScript no-emit check passed.
- Worker production build passed with both new routes included.
- New tests cover persistence, editing, isolation, authentication, origin rejection, stale versions, linked deletion, pricing eligibility and arithmetic, reconstruction limits, screening, report validation and specialist taxonomy.
- Existing time-sensitive pricing test used an expired fixed follow-up date; change fixture to seven days after execution while retaining its assertion of awaiting acknowledgment. Production follow-up logic unchanged.
- Browser screenshot/interaction QA blocked by the browser access policy. Report images are conceptual vector mockups, not browser captures. Mobile responsiveness is implemented in CSS but not device-acceptance verified.

## Storage / rollout

Migration: `drizzle/0010_lifeworth_accounts.sql`; included in migration journal. Existing claim tables untouched. No paid services or new secrets required. Preserve owner-only audience. This is a functioning manual-record foundation, not completion of the full platform backlog.
