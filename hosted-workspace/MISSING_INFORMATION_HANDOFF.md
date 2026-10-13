# Missing Information checklist

The `/missing-information` workspace connects existing source-linked missing-evidence requests, shared company tasks and inspection questions for one selected shared recovery job. It reuses `/api/shared-jobs` authorization and existing editing/review flows; it does not create a separate task database.

- Policyholders see their own evidence requests, with upload/review guidance.
- Companies see evidence requests they created or were assigned, plus their own company tasks.
- ADPA sees authorized company tasks and requests whose original is currently shared with ADPA under a verified connected engagement. Removing source sharing hides those requests again. ADPA does not gain permission to close another requester's evidence request.
- My actions, Waiting, Paused, Closed and All authorized filters; assignee, internal due date, past-due flag and next action. Due dates are not legal deadlines.
- Checklist links open the existing request, upload, history, sharing and task controls. Source-linked requests originate from confirmed findings; general measurements, receipt, log and invoice requests can use existing company tasks. Policyholder requests remain source-linked.
- Navigation entry added to company/policyholder workspaces and ADPA dashboard. Job list uses existing cursor pagination; detailed evidence loads only for the selected job.
- No implicit consent, new external messaging, AI decisions, financial changes or provider activation. This is a consolidated view, not a comprehensive automated claim completeness audit.

Verification: existing regression suite plus focused checklist/role/consent tests; TypeScript and production build. Browser/phone walkthrough remains deferred. Site audience remains owner-private. No real client records modified.
