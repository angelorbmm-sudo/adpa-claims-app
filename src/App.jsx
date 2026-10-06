import React, { useEffect, useMemo, useState } from "react";
import { emptyClaim } from "./data/seed.js";
import { demoWorkspace } from "./data/demo.js";
import { loadWorkspace, nowIso, saveWorkspace, uid } from "./lib/storage.js";
import { apiEnabled, fetchClaims, saveClaimRemote } from "./lib/api.js";
import EstimateComparison from "./components/EstimateComparison.jsx";
import PaymentLedger from "./components/PaymentLedger.jsx";
import WorkQueue from "./components/WorkQueue.jsx";
import EvidenceEngine from "./components/EvidenceEngine.jsx";
import CommunicationsHub from "./components/CommunicationsHub.jsx";
import CarrierDeadlineCenter from "./components/CarrierDeadlineCenter.jsx";
import AuthorityReleaseControl from "./components/AuthorityReleaseControl.jsx";
import AIClaimReviewCenter from "./components/AIClaimReviewCenter.jsx";
import ContentsValuationCenter from "./components/ContentsValuationCenter.jsx";
import ALEManagementCenter from "./components/ALEManagementCenter.jsx";
import SupplementsDisputeCenter from "./components/SupplementsDisputeCenter.jsx";
import MortgageLossDraftCenter from "./components/MortgageLossDraftCenter.jsx";
import PolicyEndorsementCenter from "./components/PolicyEndorsementCenter.jsx";
import ComplianceCenter from "./components/ComplianceCenter.jsx";
import IssueNegotiationCenter from "./components/IssueNegotiationCenter.jsx";
import DepreciationRecoveryCenter from "./components/DepreciationRecoveryCenter.jsx";
import ClaimLifecycleChronology from "./components/ClaimLifecycleChronology.jsx";
import { complianceStatus } from "./lib/stateCompliance.js";
import PortfolioDashboard from "./components/PortfolioDashboard.jsx";
import RepresentationContractCenter from "./components/RepresentationContractCenter.jsx";
import EvidenceStandardsCenter from "./components/EvidenceStandardsCenter.jsx";
import AgreementPacketCenter from "./components/AgreementPacketCenter.jsx";
import RoutingControlCenter from "./components/RoutingControlCenter.jsx";
import CriticalEventCenter from "./components/CriticalEventCenter.jsx";
import ContractorCommitmentCenter from "./components/ContractorCommitmentCenter.jsx";
import ClaimClosureAuditCenter from "./components/ClaimClosureAuditCenter.jsx";
import FinalFinancialReconciliation from "./components/FinalFinancialReconciliation.jsx";
import DataTransitionCenter from "./components/DataTransitionCenter.jsx";
import { reconciliationForClaim, closureBlockers } from "./lib/claimReconciliation.js";
import { claimWorkflowIntelligence } from "./lib/workflowIntelligence.js";

const modules = [
  ["portfolio", "Portfolio Command"],
  ["overview", "Claim Dashboard"],
  ["workqueue", "Work Queue"],
  ["routing", "Seven-Bucket Routing"],
  ["intake", "Claim Intake"],
  ["compliance", "State Compliance"],
  ["representation", "Representation & Contract"],
  ["coverage", "Coverage & Valuation"],
  ["policy", "Policy & Endorsements"],
  ["evidence", "Documents & Evidence"],
  ["proofplan", "Evidence Standards"],
  ["contents", "Contents"],
  ["ale", "ALE / Loss of Use"],
  ["estimates", "Estimate Comparison"],
  ["contractor", "Contractor Commitment"],
  ["payments", "Payment Ledger"],
  ["financial", "Final Financial Reconciliation"],
  ["communications", "Communications"],
  ["deadlines", "Carrier Deadline Clock"],
  ["issues", "Issues & Negotiation"],
  ["critical", "Critical Events / EUO"],
  ["chronology", "Lifecycle & Chronology"],
  ["supplements", "Supplements"],
  ["mortgage", "Mortgage"],
  ["agreements", "Agreements"],
  ["receipts", "Receipts & Depreciation"],
  ["package", "Claim Package"],
  ["approvals", "Approvals & Signatures"],
  ["recovery", "Recovery Follow-up"],
  ["closure", "Closure & Final Audit"],
  ["ai", "AI Preparation"],
  ["transition", "Production Data Readiness"]
];


