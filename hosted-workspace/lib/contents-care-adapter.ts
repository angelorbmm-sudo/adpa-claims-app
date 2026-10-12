import { contentsCareReview, contentsCareBlockers } from './contents-care-review.js';
export function contentsCareClaim(state:any, files:any[], name='',id='') {
 const m=state.contentsCare||{}, reviews=m.documentReviews||{};
 return {id,insured:name,claimNumber:state.profile?.claimNumber||'',contentsCare:m,documents:files.map(f=>({id:f.id,name:f.filename,sha256:f.id,createdAt:f.created,reviewStatus:reviews[f.id]?.status==='Verified'&&reviews[f.id]?.sourceCreated===f.created?'Verified':'Unreviewed'}))};
}
export function contentsCareFindings(state:any,files:any[]){return contentsCareBlockers(contentsCareClaim(state,files));}
export { contentsCareReview };
