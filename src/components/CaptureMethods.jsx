import React, { useState } from 'react';
import { captureOptions } from '../lib/scanGeometry.js';
export default function CaptureMethods(){
 const [selected,setSelected]=useState('manual');
 return <div className="panel capture-methods"><h2>Choose your capture method</h2>
  <div className="grid">{captureOptions().map(option=><label className={'capture-choice '+(selected===option.id?'selected':'')} key={option.id}>
   <span><input type="radio" name="capture-method" value={option.id} checked={selected===option.id} onChange={()=>setSelected(option.id)}/><b>{option.title}</b></span>
   <small>{option.id==='manual'?'Available here':'Companion installation and device testing pending'}</small>
  </label>)}</div>
  {selected==='manual'?<p>Use this app’s photo/video and voice capture. Enter laser/tape measurements below, or draw a floor outline from measured corner coordinates. No depth sensor is required.</p>:selected==='apple'?<p>On a supported LiDAR-equipped Apple device, the companion scans one room with RoomPlan and exports an ADPA scan file. Import that file below. Until the companion is installed and validated, use photos and entered measurements here.</p>:<p>On a supported Android device, the companion checks ARCore and Depth support, then guides you to mark floor corners. Enter a separately measured room height and import its ADPA scan file here. Samsung or Google branding alone does not establish scanning support.</p>}
  <small>The web app does not detect native depth sensors. A native companion must check actual device support. No paid service is called by choosing a capture method.</small>
 </div>;
}
