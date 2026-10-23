import {createRequire} from 'node:module';
import {dirname,join} from 'node:path';
import {mkdirSync,copyFileSync,readdirSync,cpSync} from 'node:fs';
const require=createRequire(import.meta.url),out=join(process.cwd(),'public/receipt-scanner');mkdirSync(out,{recursive:true});
const tess=dirname(require.resolve('tesseract.js/package.json')),core=dirname(createRequire(join(tess,'package.json')).resolve('tesseract.js-core/package.json')),pdf=dirname(require.resolve('pdfjs-dist/package.json')),data=dirname(require.resolve('@tesseract.js-data/eng/package.json'));
for(const name of ['tesseract.esm.min.js','worker.min.js','tesseract.min.js.LICENSE.txt'])copyFileSync(join(tess,'dist',name),join(out,name));
mkdirSync(join(out,'core'),{recursive:true});for(const name of readdirSync(core).filter(n=>/lstm\.wasm(?:\.js)?$/.test(n)))copyFileSync(join(core,name),join(out,'core',name));
copyFileSync(join(data,'4.0.0_best_int/eng.traineddata.gz'),join(out,'eng.traineddata.gz'));
for(const name of ['pdf.mjs','pdf.worker.mjs'])copyFileSync(join(pdf,'build',name),join(out,name));
for(const name of ['standard_fonts','cmaps','wasm'])cpSync(join(pdf,name),join(out,name),{recursive:true});
for(const [dir,name] of [[tess,'TESSERACT_LICENSE'],[core,'TESSERACT_CORE_LICENSE'],[pdf,'PDFJS_LICENSE'],[data,'LANGUAGE_DATA_LICENSE']]){const candidates=readdirSync(dir).filter(n=>/^LICENSE(?:\.txt|\.md)?$/i.test(n));if(candidates.length)copyFileSync(join(dir,candidates[0]),join(out,name));}
console.log('Prepared same-origin receipt scanner assets');
