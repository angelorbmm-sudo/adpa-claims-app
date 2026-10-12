# Invitation tracking and recovery - October 12, 2026

The `/invitations` hub manages company staff invitations (owner and authorized manager, with manager changes limited to technicians) and policyholder dashboard invitations (ADPA owner only). It links from company dashboards, policyholder sharing controls, onboarding review and the ADPA dashboard.

Statuses are Created, Sent, Accepted, Expired and Revoked. Sent requires retained provider receipt/status data; preparing or copying a link never marks it sent. No automatic invitation email delivery was connected. Prepare existing link reuses the same pending invitation. Renew revokes an expired invitation and creates one replacement with the same recipient/role. Correct pending email revokes the prior invitation and creates a fresh reviewed recipient record. Duplicate emails, own-account invitations, stale versions and role escalation are blocked. Accepted identities cannot be silently replaced; revoke and separately review a new invitation.

New pending company-staff and policyholder invitations expire after 14 days. Expiry is enforced in companyAccess and portalAccess, so expired recipients cannot accept via ordinary APIs or use a copied old URL. Already accepted access ignores pending expiration and continues until revocation. Legacy records with no recorded expiration keep their original behavior. Self-registered, already accepted company-manager membership is not expired retroactively.

The `/invitation` resume page retains kind, record ID and invitation ID through sign-in and account switching. Only the exact invited email and any bound user ID can inspect that invitation. Wrong-account errors reveal no invited identity or claim content. Acceptance uses the existing protected company/portal API and opens the exact company or claim workspace. Links are not bearer access tokens and do not grant Site sharing.

Replacement records do not inherit acceptance, user identity, delivery receipts, or old invitation-specific private uploads. Old records and correction/revocation audit events are retained. Company role and portal disclosure rules remain unchanged.

Shared recovery participation remains a separate workflow. Homeowner emails there come from company client/agreement records, so identity changes require client/contract reconciliation rather than this hub rewriting a signed party. App-wide Site access, own company agreements, homeowner approval and evidence permissions remain independent requirements.

Provider-backed email sending, actual resend delivery, broader external Site access and real-user browser acceptance remain future activation/testing tasks. No messages were sent, and the existing owner-private Site audience is unchanged. Automated domain/API tests, TypeScript and production build checks are available; browser visual QA is unavailable in this environment.
