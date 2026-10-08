# Mitigation & Cleaning: hosted deployment

Published successfully October 8, 2026, to the existing owner-private ADPA workspace:
https://adpa-claims-workspace.angelo-rbmm.chatgpt.site/mitigation

Hosted source base: 2e136b213af5467054c800cd27da2ef8b21733d2
Deployed source commit: 38d11e0db36106510a063b36f83b9299f121fa86
Site project: appgprj_6abfdafe78488191809d1b9b6efe0b5d
Saved version: appgprj_6abfdafe78488191809d1b9b6efe0b5d~appgver_f4357390c33481919cddd6df8d1f7f43
Deployment: appgdep_6ac7bb42bedc8191bd3e2ee80c01b809, succeeded.

The existing Vinext app was extended; it was not replaced by the React/Vite repository. Existing access, D1/R2 bindings, claims and evidence remain in place. No claim data was edited during deployment.

The new /mitigation screen lists saved claims, saves version-checked module records, records authenticated document-review notes and final evidence acknowledgments, and invalidates them when sources/records change. Preparation flags unresolved evidence; draft packages can include the new mitigation section; release blockers include evidence gaps. Review records are not professional approval, safety certification or verified signatures. Existing secure-release connections and real-client production readiness remain on HOLD.

Validation: 37 hosted integration tests passed, TypeScript passed, production build passed. Native publishing reported success. Browser/device interaction QA was unavailable in this environment; no claim-changing production smoke test was performed.

The accompanying deployments/sites-mitigation-2026-10-08.patch preserves the hosted source changes against the exact base above, excluding the generated single-line app/workspace-html.ts and tsconfig.tsbuildinfo. Apply only to that Sites lineage, not the React/Vite repository root. The missing navigation change is reproducible: add a nav button id adpa-open-mitigation labeled Mitigation & cleaning before data-view=construction; its click handler refuses navigation while dirty, otherwise opens /mitigation?id=encodeURIComponent(claimId). The full generated navigation file is preserved in the hosted source commit.

Use: open the app, choose Mitigation & cleaning (or the direct /mitigation link), select a claim, review originals, enter records, click Save mitigation changes, then record final review after evidence gaps are resolved. Documents upload through the existing claim evidence area. No email is sent.
