export type DropOptions={maxBytes?:number;disabled?:()=>boolean};
const fileDrag=(event:DragEvent)=>Array.from(event.dataTransfer?.types||[]).includes('Files');
function selectionError(files:File[],input:HTMLInputElement,maxBytes:number){
 if(!files.length)return 'Drop files from your device, or use Choose Files.';
 if(!input.multiple&&files.length>1)return 'Choose one file for this field. Your previous selection has been kept.';
 const accept=input.accept.toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
 for(const file of files){if(!file.size)return file.name+' is empty. Choose another file.';if(file.size>maxBytes)return file.name+' exceeds '+Math.round(maxBytes/1048576)+' MB. Choose a smaller file.';
 const name=file.name.toLowerCase(),mime=file.type.toLowerCase();if(accept.length&&!accept.some(a=>a.startsWith('.')?name.endsWith(a):a.endsWith('/*')?mime.startsWith(a.slice(0,-1)):mime===a))return file.name+' is not supported in this field. Allowed: '+input.accept+'.';}
 return '';
}
export function bindFileDrop(input:HTMLInputElement,options:DropOptions={}){
 if(input.dataset.dropEnhanced)return ()=>{};input.dataset.dropEnhanced='true';
 const doc=input.ownerDocument,zone=doc.createElement('div'),hint=doc.createElement('span'),status=doc.createElement('span');zone.className='adpa-file-drop';hint.className='adpa-file-drop-hint';hint.textContent=input.multiple?'Drop files here, or choose files':'Drop a file here, or choose a file';status.className='adpa-file-drop-status';status.id=input.id+'-drop-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');const previousDescription=input.getAttribute('aria-describedby');input.setAttribute('aria-describedby',[previousDescription,status.id].filter(Boolean).join(' '));input.parentNode!.insertBefore(zone,input);zone.appendChild(hint);zone.appendChild(input);zone.appendChild(status);
 const maxBytes=options.maxBytes??30*1048576;let depth=0;const disabled=()=>input.disabled||!!options.disabled?.();
 function message(text:string,error=false){status.textContent=text;status.classList.toggle('adpa-file-drop-error',error);}
 function refresh(){const files=Array.from(input.files||[]);message(files.length?files.map(f=>f.name).join(' · '):'No files selected. Maximum '+Math.round(maxBytes/1048576)+' MB per file.');}
 function enter(event:DragEvent){if(!fileDrag(event))return;event.preventDefault();depth++;if(!disabled())zone.classList.add('adpa-file-drop-active');}
 function over(event:DragEvent){if(!fileDrag(event))return;event.preventDefault();if(event.dataTransfer)event.dataTransfer.dropEffect=disabled()?'none':'copy';}
 function leave(event:DragEvent){if(!fileDrag(event))return;depth=Math.max(0,depth-1);if(!depth)zone.classList.remove('adpa-file-drop-active');}
 function drop(event:DragEvent){if(!fileDrag(event))return;event.preventDefault();event.stopPropagation();depth=0;zone.classList.remove('adpa-file-drop-active');if(disabled()){message('Please wait for the current upload to finish.',true);return;}
 const files=Array.from(event.dataTransfer?.files||[]),error=selectionError(files,input,maxBytes);if(error){message(error,true);return;}
 try{const Transfer=doc.defaultView?.DataTransfer;if(!Transfer)throw Error('unsupported');const transfer=new Transfer();files.forEach(f=>transfer.items.add(f));input.files=transfer.files;input.dispatchEvent(new (doc.defaultView!.Event)('change',{bubbles:true}));refresh();}catch{message('Use Choose Files on this device to select these files.',true);}
 }
 function changed(){refresh();}
 function reset(){queueMicrotask(refresh);}
 zone.addEventListener('dragenter',enter);zone.addEventListener('dragover',over);zone.addEventListener('dragleave',leave);zone.addEventListener('drop',drop);input.addEventListener('change',changed);input.form?.addEventListener('reset',reset);refresh();
 return ()=>{zone.removeEventListener('dragenter',enter);zone.removeEventListener('dragover',over);zone.removeEventListener('dragleave',leave);zone.removeEventListener('drop',drop);input.removeEventListener('change',changed);input.form?.removeEventListener('reset',reset);zone.parentNode?.insertBefore(input,zone);zone.remove();delete input.dataset.dropEnhanced;if(previousDescription===null)input.removeAttribute('aria-describedby');else input.setAttribute('aria-describedby',previousDescription);};
}
export function preventFileNavigation(doc:Document){const prevent=(event:DragEvent)=>{if(fileDrag(event))event.preventDefault();};doc.addEventListener('dragover',prevent);doc.addEventListener('drop',prevent);return ()=>{doc.removeEventListener('dragover',prevent);doc.removeEventListener('drop',prevent);};}
export function enhanceFileInputs(root:HTMLElement){const cleanup=Array.from(root.querySelectorAll<HTMLInputElement>('input[type="file"]')).map(input=>bindFileDrop(input,{maxBytes:input.id==='file'?20*1048576:30*1048576,disabled:()=>Array.from(input.form?.querySelectorAll<HTMLButtonElement>('button[type="submit"]')||[]).some(b=>b.disabled)||input.id==='scope-file'&&!!root.querySelector<HTMLButtonElement>('#scope-extract')?.disabled}));const guard=preventFileNavigation(root.ownerDocument);return ()=>{cleanup.forEach(fn=>fn());guard();};}
