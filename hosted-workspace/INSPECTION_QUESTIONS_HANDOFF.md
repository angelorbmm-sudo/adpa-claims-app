# Inspection questions → ADPA

Implemented for every approved company industry using the common shared recovery job.

1. Save a factual initial inspection with an optional question and 1–12 original references.
2. Connect ADPA to the homeowner's separate matching claim and current engagement evidence.
3. Policyholder deliberately shares every inspection original with ADPA.
4. Source company manager selects **Send question to ADPA**. This creates one immutable-origin shared task per inspection, bound to that claim and engagement. Repeat submissions are rejected; corrected observations use their own question.
5. ADPA sees authorized open questions in the existing morning **Ready for your review** queue. The link opens that job's Inspection tab. Tasks also appear in the job's existing Tasks tab.
6. Connected ADPA records an answer. Answers append with actor and time; no prior answer is overwritten. Task remains open as **Answered — company review**.
7. Source company manager reviews the answer and records a resolution note. Only then does the task become **Resolved** and leave ADPA's queue.

## Access and evidence

The source company and accepted policyholder can retain question/answer history. Other companies never receive the question task or answers, even when the inspection originals are shared with them. ADPA gets the task only while all inspection originals are current and shared and the exact representation connection is current. Removed participation, archived companies, withdrawn originals, changed metadata or changed claim/engagement block actions. History retained by the company/policyholder shows **Action paused** when these prerequisites lapse. An answer on an earlier corrected inspection is labeled accordingly, not treated as approval of the correction.

Every mutation checks job/company versions; claim and engagement originals, source assets and contributing company versions are guarded at the atomic job update. Normal company task completion cannot close an inspection question. No company can write an ADPA answer. No access is granted by sending a question, and no claim-side assignment, scope, estimate, evidence import, email, SMS or carrier approval is created automatically.

## Verification and limits

Automated tests cover full send/answer/resolve flow, duplicate submission, role isolation, immutable provenance, stale versions, ordinary-task completion bypass, withheld/withdrawn evidence, changed engagement, source changes, corrections, and morning-queue integration. TypeScript and production build required. Live multi-user browser walkthrough is deferred as requested. Answers are deliberately shared with the source company and policyholder, so private claim strategy belongs in ADPA's separate private records.
