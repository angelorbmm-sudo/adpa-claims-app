import React, { useState } from "react";
import { nowIso, uid } from "../lib/storage.js";

const CA_PACKET=[
 {name:"California Public Insurance Adjuster Contract",authority:"California Insurance Code §15027 / CDI-approved ADPA form",sequence:2},
 {name:"California Public Adjuster Disclosure",authority:"California Insurance Code §15027(v)",sequence:1},
 {name:"California Notice of Cancellation",authority:"California Insurance Code §15027",sequence:3}
];

export default function AgreementPacketCenter({claim,onChange}){
 const records=claim.agreements||[]; const [row,setRow]=useState({name:"",version:"",signer:"",status:"Draft",evidenceRef:"",notes:""});
 function addTemplate(t){onChange([...records,{...t,id:uid("agreement"),version:"Approved ADPA form — verify current version",status:"Template",createdAt:nowIso(),signer:"",evidenceRef:"",notes:"No client data or signatures should be stored in the reusable master template."}]);}
 function add(e){e.preventDefault();onChange([...records,{...row,id:uid("agreement"),createdAt:nowIso()}]);setRow({name:"",version:"",signer:"",status:"Draft",evidenceRef:"",notes:""});}
 return <section><h1>Agreement Library & Representation Packet</h1><p>Keep reusable approved templates separate from executed client copies. The California packet sequence records disclosure first, then contract, then cancellation notice.</p>
 {claim.jurisdiction==="CA"&&<div className="panel"><h2>Approved California ADPA packet</h2>{CA_PACKET.map(t=><div className="record" key={t.name}><b>{t.sequence}. {t.name}</b><small>{t.authority}</small><button onClick={()=>addTemplate(t)}>Add clean master-template record</button></div>)}<p className="notice">The screenshots supplied by Angelo are treated as approved-form references. Before production e-signature use, load clean master PDFs with all prior client names, client signatures, Angelo signatures, and initials removed; preserve the approved wording/layout and validate the current CDI approval/version.</p></div>}
 <form className="grid panel" onSubmit={add}><label>Document<input value={row.name} onChange={e=>setRow(r=>({...r,name:e.target.value}))}/></label><label>Version<input value={row.version} onChange={e=>setRow(r=>({...r,version:e.target.value}))}/></label><label>Signer<input value={row.signer} onChange={e=>setRow(r=>({...r,signer:e.target.value}))}/></label><label>Status<select value={row.status} onChange={e=>setRow(r=>({...r,status:e.target.value}))}><option>Draft</option><option>Template</option><option>Delivered</option><option>Executed</option><option>Cancelled</option><option>Superseded</option></select></label><label>Evidence ref<input value={row.evidenceRef} onChange={e=>setRow(r=>({...r,evidenceRef:e.target.value}))}/></label><label>Notes<textarea value={row.notes} onChange={e=>setRow(r=>({...r,notes:e.target.value}))}/></label><div className="form-action"><button className="primary">Add agreement record</button></div></form>
 <div className="records">{records.map(x=><div className="record" key={x.id}><b>{x.name}</b><span>{x.status} · {x.version}</span><small>{x.authority||""}</small><small>{x.signer ? "Signer: "+x.signer : "Reusable template / no signer"}{x.evidenceRef ? " · Evidence: "+x.evidenceRef : ""}</small></div>)}</div>
 </section>;
}