const workflowStages = [
  {key:"intake",label:"1 Intake",test:c=>!!(c.insured&&c.property&&c.carrier&&c.claimNumber&&c.dateOfLoss&&c.causeOfLoss),help:"Complete insured, property, carrier, claim number, date and cause of loss."},
  {key:"policy",label:"2 Policy",test:c=>(c.policyAnalysis?.declarations?.length||0)>0 || c.compliance?.policyStatus==="Collected",help:"Collect declarations/policy and begin coverage review."},
  {key:"evidence",label:"3 Evidence",test:c=>(c.documents?.length||0)>0,help:"Add and classify claim evidence."},
  {key:"estimates",label:"4 Damages & Estimates",test:c=>(c.estimateComparisons?.length||0)>0 || (c.contents?.length||0)>0,help:"Document damages and compare estimates/contents."},
  {key:"payments",label:"5 Payments",test:c=>(c.payments?.length||0)>0 || (c.coverages||[]).some(x=>Number(x.issued||0)>0),help:"Reconcile carrier payments and coverage allocations."},
  {key:"issues",label:"6 Issues & Supplements",test:c=>(c.issues?.length||0)>0 || (c.supplements?.length||0)>0,help:"Track disputed items, supplements and negotiation."},
  {key:"package",label:"7 Claim Package",test:c=>{const p=(c.packages||[]).at(-1);return !!p&&!String(p.status||"").startsWith("Stale")&&p.status!=="Superseded";},help:"Assemble a current versioned claim package."},
  {key:"approvals",label:"8 PA / Client Authority",test:c=>{const p=(c.packages||[]).at(-1),h=p?.snapshotHash||"";return !!h&&(c.approvals||[]).some(a=>a.packageHash===h&&a.stage==="Licensed PA Approval"&&!a.revokedAt)&&(c.approvals||[]).some(a=>a.packageHash===h&&a.stage==="Client Authorization"&&!a.revokedAt);},help:"Licensed PA review and client authorization are separate gates."},
  {key:"recovery",label:"9 Recovery",test:c=>(c.recovery||[]).every(x=>x.status==="Closed"),help:"Finish depreciation, lender and other recovery follow-up."},
  {key:"closure",label:"10 Close & Audit",test:c=>c.closure?.status==="Closed",help:"Reconcile and close only after all controls pass."}
];
function workflowForClaim(claim,complianceGate){
 const r=reconciliationForClaim(claim), closure=closureBlockers(claim,complianceGate);
 const stages=workflowStages.map(s=>({...s,done:s.test(claim)}));
 let next=stages.find(s=>!s.done)||stages.at(-1);
 if(stages.find(s=>s.key==="payments")?.done && (Math.abs(r.ledgerDifference)>0.01||r.depreciationOutstanding>0.01||r.lenderHeld>0.01)) next={key:"financial",label:"Financial Reconciliation",help:"Resolve payment, depreciation or mortgage reconciliation before closure.",done:false};
 return {stages,next,reconciliation:r,closure};
}

