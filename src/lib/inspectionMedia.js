// Original bytes are stored in this browser only until production object storage is connected.
function database() {
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open('adpa-inspection-media-v1',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('media');
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(new Error('This browser could not open inspection media storage.'));
  });
}
async function access(key, value, write=false) {
  const db=await database();
  try { return await new Promise((resolve,reject)=>{
    const tx=db.transaction('media',write?'readwrite':'readonly');
    const request=write?tx.objectStore('media').put(value,key):tx.objectStore('media').get(key);
    tx.oncomplete=()=>resolve(request.result);
    tx.onerror=()=>reject(new Error('Inspection media could not be saved. Check browser storage space.'));
    tx.onabort=()=>reject(new Error('Inspection media storage was interrupted.'));
  }); } finally { db.close(); }
}
export const saveMedia=(claimId,id,file)=>access(`${claimId}/${id}`,file,true);
export const loadMedia=(claimId,id)=>access(`${claimId}/${id}`);
export async function fingerprint(file) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer())),b=>b.toString(16).padStart(2,'0')).join('');
}
function imageData(source) {
  const canvas=document.createElement('canvas'), max=1280;
  const width=source.videoWidth||source.naturalWidth, height=source.videoHeight||source.naturalHeight;
  if(!width||!height) throw new Error('Could not read image dimensions.');
  const scale=Math.min(1,max/Math.max(width,height));
  canvas.width=Math.round(width*scale); canvas.height=Math.round(height*scale);
  canvas.getContext('2d').drawImage(source,0,0,canvas.width,canvas.height);
  return canvas.toDataURL('image/jpeg',0.8);
}
function eventOnce(target,event) {
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>finish(new Error('Media decoding timed out.')),15000);
    const success=()=>finish(), failure=()=>finish(new Error('Media format could not be decoded.'));
    function finish(error) { clearTimeout(timer); target.removeEventListener(event,success); target.removeEventListener('error',failure); error?reject(error):resolve(); }
    target.addEventListener(event,success,{once:true}); target.addEventListener('error',failure,{once:true});
  });
}
export async function analysisFrames(file,evidenceId) {
  const url=URL.createObjectURL(file);
  try {
    if(file.type.startsWith('image/')) {
      const img=new Image(), ready=eventOnce(img,'load'); img.src=url; await ready;
      return [{evidenceId,dataUrl:imageData(img),timestampSeconds:null}];
    }
    if(file.type.startsWith('video/')) {
      const video=document.createElement('video'); video.muted=true; video.preload='auto';
      const ready=eventOnce(video,'loadedmetadata'); video.src=url; await ready;
      if(!Number.isFinite(video.duration)||video.duration<=0) throw new Error('Video duration is unavailable. Use photos instead.');
      const frames=[];
      for(const ratio of [0.1,0.5,0.9]) {
        const seeking=eventOnce(video,'seeked'); video.currentTime=video.duration*ratio; await seeking;
        frames.push({evidenceId,dataUrl:imageData(video),timestampSeconds:video.currentTime});
      }
      video.removeAttribute('src');video.load(); return frames;
    }
    throw new Error('AI analysis accepts photos or video frames. Enter spoken observations in the transcript.');
  } finally { URL.revokeObjectURL(url); }
}
