# Policyholder recovery dashboard - October 12, 2026

The existing `/policyholder` claim portal now includes a recovery workspace backed by the same `/api/shared-jobs` records used by company managers. It shows linked companies, visits, work tasks and permissioned original evidence. A policyholder can search listed companies, invite a provider, and approve it after its own verified signed service contract. Invitations alone do not grant work access. The same conversation and appointment interface appears on `/shared-jobs` for company managers and separately connected ADPA.

The claim selector uses the explicit ADPA claim link; properties are never joined by matching names or addresses in the UI. Homeowners with no ADPA claim invitation can still use their accepted recovery job at `/policyholder`. The claim-specific portal retains its existing publication, document, payment and client-response controls.

Conversations have three audiences: the accepted job team; homeowner plus one approved company; and homeowner plus separately connected ADPA. Direct company messages are excluded from other companies and ADPA. New approved participants can read the job-team history; the UI explains this. Ordinary message senders cannot choose arbitrary sender names. Revoked or removed managers lose subsequent read/write access.

Only an approved company manager or connected ADPA can schedule a visit, and only that scheduling organization can cancel it with a reason. Appointment instants are stored in ISO format; entry uses the device timezone and display uses Pacific Time. Past and cancelled records are retained.

Records are server-persisted with optimistic version checks and company membership/version guards. Active recovery views check for updates every 30 seconds while visible. This is polling, not websocket live delivery. Conflict failures retain the typed message. These in-app messages do not send SMS, email, telephone calls or push notifications. Twilio/mail integrations remain Jose's future task.

The existing owner-private Site audience has been preserved. Real policyholder/company rollout requires separate authorized Site access and each app invitation/contract/approval. Browser QA is unavailable in this managed environment. Automated API and domain tests plus TypeScript and production build checks are the available validation. Provider activation, broader staff-role access, long-term immutable archiving and multi-device production acceptance still require validation before a real-client launch.
