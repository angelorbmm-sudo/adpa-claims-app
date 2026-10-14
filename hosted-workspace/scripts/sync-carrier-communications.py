"""Refresh the carrier communication fragment without rebuilding other claim modules."""
import json,re
from pathlib import Path
p=Path('app/workspace-html.ts')
html=json.loads(p.read_text().split(' = ',1)[1].strip().removesuffix(';'))
start='// carrier-communications-client-start';end='// carrier-communications-client-end'
fragment=start+'\n'+Path('lib/communication-review.js').read_text().replace('export ','')+'\n'+Path('source/carrier-communications-client.js').read_text()+end+'\n'
html,count=re.subn(re.escape(start)+r'.*?'+re.escape(end)+r'\n?',lambda _:fragment,html,flags=re.S)
if count!=1:raise ValueError('Expected one communication fragment')
p.write_text('export const workspaceHTML = '+json.dumps(html)+';\n')
