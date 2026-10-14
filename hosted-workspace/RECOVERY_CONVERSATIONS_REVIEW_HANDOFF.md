# In-app conversations and appointments review — 2026-10-14

Canonical area 17 completed. Ledger: 46 of 52 canonical areas covered; 6 dedicated reviews remain. Next: area 18 Carrier communication timeline and reply drafts.

## Changes

- A company sender may speak only in its own private company conversation or the team channel, even when the account manages multiple approved companies. ADPA-role communication/visit writes require current separate engagement evidence, bound to the final update.
- The recovery panel gives message and appointment writes a stable request ID tied to job and entered facts. Retries return the existing record instead of inserting another. Changed facts for the same ID are rejected; current role and original actor are checked. Refresh/version changes do not silently replace the request ID. Legacy callers without request IDs retain existing version safeguards.
- Automatic and manual recovery reads share a request gate; obsolete results cannot replace a newer refresh/job. Auto refresh pauses during writes, accepted writes invalidate earlier reads, and failed current reads clear stale job actions while preserving unrecorded entries. Saved updates remain explicitly reported as saved after refresh failure.
- The parent shared workspace receives recovery working/draft state. Parent refresh and competing coordination actions cannot discard active message/visit entries. The recovery panel still supports its own status refresh and explicit draft clearing. Removed conversation audiences retain draft text but block sending until a current audience is chosen.
- Appointment entry uses Pacific civil time independent of device timezone. Winter/summer offsets are resolved explicitly; invalid dates, nonexistent spring-forward times and repeated fall-back times require another time instead of silent normalization. Displayed invalid legacy timestamps do not crash the panel.
- Withdrawn company/ADPA participation removes a visit from upcoming eligibility while retaining its historical schedule. This does not claim external cancellation or send a notification. Cancellation records retain who cancelled, reason and time; audit entries identify the exact message/appointment.

## Validation

692 automated tests passed, including seven new regressions for multi-company sender binding, Pacific winter/summer/clock-change behavior, withdrawn visit eligibility, removed ADPA engagement, message retry identity, appointment retries/cancellation audit and stable request IDs across version changes. Existing private-channel visibility, company-specific scheduling/cancellation, pending invitation isolation and saved-refresh outcome tests pass. TypeScript passed; production build runs during packaging.

## Pending

Browser/iPhone, actual multi-user conversation walkthroughs and provider activation remain pending because supported browser QA is unavailable. Saved in-app messages/visits do not send email, SMS, push notifications or external calendar invitations. Team history is visible to newly approved participants as described in the interface. Revocation cannot recall downloaded records. No real message, appointment, invitation or payment was created during this code review; owner-private access is preserved.
