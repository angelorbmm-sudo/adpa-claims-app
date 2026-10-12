import fs from 'node:fs';
import {createRequire} from 'node:module';const require=createRequire(import.meta.url);const {DOMMatrix,Path2D,ImageData}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');Object.assign(globalThis,{DOMMatrix,Path2D,ImageData});
const pdfjs=await import('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/pdfjs-dist/legacy/build/pdf.mjs');
const doc=await pdfjs.getDocument({data:new Uint8Array(fs.readFileSync(process.argv[2])),useSystemFonts:true}).promise;const pages=[];
for(let n=1;n<=doc.numPages;n++){const page=await doc.getPage(n),text=await page.getTextContent(),lines=[];for(const item of text.items){if(!item.str?.trim())continue;const y=item.transform[5];let line=lines.find(l=>Math.abs(l.y-y)<2);if(!line){line={y,items:[]};lines.push(line);}line.items.push({x:item.transform[4],text:item.str});}pages.push({page:n,lines:lines.sort((a,b)=>b.y-a.y).map(l=>({y:l.y,text:l.items.sort((a,b)=>a.x-b.x).map(i=>i.text).join(' '),cells:l.items}))});}
fs.writeFileSync(process.argv[3],JSON.stringify(pages));console.log(JSON.stringify({file:process.argv[3],pages:pages.length}));
