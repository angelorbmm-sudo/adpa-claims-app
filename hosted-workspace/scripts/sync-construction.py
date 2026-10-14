"""Update or restore construction fragments without regenerating other modules."""
import json,re
from pathlib import Path
p=Path('app/workspace-html.ts')
html=json.loads(p.read_text().split(' = ',1)[1].strip().removesuffix(';'))
for start,end,source,anchor in [('<!-- construction-panel-start -->','<!-- construction-panel-end -->','source/construction-panel.html','<section data-panel="evidence" hidden>'),('// construction-client-start','// construction-client-end','source/construction-client.js','function snapshot(){')]:
 content=Path(source).read_text();fragment=start+'\n'+content+'\n'+end+'\n'
 if start in html:
  html,count=re.subn(re.escape(start)+r'.*?'+re.escape(end)+'\n?',lambda m:fragment,html,flags=re.S)
  if count!=1:raise ValueError('Expected one construction fragment: '+start)
 else:
  if html.count(anchor)!=1:raise ValueError('Expected one construction insertion anchor: '+anchor)
  html=html.replace(anchor,fragment+anchor,1)
if 'data-view="construction"' not in html:
 html=html.replace('<button class="cursor-interaction" data-view="evidence">','<button class="cursor-interaction" data-view="construction">Construction comparison</button><button class="cursor-interaction" data-view="evidence">',1)
if "if(name==='construction')loadConstruction();" not in html:html=html.replace('function view(name){',"function view(name){if(name==='construction')loadConstruction();",1)
html=html.replace("'supplements','mortgage'].includes","'supplements','mortgage','construction'].includes")
p.write_text('export const workspaceHTML = '+json.dumps(html)+';\n')
Path('public/scope-engine.mjs').write_bytes(Path('source/scope-engine.mjs').read_bytes())
Path('.sites-runtime/workspace-test.html').write_text(html)
