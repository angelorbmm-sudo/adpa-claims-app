import json
from pathlib import Path
items=[]
for key,label,name,author,date,url,coverage,address,note in [
('colleen-contractor','Colleen · Sierra Renovations','Colleen Blanchard','Devin Irving / Sierra Renovations','2026-01-16','https://mail.google.com/mail/u/?authuser=angelo.rbmm%40gmail.com#all/19c444bb02efc8a9',0,'218 Gunston Ct, El Dorado Hills, CA 95762','Forwarded by Peter Rooney February 9. The document names Devin Irving as estimator. Date of loss on this contractor document differs from carrier; confirm against policy and claim records.'),
('colleen-carrier','Colleen · Liberty/Safeco Revision 3','Colleen Blanchard','Alaina Vierra / Liberty Mutual / Safeco','2026-06-16','https://mail.google.com/mail/u/?authuser=angelo.rbmm%40gmail.com#all/19edb38458ad7051',0,'218 Gunston Ct, El Dorado Hills, CA 95762','Sent by Doug Lindsey June 18. Carrier has separate removal and replacement lines. Document dates and room labels differ from contractor; every match requires review.'),
('bernards-contractor','Bernards · Peter Rooney / Tektone','Robert and Judy Bernards','Peter Rooney / Tektone Construction','2026-06-15',None,None,'12623 E Hwy 20, Clearlake Oaks, CA 95423','Mixed coverage estimate. Dwelling, other structures and contents have separate summaries. Assign coverage before creating supplements; unpriced code items remain unresolved.')]:
 p=json.loads(Path('.sites-runtime/scopes/'+key+'-parsed.json').read_text());p.update(key=key,label=label,claimName=name,author=author,date=date,address=address,sourceURL=url,sourceName={'colleen-contractor':'Collen Blanchard Estimate.pdf','colleen-carrier':'Blanchard Estimate 06.16.2026.pdf','bernards-contractor':'BERNARD_ROBERT_CAR.pdf'}[key],side='Carrier' if key.endswith('carrier') else 'Contractor',note=note,pageCount={'colleen-contractor':106,'colleen-carrier':26,'bernards-contractor':62}[key]);
 for row in p['rows']:row['coverage']=coverage
 items.append(p)
Path('source/scope-library.json').write_text(json.dumps(items))
