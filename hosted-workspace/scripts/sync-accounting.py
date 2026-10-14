"""Update accounting and ALE fragments, retaining unrelated workspace modules."""
import json,re,subprocess
from pathlib import Path
p=Path('app/workspace-html.ts');html=json.loads(p.read_text().split(' = ',1)[1].strip().removesuffix(';'))
start='// accounting-client-start';end='// accounting-client-end';content=Path('source/accounting-client.js').read_text();fragment=start+'\n'+content+'\n'+end
if start in html:html,count=re.subn(re.escape(start)+r'.*?'+re.escape(end),lambda m:fragment,html,flags=re.S)
else:
 old=subprocess.check_output(['git','show','HEAD:source/accounting-client.js'],text=True).strip()
 if html.count(old)==1:html=html.replace(old,fragment,1)
 elif 'let accountingEdit' not in html:html=html.replace('// recovery-client-end','// recovery-client-end\n'+fragment,1)
 else:raise ValueError('Expected one accounting fragment')
 count=1
if count!=1:raise ValueError('Expected one accounting fragment')
for name in ['accounting','ale']:
 panel=next('<section'+x for x in Path('source/accounting-panel.html').read_text().split('<section')[1:] if f'data-panel="{name}"' in x).strip()
 html,count=re.subn(r'<section data-panel="'+name+r'" hidden>.*?</section>',lambda m:panel,html,flags=re.S)
 if count==0 and f'data-panel="{name}"' not in html:html=html.replace('<main>','<main>\n'+panel,1)
 elif count!=1:raise ValueError('Expected one '+name+' panel')
if 'data-view="ale"' not in html:html=html.replace('<button class="cursor-interaction" data-view="agreements">','<button class="cursor-interaction" data-view="ale">ALE expenses</button><button class="cursor-interaction" data-view="accounting">Payment ledger</button><button class="cursor-interaction" data-view="agreements">')
if "if(name==='ale'" not in html:html=html.replace('function view(name){',"function view(name){if(name==='ale'||name==='accounting')void loadAccounting().catch(e=>q('#adpa-feedback').textContent=e.message);")
html=html.replace("['overview','communications','buckets','inventory','evidence'].includes","['overview','communications','buckets','inventory','evidence','ale','accounting'].includes")
if 'claimExtra.aleAudit=d.aleAudit' not in html:html=html.replace('claimExtra.agreementAudit=d.agreementAudit||claimExtra.agreementAudit;','claimExtra.agreementAudit=d.agreementAudit||claimExtra.agreementAudit;claimExtra.aleAudit=d.aleAudit||claimExtra.aleAudit;')
p.write_text('export const workspaceHTML = '+json.dumps(html)+';\n');Path('public/ale-review.js').write_bytes(Path('lib/ale-review.js').read_bytes());Path('.sites-runtime/workspace-test.html').write_text(html)
