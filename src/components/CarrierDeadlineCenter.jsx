import React, { useMemo, useState } from "react";
import { nowIso, uid } from "../lib/storage.js";
import { DEADLINE_RULES, calculateDueDate, reminderDate, daysFromToday, ruleFor } from "../lib/deadlineRules.js";

const blank = { state: "CA", ruleKey: "claimant_communication", triggerDate: "", subject: "", carrierParty: "", sourceRef: "", notes: "", leadDays: 2 };

function statusFor(clock) {
  if (clock.status === "Satisfied") return "Satisfied";
  if (!clock.dueDate) return "Needs review";
  const left = daysFromToday(clock.dueDate);
  if (left < 0) return "LATE";
  if (left <= Number(clock.leadDays || 2)) return "PRE-DEADLINE";
  return "Running";
}

function draftNotice(claim, clock) {
  const rule = ruleFor(clock.state, clock.ruleKey);
  const late = clock.dueDate && daysFromToday(clock.dueDate) < 0;
  return `Subject: ${late ? "Overdue Response" : "Time-Sensitive Follow-Up"} — ${claim.claimNumber || "Claim"} — ${clock.subject || rule?.label || "Claim communication"}

Dear ${clock.carrierParty || "Adjuster"},

I am following up regarding our communication dated ${clock.triggerDate || "[date]"} concerning ${clock.subject || "the above claim"}. Our records reflect a response deadline of ${clock.dueDate || "[deadline]"} under ${clock.authority || rule?.authority || "the applicable claim-handling rule"}.

${late ? `The recorded response deadline has passed without a complete response reflected in our file. Please provide the response promptly or identify the specific reason additional time is required.` : `Please provide a complete response before the applicable deadline.`} We are maintaining a contemporaneous claim chronology and would appreciate your timely attention.

Thank you,
ADPA Claims
Angelo Daniel, Public Insurance Adjuster`;
}

