# Shared recovery job and company participation review — 2026-10-14

Canonical area 11 completed. Ledger: 44 of 52 canonical areas covered; 8 dedicated reviews remain. Next: area 12 Company My Jobs and focused navigation.

## Changes

- Homeowner acceptance and company joining verify retained signed PDFs/certificates by kind, company/client, safe size, PDF header and SHA-256 digest, rather than merely finding asset IDs. Originals are checked again before the final approval write, with atomic metadata guards.
- Homeowner approval of an additional company rechecks the current matching client/property, unchanged accepted contract request, completed contract and retained originals. The originating participation must still match the original company/client and be unremoved and unambiguous.
- Multiple active entries for one company produce no manager participation or access. Invitation, joining, homeowner approval and individual evidence permission remain separate gates.
- Creation binds exact company owner/state and client state and atomically rejects matching existing originating or joined recovery workspaces. Ordinary updates bind the original shared-job state and participating company state alongside existing version/source guards. Same-version state changes cannot be silently overwritten.
- Shared audit entries retain earlier consent/removal/contract-request records beyond the former 500-entry truncation. The explicit 1,000-entry limit rejects new updates without dropping prior entries; the existing 800 KB saved-job limit remains.
- Parent coordination forms guard unsaved navigation/refresh and competing saves. Accepted writes clear submitted forms, retain the saved job ID and remain reported as saved after a refresh failure. Rejected writes preserve entries. Mutation locking and disabled controls prevent overlapping parent actions. Embedded inspection/evidence draft guards remain in use.

## Validation

678 automated tests passed, including eight new regressions for missing signed bytes, replaced accepted contracts, same-version shared state races, final signed-original metadata changes, duplicate participation, retained audit limits, draft/save-refresh outcomes and a concurrent joined-job creation race. TypeScript passed; production build runs during packaging.

## Pending

Browser/iPhone and real multi-user/provider walkthroughs remain pending because supported browser QA is unavailable. File-sharing consent is separate from company approval. Revocation stops future access but cannot recall downloaded/imported copies. ADPA engagement remains separate from company service contracting. No real invitation, message, signature request or payment action was performed; owner-private access is preserved. Previously truncated history cannot be reconstructed by this change.
