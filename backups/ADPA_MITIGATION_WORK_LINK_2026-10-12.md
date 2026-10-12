# Shared recovery job to mitigation work

Current complete source is hosted-workspace/. Site source commit `f1432fd1a7c75a96f5cddaa935dc8d665bc63ae1`, exact source tree excluding generated TypeScript cache `eb9fbe2094717e0654724610126a8de122465f24`. Earlier manifests and bundles remain historical snapshots.

The shared recovery job displays Open mitigation work only to the company manager with accepted participation, homeowner approval, separately connected ADPA representation, current matching claim/engagement evidence and an active claim-side assignment. It resolves the explicit linked claim, never searches by address alone, creates no new claim or assignment, and grants no new access. Pending states explain acceptance, approval or work assignment. Policyholders and unrelated companies do not receive the specialist link.

The destination retains exact company/claim parameters through sign-in and rejects an unavailable requested company instead of falling back to a different company. Its existing APIs continue enforcing assignments, source permissions and revocation.

Verification: 233 automated domain/API tests and TypeScript checks passed; the exact source deployment succeeded. Live walkthrough and browser visual verification are deferred. No communication provider activated and no client messages sent. Root React/Express app preserved.
