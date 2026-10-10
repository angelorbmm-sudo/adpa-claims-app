import {getChatGPTUser} from '@/app/chatgpt-auth';
import {loadCompany} from '@/app/api/company/route';
import {loadMarketing} from '@/app/api/marketing/route';
import {manager} from '@/lib/shared-jobs';
import {designBrief} from '@/lib/company-marketing-connections';
export const dynamic='force-dynamic';
export async function GET(request:Request){const a=await getChatGPTUser();if(!a)return Response.json({error:'Please sign in.'},{status:401});try{const c=await loadCompany(new URL(request.url).searchParams.get('companyId')||'',a);if(!c||!manager(c,a))return Response.json({error:'Company brief not found.'},{status:404});const r=await loadMarketing(c);if(!r)return Response.json({error:'Company changed. Refresh.'},{status:409});return new Response(designBrief(r.state,c),{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'private, no-store','Content-Disposition':'attachment; filename="company-marketing-brief.txt"'}});}catch{return Response.json({error:'Brief unavailable.'},{status:503});}}
