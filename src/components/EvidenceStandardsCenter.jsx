import React from "react";
import { nowIso } from "../lib/storage.js";

const STANDARDS=[
 {key:"dwelling",title:"Dwelling / Other Structures",items:["Pre-loss photos/video or other condition evidence","Post-loss overview and room-by-room photos/video","Measurements / sketches / floor plan","Carrier estimate and ADPA estimate","Contractor scope/bid and trade support","Material quality/specification / LKQ support","Permit/code/ordinance support when claimed","Mitigation/moisture/engineering or expert evidence when applicable"]},
 {key:"contents",title:"Contents / Personal Property",items:["Room/location and item description","Photo/video evidence","Brand/model/serial where available","Age and pre-loss condition","Receipt, bank/card record, or other ownership proof when available","Current like-kind-and-quality replacement source","Quantity and replacement cost","Depreciation basis / useful-life reasoning"]},
 {key:"ale",title:"ALE / Loss of Use",items:["Pre-loss baseline living expenses","Temporary housing lease/invoice","Utility differential","Food/meal differential where applicable","Storage / pet / transportation / mileage support","Receipts and payment proof","Habitability/displacement support","Repair/rebuild timeline tied to period of restoration"]},
 {key:"mitigation",title:"Mitigation",items:["Emergency condition / cause evidence","Authorization / work order","Daily logs and equipment records","Moisture readings / maps","Photos before/during/after","Invoices and pricing support","Disposal / hazardous-material support when applicable","Carrier communications / approvals"]},
 {key:"code",title:"Code / Ordinance",items:["Policy coverage / endorsement","Specific adopted code provision","Authority-having-jurisdiction requirement","Permit or plan-check support","Scope line tied to code requirement","Cost support","Causation / repair trigger explanation","Carrier position and response"]},
 {key:"causation",title:"Causation / Coverage",items:["Date/time and event chronology","Weather/fire/plumbing/tree/other event evidence","Inspection findings","Expert report where needed","Policy insuring agreement and relevant exclusions/limitations","Photos/video and physical evidence","Prior-condition / maintenance evidence when relevant","Carrier coverage letter / reservation / denial"]},
 {key:"payment",title:"Payments / Depreciation",items:["Carrier payment letter / estimate","Check/EFT record","Coverage allocation","Deductible","ACV/RCV calculation","Recoverable vs nonrecoverable depreciation","Replacement receipt/proof","Request and release chronology"]}
];

export default function EvidenceStandardsCenter({claim,onChange}){
 const plan=claim.evidencePlan||{};
 const set=(section,index,value)=>{
   const next={...plan,[section]:{...(plan[section]||{}),[index]:{...((plan[section]||{})[index]||{}),...value,updatedAt:nowIso()}}};
   onChange(next);
 };
 const totals=STANDARDS.reduce((a,s)=>{a.all+=s.items.length;a.done+=s.items.filter((_,i)=>plan[s.key]?.[i]?.status==="Verified").length;return a},{all:0,done:0});
 return <section><h1>Evidence Standards & Proof Plan</h1><p>Issue-driven evidence checklist. ADPA should know what proves each claim position, what is missing, and exactly where the proof lives.</p>
 <div className="stats"><div className="stat"><small>Evidence standards</small><b>{totals.all}</b></div><div className="stat"><small>Verified</small><b>{totals.done}</b></div><div className="stat"><small>Open proof gaps</small><b>{totals.all-totals.done}</b></div><div className="stat"><small>Completion</small><b>{totals.all?Math.round(totals.done/totals.all*100):0}%</b></div></div>
 {STANDARDS.map(s=><div className="panel" key={s.key}><h2>{s.title}</h2><div className="records">{s.items.map((item,i)=>{const x=plan[s.key]?.[i]||{};return <div className="record" key={item}><b>{item}</b><label>Status<select value={x.status||"Missing"} onChange={e=>set(s.key,i,{status:e.target.value})}><option>Missing</option><option>Requested</option><option>Collected</option><option>Verified</option><option>Not applicable</option></select></label><label>Evidence/source ref<input value={x.sourceRef||""} onChange={e=>set(s.key,i,{sourceRef:e.target.value})} placeholder="Document/photo/email/estimate ID"/></label><label>Reviewer note<input value={x.note||""} onChange={e=>set(s.key,i,{note:e.target.value})}/></label></div>})}</div></div>)}
 <p className="notice">The checklist is a proof-quality control, not a rule that every listed item is required on every loss. A licensed reviewer should mark items not applicable and identify expert/counsel needs where causation or legal interpretation exceeds ordinary adjusting.</p>
 </section>
}
