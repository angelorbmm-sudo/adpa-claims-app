import React, {useEffect, useState} from "react";
import {ACCESS_ROLES, CAPABILITIES, initialAccessPlans, plannedCapabilities, roleDefinition, validateAccessPlan} from "../lib/accessPlans.js";
import {accessConnected, fetchAccessSession, fetchAccessPlans, fetchAccessMembers, createAccessPlan, updateAccessPlan} from "../lib/accessApi.js";
import Icon from "./Icon.jsx";

const KEY = "adpa-demo-access-plans-v1";
const blank = () => ({displayName:"",email:"",role:"claims_staff",licensedAuthority:false,scope:"assigned",claimIds:[],status:"draft",notes:""});
function loadDemoPlans() {
  try { const plans=JSON.parse(localStorage.getItem(KEY)); return Array.isArray(plans) && plans.every(p => p && typeof p.id === "string" && typeof p.displayName === "string" && typeof p.notes === "string" && Array.isArray(p.claimIds) && roleDefinition(p.role) && ["draft","archived"].includes(p.status)) ? plans : initialAccessPlans(); }
  catch { return initialAccessPlans(); }
}
export default function UserAccessCenter({claims, isDemo}) {
  const connected = accessConnected();
  const demo = isDemo && !connected;
  const [plans,setPlans] = useState(() => demo ? loadDemoPlans() : []);
  const [session,setSession] = useState(null);
  const [members,setMembers] = useState([]);
  const [loading,setLoading] = useState(connected);
  const [view,setView] = useState("team");
  const [draft,setDraft] = useState(blank);
  const [editing,setEditing] = useState(false);
  const [message,setMessage] = useState("");
  const [saving,setSaving] = useState(false);
  const canManage = demo || Boolean(session?.permissions?.includes("users:manage"));
  useEffect(() => {
    if (!connected) return;
    let cancelled=false;
    (async () => {
      try {
        const me=await fetchAccessSession();
        if(cancelled)return;
        setSession(me);
        if(me.permissions?.includes("users:manage")){
          const [p,m]=await Promise.all([fetchAccessPlans(),fetchAccessMembers()]);
          if(!cancelled){setPlans(p.plans);setMembers(m.members);}
        }
      }catch(error){if(!cancelled)setMessage(error.message);}
      finally{if(!cancelled)setLoading(false);}
    })();
    return()=>{cancelled=true;};
  },[connected]);
  function change(key,value){setDraft(d=>({...d,[key]:value}));}
  async function save(e){
    e.preventDefault();
    if(!canManage || saving)return;
    const errors=validateAccessPlan(draft,claims.map(c=>c.id));
    if(errors.length){setMessage(errors.join(" "));return;}
    setSaving(true);
    try {
      let saved;
      if(demo) {
        saved={...draft,id:draft.id || crypto.randomUUID(),displayName:draft.displayName.trim(),updatedAt:new Date().toISOString()};
        const next=plans.some(p=>p.id===saved.id)?plans.map(p=>p.id===saved.id?saved:p):[...plans,saved];
        localStorage.setItem(KEY,JSON.stringify(next));
        setPlans(next);
      } else {
        const result=await (draft.id?updateAccessPlan(draft):createAccessPlan(draft));
        saved=result.plan;
        setPlans(p=>p.some(x=>x.id===saved.id)?p.map(x=>x.id===saved.id?saved:x):[...p,saved]);
      }
      setEditing(false);setDraft(blank());setMessage("Access plan saved. No account was activated and no invitation was sent.");
    }catch(error){setMessage(error.message);}
    finally{setSaving(false);}
  }
  return <section className="access-center">
    <div className="page-heading"><div><span className="eyebrow">Team & permissions</span><h1>User access</h1><p>Prepare individual accounts, roles, and claim assignments.</p></div>{canManage && <button className="primary" onClick={()=>{setDraft(blank());setEditing(true);setMessage("");}}><Icon name="plus"/>New access plan</button>}</div>
    <div className="notice"><b>{demo ? "Demo planning mode." : connected ? "Account planning module." : "Identity service not connected."}</b> Access plans do not create logins, grant permissions, or send invitations. Do not enter passwords here.{demo && " Use sample email addresses only; plans stay in this browser."}</div>
    <div className="access-tabs" role="group" aria-label="User access views">{[["team","Team plans"],["permissions","Access levels"],["login","Login setup"]].map(([key,label])=><button key={key} className={view===key?"primary":""} aria-pressed={view===key} onClick={()=>{setView(key);setEditing(false);}}>{label}</button>)}</div>
    <p role="status" className="access-message">{loading ? "Loading server-authorized account context…" : message}</p>
    {connected && session && <p className="muted">Signed in as {session.user.displayName || session.user.email} · Organization {session.user.organizationId} · Server role: {session.user.role}</p>}
    {!loading && connected && !canManage && <p className="notice">Team administration requires server-authorized account-management permission. Contact your administrator.</p>}
    {view==="team" && canManage && <>
      <div className="stats"><div className="stat"><small>Proposed team members</small><b>{plans.filter(p=>p.status==="draft").length}</b></div><div className="stat"><small>Connected active members</small><b>{demo ? "Not connected" : members.length}</b></div><div className="stat"><small>Account activation</small><b>Pending</b></div></div>
      {editing && <form className="panel" onSubmit={save}><h2>{draft.id?"Edit access plan":"New access plan"}</h2>
        <div className="grid"><label>Display name<input required maxLength={120} value={draft.displayName} onChange={e=>change("displayName",e.target.value)}/></label><label>Email {demo?"(sample only)":"(optional until confirmed)"}<input type="email" maxLength={254} value={draft.email} onChange={e=>change("email",e.target.value)}/></label>
        <label>Proposed role<select value={draft.role} onChange={e=>setDraft(d=>({...d,role:e.target.value,licensedAuthority:false}))}>{ACCESS_ROLES.map(r=><option key={r.key} value={r.key}>{r.label}</option>)}</select></label>
        <label>Plan status<select value={draft.status} onChange={e=>change("status",e.target.value)}><option value="draft">Draft — inactive</option><option value="archived">Archived plan</option></select></label></div>
        <p className="muted">{roleDefinition(draft.role)?.description}</p>
        {draft.role==="admin" && <label className="checkbox-label"><input type="checkbox" checked={draft.licensedAuthority} onChange={e=>change("licensedAuthority",e.target.checked)}/>Also propose licensed-PA authority, subject to verification</label>}
        {plannedCapabilities(draft).some(p=>p==="claims:approve"||p==="claims:release") && <p className="notice">PA approval and release require an active verified license for each claim jurisdiction, plus existing client-authorization and package gates. This plan provides no authority.</p>}
        <fieldset className="access-assignments"><legend>Proposed claim assignments</legend><p className="muted">No assignments selected means no proposed claim access. Production must enforce these assignments on every API request.</p>{claims.map(c=><label className="checkbox-label" key={c.id}><input type="checkbox" checked={draft.claimIds.includes(c.id)} onChange={e=>change("claimIds",e.target.checked?[...draft.claimIds,c.id]:draft.claimIds.filter(id=>id!==c.id))}/>{c.insured || "Unnamed claim"} · {c.claimNumber}</label>)}</fieldset>
        <label>Planning notes<textarea maxLength={2000} value={draft.notes} onChange={e=>change("notes",e.target.value)}/></label>
        <div className="actions"><button className="primary" type="submit" disabled={saving}>{saving?"Saving…":"Save access plan"}</button><button type="button" onClick={()=>{setEditing(false);setDraft(blank());}}>Cancel</button></div>
      </form>}
      <div className="access-team">{plans.map(p=><article className="panel access-person" key={p.id}><div className="access-person-head"><div><h2>{p.displayName}</h2><p>{p.email || "Email not confirmed"}</p></div><span className="status-badge hold">{p.status==="archived"?"Archived plan":"Draft · inactive"}</span></div><b>{roleDefinition(p.role)?.label || "Unknown role"}{p.role==="admin"&&p.licensedAuthority?" + proposed licensed PA":""}</b><p className="muted">{p.claimIds.length} proposed claim assignment(s)</p><div className="access-capabilities">{plannedCapabilities(p).map(c=><span className="pill secondary" key={c}>{CAPABILITIES.find(([key])=>key===c)?.[1] || c}</span>)}</div><p>{p.notes}</p><button onClick={()=>{setDraft({...p,claimIds:[...p.claimIds]});setEditing(true);setMessage("");window.scrollTo({top:0,behavior:"auto"});}}>Edit plan</button></article>)}</div>
      {members.length>0 && <div className="panel"><h2>Server-authorized organization members</h2>{members.map(m=><p key={m.id}>{m.displayName || m.email} · {m.role} · {m.active?"Active":"Inactive"}</p>)}<p className="muted">Listed from the server. Planning edits above do not change these memberships.</p></div>}
    </>}
    {view==="permissions" && <div className="panel"><h2>Proposed access levels</h2><p>Target permission policy for activation. It is not a statement that production enforcement is complete.</p><div className="table-wrap"><table><thead><tr><th>Role</th>{CAPABILITIES.map(([key,label])=><th key={key}>{label}</th>)}</tr></thead><tbody>{ACCESS_ROLES.map(r=><tr key={r.key}><td><b>{r.label}</b></td>{CAPABILITIES.map(([key])=><td key={key}>{r.capabilities.includes(key)?"Allowed":"—"}</td>)}</tr>)}</tbody></table></div><p className="notice">Administrators have no licensed authority through this proposed role alone. Existing backend administrator and reviewer roles still need reconciliation to this matrix before activation. Estimate-only editing and claim assignment enforcement require José’s backend work.</p></div>}
    {view==="login" && <div className="panel"><h2>Individual sign-in</h2><p>Each person will use their own email account through the identity provider José connects.</p><div className="grid"><div className="record"><b>Sign in</b><p>Provider-hosted authentication; ADPA does not store passwords.</p><button disabled>Sign-in connection pending</button></div><div className="record"><b>Password recovery</b><p>Handled by the identity provider after email verification.</p><button disabled>Password reset connection pending</button></div><div className="record"><b>Two-factor authentication</b><p>Require MFA for administrator and licensed-PA accounts during provider setup.</p><span className="status-badge hold">Provider policy pending</span></div><div className="record"><b>Invitations & account status</b><p>José connects invitations, verified identity matching, activation, suspension, and session revocation.</p><span className="status-badge hold">No invitations sent</span></div></div><p className="muted">A proposed role, browser record, or screen visibility never authorizes a production API request.</p></div>}
  </section>;
}
