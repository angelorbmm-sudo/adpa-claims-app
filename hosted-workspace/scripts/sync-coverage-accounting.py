"""Update only the coverage-accounting helpers in the generated workspace."""
import json,re
from pathlib import Path
p=Path('app/workspace-html.ts')
html=json.loads(p.read_text().split(' = ',1)[1].strip().removesuffix(';'))
start='// coverage-accounting-start';end='// coverage-accounting-end'
fragment=start+'\n'+Path('lib/coverage-accounting.js').read_text().replace('export ','')+Path('source/coverage-accounting-client.js').read_text()+end
html,count=re.subn(re.escape(start)+r'.*?'+re.escape(end),lambda _:fragment,html,flags=re.S)
if count!=1:raise ValueError('Expected one accounting fragment')
p.write_text('export const workspaceHTML = '+json.dumps(html)+';\n')
