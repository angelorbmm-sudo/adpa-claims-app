import React,{useState} from "react";
import {apiEnabled,preflightWorkspace} from "../lib/api.js";
export default function DataTransitionCenter({workspace}){
 const [preflight,setPreflight]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 const claims=workspace.claims||[];
 function downloadBackup(){
   const payload={format:"ADPA_WORKSPACE_BACKUP_V1",exportedAt:new Date().toISOString(),claimCount:claims.length,workspace};
   const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
   const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="adpa-workspace-backup-"+new Date().toISOString().slice(0,10)+".json";a.click();URL.revokeObjectURL(url);
 }
 async function runPreflight(){
   setBusy(true);setError("");try{setPreflight(await preflightWorkspace(claims));}catch(e){setError(e.message||String(e));}finally{setBusy(false);}
 }
 const localWarnings=claims.flatMap(c=>[
   !c.id&&"Claim without ID",!c.jurisdiction&&((c.insured||"Unnamed")+": jurisdiction missing"),
   !c.insured&&((c.id||"Claim")+": insured missing"),!c.carrier&&((c.insured||c.id||"Claim")+": carrier missing"),
   !c.claimNumber&&((c.insured||c.id||"Claim")+": claim number missing"),!c.dateOfLoss&&((c.insured||c.id||"Claim")+": date of loss missing")
 ].filter(Boolean));
 return <section><h1>Production Data Transition Readiness</h1><p>Prepare the current browser workspace for a controlled move to the ADPA PostgreSQL backend. This screen does not migrate live client data automatically.</p>
 <div className="stats"><div className="stat"><small>Local claims</small><b>{claims.length}</b></div><div className="stat"><small>Local readiness warnings</small><b>{localWarnings.length}</b></div><div className="stat"><small>Backend configured</small><b>{apiEnabled()?"YES":"NO"}</b></div><div className="stat"><small>Remote preflight</small><b>{preflight?(preflight.ready?"PASS":"REVIEW"):"NOT RUN"}</b></div></div>
 <div className="panel"><h2>Step 1 — immutable transition backup</h2><p>Create a complete JSON backup before any database import. Keep it in a secure location because it may contain client information.</p><button onClick={downloadBackup}>Export encrypted-storage candidate backup</button><p className="notice">The downloaded JSON itself is not encrypted by this browser function. Production handling must place it only in an approved encrypted location; do not email it or put it in the public demo repository.</p></div>
 <div className="panel"><h2>Step 2 — local data readiness</h2>{localWarnings.length?<div className="records">{localWarnings.map((x,i)=><div className="record" key={i}>{x}</div>)}</div>:<p>PASS — core migration identifiers are present on all local claims.</p>}</div>
 <div className="panel"><h2>Step 3 — backend preflight</h2><button disabled={!apiEnabled()||busy} onClick={runPreflight}>{busy?"Checking…":"Run non-destructive backend preflight"}</button>{!apiEnabled()&&<p className="notice">Backend URL/authentication are not production-configured, so remote preflight and migration remain disabled.</p>}{error&&<p className="notice">{error}</p>}{preflight&&<pre>{JSON.stringify(preflight,null,2)}</pre>}</div>
 <div className="release-banner blocked"><b>LIVE IMPORT LOCKED BY PROCESS</b><span>After PostgreSQL, identity, backups, private object storage, audit retention, license verification and security testing are deployed, run backup → preflight → reviewed import. Existing records default to skip rather than silent overwrite.</span></div>
 </section>
}
