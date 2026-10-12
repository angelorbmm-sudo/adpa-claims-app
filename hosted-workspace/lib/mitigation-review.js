// Evidence-review controls, not remediation instructions or coverage determinations.
export const MITIGATION_LISTS = ["zones", "readings", "equipment", "scope", "cleaning", "contents", "custody", "hazards", "invoices"];
export const emptyMitigation = () => ({ applicable: false, lossType: "Water", sourceStatus: "Unknown", carrierStatus: "Not requested", zones: [], readings: [], equipment: [], scope: [], cleaning: [], contents: [], custody: [], hazards: [], invoices: [], review: null });
const present = v => v !== null && v !== undefined && String(v).trim() !== "";
const numeric = v => present(v) && Number.isFinite(Number(v));
const positive = v => numeric(v) && Number(v) > 0;
const value = v => numeric(v) ? Number(v) : null;
const active = m => !!m.applicable || MITIGATION_LISTS.some(k => Array.isArray(m[k]) && m[k].length);
export const mitigationApplicable = claim => active(claim.mitigation || {});
function canonical(v) { if (Array.isArray(v)) return v.map(canonical); if (v && typeof v === "object") return Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])])); return v; }
export function mitigationSnapshot(claim) {
 const { review, ...record } = { ...emptyMitigation(), ...(claim.mitigation || {}) };
 return JSON.stringify(canonical({ record, documents: (claim.documents || []).map(d => ({ id:d.id, name:d.name, sha256:d.sha256||"", reviewStatus:d.reviewStatus||"", processingStatus:d.processingStatus||"", updatedAt:d.updatedAt||"" })) }));
}
export function equipmentUsage(row) {
 const zoned = s => typeof s === "string" && /(?:Z|[+-]\d{2}:\d{2})$/.test(s);
 const count = value(row.count), start = zoned(row.startedAt) ? Date.parse(row.startedAt) : NaN, end = zoned(row.removedAt) ? Date.parse(row.removedAt) : NaN;
 if (!Number.isInteger(count) || count <= 0 || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) return { valid:false, hours:null, unitDays:null };
 const hours = (end-start)/3600000;
 return { valid:true, hours, unitDays:count*hours/24 };
}
export function scopeMeasurement(row) {
 const length = value(row.length), height = value(row.height), qty = value(row.quantity);
 const expected = row.unit === "SF" && length !== null && height !== null ? length*height : row.unit === "LF" && length !== null ? length : null;
 return { expected, mismatch:expected !== null && qty !== null && Math.abs(expected-qty) > 0.01 };
}
export function mitigationReview(claim) {
 const m = { ...emptyMitigation(), ...(claim.mitigation || {}) }, issues = [];
 if (!active(m)) return { applicable:false, issues, evidenceReady:true, reviewed:false, ready:true, stale:false, equipment:[], invoiceTotal:0 };
 const lists = Object.fromEntries(MITIGATION_LISTS.map(k => [k, Array.isArray(m[k]) ? m[k] : []]));
 const docs = new Map((claim.documents || []).map(d => [d.id,d]));
 const zones = new Map(lists.zones.map(z => [z.id,z]));
 const add = (code, text, kind="project", id="project", severity="High") => issues.push({ code, text, kind, id, severity });
 const source = (row, field, label, kind, locatorField="locator") => {
  const doc = docs.get(row[field]);
  if (!doc || doc.reviewStatus !== "Verified" || /quarantine|failed/i.test(doc.processingStatus||"")) { add("source",`${label}: link reviewed evidence from this claim.`,kind,row.id); return false; }
  if (!present(row[locatorField])) { add("locator",`${label}: specify page, photo, timestamp or record locator.`,kind,row.id); return false; }
  return true;
 };
 const zoneLink = (row,kind) => { if (!zones.has(row.zoneId)) add("zone",`${kind}: select an existing affected zone.`,kind,row.id); };
 // Never transform owner authorization or carrier review into payment approval.
 if (!present(m.contractor)) add("contractor","Record the responsible restoration contractor.");
 source({id:"project",...m},"authorizationDocumentId","Service authorization","project","authorizationLocator");
 source({id:"project",...m},"workPlanDocumentId","Contractor work plan","project","workPlanLocator");
 const water = /Water|Sewage/i.test(m.lossType||"");
 if (water) {
  if (m.sourceStatus !== "Controlled") add("source-control","Moisture source control is unresolved or unverified.");
  source({id:"project",...m},"sourceDocumentId","Source-control record","project","sourceLocator");
  if (!["1","2","3"].includes(String(m.waterCategory)) || !present(m.categoryReviewer) || !present(m.categoryBasis)) add("category","Water category requires a qualified contractor determination and factual basis; weather alone is insufficient.");
  source({id:"project",...m},"categoryDocumentId","Category assessment","project","categoryLocator");
 }
 if (!lists.zones.length) add("zones","Add affected zones/materials and their inspection evidence.");
 for (const [kind, rows] of Object.entries(lists)) {
  const ids = new Set();
  for (const row of rows) { if (!row.id || ids.has(row.id)) add("identity",`${kind}: record IDs must be present and unique.`,kind,row.id); ids.add(row.id); }
 }
 for (const z of lists.zones) {
  if (!present(z.name) || !present(z.material)) add("zone-detail","Zone needs a name and material/assembly description.","zones",z.id);
  source(z,"documentId",`${z.name||"Zone"} inspection`,"zones");
  if (z.addedAfterInitial && !present(z.changeReason)) add("expanded-scope","Added zone needs a discovery date/reason and supporting evidence.","zones",z.id);
  if (water && z.disposition !== "Removed") {
   if (!numeric(z.dryGoal) || !present(z.goalBasis) || !present(z.pointId) || !present(z.method) || !present(z.units) || !present(z.instrument)) add("dry-goal",`${z.name}: record contractor-defined dry goal, test point, material, instrument, method and scale.`,"zones",z.id);
   const candidates = lists.readings.filter(r => r.zoneId===z.id && r.pointId===z.pointId && r.material===z.material && r.units===z.units && r.method===z.method && r.instrument===z.instrument && numeric(r.value) && Number.isFinite(Date.parse(r.observedAt))).sort((a,b)=>Date.parse(b.observedAt)-Date.parse(a.observedAt));
   const last = candidates[0];
   if (!last || !numeric(z.dryGoal) || Number(last.value)>Number(z.dryGoal)) add("drying",`${z.name}: latest comparable reading is missing or exceeds the recorded dry goal.`,"zones",z.id);
  }
 }
 for (const r of lists.readings) {
  zoneLink(r,"readings");
  if (!numeric(r.value) || Number(r.value)<0 || !present(r.pointId) || !present(r.material) || !present(r.instrument) || !present(r.method) || !present(r.units) || !Number.isFinite(Date.parse(r.observedAt))) add("reading","Moisture reading needs a dated material/test point, numeric value, instrument, method and units.","readings",r.id);
  if ((present(r.rh)&&(!numeric(r.rh)||Number(r.rh)<0||Number(r.rh)>100)) || (present(r.temperature)&&!numeric(r.temperature))) add("psychrometry","Temperature/RH entries are invalid; RH must be 0–100%.","readings",r.id);
  source(r,"documentId","Moisture reading","readings");
 }
 const equipment = lists.equipment.map(e => ({...e,usage:equipmentUsage(e)}));
 for (const e of equipment) {
  zoneLink(e,"equipment"); source(e,"documentId","Equipment deployment/removal log","equipment");
  source(e,"photoDocumentId","Equipment placement photo","equipment","photoLocator");
  if (!e.usage.valid) add("equipment-time","Equipment needs a positive integer count and ordered timestamps with UTC/offset (e.g. 2026-10-08T09:00:00-07:00).","equipment",e.id);
  if (!present(e.needBasis)) add("equipment-need","Explain equipment placement/quantity and continued need from contractor records.","equipment",e.id);
  if (!numeric(e.billedUnitDays)||Number(e.billedUnitDays)<0) add("billing-days","Record billed unit-days as a nonnegative number.","equipment",e.id);
  if (e.usage.valid && numeric(e.billedUnitDays) && Math.abs(e.usage.unitDays-Number(e.billedUnitDays))>0.01 && !present(e.billingBasis)) add("billing-variance","Billed unit-days differ from elapsed usage; document the contractual rounding/minimum or correction. Do not auto-deduct.","equipment",e.id);
 }
 for (const s of lists.scope) {
  zoneLink(s,"scope"); source(s,"documentId","Scope necessity / damage evidence","scope"); source(s,"photoDocumentId","Work extent photo","scope","photoLocator");
  if (!positive(s.quantity)||!present(s.unit)||!present(s.reason)) add("scope-detail","Scope line needs quantity, unit and a reason distinguishing wet damage, access, contamination or reconstruction matching.","scope",s.id);
  const measured=scopeMeasurement(s);
  if (measured.mismatch) add("measurement","Scope quantity disagrees with recorded dimensions; reconcile the line and narrative.","scope",s.id);
  if (/flood|drywall/i.test(s.operation||"") && (!positive(s.length)||!positive(s.height))) add("flood-cut","Record actual affected wall length and cut height; do not default every room to a 2-foot cut.","scope",s.id);
 }
 for (const c of lists.cleaning) {
  zoneLink(c,"cleaning");
  for (const [f,l,loc] of [["beforeDocumentId","Before-cleaning evidence","beforeLocator"],["afterDocumentId","After-cleaning evidence","afterLocator"],["documentId","Contractor cleaning/QA record","locator"]]) source(c,f,l,"cleaning",loc);
  if (!present(c.material)||!present(c.method)||!present(c.rationale)||!present(c.contractor)) add("cleaning-plan","Cleaning record needs material/item, contractor, selected method and rationale.","cleaning",c.id);
  if (c.result!=="Contractor reviewed" || !present(c.reviewer)) add("cleaning-result","Cleaning QA/remaining odor or damage requires a documented contractor review.","cleaning",c.id);
  if (c.kind==="Antimicrobial") {
   if (!present(c.product)||!present(c.registrationReview)) add("chemical","Record product and EPA registration/applicability review; chemicals do not replace removal of contamination.","cleaning",c.id);
   source(c,"labelDocumentId","Product label review","cleaning","labelLocator"); source(c,"sdsDocumentId","Product safety data","cleaning","sdsLocator");
  }
  if (/ozone|fog/i.test(c.method||"") && !present(c.specialistBasis)) add("specialist-method","Record qualified specialist applicability/occupancy controls for this method; odor treatment is not a safety certification.","cleaning",c.id);
 }
 for (const h of lists.hazards) {
  if (h.status!=="Reviewed"||!present(h.reviewer)||!present(h.dispositionNotes)) add("hazard",`${h.type||"Hazard"}: qualified assessment and disposition are unresolved.`,"hazards",h.id);
  source(h,"documentId","Hazard assessment / specialist report","hazards");
 }
 if ((/Wildfire|Chemical|Industrial/i.test(m.lossType||"")||m.hvacConcern||m.sensitiveOccupants||m.hiddenContamination) && !lists.hazards.length) add("specialist","Record specialist review for the indicated event/occupancy/HVAC/hidden-contamination concern.");
 for (const c of lists.contents) {
  let held=0;
  const moves=lists.custody.filter(t=>t.itemId===c.id).sort((a,b)=>Date.parse(a.observedAt)-Date.parse(b.observedAt));
  for (const t of moves) { if(t.event==="Pack-out") held+=value(t.quantity)||0; if(t.event==="Return") { held-=value(t.quantity)||0; if(held<0) add("custody-order","A return precedes sufficient documented pack-out custody.","custody",t.id); } }
 }
 const items = new Map(lists.contents.map(x=>[x.id,x]));
 for (const c of lists.contents) {
  zoneLink(c,"contents"); source(c,"documentId","Contents condition/inventory","contents");
  if (!Number.isInteger(Number(c.quantity))||!positive(c.quantity)||!present(c.description)||!present(c.currentLocation)) add("inventory","Contents needs description, whole-item quantity and current custody location.","contents",c.id);
  if (["Dispose","Nonrestorable"].includes(c.disposition)) { source(c,"authorizationDocumentId","Disposition authorization","contents","authorizationLocator"); if (!present(c.reason)) add("disposition","Record the item-specific basis for nonrestorable/disposal disposition.","contents",c.id); }
  const itemMoves=lists.custody.filter(x=>x.itemId===c.id);
  const returned=itemMoves.filter(x=>x.event==="Return").reduce((a,x)=>a+(value(x.quantity)||0),0);
  const out=itemMoves.filter(x=>x.event==="Pack-out").reduce((a,x)=>a+(value(x.quantity)||0),0);
  if (out>Number(c.quantity)||returned>out) add("custody-count","Pack-out/return counts exceed recorded custody quantities.","contents",c.id);
  if (c.status==="Returned"&&(returned!==Number(c.quantity)||!itemMoves.some(x=>x.event==="Return"))) add("return-count","Returned contents require matching documented pack-out and return counts.","contents",c.id);
  if (c.status==="In storage"&&!itemMoves.some(x=>["Pack-out","Storage transfer"].includes(x.event))) add("custody-gap","Stored item needs a documented custody handoff.","contents",c.id);
 }
 for (const t of lists.custody) {
  if (!items.has(t.itemId)||!Number.isInteger(Number(t.quantity))||!positive(t.quantity)||!present(t.from)||!present(t.to)||!present(t.person)||!Number.isFinite(Date.parse(t.observedAt))) add("handoff","Custody handoff needs item, count, date, from/to locations and responsible person.","custody",t.id);
  source(t,"documentId","Custody handoff / receipt","custody");
 }
 let invoiceTotal=0;
 for (const i of lists.invoices) {
  source(i,"documentId","Invoice line","invoices");
  if (!numeric(i.amount)||Number(i.amount)<0||!Number.isSafeInteger(Math.round(Number(i.amount)*100))||Math.abs(Number(i.amount)*100-Math.round(Number(i.amount)*100))>0.000001) add("invoice-value","Invoice amount must be nonnegative and finite.","invoices",i.id); else invoiceTotal+=Number(i.amount);
  if (!present(i.serviceType)||!present(i.contractor)||!present(i.invoiceLine)) add("invoice-detail","Identify invoice line, service bucket and contractor.","invoices",i.id);
  const link=lists.scope.some(s=>s.id===i.scopeId)||lists.equipment.some(e=>e.id===i.equipmentId)||lists.cleaning.some(c=>c.id===i.cleaningId)||lists.custody.some(t=>t.id===i.custodyId);
  if (!link) add("invoice-support","Link this service charge to scope, equipment, cleaning or custody work.","invoices",i.id);
  if (!["A","B","C","D","CODE"].includes(i.coverage)||!present(i.coverageBasis)) add("allocation","Coverage allocation needs policy/claim-specific review; do not assume all service charges are Coverage C.","invoices",i.id);
 }
 const evidenceReady=!issues.length, snapshot=mitigationSnapshot(claim);
 const reviewed=!!m.review && present(m.review.reviewer) && present(m.review.reviewedAt) && m.review.snapshot===snapshot;
 const stale=!!m.review && m.review.snapshot!==snapshot;
 return { applicable:true, issues, evidenceReady, reviewed, stale, ready:evidenceReady&&reviewed, equipment, invoiceTotal };
}
export function mitigationBlockers(claim) {
 const r=mitigationReview(claim);
 if (!r.applicable) return [];
 return [...r.issues.map(x=>`Mitigation / cleaning: ${x.text}`),...(!r.reviewed?[r.stale?"Mitigation / cleaning review is stale after records/evidence changed.":"Mitigation / cleaning needs final documented human evidence review."]:[])];
}
export function mitigationDraft(claim) {
 const m=claim.mitigation||{}, r=mitigationReview(claim);
 return ["MITIGATION / CLEANING — DRAFT FOR HUMAN REVIEW; NOTHING SENT",`Insured: ${claim.insured||"Not entered"}`,`Claim #: ${claim.claimNumber||"Claim number needed"}`,`Contractor: ${m.contractor||"Not entered"}`,`Loss workstream: ${m.lossType||"Not entered"}`,`Owner service authorization: ${m.authorizationDocumentId?"Recorded; verify linked evidence":"Not recorded"}`,`Carrier position (recorded, not verified payment): ${m.carrierStatus||"Not entered"}`,`Evidence review: ${r.ready?"Current recorded human review":"Incomplete / needs review"}`,`Invoice service total (not added to coverage ledger): $${r.invoiceTotal.toFixed(2)}`,"",...r.equipment.map(e=>`${e.label||"Equipment"}: ${e.usage.valid?e.usage.hours.toFixed(2)+" elapsed hours; "+e.usage.unitDays.toFixed(2)+" unit-days":"time/count incomplete"}; billed ${present(e.billedUnitDays)?e.billedUnitDays:"not entered"}; basis ${e.billingBasis||"not entered"}`),"","Outstanding items:",...(mitigationBlockers(claim).length?mitigationBlockers(claim):["No deterministic evidence gaps identified; this does not establish safety, compliance, coverage or payment entitlement."]),"","Next action: obtain/correct source records and complete qualified contractor and licensed PA review before substantive use.","No automatic category, drying time, flood-cut height, chemical treatment, total-loss disposition or legal payment obligation has been inferred."].join("\n");
}