function money(v) {
  return Number(v || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function packageRelevantClaim(claim) {
  const { packages, approvals, signatures, releaseRecords, closure, routing, updatedAt, ...substantive } = claim || {};
  return JSON.stringify(substantive);
}

function markPackageStaleIfNeeded(prior, next) {
  const priorPackages = prior?.packages || [];
  const nextPackages = next?.packages || [];
  if (!priorPackages.length || priorPackages.length !== nextPackages.length) return next;
  if (packageRelevantClaim(prior) === packageRelevantClaim(next)) return next;
  let marked = false;
  const packages = nextPackages.map((p, i) => {
    if (!marked && i === nextPackages.length - 1 && p.status !== "Superseded") {
      marked = true;
      return { ...p, status: "Stale — claim data changed", staleAt: nowIso() };
    }
    return p;
  });
  return { ...next, packages };
}

function App() {
  const isDemo = import.meta.env.VITE_DEMO_MODE === "true";
  const [workspace, setWorkspace] = useState(() => loadWorkspace() || (isDemo ? demoWorkspace() : { claims: [], selectedId: null }));
  const [tab, setTab] = useState("overview");
  const [draft, setDraft] = useState(() => emptyClaim());
  const [serverVersions, setServerVersions] = useState({});
  const [syncState, setSyncState] = useState(apiEnabled() ? "Loading authoritative server data…" : "Browser workspace mode");

  const selected = useMemo(
    () => workspace.claims.find(c => c.id === workspace.selectedId) || null,
    [workspace]
  );

  useEffect(() => {
    // localStorage is a local draft/cache only when the API is enabled.
    saveWorkspace(workspace);
  }, [workspace]);

  useEffect(() => {
    if (!apiEnabled()) return;
    let cancelled = false;
    (async () => {
      try {
        const remote = await fetchClaims();
        if (cancelled) return;
        const claims = remote.claims || [];
        setServerVersions(remote.versions || {});
        setWorkspace(w => ({
          claims,
          selectedId: claims.some(c => c.id === w.selectedId) ? w.selectedId : (claims[0]?.id || null)
        }));
        setSyncState("Server authoritative");
      } catch (error) {
        if (!cancelled) setSyncState("SERVER UNAVAILABLE — local cache is read-only until connection returns");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (selected) setDraft(structuredClone(selected));
    else setDraft(emptyClaim());
  }, [selected?.id, selected?.updatedAt]);

  async function persistAuthoritative(claim) {
    if (!apiEnabled()) return claim;
    const result = await saveClaimRemote(claim, serverVersions[claim.id]);
    setServerVersions(v => ({ ...v, [claim.id]: result.version }));
    setSyncState("Server authoritative · saved");
    return result.claim;
  }

  async function createClaim() {
    const claim = emptyClaim();
    claim.id = uid("claim");
    claim.insured = "New Claim";
    claim.updatedAt = nowIso();
    if (apiEnabled()) {
      try {
        const saved = await persistAuthoritative(claim);
        setWorkspace(w => ({ ...w, claims: [saved, ...w.claims], selectedId: saved.id }));
      } catch (error) {
        setSyncState("SAVE FAILED — server remains authoritative");
        return;
      }
    } else setWorkspace(w => ({ ...w, claims: [claim, ...w.claims], selectedId: claim.id }));
    setTab("intake");
  }

  async function saveClaim(next = draft) {
    const guarded = markPackageStaleIfNeeded(draft, next);
    let saved = { ...guarded, updatedAt: nowIso() };
    if (apiEnabled()) {
      try { saved = await persistAuthoritative(saved); }
      catch (error) { setSyncState("SAVE FAILED — server remains authoritative"); return; }
    }
    setWorkspace(w => ({
      ...w,
      claims: w.claims.map(c => c.id === saved.id ? saved : c),
      selectedId: saved.id
    }));
    setDraft(saved);
  }

  function updateClaimById(claimId, updater) {
    setWorkspace(w => ({
      ...w,
      claims: w.claims.map(c => { if (c.id !== claimId) return c; const next = updater(c); return { ...markPackageStaleIfNeeded(c, next), updatedAt: nowIso() }; })
    }));
  }

  function openClaim(claimId, targetTab = "overview") {
    setWorkspace(w => ({ ...w, selectedId: claimId }));
    setTab(targetTab);
  }

  function patch(field, value) {
    setDraft(d => ({ ...d, [field]: value }));
  }

  function patchCoverage(index, field, value) {
    setDraft(d => {
      const coverages = d.coverages.map((c, i) => i === index ? { ...c, [field]: Number(value || 0) } : c);
      return { ...d, coverages };
    });
  }

  function addRecord(field, record) {
    const next = { ...draft, [field]: [...draft[field], { id: uid(field), createdAt: nowIso(), ...record }] };
    saveClaim(next);
  }

  async function assemblePackage() {
    const snapshot = {
      claimId: draft.id,
      insured: draft.insured,
      property: draft.property,
      carrier: draft.carrier,
      claimNumber: draft.claimNumber,
      coverages: draft.coverages,
      valuation: draft.valuation,
      contents: draft.contents,
      supplements: draft.supplements,
      receipts: draft.receipts,
      recovery: draft.recovery,
      estimateComparisons: draft.estimateComparisons || [],
      payments: draft.payments || [],
      ale: draft.ale || {},
      mortgage: draft.mortgage || {},
      policyAnalysis: draft.policyAnalysis || {},
      jurisdiction: draft.jurisdiction || "CA",
      deadlineClocks: draft.deadlineClocks || [],
      compliance: draft.compliance || {},
      representation: draft.representation || {},
      evidencePlan: draft.evidencePlan || {},
      issues: draft.issues || [],
      lifecycle: draft.lifecycle || {},
      routing: draft.routing || {},
      criticalEvents: draft.criticalEvents || [],
      contractorCommitments: draft.contractorCommitments || [],
      communications: draft.communications || [],
      aiPrep: draft.aiPrep || {},
      aiFindings: draft.aiFindings || [],
      documentManifest: draft.documents.map(({ id, name, category, size, createdAt }) => ({ id, name, category, size, createdAt })),
      assembledAt: nowIso()
    };
    const encoded = new TextEncoder().encode(JSON.stringify(snapshot));
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", encoded)))
      .map(b => b.toString(16).padStart(2, "0")).join("");
    const existing = draft.packages || [];
    const superseded = existing.map(p => p.status === "Superseded" ? p : { ...p, status: "Superseded", supersededAt: nowIso() });
    const nextPackage = {
      id: uid("packages"),
      createdAt: nowIso(),
      version: existing.length + 1,
      name: "Claim Package v" + (existing.length + 1) + " — " + new Date().toLocaleString(),
      snapshotHash: hash,
      snapshot,
      status: "Draft",
      priorPackageHash: existing.at(-1)?.snapshotHash || ""
    };
    saveClaim({ ...draft, packages: [...superseded, nextPackage] });
  }

  if (!selected) {
    return (
      <div className="app">
        {isDemo && <div className="demo-banner">ADPA DEMO — TEST DATA ONLY — DO NOT ENTER REAL CLIENT INFORMATION</div>}
        <header className="topbar"><div><strong>ADPA Claims</strong><span>{isDemo ? "Demo Playground" : "Private Working Workspace"}</span></div></header>
        <main className="empty">
          <h1>ADPA Claims Workspace</h1>
          <p>This recovered build keeps regulated decisions behind human and licensed approval gates.</p>
          <button onClick={createClaim}>Create first claim</button>
          {workspace.claims.length > 0 && (
            <div className="claim-list">
              {workspace.claims.map(c => <button key={c.id} onClick={() => openClaim(c.id)}>{c.insured || "Unnamed Claim"}</button>)}
            </div>
          )}
        </main>
      </div>
    );
  }

  const totalRequested = draft.coverages.reduce((s, c) => s + Number(c.requested || 0), 0);
  const totalReceived = draft.coverages.reduce((s, c) => s + Number(c.received || 0), 0);
  const ledgerPaid = (draft.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0);
  const complianceGate = complianceStatus(draft);
  const openIssues = (draft.issues || []).filter(x => x.status !== "Resolved");
  const issueVariance = openIssues.reduce((s,x)=>s + Number(x.adpaAmount||0) - Number(x.carrierAmount||0),0);
  const deadlineLate = (draft.deadlineClocks || []).filter(x => x.status !== "Satisfied" && (x.verifiedDueDate || x.dueDate) && new Date((x.verifiedDueDate || x.dueDate)+"T23:59:59").getTime() < Date.now()).length;
  const depreciationOutstanding = (draft.receipts || []).reduce((s,x)=>s+Number(x.recoverableDepreciation||0)-Number(x.released||0),0);
  const workflow = workflowForClaim(draft, complianceGate);
  const intelligence = claimWorkflowIntelligence(draft);

  return (
    <div className="app">
      <header className="topbar">
        <div><strong>ADPA Claims</strong><span>Private Working Workspace · {syncState}</span></div>
        <div className="actions">
          <select value={selected.id} onChange={e => openClaim(e.target.value)}>
            {workspace.claims.map(c => <option key={c.id} value={c.id}>{c.insured || "Unnamed Claim"}</option>)}
          </select>
          <button onClick={createClaim}>+ New claim</button>
          <button className="primary" onClick={() => saveClaim()}>Save claim</button>
        </div>
      </header>

      <div className="shell">
        <aside>
          <div className="claim-card">
            <b>{draft.insured || "Unnamed Claim"}</b>
            <small>{draft.carrier || "Carrier not entered"}</small>
            <small>{draft.claimNumber || "Claim # not entered"}</small>
            <small>{draft.jurisdiction || "State?"} · Compliance {complianceGate.cleared ? "CLEAR" : "HOLD"} · {openIssues.length} open issue(s) · {deadlineLate} late clock(s)</small>
          </div>
          <nav>{modules.map(([key, label]) => <button className={tab === key ? "active" : ""} key={key} onClick={() => setTab(key)}>{label}</button>)}</nav>
        </aside>

        <main>
          {tab === "portfolio" && <PortfolioDashboard claims={workspace.claims} onOpenClaim={openClaim} />}
          {tab === "overview" && (
            <section>
              <h1>Claim Dashboard</h1>
              <div className="panel">
                <h2>Claim Workflow</h2>
                <p><b>Recommended next step:</b> {intelligence.next.label} — {intelligence.next.status}</p>
                <p className="muted">{intelligence.next.nextAction}</p>
                <button className="primary" onClick={() => setTab(intelligence.next.targetTab)}>Continue claim →</button>
                <div className="workflow-summary"><span>Complete: {intelligence.counts["Complete"]}</span><span>In progress: {intelligence.counts["In Progress"]}</span><span>Needs attention: {intelligence.counts["Blocked / Needs Attention"]}</span><span>PA review: {intelligence.counts["Needs PA Review"]}</span></div>
                <div className="workflow-strip">
                  {intelligence.stages.map(s => <button key={s.key} className={s.status==="Complete" ? "workflow-done" : s.status==="Needs PA Review" ? "workflow-pa" : s.status==="Blocked / Needs Attention" ? "workflow-blocked" : ""} title={s.detail} onClick={() => setTab(s.targetTab)}>{s.status==="Complete" ? "✓ " : ""}{s.label}<small>{s.status}</small></button>)}
                </div>
                {workflow.closure.blockers.length > 0 && <details><summary>{workflow.closure.blockers.length} closure blocker(s)</summary><ul>{workflow.closure.blockers.map((b,i)=><li key={i}>{b}</li>)}</ul></details>}
              </div>
              <div className="stats">
                <Stat label="Requested" value={money(totalRequested)} />
                <Stat label="Received" value={money(totalReceived)} />
                <Stat label="Open follow-ups" value={(draft.recovery || []).filter(x => x.status !== "Closed").length} />
                <Stat label="Evidence files" value={(draft.documents || []).length} />
                <Stat label="Payment ledger total" value={money(ledgerPaid)} />
                <Stat label="Compliance gate" value={complianceGate.cleared ? "CLEAR" : "HOLD"} />
                <Stat label="Open issue variance" value={money(issueVariance)} />
                <Stat label="Late carrier clocks" value={deadlineLate} />
                <Stat label="Depreciation outstanding" value={money(depreciationOutstanding)} />
              </div>
              <Panel title="Next controls">
                <ul>
                  <li>Confirm policy / coverage source before relying on a coverage conclusion.</li>
                  <li>Licensed PA approval is separate from operational review.</li>
                  <li>Client authorization is required before settlement or compromise.</li>
                  <li>External sending remains disabled in this recovery build.</li>
                </ul>
              </Panel>
            </section>
          )}

          {tab === "routing" && <RoutingControlCenter claim={draft} onChange={routing => saveClaim({ ...draft, routing })} />}
          {tab === "workqueue" && (
            <WorkQueue
              claims={workspace.claims}
              selectedId={selected.id}
              onOpenClaim={openClaim}
              onUpdateClaim={updateClaimById}
            />
          )}

          {tab === "intake" && (
            <section>
              <h1>Claim Intake</h1>
              <div className="grid">
                <Field label="Insured" value={draft.insured} onChange={v => patch("insured", v)} />
                <Field label="Property" value={draft.property} onChange={v => patch("property", v)} />
                <Field label="Carrier" value={draft.carrier} onChange={v => patch("carrier", v)} />
                <Field label="Claim number" value={draft.claimNumber} onChange={v => patch("claimNumber", v)} />
                <Field type="date" label="Date of loss" value={draft.dateOfLoss} onChange={v => patch("dateOfLoss", v)} />
                <label>Claim jurisdiction<select value={draft.jurisdiction || "CA"} onChange={e => patch("jurisdiction", e.target.value)}><option value="CA">California</option><option value="NV">Nevada</option></select></label>
                <Field label="Cause of loss" value={draft.causeOfLoss} onChange={v => patch("causeOfLoss", v)} />
                <Field label="Mortgage servicer" value={draft.mortgageServicer} onChange={v => patch("mortgageServicer", v)} />
                <label>Representation status<select value={draft.representationStatus} onChange={e => patch("representationStatus", e.target.value)}><option>Pending</option><option>Active</option><option>Terminated</option></select></label>
              </div>
              <label>Internal notes<textarea value={draft.notes} onChange={e => patch("notes", e.target.value)} /></label>
            </section>
          )}

          {tab === "coverage" && (
            <section>
              <h1>Coverage & Policy Valuation</h1>
              <div className="table-wrap"><table><thead><tr><th>Coverage</th><th>Limit</th><th>Requested</th><th>Carrier</th><th>Issued</th><th>Received</th></tr></thead><tbody>
                {draft.coverages.map((c, i) => <tr key={c.key}><td><b>{c.key}</b> {c.name}</td>{["limit","requested","carrier","issued","received"].map(f => <td key={f}><input type="number" value={c[f]} onChange={e => patchCoverage(i, f, e.target.value)} /></td>)}</tr>)}
              </tbody></table></div>
              <div className="grid">
                <label>Policy valuation<select value={draft.valuation} onChange={e => patch("valuation", e.target.value)}><option>Unreviewed</option><option>RCV</option><option>ACV</option><option>Mixed</option><option>Actual Loss Sustained</option></select></label>
                <Field label="Source / policy provision" value={draft.valuationSource} onChange={v => patch("valuationSource", v)} />
                <Field label="Reviewer" value={draft.valuationReviewer} onChange={v => patch("valuationReviewer", v)} />
              </div>
              <p className="notice">Ordinance / Law is tracked separately and must be tied to policy language and applicable code support.</p>
            </section>
          )}

          {tab === "compliance" && <ComplianceCenter claim={draft} onChange={compliance => saveClaim({ ...draft, compliance })} />}
          {tab === "representation" && <RepresentationContractCenter claim={draft} onChange={representation => saveClaim({ ...draft, representation })} />}
          {tab === "policy" && <PolicyEndorsementCenter claim={draft} onChange={policyAnalysis => saveClaim({ ...draft, policyAnalysis })} />}
          {tab === "evidence" && <EvidenceEngine claim={draft} onChange={documents => saveClaim({ ...draft, documents })} />}
          {tab === "proofplan" && <EvidenceStandardsCenter claim={draft} onChange={evidencePlan => saveClaim({ ...draft, evidencePlan })} />}
          {tab === "estimates" && <EstimateComparison records={draft.estimateComparisons || []} onChange={records => saveClaim({ ...draft, estimateComparisons: records })} />}
          {tab === "contractor" && <ContractorCommitmentCenter claim={draft} onChange={contractorCommitments => saveClaim({ ...draft, contractorCommitments })} />}
          {tab === "payments" && <PaymentLedger payments={draft.payments || []} coverages={draft.coverages} onChange={payments => saveClaim({ ...draft, payments })} />}
          {tab === "financial" && <FinalFinancialReconciliation claim={draft} />}
          {tab === "contents" && <ContentsValuationCenter items={draft.contents || []} onChange={contents => saveClaim({ ...draft, contents })} />}
          {tab === "ale" && <ALEManagementCenter claim={draft} onChange={changes => saveClaim({ ...draft, ...changes })} />}
          {tab === "communications" && <CommunicationsHub claim={draft} onChange={communications => saveClaim({ ...draft, communications })} onDeadlineChange={deadlineClocks => updateClaimById(selected.id, claim => ({ ...claim, deadlineClocks }))} />}
          {tab === "deadlines" && <CarrierDeadlineCenter claim={draft} onChange={deadlineClocks => saveClaim({ ...draft, deadlineClocks })} />}
          {tab === "issues" && <IssueNegotiationCenter claim={draft} onChange={issues => saveClaim({ ...draft, issues })} />}
          {tab === "critical" && <CriticalEventCenter claim={draft} onChange={criticalEvents => saveClaim({ ...draft, criticalEvents })} />}
          {tab === "chronology" && <ClaimLifecycleChronology claim={draft} onChange={lifecycle => saveClaim({ ...draft, lifecycle })} />}
          {tab === "supplements" && <SupplementsDisputeCenter claim={draft} onChange={supplements => saveClaim({ ...draft, supplements })} />}
          {tab === "mortgage" && <MortgageLossDraftCenter claim={draft} onChange={mortgage => saveClaim({ ...draft, mortgage })} />}
          {tab === "agreements" && <AgreementPacketCenter claim={draft} onChange={agreements => saveClaim({ ...draft, agreements })} />}
          {tab === "receipts" && <DepreciationRecoveryCenter claim={draft} onChange={receipts => saveClaim({ ...draft, receipts })} />}

          {tab === "package" && (
            <section>
              <h1>Claim-Package Assembly</h1>
              <p>Creates a versioned snapshot of the current claim record and SHA-256 hash. A new package supersedes the prior package while preserving its hash, approvals, and history.</p>
              <button className="primary" onClick={assemblePackage}>Assemble draft package</button>
              <RecordList records={draft.packages} render={r => <><b>{r.name}</b><span>Status: {r.status}</span><code>{r.snapshotHash}</code></>} />
            </section>
          )}

          {tab === "approvals" && (
            <AuthorityReleaseControl
              claim={draft}
              onChange={changes => saveClaim({ ...draft, ...changes })}
            />
          )}

          {tab === "recovery" && <SimpleRecords title="Recovery Follow-up & Depreciation Tracking" records={draft.recovery} fields={[["coverage","Coverage"],["amount","Outstanding amount"],["condition","Recovery condition / proof needed"],["dueDate","Follow-up date"],["status","Status"]]} onAdd={r => addRecord("recovery", r)} />}

          {tab === "closure" && <ClaimClosureAuditCenter claim={draft} onChange={changes => saveClaim({ ...draft, ...changes })} />}

          {tab === "transition" && <DataTransitionCenter workspace={workspace} />}

          {tab === "ai" && (
            <AIClaimReviewCenter
              claim={draft}
              onChange={changes => saveClaim({ ...draft, ...changes })}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return <label>{label}<input type={type} value={value || ""} onChange={e => onChange(e.target.value)} /></label>;
}

function Stat({ label, value }) {
  return <div className="stat"><small>{label}</small><b>{value}</b></div>;
}

function Panel({ title, children }) {
  return <div className="panel"><h2>{title}</h2>{children}</div>;
}

function RecordList({ records, render }) {
  if (!records?.length) return <p className="muted">No records yet.</p>;
  return <div className="records">{records.map(r => <div className="record" key={r.id}>{render(r)}</div>)}</div>;
}

function SimpleRecords({ title, records, fields, onAdd, embedded = false }) {
  const initial = Object.fromEntries(fields.map(([k]) => [k, ""]));
  const [row, setRow] = useState(initial);
  function submit(e) {
    e.preventDefault();
    onAdd(row);
    setRow(initial);
  }
  const content = (
    <>
      <h1>{title}</h1>
      <form className="grid" onSubmit={submit}>
        {fields.map(([key, label]) => <Field key={key} label={label} value={row[key]} onChange={v => setRow(r => ({ ...r, [key]: v }))} />)}
        <div className="form-action"><button type="submit">Add record</button></div>
      </form>
      <RecordList records={records} render={r => <>{fields.map(([key, label]) => <span key={key}><b>{label}:</b> {String(r[key] ?? "")}</span>)}</>} />
    </>
  );
  return embedded ? <div className="panel">{content}</div> : <section>{content}</section>;
}


export default App;
