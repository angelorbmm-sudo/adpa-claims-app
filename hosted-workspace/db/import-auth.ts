import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
export const CLAIM_OWNER = '57a641c7-7f54-4f15-8121-e53a65a2f33b';
export async function importAuthorized(request: Request) {
  const config = env as unknown as Record<string,string|undefined>;
  const expected = config.ADPA_IMPORT_KEY;
  const supplied = request.headers.get('X-ADPA-Import-Key');
  if (!expected || !supplied || expected.length < 32 || supplied.length > 200) return false;
  const [a,b] = await Promise.all([expected,supplied].map(v => crypto.subtle.digest('SHA-256',new TextEncoder().encode(v))));
  const left = new Uint8Array(a),right=new Uint8Array(b);let mismatch=0;
  for(let i=0;i<left.length;i++)mismatch|=left[i]^right[i];
  return mismatch===0;
}
export async function evidenceOwner(request:Request, allowImport=false){
 const user=await getChatGPTUser();
 if(user)return user.userId;
 if(allowImport && await importAuthorized(request))return CLAIM_OWNER;
 return null;
}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}});}
