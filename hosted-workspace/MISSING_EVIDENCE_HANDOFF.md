# Missing evidence checklist — October 13, 2026

## Delivered workflow

The shared Evidence Inbox now begins with a Missing evidence checklist. Every authorized company industry, the accepted policyholder and separately connected ADPA use the same workflow.

1. Record and confirm a photo finding that lists a missing detail.
2. Choose that detail, an approved company / policyholder / ADPA assignee, and an optional real due date.
3. Create the in-app request. Both requester and assignee must already have access to the source original. Creating a request never changes sharing.
4. The assignee uses Upload requested evidence to prefill room/item context and upload through the existing inbox. It then selects the new original and submits a response note. The response must be a different original and shared with both requester and responder. Policyholder file consent is still explicit.
5. Submission changes Requested to Uploaded. The requester opens Review uploaded response, moving it to Needs review.
6. After inspecting the response original, the requester records a reason and either completes this evidence request or asks for more evidence. A follow-up reopens Requested, retaining prior responses and review rationale.
7. The requester or policyholder may cancel an open request with a reason. Closed records remain retained. A completion is not coverage, price, work-scope or claim approval.

## Permissions and integrity

Requests retain immutable confirmed-finding indexes and a snapshot of the detail, label, room/item reference, photo-region locator, original ID/digest/revision/time, requester, assignee and dates. Unconfirmed AI output, foreign files, duplicate active requests for the same finding/detail and invalid calendar dates are rejected.

The original and uploaded response are checked against current metadata and storage availability. Optimistic job and company versions guard changes. ADPA requires the current separate engagement and explicit file consent. Checklist actions never grant access, create claims, alter inventory quantities, calculate prices or complete the file-level review status.

Only the requester, assigned participant and accepted policyholder see a request under current source permissions. Source withdrawal removes its visible checklist record while retaining saved history. Changed source/response metadata, recipient consent, company participation or ADPA representation pause current tasks instead of reporting them complete. Other companies cannot review or cancel a request. Hidden response originals and response notes are omitted from projections; prior server history is retained.

Requested follow-ups can accept a new response even if an earlier response loses sharing; the earlier response is not needed to provide new evidence. Uploaded / Needs review / Complete require current response permissions. Cancellation remains possible for a policyholder/requester who can see the retained source record. Source replacement requires a new current confirmed finding and a new request.

## UI and limits

Filters: My actions, Waiting, Paused, Closed and All authorized requests. My actions follows the selected company role. Policyholders see a count of their actionable requests in Shared evidence, linking to the inbox. Uploading alone does not submit or approve a response. New uploads begin under existing private permissions; use sharing controls before submission.

Up to 200 requests/job and 25 submitted responses/request, within the existing 800 KB job-state limit. Requests appear in the in-app checklist; no email/text or push notification is sent automatically. This task does not activate the still-missing AI service key. Confirmed manual photo findings work immediately.

## Verification

287 automated tests pass, including assignment/consent, response access, review transitions, more-evidence history, stale writes, cancellation and changed ADPA representation. TypeScript and production build checked for the published source. Live browser / phone walkthrough remains deferred because this managed environment has no supported browser QA tool.
