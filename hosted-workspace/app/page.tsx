import { requireChatGPTUser } from './chatgpt-auth';
import {database} from '@/db/store';
import {redirect} from 'next/navigation';
import {PORTAL_OWNER} from '@/lib/policyholder';
import ClaimList from './claim-list';
export const dynamic='force-dynamic';
export default async function Page(){const user=await requireChatGPTUser('/');if(user.userId!==PORTAL_OWNER){const assigned=await database().prepare("SELECT id FROM claims WHERE EXISTS(SELECT 1 FROM json_each(claims.state,'$.clientPortal.invitations') p WHERE lower(json_extract(p.value,'$.email'))=? AND COALESCE(json_extract(p.value,'$.revoked'),0)=0 AND (json_extract(p.value,'$.userId') IS NULL OR json_extract(p.value,'$.userId')=?)) LIMIT 1").bind(user.email.trim().toLowerCase(),user.userId).first();if(assigned)redirect('/policyholder');}return <ClaimList displayName={user.displayName}/>;}
