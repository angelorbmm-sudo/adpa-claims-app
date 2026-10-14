# Coverage accounting and routing — canonical area 20

Completed 2026-10-14. Coverage is now 48/52 canonical areas; four dedicated passes remain. Next: area 41 Contents PDF and spreadsheet package.

Coverage amounts distinguish unknown/blank from explicit zero. Changed amounts must be nonnegative, finite, bounded to 999999999 and have at most two decimal places. Invalid prior legacy fields may remain unchanged during unrelated saves. The server rejects invalid new amounts without overwriting the stored claim. Scheduled-limit comparisons operate in cents and flag invalid values instead of displaying a misleading difference. The generated workspace keeps the new helpers in a dedicated synchronized fragment.

Routing source hashes now include evidence MIME as well as identifier, filename, size, category and creation provenance. Final routing writes compare the exact claim version/state/name/address and evidence count and manifest, preventing concurrent changes, additions, deletions or replacements from slipping through after validation. The five base coverages do not consume the allowance of thirty separate issues. Existing history remains retained at its bound.

Threshold saves preserve an open workstream draft. Workstream saves preserve unsaved threshold edits. Switching claims, reviews, cancellation and explicit refresh guard unsaved edits; unloading warns. Controls prevent concurrent duplicate writes. Latest-request checks prevent older load responses replacing newer results. A confirmed save remains successful when refresh fails, offers reload and requires reloaded facts before another write. Rejected writes keep draft entries.

Validation: all 710 tests passed, including exact-state/evidence race guards, MIME provenance, issue allowance, retained history, threshold-draft preservation, save/refresh outcomes, invalid accounting rejection, legacy unchanged values and cents/unknown comparisons. TypeScript, generated inline JavaScript syntax and production build passed. Prior variance thresholds, urgent deadlines, serious issue overrides, independent coverage routes, authorization and preserved financial/authority checks continue to pass.

No live claim financial values, settlement approvals or real correspondence were changed by this review. Browser/iPhone and real multi-user walkthroughs remain pending; supported browser automation was unavailable. Provider integrations, specialist review, security/recovery/performance validation and controlled pilot remain separate release gates.
