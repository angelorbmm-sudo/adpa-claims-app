import {createWorker} from 'tesseract.js';
import {createRequire} from 'node:module';
import {dirname,join} from 'node:path';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';
import {PDFDocument,StandardFonts} from 'pdf-lib';
const require=createRequire(import.meta.url),pdfRoot=dirname(require.resolve('pdfjs-dist/package.json')),canvas=await import(createRequire(join(pdfRoot,'package.json')).resolve('@napi-rs/canvas'));
globalThis.DOMMatrix=canvas.DOMMatrix;globalThis.Path2D=canvas.Path2D;globalThis.ImageData=canvas.ImageData;
const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs'),langPath=join(dirname(require.resolve('@tesseract.js-data/eng/package.json')),'4.0.0_best_int'),scratch=mkdtempSync(join(tmpdir(),'lifeworth-ocr-'));
const lines=['EXAMPLE HOME STORE','Receipt # ABC-123','10/20/2026','','Office Desk     129.99','2 x Lamp         40.00','','Subtotal        169.99','Tax              13.60','TOTAL           183.59'];
const image=canvas.createCanvas(1100,1000),ctx=image.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,1100,1000);ctx.fillStyle='black';ctx.font='36px sans-serif';lines.forEach((s,i)=>ctx.fillText(s,60,70+i*75));const png=image.toBuffer('image/png');
const worker=await createWorker('eng',1,{langPath,gzip:true,cacheMethod:'none',cachePath:scratch});
const check=text=>{assert.match(text,/Office Desk\s+129.99/i);assert.match(text,/TOTAL\s+183.59/i)};
try{
 const result=await worker.recognize(png);check(result.data.text);console.log('PASS: real OCR recognizes a synthetic PNG product and total.');
 const textPdf=await PDFDocument.create(),page=textPdf.addPage([550,700]),font=await textPdf.embedFont(StandardFonts.Helvetica);lines.forEach((s,i)=>page.drawText(s,{x:30,y:660-i*50,size:16,font}));
 const task=pdfjs.getDocument({data:await textPdf.save(),isEvalSupported:false,standardFontDataUrl:pdfRoot+'/standard_fonts/'});try{const doc=await task.promise,p=await doc.getPage(1),content=await p.getTextContent();check(content.items.filter(x=>'str' in x).map(x=>x.str).join('\n'));console.log('PASS: PDF.js extracts a synthetic text PDF product and total.');}finally{await task.destroy();}
 const scanned=await PDFDocument.create(),scanPage=scanned.addPage([550,500]),embedded=await scanned.embedPng(png);scanPage.drawImage(embedded,{x:0,y:0,width:550,height:500});const scanTask=pdfjs.getDocument({data:await scanned.save(),isEvalSupported:false,standardFontDataUrl:pdfRoot+'/standard_fonts/'});try{const doc=await scanTask.promise,p=await doc.getPage(1),content=await p.getTextContent();assert.equal(content.items.length,0);const viewport=p.getViewport({scale:2}),surface=canvas.createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));await p.render({canvas:surface,canvasContext:surface.getContext('2d'),viewport}).promise;const r=await worker.recognize(surface.toBuffer('image/png'));check(r.data.text);console.log('PASS: image-only PDF renders and OCR recognizes the product and total.');}finally{await scanTask.destroy();}
}finally{await worker.terminate();rmSync(scratch,{recursive:true,force:true});}
