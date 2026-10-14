# Evidence-draft transfer review — 2026-10-13

Module 35 cleanup completed.

- Sending requires the selected reviewed draft revision. A later review/edit cannot silently replace the draft the sender confirmed, even after refreshing the job.
- An already accepted draft returns its existing receipt rather than creating another incoming item after history changes. Acceptance also blocks a second contents count for the same shared physical reference, even with a different tag.
- Scope lines cite every retained supporting original and carry the quantity source locator. PDF quantity pages remain explicit; missing non-quantity PDF pages remain working-scope review gaps. Room selection must match the current destination name.
- Contents imports preserve source each/set/box units and whole group counts without converting pieces into additional items.
- Destination provenance retains original/source links, room/area and physical subject IDs. Acceptance checks original digest and byte length, current ADPA sharing/representation, roles and source/destination versions.
- Transfer notes have Copy/Clear and navigation protection. Source or destination refresh invalidates old confirmation; changed intake preserves notes while pausing acceptance.
- Confirmed writes clear their selected review before refreshing. Refresh failure is reported as a saved write and offers refresh without resending; further actions pause until successful refresh.

Regression checks: stale selected revision, accepted-draft re-send, physical-reference duplicate protection, multi-source scope citations, room mismatch, and review-context freshness. Complete preparation tests, TypeScript and production build validate this release.

Accepted records remain working drafts with unknown prices. No company assignment, carrier sending, automatic valuation, pricing approval, Xactimate export or provider activation is added. Live multi-user/browser walkthrough remains deferred.

Ledger: 22 of 52 review areas completed; 30 remain. Next: replacement and service pricing.
