# Ready to begin work — October 12, 2026

`/job-readiness?companyId=…&clientId=…` extends the existing first-job workflow. It derives six checks from current records: client/property, retained verified company agreement, policyholder acceptance, company approval, future visit with responsible person/team, and at least one open initial task. No readiness override is saved and no new work authority is granted.

Company manager access uses the existing first-job API. Other company records remain private. Client email/property must match the recovery job. Cancelled clients, removed participation, missing signature originals, unapproved companies, past/cancelled/unassigned visits and missing open tasks prevent completion. Evidence count includes only active company-contributed or explicitly shared items, and does not treat participation as blanket evidence permission.

Visits and tasks are saved through the existing shared-job API, with company/job version guards. Responsible person/team is a text label, not a user permission. Only an accepted company manager may plan that company's visit; ADPA's owner review privilege does not impersonate the manager. Existing appointments remain compatible, but need a responsible label to satisfy this planning checklist. Visible page refreshes every 30 seconds; failed refresh removes old readiness. Unsaved inputs are kept on save failure and protected by a leave warning.

Exact recovery-job links reuse the job, client, tasks, conversations and permissioned originals. Industry recommendations use existing multi-industry classification. Specialist mitigation/contents dashboards require separately configured ADPA claim/crew/scope assignments; readiness does not grant them. No stand-alone reconstruction estimating dashboard is claimed here.

External signature/email/SMS/call/push providers are not activated. No invitations or client communications are sent by this build. Private Site audience preserved. Browser QA is unavailable in this environment; domain/API tests, TypeScript and production build verify implementation, not live visual interactions.
