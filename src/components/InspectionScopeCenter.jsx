import React, { useEffect, useRef, useState } from 'react';
import { uid, nowIso } from '../lib/storage.js';
import { apiEnabled, apiRequest } from '../lib/api.js';
import { bases, normalizeScan, roomQuantities, lineQuantity, reviewBlockers, comparisonLines, mergeComparisonLines } from '../lib/inspectionScope.js';
import { saveMedia, loadMedia, fingerprint, analysisFrames } from '../lib/inspectionMedia.js';
import CaptureMethods from './CaptureMethods.jsx';
import { polygonMetrics, sketchPoints } from '../lib/scanGeometry.js';
import { downloadJSON, scopeReviewExport } from '../lib/scopeExport.js';
import '../inspection.css';

const blankLine = () => ({id:uid('operation'),material:'',trade:'',description:'',basis:'manual',quantity:'',unit:'SF',rationale:'',evidenceIds:[],reviewed:false});
const newRoom = name => ({measurementMode:'rectangle',id:uid('room'),name,coverage:'A',length:'',width:'',height:'',openingsArea:0,measurementSource:'',measurementVerified:false,transcript:'',reviewer:'',lines:[],evidenceIds:[],questions:[],observations:[]});
const revision = room => JSON.stringify(room);
export default function InspectionScopeCenter({claim,onChange}) {
  const rooms=claim.inspection?.rooms||[];
  const [activeId,setActiveId]=useState(rooms[0]?.id||'');
  const [room,setRoom]=useState(null), [message,setMessage]=useState(''), [busy,setBusy]=useState(false);
  const [aiReady,setAiReady]=useState(false), [dictating,setDictating]=useState(false), [preview,setPreview]=useState(null);
  const [sendConfirmed,setSendConfirmed]=useState(false), [replaceConfirmed,setReplaceConfirmed]=useState(false);
  const recognizer=useRef(null), recorder=useRef(null), stream=useRef(null), [recording,setRecording]=useState(false);
  const alive=useRef(true), previewUrl=useRef(null);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;recognizer.current?.abort();recorder.current?.state==='recording'&&recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(previewUrl.current)URL.revokeObjectURL(previewUrl.current);};},[]);
  useEffect(()=>{setRoom(structuredClone(rooms.find(r=>r.id===activeId)||null));setMessage('');setReplaceConfirmed(false);},[activeId]);
  useEffect(()=>{ if(!apiEnabled())return; apiRequest('/api/inspection/status').then(s=>setAiReady(s.configured)).catch(()=>setAiReady(false)); },[]);
  function patch(key,value) {
    setRoom(r=>{
      const next={...r,[key]:value,measurementVerified:['length','width','height','openingsArea','measurementSource','scanGeometry','measurementMode'].includes(key)?false:r.measurementVerified,lines:r.lines.map(l=>({...l,reviewed:false}))};
      if(r.scanGeometry?.sourceScanId&&['height','openingsArea','scanGeometry'].includes(key)){
        next.scanGeometry={...next.scanGeometry,editedAfterImport:true,editedAt:nowIso(),modifiedFields:[...new Set([...(r.scanGeometry.modifiedFields||[]),key])]};
      }
      return next;
    });setReplaceConfirmed(false);
  }
  function patchLine(id,key,value) {setRoom(r=>({...r,lines:r.lines.map(l=>l.id===id?{...l,[key]:value,...(key==='reviewed'?{}:{reviewed:false})}:l)}));setReplaceConfirmed(false);}
  function payload(nextRoom=room, additions={}) {
    const nextRooms=rooms.some(r=>r.id===nextRoom.id)?rooms.map(r=>r.id===nextRoom.id?nextRoom:r):[...rooms,nextRoom];
    const oldRoom=rooms.find(r=>r.id===nextRoom.id);
    const changed=oldRoom && revision(oldRoom)!==revision(nextRoom);
    const estimateComparisons=changed?(claim.estimateComparisons||[]).map(l=>l.inspectionRoomId===nextRoom.id?{...l,status:'Needs review',inspectionStale:true}:l):claim.estimateComparisons;
    return {...claim,estimateComparisons,...additions,inspection:{...claim.inspection,version:1,rooms:nextRooms}};
  }
  async function persist(nextRoom=room,additions={}) {
    const ok=await onChange(payload(nextRoom,additions));
    if(ok===false)throw new Error('Save failed. Your inspection remains open; reconnect and retry.');
  }
  async function run(action) {setBusy(true);setMessage('');try{await action();}catch(error){if(alive.current)setMessage(error.message||'Inspection action failed.');}finally{if(alive.current)setBusy(false);}}
  async function save() {await persist();setMessage('Inspection saved. Original media remains on this browser.');}
  async function addRoom() {
    const next=newRoom(`Room ${rooms.length+1}`);
    await persist(next);setActiveId(next.id);setRoom(next);
  }
  async function switchRoom(id) {if(room)await persist();setActiveId(id);}
  async function importScan(file) {
    if(!file)return;
    if(file.size>1024*1024)throw new Error('Scan JSON must be under 1 MB.');
    const input=JSON.parse(await file.text());
    const normalized=normalizeScan(input);
    const hash=await fingerprint(file),existing=(claim.documents||[]).find(d=>d.sha256===hash);
    if(existing&&rooms.some(r=>r.scanSourceDocumentId===existing.id)){
      await saveMedia(claim.id,existing.id,file);setMessage('This scan was already imported. Its original file has been restored on this browser.');return;
    }
    if(input.scanId&&rooms.some(r=>r.scanGeometry?.sourceScanId===input.scanId))throw new Error('This scan ID is already present in this claim. Import a new capture or edit the existing room.');
    const evidenceId=existing?.id||uid('scan-source');
    await saveMedia(claim.id,evidenceId,file);
    const source={id:evidenceId,name:file.name,type:'application/json',size:file.size,sha256:hash,createdAt:nowIso(),category:'Other',coverage:'General',source:'Original room measurement scan',reviewStatus:'Unreviewed',processingStatus:'Original saved in this browser',storageStatus:'Browser IndexedDB only — not backed up to server'};
    const imported=normalized.map(r=>({...newRoom(r.name),...r,id:uid('room'),scanSourceDocumentId:evidenceId,evidenceIds:[evidenceId]}));
    const base=room?payload(room):claim;
    const savedRooms=base.inspection?.rooms||[];
    const ok=await onChange({...base,documents:existing?base.documents:[...(base.documents||[]),source],inspection:{...base.inspection,version:1,rooms:[...savedRooms,...imported]}});
    if(ok===false)throw new Error('Scan was not saved. Retry when the server is available.');
    setActiveId(imported[0].id);setRoom(imported[0]);setMessage('Scan imported in feet. Verify measurements before using them in scope.');
  }
  async function capture(files) {
    const additions=[], ids=[...room.evidenceIds];
    for(const file of Array.from(files||[])) {
      if(!/^(image|video|audio)\//.test(file.type))throw new Error('Choose photos, videos, or audio recordings.');
      if(file.size>100*1024*1024)throw new Error('Each media file must be 100 MB or less.');
      const hash=await fingerprint(file), existing=[...(claim.documents||[]),...additions].find(d=>d.sha256===hash);
      const id=existing?.id||uid('inspection-media');
      await saveMedia(claim.id,id,file);
      if(!ids.includes(id))ids.push(id);
      if(!existing)additions.push({id,name:file.name,type:file.type,size:file.size,sha256:hash,createdAt:nowIso(),category:file.type.startsWith('audio/')?'Other':'Photo / Video',coverage:room.coverage,source:`Inspection: ${room.name}`,reviewStatus:'Unreviewed',processingStatus:'Original saved in this browser',storageStatus:'Browser IndexedDB only — not backed up to server',inspectionRoomId:room.id});
    }
    const next={...room,evidenceIds:ids,lines:room.lines.map(l=>({...l,reviewed:false}))};
    await persist(next,{documents:[...(claim.documents||[]),...additions]});setRoom(next);
    setMessage('Media saved on this browser and linked to the claim. Download originals for backup.');
  }
  async function viewMedia(id) {
    const file=await loadMedia(claim.id,id);if(!file)throw new Error('Original unavailable on this browser. Re-select it to restore local media.');
    if(previewUrl.current)URL.revokeObjectURL(previewUrl.current);
    previewUrl.current=URL.createObjectURL(file);setPreview({url:previewUrl.current,type:file.type,name:file.name,text:file.type==='application/json'?(await file.text()).slice(0,20000):''});
  }
  function dictate() {
    const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Speech){setMessage('Live dictation is unavailable here. Use keyboard dictation or record audio and enter a transcript.');return;}
    if(dictating){recognizer.current?.stop();return;}
    const recognition=new Speech();recognizer.current=recognition;recognition.continuous=true;recognition.lang='en-US';
    recognition.onresult=e=>{let text='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)text+=e.results[i][0].transcript+' ';if(text)setRoom(r=>({...r,transcript:(r.transcript+' '+text).trim(),lines:r.lines.map(l=>({...l,reviewed:false}))}));};
    recognition.onerror=e=>setMessage('Dictation stopped: '+e.error+'. You can still type observations.');
    recognition.onend=()=>setDictating(false);recognition.start();setDictating(true);
  }
  async function recordAudio() {
    if(recording){recorder.current.stop();return;}
    if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw new Error('Audio recording is unavailable. Upload a recording or type notes.');
    const audioStream=await navigator.mediaDevices.getUserMedia({audio:true});
    if(!alive.current){audioStream.getTracks().forEach(t=>t.stop());return;}
    stream.current=audioStream;const chunks=[];const rec=new MediaRecorder(audioStream);recorder.current=rec;
    rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
    rec.onstop=()=>{audioStream.getTracks().forEach(t=>t.stop());if(!alive.current)return;setRecording(false);const type=rec.mimeType||'audio/webm';run(()=>capture([new File(chunks,`inspection-voice-${Date.now()}.${type.includes('mp4')?'m4a':'webm'}`,{type})]));};
    rec.start();setRecording(true);
  }
  async function analyze() {
    await persist();
    const frames=[];
    for(const id of room.evidenceIds) {
      const doc=(claim.documents||[]).find(d=>d.id===id);
      if(!doc||!/^image\/|^video\//.test(doc.type||''))continue;
      const file=await loadMedia(claim.id,id);if(!file)throw new Error(`Re-select ${doc.name}: original is missing on this browser.`);
      frames.push(...await analysisFrames(file,id));
    }
    if(frames.length>12)throw new Error('Analyze up to 12 photos/video frames per room. Unlink extra media from this room first.');
    const result=await apiRequest(`/api/inspection/${encodeURIComponent(claim.id)}/analyze`,{method:'POST',body:JSON.stringify({roomId:room.id,frames})});
    const suggested=result.suggestion.lines.map(line=>({...blankLine(),...line,unit:line.basis==='perimeter'?'LF':'SF',origin:'AI suggestion',analysisId:result.analysisId,reviewed:false}));
    const next={...room,observations:result.suggestion.observations,questions:result.suggestion.questions,lines:[...room.lines,...suggested],lastAnalysis:{id:result.analysisId,model:result.model,createdAt:result.createdAt}};
    await persist(next);setRoom(next);setMessage('AI proposals added. Check materials, affected quantities, and related work before marking each line reviewed.');
  }
  async function transfer() {
    const incoming=comparisonLines(room,claim.documents||[],nowIso());
    const next={...room,lastTransferredAt:nowIso()};
    await persist(next,{estimateComparisons:mergeComparisonLines(claim.estimateComparisons||[],incoming,room.id)});setRoom(next);setReplaceConfirmed(false);setMessage('Scope quantities added to Estimate Comparison. Licensed Xactimate item selection and pricing remain pending.');
  }
  const quantities=room&&roomQuantities(room), docs=claim.documents||[], blockers=room?reviewBlockers(room,docs):[];
  const replacing=room&&(claim.estimateComparisons||[]).some(l=>l.inspectionRoomId===room.id);
  return <section className="inspection-scope">
    <h1>Inspection & Scope</h1>
    <p>Capture the room, describe its materials, verify measurements, and build a source-linked scope for Xactimate review.</p>
    <div className="inspection-status"><span>Photos / video / voice</span><span>Measured room sketch</span><span>Materials & repair operations</span><span>Xactimate review</span></div>
    <p className="notice">{aiReady?'An AI provider is configured; analysis results still require review.':'AI analysis is not connected. Capture, measurements, manual scope, and review still work.'} Live LiDAR requires a native scanner; import a normalized scan below. Xactimate pricing and direct estimate-file export are not connected.</p>
    <CaptureMethods/>
    {message&&<p role="status" className="notice">{message}</p>}
    <fieldset disabled={busy||recording||dictating} className="inspection-controls"><legend>Rooms & scan import</legend>
      <label>Room<select value={activeId} onChange={e=>run(()=>switchRoom(e.target.value))}><option value="" disabled>Select a room</option>{rooms.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
      <button type="button" onClick={()=>run(addRoom)}>Add room</button>
      <label>Import ADPA scan (.json)<input type="file" accept="application/json,.json" onChange={e=>{const file=e.target.files?.[0];e.target.value='';run(()=>importScan(file));}} /></label>
      <small>Imports version 1 rectangular measurements or version 2 Apple, Android, and manual floor outlines. Raw RoomPlan/Matterport files are not ADPA scan files. Scan originals are preserved on this browser with a fingerprint.</small>
    </fieldset>
    {!room?<p>Add a room to start an inspection.</p>:<>
    <fieldset disabled={busy} className="panel"><legend>1. Room & measurements</legend><div className="grid">
      <label>Room name<input value={room.name} onChange={e=>patch('name',e.target.value)} /></label>
      <label>Coverage<select value={room.coverage} onChange={e=>patch('coverage',e.target.value)}>{['A','B','CODE'].map(v=><option key={v}>{v}</option>)}</select></label>
      {(room.measurementMode==='polygon'?['height','openingsArea']:['length','width','height','openingsArea']).map(key=><label key={key}>{({length:'Length (ft)',width:'Width (ft)',height:'Height (ft)',openingsArea:'Wall opening deductions (SF)'})[key]}<input type="number" min="0" step="any" value={room[key]} onChange={e=>patch(key,e.target.value)} /></label>)}
      <label>Measurement source<input placeholder="LiDAR scan / laser measure / field notes" value={room.measurementSource} onChange={e=>patch('measurementSource',e.target.value)} /></label>
      <label className="inspection-check"><input type="checkbox" checked={room.measurementVerified} onChange={e=>setRoom(r=>({...r,measurementVerified:e.target.checked,lines:r.lines.map(l=>({...l,reviewed:false}))}))} />Measurements verified in field</label>
    </div>
    <div className="inspection-controls"><button type="button" onClick={()=>setRoom(r=>({...r,measurementMode:'rectangle',scanGeometry:null,length:'',width:'',measurementVerified:false,measurementSource:'',lines:r.lines.map(l=>({...l,reviewed:false}))}))}>Use rectangular measurements</button><button type="button" onClick={()=>setRoom(r=>({...r,measurementMode:'polygon',scanGeometry:{points:[],captureMethod:'manual_polygon',heightSource:'Inspector field measurement',warnings:[]},measurementSource:'Manual measured floor outline',measurementVerified:false,lines:r.lines.map(l=>({...l,reviewed:false}))}))}>Start manual floor outline</button></div>
    {room.measurementMode==='polygon'&&<div><h3>Measured floor outline</h3>{room.scanGeometry?.editedAfterImport&&<p className="notice">These scan-derived measurements were edited by the inspector. The original imported scan remains linked separately.</p>}<p>Enter corners in order around the room in feet; the last corner connects to the first. Use actual measurements in a common coordinate system. Do not repeat the first point.</p>
      <div className="grid">{(room.scanGeometry?.points||[]).map((point,index)=><div key={index} className="record"><b>Corner {index+1}</b>{['x','z'].map(axis=><label key={axis}>{axis.toUpperCase()} coordinate (ft)<input aria-label={`Corner ${index+1} ${axis} (ft)`} type="number" step="any" value={point[axis]} onChange={e=>patch('scanGeometry',{...room.scanGeometry,points:room.scanGeometry.points.map((p,i)=>i===index?{...p,[axis]:e.target.value===''?'':Number(e.target.value)}:p)})}/></label>)}<button type="button" onClick={()=>patch('scanGeometry',{...room.scanGeometry,points:room.scanGeometry.points.filter((p,i)=>i!==index)})}>Remove corner {index+1}</button></div>)}</div>
      <button type="button" disabled={(room.scanGeometry?.points?.length||0)>=100} onClick={()=>patch('scanGeometry',{...room.scanGeometry,points:[...(room.scanGeometry?.points||[]),{x:'',z:''}]})}>Add floor corner</button>
      {!polygonMetrics(room.scanGeometry?.points)&&<p className="notice">Enter at least three distinct corners forming a simple outline without crossing edges. No quantities are valid until the outline is complete.</p>}
      {room.scanGeometry?.warnings?.length>0&&<ul>{room.scanGeometry.warnings.map((warning,i)=><li key={i}>{warning}</li>)}</ul>}
    </div>}
    <p>{room.measurementMode==='polygon'?'Quantities use this floor polygon and the entered uniform height. Verify the outline, height, and opening deductions. Sloped ceilings and varying wall heights need custom quantities.':'Rectangular room calculation only.'} Use custom quantities for partial damage and individual wall surfaces.</p>
    {quantities&&<div className="inspection-sketch">{room.measurementMode==='polygon'?<svg viewBox="0 0 320 210" role="img" aria-label="Measured floor polygon"><polygon points={sketchPoints(room.scanGeometry.points)} fill="#e3f1f4" stroke="#126b7c" strokeWidth="3"/><text x="160" y="195" textAnchor="middle">Floor outline · height: {Number(room.height).toFixed(2)} ft</text></svg>:<svg viewBox="0 0 320 210" role="img" aria-label={`Rectangular room: ${room.length} by ${room.width} feet`}><rect x="55" y="35" width="210" height={Math.max(25,Math.min(125,125*Number(room.width)/Number(room.length)))} fill="#e3f1f4" stroke="#126b7c" strokeWidth="3"/><text x="160" y="22" textAnchor="middle">{Number(room.length).toFixed(2)} ft</text><text x="160" y="190" textAnchor="middle">Width: {Number(room.width).toFixed(2)} ft · height: {Number(room.height).toFixed(2)} ft</text></svg>}<dl>{Object.entries(quantities).map(([k,v])=><div key={k}><dt>{k==='walls'?'Net walls':k}</dt><dd>{v.toFixed(2)} {k==='perimeter'?'LF':'SF'}</dd></div>)}</dl></div>}
    </fieldset>
    <fieldset disabled={busy} className="panel"><legend>2. Capture evidence & spoken observations</legend>
      <div className="grid"><label>Take photo<input type="file" accept="image/*" capture="environment" onChange={e=>{const files=Array.from(e.target.files||[]);e.target.value='';run(()=>capture(files));}} /></label><label>Record video<input type="file" accept="video/*" capture="environment" onChange={e=>{const files=Array.from(e.target.files||[]);e.target.value='';run(()=>capture(files));}} /></label><label>Upload photos / video / voice<input type="file" multiple accept="image/*,video/*,audio/*" onChange={e=>{const files=Array.from(e.target.files||[]);e.target.value='';run(()=>capture(files));}} /></label></div>
      <p>Original media is saved in this browser only. It is unavailable on other devices and is lost if browser data is cleared. Use the original download below for backup.</p>
      <div className="inspection-controls"><button type="button" disabled={dictating} onClick={()=>run(recordAudio)}>{recording?'Stop & save voice recording':'Record voice evidence'}</button><button type="button" disabled={recording} onClick={dictate}>{dictating?'Stop dictation':'Dictate material notes'}</button></div>
      <small>Dictation may use your browser’s speech service. Audio recordings are preserved as evidence; AI reads the reviewed transcript, not raw audio.</small>
      <label>Material observations / reviewed voice transcript<textarea rows="4" placeholder="Ceiling: 5/8-inch drywall. Water staining at north corner. Inspect insulation after opening. Retain crown molding…" value={room.transcript} onChange={e=>patch('transcript',e.target.value)} /></label>
      <details><summary>Link existing claim evidence</summary>{docs.map(d=><label className="inspection-check" key={d.id}><input type="checkbox" checked={room.evidenceIds.includes(d.id)} onChange={e=>patch('evidenceIds',e.target.checked?[...room.evidenceIds,d.id]:room.evidenceIds.filter(id=>id!==d.id))} />{d.name||d.id}</label>)}</details>
      <div className="records">{room.evidenceIds.map(id=>{const doc=docs.find(d=>d.id===id);return <div className="record" key={id}><b>{doc?.name||'Missing evidence record'}</b><small>{doc?.storageStatus}</small><div><button type="button" onClick={()=>run(()=>viewMedia(id))}>Open / download original</button><button type="button" onClick={()=>patch('evidenceIds',room.evidenceIds.filter(x=>x!==id))}>Unlink from room</button></div></div>;})}</div>
      {preview&&<div className="inspection-preview">{preview.type.startsWith('image/')?<img src={preview.url} alt={preview.name}/>:preview.type.startsWith('video/')?<video controls src={preview.url}/>:preview.type.startsWith('audio/')?<audio controls src={preview.url}/>:<pre className="scan-source-preview">{preview.text||'Download this original file to inspect it.'}</pre>}<a href={preview.url} download={preview.name}>Download {preview.name}</a></div>}
      <label className="inspection-check"><input type="checkbox" checked={sendConfirmed} onChange={e=>setSendConfirmed(e.target.checked)}/>Send this room’s photos/video sample frames and saved notes to the configured AI provider for analysis.</label>
      <button className="primary" type="button" disabled={!aiReady||!sendConfirmed||recording||dictating} onClick={()=>run(analyze)}>Suggest materials & scope with AI</button>
      <small>Video analysis samples three frames per clip; it does not inspect every frame or listen to the clip. Maximum 12 images/frames per room.</small>
      {room.lastAnalysis&&<small>Last analysis: {room.lastAnalysis.model} · {room.lastAnalysis.createdAt}</small>}
      {room.observations.length>0&&<><h3>AI observations — verify</h3><ul>{room.observations.map((v,i)=><li key={i}>{v}</li>)}</ul></>}
      {room.questions.length>0&&<><h3>Questions for the inspector</h3><ul>{room.questions.map((v,i)=><li key={i}>{v}</li>)}</ul></>}
    </fieldset>
    <fieldset disabled={busy} className="panel"><legend>3. Scope operations & review</legend>
      <p>AI suggestions and manual operations are working scope. Use custom quantities when the affected area differs from the full room. Xactimate item codes, regional prices, assemblies, and Peter’s training corpus are not loaded in this build.</p>
      {room.lines.map((line,index)=><div className="record" key={line.id}><h3>Operation {index+1} · {line.origin||'Inspector entered'}</h3><div className="grid">
        {[['material','Building material'],['trade','Trade'],['description','Repair operation'],['rationale','Damage / repair rationale']].map(([key,label])=><label key={key}>{label}<input value={line[key]} onChange={e=>patchLine(line.id,key,e.target.value)}/></label>)}
        <label>Quantity basis<select value={line.basis} onChange={e=>{const basis=e.target.value;setRoom(r=>({...r,lines:r.lines.map(l=>l.id===line.id?{...l,basis,unit:basis==='perimeter'?'LF':'SF',reviewed:false}:l)}));}}>{Object.entries(bases).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
        {line.basis==='manual'&&<label>Custom quantity<input type="number" min="0" step="any" value={line.quantity} onChange={e=>patchLine(line.id,'quantity',e.target.value)}/></label>}
        <label>Unit<select disabled={line.basis!=='manual'} value={line.unit} onChange={e=>patchLine(line.id,'unit',e.target.value)}>{['SF','LF','EA','CY','HR'].map(v=><option key={v}>{v}</option>)}</select></label>
      </div><p>Calculated quantity: {lineQuantity(room,line)?.toFixed(2)||'Needs measurement'} {line.unit}</p>
      <div>{room.evidenceIds.map(id=><label className="inspection-check" key={id}><input type="checkbox" checked={line.evidenceIds.includes(id)} onChange={e=>patchLine(line.id,'evidenceIds',e.target.checked?[...line.evidenceIds,id]:line.evidenceIds.filter(x=>x!==id))}/>{docs.find(d=>d.id===id)?.name||'Missing evidence'}</label>)}</div>
      <label className="inspection-check"><input type="checkbox" checked={line.reviewed} onChange={e=>patchLine(line.id,'reviewed',e.target.checked)}/>I reviewed material, damage, repair operation, evidence, quantity, and related work.</label>
      <button type="button" onClick={()=>setRoom(r=>({...r,lines:r.lines.filter(l=>l.id!==line.id)}))}>Remove operation</button></div>)}
      <button type="button" onClick={()=>setRoom(r=>({...r,lines:[...r.lines,blankLine()]}))}>Add repair operation</button>
      <label>Scope reviewer<input value={room.reviewer} onChange={e=>patch('reviewer',e.target.value)} /></label>
      {blockers.length>0&&<details><summary>{blockers.length} review requirement(s) before transfer</summary><ul>{blockers.map((b,i)=><li key={i}>{b}</li>)}</ul></details>}
      {replacing&&<label className="inspection-check"><input type="checkbox" checked={replaceConfirmed} onChange={e=>setReplaceConfirmed(e.target.checked)}/>Replace this room’s previously transferred comparison lines and reset their pricing / review. Removed operations will also be removed from the working comparison.</label>}
      <div className="inspection-controls"><button type="button" className="primary" disabled={recording||dictating} onClick={()=>run(save)}>Save inspection</button><button type="button" onClick={()=>downloadJSON(scopeReviewExport(claim,room),'adpa-scope-review.json')}>Download scope review packet</button><button type="button" disabled={!!blockers.length||(replacing&&!replaceConfirmed)||recording||dictating} onClick={()=>run(transfer)}>{replacing?'Update working comparison':'Send scope to Estimate Comparison'}</button></div>
    </fieldset></>}
  </section>;
}
