"""Update construction fragments without regenerating older workspace modules."""
import json,re
from pathlib import Path
p=Path('app/workspace-html.ts')
html=json.loads(p.read_text().split(' = ',1)[1].strip().removesuffix(';'))
for start,end,source in [('<!-- construction-panel-start -->','<!-- construction-panel-end -->','source/construction-panel.html'),('// construction-client-start','// construction-client-end','source/construction-client.js')]:
 content=Path(source).read_text();pattern=re.escape(start)+r'.*?'+re.escape(end)
 html,count=re.subn(pattern,lambda m:start+'\n'+content+'\n'+end,html,flags=re.S)
 if count!=1:raise ValueError('Expected one construction fragment: '+start)
p.write_text('export const workspaceHTML = '+json.dumps(html)+';\n')
Path('public/scope-engine.mjs').write_bytes(Path('source/scope-engine.mjs').read_bytes())
Path('.sites-runtime/workspace-test.html').write_text(html)
