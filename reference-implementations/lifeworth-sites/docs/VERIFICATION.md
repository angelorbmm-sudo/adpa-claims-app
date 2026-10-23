# Verification — October 23, 2026

Private hosted source: `36d70f6dc247d4694ce245599351c635b09e22e4`; deployed version **125**, successfully published October 23, 2026.

- Full hosted automated suite: **780 passed**, zero failed, zero skipped.
- Hosted TypeScript and production build: passed.
- Updated standalone reference suite: **43 passed**, zero failed, zero skipped (`npm test`).
- Reproducible real-engine checks: **3 passed** (`npm run test:engines`): PNG receipt OCR, text-PDF extraction and rendered image-only PDF OCR. Every fixture is generated locally from synthetic content; no customer receipt is used.
- Scanner asset preparation: passed (`npm run prepare:scanner`). The private production build includes same-origin language data, worker/core variants, PDF worker, fonts, cmaps and wasm resources.
- Domain/API/UI/schema/source test files match the hosted checkpoint. `docs/SOURCE_MANIFEST.json` lists all reference files and SHA-256 digests, excluding itself, node_modules and generated scanner resources.
- The standalone runner includes both domain helpers and both authenticated API routes, with synthetic accounts, mock object storage and in-memory SQLite. No live account was seeded.
- Earlier dashboard server-render checks were prior checks; they do not establish browser verification for newer screens.
- Browser visual/end-to-end and mobile acceptance remain **unverified**: preview supervisor reports running, but the cloud browser gets ERR_CONNECTION_REFUSED. No safeguard was bypassed and no alternative browser-control path was used.

The root React/Vite/Express/PostgreSQL app is not wired by this reference package. It needs the documented identity/storage/transaction/routing/build adaptations and staging checks. The 780 hosted tests are separate from the 43-test reference subset and three engine checks.
