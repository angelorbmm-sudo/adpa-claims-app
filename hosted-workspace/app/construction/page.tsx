import {getChatGPTUser,chatGPTSignInPath} from '@/app/chatgpt-auth';
import {redirect} from 'next/navigation';
import ConstructionLibrary from './library';
export const dynamic='force-dynamic';
export default async function Page(){if(!await getChatGPTUser())redirect(chatGPTSignInPath('/construction'));return <ConstructionLibrary/>;}
