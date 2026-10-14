"""Integrate approval fragments while preserving the existing workspace modules."""
import json,re
from pathlib import Path
p=Path('app/workspace-html.ts');html=json.loads(p.read_text().split(' = ',1)[1].strip().removesuffix(';'))
for start,end,source,anchor in [('<!-- authority-panel-start -->','<!-- authority-panel-end -->','source/authority-panel.html','<!-- construction-panel-start -->'),('// authority-client-start','// authority-client-end','source/authority-client.js','// construction-client-start')]:
 content=Path(source).read_text();fragment=start+'\n'+content+'\n'+end+'\n'
 if start in html:
  html,count=re.subn(re.escape(start)+r'.*?'+re.escape(end)+'\n?',lambda m:fragment,html,flags=re.S)
  if count!=1:raise ValueError('Expected one authority fragment')
 else:
  if html.count(anchor)!=1:raise ValueError('Expected one insertion anchor')
  html=html.replace(anchor,fragment+anchor)
if 'data-view="authority"' not in html:html=html.replace('<button class="cursor-interaction" data-view="construction">','<button class="cursor-interaction" data-view="authority">Approvals &amp; release</button><button class="cursor-interaction" data-view="construction">',1)
if "if(name==='authority')loadAuthority();" not in html:html=html.replace('function view(name){',"function view(name){if(name==='authority')loadAuthority();",1)
html=re.sub(r"view\(\[([^]]*)\]\.includes",lambda m:'view(['+m.group(1)+''.join(",'"+name+"'" for name in ['authority','ale','accounting'] if "'"+name+"'" not in m.group(1))+'].includes',html)
# Make the old manual readiness label unable to authorize a new release.
html=html.replace('<option>Ready to submit</option>','<option disabled>Ready to submit</option>')
p.write_text('export const workspaceHTML = '+json.dumps(html)+';\n');Path('.sites-runtime/workspace-test.html').write_text(html)
