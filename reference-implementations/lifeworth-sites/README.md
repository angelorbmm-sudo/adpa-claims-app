# LifeWorth source and developer handoff

This package contains the LifeWorth module deployed in the private Sites workspace through October 23, 2026, including documentation tasks, Purchase Organizer and Divide My Belongings. It gives José source, schema, a standalone test suite and integration instructions for the repository's React/Vite/Express/PostgreSQL application.

**Integration status:** this directory is a reference implementation. It does not wire LifeWorth into the root GitHub app or deploy anything to José's environment. The full private Sites app remains separate.

## Current release

- Hosted source checkpoint: `a7f2afbb931053c767a324673fa3c8a2f742b39b`.
- Private deployed version: **124**, October 23, 2026.
- Private app: https://adpa-claims-workspace.angelo-rbmm.chatgpt.site/lifeworth
- Source files and SHA-256 hashes: [manifest](docs/SOURCE_MANIFEST.json).
- Validation and limits: [verification](docs/VERIFICATION.md).
- Detailed porting guide: [integration checklist](docs/INTEGRATION_CHECKLIST.md).
- Spanish summary for José: [resumen](docs/RESUMEN_PARA_JOSE.md).

## Included capabilities

| Area | Behavior and handoff |
| --- | --- |
| Inventory and purchasing foundation | Properties, room inventory, separate replacement values, manual receipt allocations, returns/refunds, receipt CSV, reviewed ITEL links. [Foundation](HOMEBACK_LIFEWORTH_HANDOFF.md), [room values](LIFEWORTH_ROOM_VALUES_HANDOFF.md). |
| Analytics and snapshots | Contents/equipment values, room charts, documentation-reference progress, reconstruction versus dwelling limits, dated snapshots. [Analytics](LIFEWORTH_ANALYTICS_HANDOFF.md). |
| Documentation tasks | Prioritized gaps, assignment labels, statuses and review notes. [Task behavior](docs/DOCUMENTATION_TASKS.md). |
| Purchase Organizer | Purchase dates, receipt links, confirmed return deadlines and warranty dates/terms, manual links, item/retailer search and upcoming-date filters. [Purchase Organizer](LIFEWORTH_PURCHASE_ORGANIZER_HANDOFF.md). |
| Divide My Belongings | Two-person plans, selected inventory, split quantities, separate proposed division values, individual owner-recorded responses, stale-proposal review/history and selected-plan CSV. [Division workflow](LIFEWORTH_DIVISION_HANDOFF.md). |
| Other working foundation | Good/Better/Best pricing circumstances, supplier quote records, reconstruction scope, policy comparisons, assessment questions, provider coordination and manual operation planning. |

## Run standalone tests

Node **>=22.13** is required for `node:sqlite`. From this directory:

```sh
npm install
npm test
```

The runner compiles the domain modules and API into a temporary directory. It uses synthetic fixtures, mocked identities and an in-memory SQLite database. **35 tests pass**, covering the current module and API. The complete hosted application separately passed **772 tests**, TypeScript and its production build at the hosted checkpoint above.

This package is not a standalone running UI. The target must provide routing, React, lucide-react, server authentication and database adapters. Runtime UI/framework dependencies belong to the host; the package dependencies support the standalone test runner.

## José: implementation order

1. Confirm the authoritative app and staging branch. HomeBack has shared HB1 homeowner-first and HB2 professional-first technology; ADPA remains a separate public adjusting business with separate representation and authorization.
2. Port both `lib/lifeworth.ts` and `lib/lifeworth-division.ts` together. The main module imports the division helper. Retain validation and currency arithmetic, backward-compatible defaults, relationships, stale-proposal checks, response history and capacity limits.
3. Adapt `app/api/lifeworth/route.ts` to trusted server identity and PostgreSQL. Preserve owner isolation, same-origin writes, optimistic version checks and atomic writes. Never accept a browser-supplied owner ID.
4. Adapt the D1/SQLite account migration to PostgreSQL. The newer records live in the account JSON; no new D1 migration was needed. Do not overwrite populated account JSON or drop unfamiliar fields.
5. Adapt all LifeWorth client components and CSS together, including `next-actions.tsx`, `purchase-organizer.tsx`, `division.tsx`, `dashboard.tsx` and `workspace.tsx`. Map the page to the target router and protect it before rendering.
6. Run the standalone suite, target-app TypeScript/build checks and the [staging acceptance checklist](docs/INTEGRATION_CHECKLIST.md). The existing-host integration patch from older packages is not current and is intentionally not included here.
7. After staging acceptance, deploy through the target app's own workflow. Merging this reference package alone does not complete integration.

## Product boundaries

- Good is everyday pricing; Better is verified individual-loss partner discounts; Best is verified catastrophe/partner-agreed actual-cost/no-profit pricing. They are circumstances, not merchandise quality tiers.
- Evidence fields hold source references/HTTPS links. Original LifeWorth file uploads, receipt OCR and automatic matching are not included.
- Purchase deadlines are entered and confirmed against sources. On-page date indicators do not send email/push reminders or verify eligibility.
- Division responses are entered by the signed-in owner with separate sources and dates. They are not independently authenticated participant approvals, signatures or legal ownership transfers.
- No live catalog, checkout, payment/refund processing, automatic ADPA transfer or outside invitation is activated.
- Prior Bernards/dashboard and purchase mockups are illustrative concepts with sample data, not browser captures or parity evidence. Images are not included; preserve the previous decision not to upload the mockup image to GitHub.
- Browser visual QA and mobile/device acceptance remain unverified after preview access/connection failures. No bypass was attempted.

No customer claim records, original evidence, account databases, runtime bindings, credentials or secrets are included. Historical handoff documents describe earlier checkpoints; this README, the current manifest and verification report describe this release.
