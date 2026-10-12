# Focused company dashboard and navigation

The everyday entry point is `/company-jobs`, for all company industries. It uses actual selected company classifications and accepted user roles. There is no Arman- or Ana-specific account hardcoding.

## Daily flow

- My jobs shows a company's next actionable task, items waiting on ADPA, and jobs with upcoming shared visits.
- A Start here action opens the exact assigned work screen. Company replies waiting on ADPA are shown as waiting, not unfinished company actions.
- Jobs needing action appear first. All jobs, Needs action, Waiting and Visits filters plus a name/address search apply to the loaded pages. Recovery and legacy assignment pagination remain separately available. Counts explicitly apply to loaded pages; they are not portfolio-wide totals.
- One main action appears per job. Additional documents, inspection and coordination links are available in More job options.
- Multiple-company managers retain an explicit company selector. The selected company is preserved in workspace and business-tool links, and supported task tabs survive authentication.

## Navigation

One reusable CompanyNavigation component keeps My jobs accessible throughout company work. Mitigation's main job menu focuses on summary, requests, daily field documentation and messages; source files, equipment review, material decisions, detailed scope and billing remain in More job tools. Contents focuses on summary, inventory, pack/clean/return and requests/messages, with evidence under More job tools.

Shared recovery jobs retain people/permissions, inspection, documents and tasks/visits/messages. Client agreements and marketing keep their own focused module menus. Setup, marketing, template/connection management and staff access are secondary Company tools. ADPA administration links appear only for the actual owner. Managers receive business-management shortcuts; technicians do not receive the manager shortcut menu. Server authorization still independently controls every operation.

Shared-job policyholders get My recovery linking to `/policyholder`, not the company landing page. Their existing company participation and evidence sharing controls remain available.

## Preserved behavior

No policies, scopes, contracts, evidence sharing permissions, client records or claim approvals are changed by this UI work. Industry classification does not grant specialist access: exact assignment and job consent checks remain required. Companies with multiple services keep those services and use the correct authorized job workspaces. Source withdrawal or changed ADPA engagement removes an inspection-answer shortcut until its prerequisites are current.

The dashboard refreshes every 30 seconds while visible and clears displayed job data on errors. Recorded visits and tasks come from saved records; the UI does not imply background completion, external messaging, Xactimate activation, insurance approval or payment release.

## Design and validation

Design rationale follows GOV.UK's service-navigation guidance (show important sections rather than the whole site map) and Nielsen Norman Group's progressive disclosure guidance (make secondary tools available when needed):
- https://design-system.service.gov.uk/patterns/navigate-a-service/
- https://www.nngroup.com/articles/progressive-disclosure/

Responsive layouts, text labels, visible keyboard focus, native expandable menus and at least 44px primary controls are used. Tests cover exact task routing, company/service isolation, manager vs technician projections, waiting vs actionable tasks and source withdrawal. TypeScript and production build must pass before publication. Automated checks are not a usability study: browser/device walkthrough and Arman/Ana feedback remain deferred.
