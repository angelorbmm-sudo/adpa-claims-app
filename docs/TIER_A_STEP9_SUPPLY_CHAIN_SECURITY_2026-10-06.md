# ADPA Tier-A Step 9 — Dependency & Software Supply-Chain Security

Audit date: 2026-10-06
Status: COMPLETE — SUPPLY-CHAIN HOLD UNTIL REPRODUCIBLE INSTALL IS ESTABLISHED

Scope: npm dependency manifest, lockfile state, GitHub Actions, CI install behavior, third-party action references, dependency review, vulnerability scanning, provenance/SBOM readiness, update governance and build reproducibility.

## Current inventory
Runtime/build dependencies declared: @vitejs/plugin-react, cors, dotenv, express, jose, pg, react, react-dom, vite, zod.
No package-lock.json is committed.
Four direct dependencies use the literal version "latest": @vitejs/plugin-react, react, react-dom, vite.
Build Check uses Node 22 and npm install --no-audit --no-fund.
Demo workflow uses Node 20 and npm install.
GitHub Actions use version tags such as actions/checkout@v4 and actions/setup-node@v4 rather than immutable commit SHAs.

## Findings

### S9-C01 — No lockfile / non-reproducible dependency graph
Severity: CRITICAL before production.
Without a committed package-lock.json, transitive versions are re-resolved during installation. The same ADPA commit can therefore build with different third-party code on different days.
Fix: generate and review package-lock.json from a trusted environment, commit it, then use npm ci in CI/deployments. Verify clean reproducible build/tests before merging.

### S9-H01 — Four direct packages use "latest"
Severity: HIGH.
React, React DOM, Vite and the Vite React plugin can change without an ADPA source-code change.
Fix: pin reviewed versions/ranges together with the lockfile. Update only through reviewed dependency changes.

### S9-H02 — CI intentionally disables npm audit and has no equivalent vulnerability gate
Severity: HIGH.
--no-audit suppresses npm's install-time audit and no separate dependency-vulnerability job is present.
Fix: use an explicit vulnerability scanning policy in CI so results are controlled and reviewable rather than hidden in install output.

### S9-H03 — No dependency-review gate on pull requests
Severity: HIGH.
There is no visible pull_request dependency-review workflow. GitHub's dependency review can identify added/changed dependencies and block newly introduced vulnerable dependencies when supported/configured.
Fix: enable dependency graph and dependency review appropriate to the private-repository plan, and make the security check required where available.

### S9-H04 — GitHub Actions are tag-pinned, not commit-SHA pinned
Severity: HIGH for hardened production CI.
Tags are convenient but mutable references. A hardened workflow should pin third-party actions to reviewed full commit SHAs, with comments recording the human-readable release, and use an update bot/review process.
Fix: SHA-pin all external actions after validating current official releases.

### S9-H05 — Node version differs between build and demo workflows
Severity: HIGH reproducibility issue.
Build Check uses Node 22; demo uses Node 20. Dependency/runtime behavior can differ.
Fix: define one supported Node major (and preferably exact toolchain policy) across local, CI, demo and production unless compatibility testing intentionally covers multiple versions.

### S9-H06 — No automated dependency update governance
Severity: HIGH.
No visible Dependabot/Renovate configuration or scheduled dependency review policy was found in the reviewed files.
Fix: configure controlled update PRs for npm and GitHub Actions; never auto-merge security-sensitive major changes without tests/review.

### S9-H07 — No SBOM / release provenance
Severity: HIGH for mature production.
There is no Software Bill of Materials or build provenance/attestation for deployable artifacts.
Fix: generate an SBOM from the locked dependency graph and attach it to controlled releases. Add artifact provenance/attestation when the chosen GitHub plan/deployment model supports it.

### S9-M01 — Build artifacts are not tied to a formal release identity
Severity: MEDIUM-HIGH.
The demo uploads dist but there is no ADPA release manifest tying artifact hash, source commit, dependency lock hash, test run and deployment.
Fix: create release metadata and retain provenance.

### S9-M02 — No license-policy review
Severity: MEDIUM.
Third-party software licenses are not inventoried/approved in the repository.
Fix: SBOM/license inventory plus approved/denied license policy reviewed with counsel/business as needed.

### S9-M03 — No package-manager/toolchain declaration
Severity: MEDIUM.
package.json does not declare packageManager/engines.
Fix: declare supported Node/npm policy and enforce it in CI.

### S9-M04 — No visible SAST/secret-scanning/supply-chain workflow
Severity: MEDIUM-HIGH.
Step 7 identified the same broader gap.
Fix: enable appropriate GitHub code/security scanning features for the repository plan and add independent secret checks where useful.

### S9-M05 — Deployment workflow has broader permissions than build workflow
Severity: MEDIUM / expected but sensitive.
Pages deployment legitimately requests pages:write and id-token:write. Keep those permissions only in the deployment job/workflow and never expose them to untrusted dependency install/build scripts unnecessarily.
Fix: continue least-privilege separation and review pull-request execution boundaries.

## Required controlled remediation sequence
1. On a trusted machine/environment, resolve the currently intended dependency versions.
2. Review exact direct/transitive versions and known advisories.
3. Replace "latest" declarations with reviewed versions/ranges.
4. Commit package-lock.json.
5. Add packageManager/engines policy.
6. Change CI/demo installs to npm ci.
7. Standardize Node version or intentionally matrix-test supported versions.
8. Run build + Step 6 regression tests from a clean checkout.
9. Add dependency vulnerability scanning/review according to available GitHub plan features.
10. SHA-pin GitHub Actions after verifying official action releases.
11. Add controlled Dependabot/update PR policy.
12. Generate SBOM/release manifest; add provenance/attestation when supported.
13. Require review before dependency/security workflow changes.

## Acceptance tests
- Two clean installs from the same commit+lockfile resolve identical dependency versions.
- npm ci succeeds without modifying lockfile.
- Build and regression tests pass from a clean checkout.
- A deliberately vulnerable test dependency in a safe test branch/PR is detected by the configured gate.
- A dependency change is visible for review before merge.
- CI refuses an unexpected lockfile/manifest mismatch.
- Node/toolchain version is identical or explicitly compatibility-tested.
- External Actions are immutable-SHA pinned in hardened workflows.
- Release manifest records source commit, lockfile hash, artifact hash and test result.
- SBOM can identify the version/path of every shipped dependency.
- No production secret is present in source, lockfile, build artifact or logs.
- Dependency update rollback can restore the previous locked graph.

## Release decision
Synthetic local/demo development: PASS WITH CAUTION.
Production build reproducibility: HOLD.
Production dependency-security gate: HOLD.
Production artifact provenance/SBOM: HOLD.
Supply-chain readiness becomes PASS only after a committed reviewed lockfile, pinned dependency policy, reproducible npm ci build/tests and security update/scanning controls are proven.

## Step 9 conclusion
The largest supply-chain risk is straightforward and fixable: ADPA currently has no committed lockfile and several core frontend/build packages use "latest". The application source may be unchanged while the third-party code entering a build changes. The next remediation should establish a deterministic dependency graph before production infrastructure is trusted.

STEP 9 COMPLETE.
