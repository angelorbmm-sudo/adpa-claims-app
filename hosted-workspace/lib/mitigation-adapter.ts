import { mitigationReview, mitigationBlockers } from './mitigation-review.js';
export function mitigationClaim(state:any, files:any[], name='',id='') {
 const m=state.mitigation||{}, reviews=m.documentReviews||{};
 return {id,insured:name,claimNumber:state.profile?.claimNumber||'',mitigation:m,documents:files.map(f=>({id:f.id,name:f.filename,sha256:f.id,createdAt:f.created,reviewStatus:reviews[f.id]?.status==='Verified'&&reviews[f.id]?.sourceCreated===f.created?'Verified':'Unreviewed'}))};
}
export function mitigationFindings(state:any,files:any[]){return mitigationBlockers(mitigationClaim(state,files));}
export { mitigationReview };
