import json,re,subprocess
from pathlib import Path
p=Path('app/workspace-html.ts');html=json.loads(p.read_text().split(' = ',1)[1].strip().removesuffix(';'))
start='// agreements-client-start';end='// agreements-client-end';content=Path('source/agreements-client.js').read_text();fragment=start+'\n'+content+'\n'+end
if start in html:html,count=re.subn(re.escape(start)+r'.*?'+re.escape(end),lambda m:fragment,html,flags=re.S)
else:
 old=subprocess.check_output(['git','show','HEAD:source/agreements-client.js'],text=True).strip()
 if html.count(old)!=1:raise ValueError('Expected one agreement fragment')
 html=html.replace(old,fragment,1);count=1
if count!=1:raise ValueError('Expected one agreement fragment')
html,count=re.subn(r'<section data-panel="agreements" hidden>.*?</section>',lambda m:Path('source/agreements-panel.html').read_text().strip(),html,flags=re.S)
if count!=1:raise ValueError('Expected one agreement panel')
html=html.replace('claimExtra.mortgageDrawAudit=d.mortgageDrawAudit||claimExtra.mortgageDrawAudit;','claimExtra.mortgageDrawAudit=d.mortgageDrawAudit||claimExtra.mortgageDrawAudit;claimExtra.agreementAudit=d.agreementAudit||claimExtra.agreementAudit;') if 'claimExtra.agreementAudit=d.agreementAudit' not in html else html
p.write_text('export const workspaceHTML = '+json.dumps(html)+';\n');Path('public/agreement-review.js').write_bytes(Path('lib/agreement-review.js').read_bytes());Path('.sites-runtime/workspace-test.html').write_text(html)
