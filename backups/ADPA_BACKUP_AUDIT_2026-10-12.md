# ADPA source backup audit - October 12, 2026

The current deployed private ADPA app source is backed up in `hosted-workspace/`. This directory is a complete source snapshot, including application code, assets, dependency lockfile, database schema/migrations, tests and engineering handoffs. The older recovered React/Express application and its check-processing code remain in the repository root and `src/`; they are a separate implementation and are preserved rather than overwritten.

## Verified snapshot

- Site source commit: `58b2cfa3e2825835db6346b1c4895abeb0dc8646`.
- 385 current source files. The generated `tsconfig.tsbuildinfo` cache is excluded from the browsable snapshot.
- Exact hosted source Git tree: `e3800b91f21bc6c06335a269c7b7d5476cbf1fdc`.
- File-by-file Git blob hashes, SHA-256 hashes and sizes: `backups/ADPA_SOURCE_MANIFEST_2026-10-12.json`.
- Available Site source history, including earlier tracked cache versions: `backups/ADPA_Site_Source_History_2026-10-12.bundle`.
- Bundle SHA-256: `88c84ad64ee8b9bc399712d10b8f439d3369a831c667accf224a9a4b4a1540d6`.

The GitHub-created hosted source tree matches the independently calculated local tree hash. This verifies all source paths, file contents and modes, not just the newest screen files. The bundle is verified by restoring its HEAD and checking the restored source commit.

## Work reviewed

| Work | Backup coverage |
| --- | --- |
| Earlier claim foundations and check processing | Existing root app/main history preserved; CheckProcessingCenter.jsx was read directly from main. |
| Water mitigation, policy/evidence review and evidence-to-pricing | Current hosted source and earlier feature branches/history. |
| Company and contents dashboards, contents care | Current hosted source and earlier feature branches/history. |
| Company client intake, contracts and channel integration scaffolding | Current hosted source and earlier feature branches/history. |
| Shared recovery jobs, homeowner approvals and evidence sharing | Current hosted source and earlier feature branches/history. |
| Marketing templates, connections, industry and multiple-service onboarding | Current hosted source and earlier feature branches/history. |
| Arman's daily field visits, equipment review and material decisions | Earlier Oct 11 backup confirmed; included in full current snapshot. |
| Connected policyholder recovery dashboard and conversations | Newly backed up in this snapshot. |
| Guided setup and account-private saved progress | Newly backed up in this snapshot. |
| First-job guide and duplicate client/job prevention | Newly backed up in this snapshot. |
| ADPA onboarding review and follow-up ownership/history | Newly backed up in this snapshot. |
| Invitation expiry, correction, renewal and resume after sign-in | Newly backed up in this snapshot. |

The earlier cumulative hosted backup was commit `86a53342fe7d600fd5a9715878fa8a4ad6852e13` on `feature/material-decisions-2026-10-11`. The missing delta was the October 12 dashboard/onboarding sequence. The full snapshot also supplies dependency/setup files that were absent from earlier partial hosted backups. Existing main and feature branches remain intact; this is a backup branch, not a merge or production rollout.

## Restore the hosted app

Use `hosted-workspace/` for the current Vinext/Worker app. Follow its package scripts and handoff documents; Site runtime secrets, provider credentials, D1/R2 data and audience permissions are not included in a code backup. The snapshot retains the hosting manifest as project provenance, not credentials. Source backup does not activate signatures, email, texting/calls, banking or external user access.

To restore the source history locally:

```sh
git init restored-adpa-site
git -C restored-adpa-site fetch /absolute/path/ADPA_Site_Source_History_2026-10-12.bundle HEAD
git -C restored-adpa-site checkout --detach FETCH_HEAD
```

The final implementation had 229 passing automated tests, a passing TypeScript check and a successful production build. No code changes were made during this backup audit, so those checks were not repeated. Browser visual QA remains unverified.