export default function CarrierDeadlineCenter({ claim, onChange }) {
  const [row, setRow] = useState({ ...blank, state: claim.jurisdiction || "CA" });
  const clocks = claim.deadlineClocks || [];
  const rules = DEADLINE_RULES[row.state] || [];

  const metrics = useMemo(() => ({
    running: clocks.filter(x => statusFor(x) === "Running").length,
    warning: clocks.filter(x => statusFor(x) === "PRE-DEADLINE").length,
    late: clocks.filter(x => statusFor(x) === "LATE").length,
    satisfied: clocks.filter(x => statusFor(x) === "Satisfied").length
  }), [clocks]);

  function addClock(e) {
    e.preventDefault();
    const rule = ruleFor(row.state, row.ruleKey);
    if (!rule || !row.triggerDate) return;
    const dueDate = calculateDueDate(row.triggerDate, rule);
    const clock = {
      ...row,
      id: uid("deadline"),
      dueDate,
      reminderDate: reminderDate(dueDate, row.leadDays),
      authority: rule.authority,
      ruleLabel: rule.label,
      dayCount: rule.days,
      dayUnit: rule.unit,
      status: "Open",
      createdAt: nowIso(),
      audit: [{ at: nowIso(), action: "Clock created", detail: `${rule.authority}; trigger ${row.triggerDate}; due ${dueDate || "prompt review"}` }]
    };
    onChange([...clocks, clock]);
    setRow(r => ({ ...blank, state: r.state }));
  }

  function patch(id, changes, auditAction) {
    onChange(clocks.map(c => c.id === id ? {
      ...c, ...changes, updatedAt: nowIso(),
      audit: auditAction ? [...(c.audit || []), { at: nowIso(), action: auditAction, detail: "" }] : c.audit
    } : c));
  }

  function markNotice(clock) {
    patch(clock.id, { preDeadlineNoticeAt: nowIso(), preDeadlineNoticeDraft: draftNotice(claim, clock) }, "Deadline follow-up notice prepared");
  }

  function markSatisfied(clock) {
    patch(clock.id, { status: "Satisfied", satisfiedAt: nowIso() }, "Carrier response recorded / clock satisfied");
  }

  return (
    <section>
      <h1>Carrier Deadline Clock & Claim Chronology</h1>
      <p>State-aware response clocks create a contemporaneous record of carrier deadlines, pre-deadline follow-ups, late responses, and supporting authority.</p>

      <div className="stats">
        <div className="stat"><small>Running</small><b>{metrics.running}</b></div>
        <div className="stat"><small>Due soon</small><b>{metrics.warning}</b></div>
        <div className="stat"><small>Late</small><b>{metrics.late}</b></div>
        <div className="stat"><small>Satisfied</small><b>{metrics.satisfied}</b></div>
      </div>

      <div className="panel">
        <h2>Start a regulatory clock</h2>
        <form className="grid" onSubmit={addClock}>
          <label>State<select value={row.state} onChange={e => setRow(r => ({...r,state:e.target.value,ruleKey:"claimant_communication"}))}><option value="CA">California</option><option value="NV">Nevada</option></select></label>
          <label>Clock type<select value={row.ruleKey} onChange={e => setRow(r => ({...r,ruleKey:e.target.value}))}>{rules.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}</select></label>
          <label>Trigger / received date<input type="date" value={row.triggerDate} onChange={e => setRow(r => ({...r,triggerDate:e.target.value}))}/></label>
          <label>Pre-deadline warning<input type="number" min="1" max="10" value={row.leadDays} onChange={e => setRow(r => ({...r,leadDays:Number(e.target.value||2)}))}/><small>Calendar days before due date; default 2.</small></label>
          <label>Carrier / adjuster<input value={row.carrierParty} onChange={e => setRow(r => ({...r,carrierParty:e.target.value}))}/></label>
          <label>Subject / document<input value={row.subject} onChange={e => setRow(r => ({...r,subject:e.target.value}))}/></label>
          <label>Evidence / source reference<input placeholder="Email ID, document, portal confirmation..." value={row.sourceRef} onChange={e => setRow(r => ({...r,sourceRef:e.target.value}))}/></label>
          <label>Notes<textarea value={row.notes} onChange={e => setRow(r => ({...r,notes:e.target.value}))}/></label>
          <div className="form-action"><button className="primary" type="submit">Start clock</button></div>
        </form>
      </div>

      <div className="timeline">
        {clocks.length === 0 && <p className="muted">No regulatory clocks recorded yet.</p>}
        {[...clocks].sort((a,b) => String(a.dueDate).localeCompare(String(b.dueDate))).map(c => {
          const state = statusFor(c);
          const left = daysFromToday(c.dueDate);
          return <div className="timeline-item" key={c.id}>
            <div className="timeline-head">
              <div><span className="pill">{c.state}</span><span className="pill secondary">{c.authority}</span><span className={state === "LATE" ? "pill alert" : "pill system"}>{state}</span></div>
              <b>{c.dueDate || "Prompt-action review"}</b>
            </div>
            <b>{c.subject || c.ruleLabel}</b>
            <span>{c.ruleLabel}</span>
            <small>Trigger: {c.triggerDate} · Rule: {c.dayCount} {c.dayUnit} days · Reminder: {c.reminderDate || "manual"}</small>
            {c.dueDate && <small>{left < 0 ? `${Math.abs(left)} day(s) late` : `${left} day(s) remaining`}</small>}
            {c.sourceRef && <small><b>Evidence:</b> {c.sourceRef}</small>}
            {c.preDeadlineNoticeDraft && <div className="draft-box"><b>{state === "LATE" ? "Overdue response notice" : "Pre-deadline notice"}</b><p style={{whiteSpace:"pre-wrap"}}>{c.preDeadlineNoticeDraft}</p><small>Prepared {c.preDeadlineNoticeAt}. Sending remains separately controlled.</small></div>}
            <div className="comm-actions">
              {state !== "Satisfied" && !c.preDeadlineNoticeAt && <button type="button" onClick={() => markNotice(c)}>{state === "LATE" ? "Prepare overdue notice" : "Prepare pre-deadline notice"}</button>}
              {state !== "Satisfied" && <button type="button" onClick={() => markSatisfied(c)}>Record carrier response</button>}
            </div>
            {(c.audit || []).length > 0 && <details><summary>Audit trail ({c.audit.length})</summary>{c.audit.map((a,i)=><small key={i}>{a.at} — {a.action}{a.detail ? " — "+a.detail : ""}</small>)}</details>}
          </div>;
        })}
      </div>

      <p className="notice">California clocks use calendar days where the cited rule says calendar days. Nevada working-day calculations currently exclude weekends; state holidays and claim-specific exceptions require human verification before treating a date as a legal conclusion. This module preserves operational evidence and does not itself establish bad faith or a legal violation.</p>
    </section>
  );
}
