# Carrier communication timeline and reply drafts — canonical area 18

Completed 2026-10-14. Review coverage is now 47/52 canonical areas; five dedicated passes remain. Next is area 20, Coverage accounting and routing.

Timeline records are append-only: corrections require a new note. Follow-ups must match their source and retain earlier facts; completion may be changed. Calendar dates, identifiers, field lengths and record counts are validated on the server. Legacy unrelated saves remain allowed.

Switching reply sources captures typed recipient, subject and body. Unrecorded conversation form fields block the claim save until recorded or explicitly cleared. Reply approval requires an actual email, single-line headers, the current claim number in the subject and current source provenance. Approval records preparation only and does not send a message. Reopening a stale approved draft requires review.

Server-stamped communicationHistory retains actor, time, prior version and before/after values, rejects ordinary-save forgery and stops at 300 revisions without dropping earlier history. The older client commAudit is a convenience activity list, not authoritative proof. Final claim updates compare version, exact prior state, name/address and existing evidence/template guards, preventing same-version concurrent overwrites.

The dedicated source fragment and sync script update only carrier communications within the existing generated workspace. All other module fragments are preserved.

Validation: 699 automated tests passed, TypeScript check passed, generated inline JavaScript syntax passed. Targeted regressions cover immutable records, corrections, invalid dates/IDs/tasks, approval prerequisites, stale provenance, history forgery/cap, same-version save conflict and typed draft retention.

Browser/iPhone and real multi-user walkthroughs remain pending; no browser automation was available. Real email delivery, provider integrations, specialist review, security/recovery/performance and controlled pilot remain release gates. No real correspondence was sent.
