"""Update recovery fragments while preserving the other claim modules."""
import json,re,subprocess
from pathlib import Path
p=Path('app/workspace-html.ts');html=json.loads(p.read_text().split(' = ',1)[1].strip().removesuffix(';'))
start='// recovery-client-start';end='// recovery-client-end';content=Path('source/recovery-client.js').read_text();fragment=start+'\n'+content+'\n'+end
if start in html:html,count=re.subn(re.escape(start)+r'.*?'+re.escape(end),lambda m:fragment,html,flags=re.S)
else:
 old=subprocess.check_output(['git','show','HEAD:source/recovery-client.js'],text=True).strip()
 if html.count(old)!=1:raise ValueError('Expected one current recovery fragment')
 html=html.replace(old,fragment,1);count=1
if count!=1:raise ValueError('Expected one recovery fragment')
panel=Path('source/recovery-panel.html').read_text().split('</section>',1)[0]+'</section>'
html,count=re.subn(r'<section data-panel="supplements" hidden>.*?</section>',lambda m:panel,html,flags=re.S)
if count!=1:raise ValueError('Expected one supplement panel')
mortgage=Path('source/recovery-panel.html').read_text().split('<section data-panel="mortgage"',1)[1]
mortgage='<section data-panel="mortgage"'+mortgage
html,count=re.subn(r'<section data-panel="mortgage" hidden>.*?</section>',lambda m:mortgage,html,flags=re.S)
if count!=1:raise ValueError('Expected one mortgage panel')
p.write_text('export const workspaceHTML = '+json.dumps(html)+';\n')
Path('public/supplement-review.js').write_bytes(Path('lib/supplement-review.js').read_bytes())
Path('public/mortgage-draw-review.js').write_bytes(Path('lib/mortgage-draw-review.js').read_bytes())
Path('.sites-runtime/workspace-test.html').write_text(html)
