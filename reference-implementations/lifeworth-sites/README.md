# LifeWorth source and developer handover

The LifeWorth module is implemented in the private Sites ADPA Claims Workspace. This package gives José the exact current module source, schema, tests, integration guidance and illustrative UI design notes. It is a reference implementation for integration into this repository's React/Vite/Express/PostgreSQL application; adding this directory does not wire the feature into that app.

## Current release

- Hosted source: `5de90eeaa923ca6cd9a2eb4812d2e57a2a252de8`.
- Published version: 121, successfully deployed October 23, 2026.
- Private app: https://adpa-claims-workspace.angelo-rbmm.chatgpt.site/lifeworth
- [Current analytics implementation and verification](LIFEWORTH_ANALYTICS_HANDOFF.md).
- [Inventory, receipts, refunds and material-link handover](LIFEWORTH_ROOM_VALUES_HANDOFF.md).
- [Original foundation scope](HOMEBACK_LIFEWORTH_HANDOFF.md).
- Bernards illustrative dashboard mockup: emailed to Angelo separately; image upload to GitHub was declined, so the image is not included in this PR.

## Working features

Properties, room inventory and materials, reviewed/unreviewed replacement values, manually linked purchases and receipt lines, returns/refunds and CSV export, reviewed ITEL links, supplier quotes with Good/Better/Best eligibility, reconstruction costs, policy comparisons, screening questions, service coordination records and operation planning records.

The analytics dashboard separates contents from equipment and reconstruction, charts room values, tracks documentation references, compares reconstruction with the dwelling limit and saves dated immutable valuation snapshots. Stored history and audit are exported with the existing JSON export.

The Bernards image is an illustrative concept using fabricated sample values and history. It is not a screenshot of the published UI or actual claim data. The image uses a circular documentation indicator; the published dashboard currently uses a horizontal progress bar. The concept does not certify any claim coverage or payable amount.

## Run the reference tests

Node >=22.13 is required (`node:sqlite`). From this directory:

```sh
npm install
npm test
```

The runner compiles the module and authenticated API into a temporary test directory and uses mocked users and an in-memory SQLite database. It is not a standalone app. UI runtime dependencies (React, lucide-react), framework auth, database bindings and host routing must be supplied by the target application.

The complete hosted source passed **759 automated tests**, TypeScript and production build checks. The independently runnable subset here covers the LifeWorth module only; its result is recorded in [verification](docs/VERIFICATION.md). Server rendering was checked for loading, no-property, empty and populated states. Browser visual QA, screenshots of the real UI, mobile/device acceptance and live vendor integrations remain unverified because prior browser preview was blocked. The mockup is not browser QA evidence.

## José: integration sequence

1. Confirm the authoritative app and staging branch. Keep LifeWorth central to HB1 homeowner-first and HB2 professional-first flows; ADPA remains a separate public adjusting business using shared technology with separate representation and permissions.
2. Reuse `lib/lifeworth.ts` validation, category calculations, pricing circumstances and snapshot logic. Good means everyday shopping; Better means verified individual-loss partner discounts; Best means verified catastrophe recovery with partner-agreed actual-cost/no-profit basis. These are circumstances, not quality levels.
3. Port `app/api/lifeworth/route.ts` to verified server identity and tenant authorization. Keep owner isolation, same-origin writes, optimistic concurrency and capacity limits. Do not trust browser-supplied owner IDs.
4. Convert `drizzle/0010_lifeworth_accounts.sql` from D1/SQLite to an appropriate PostgreSQL migration. Preserve existing records and backward compatibility with accounts that have no snapshots.
5. Adapt the app-router page, client workspace, dashboard component and CSS to the target router and styling. Connect the API through the target server; copied files do not implement that integration automatically.
6. Run the supplied tests, then verify two unrelated accounts, stale-write rejection, record/receipt relationships, immutable snapshots, export, mobile layouts and retention in staging.
7. Complete external services separately: catalogs, checkout, payments, storage metering, phone setup/recordings, lab connectors, permitted ADPA transfer and AI. Manual records do not activate these services.

## Scope and integration status

This package contains the current LifeWorth module and the handover documents needed to integrate it. The complete private Sites application, unrelated claim modules and deployment runtime are separate from this reference bundle. The root GitHub app has not been changed by this package.

No customer claim records, original claim evidence, account databases, credentials or runtime secrets are included.
