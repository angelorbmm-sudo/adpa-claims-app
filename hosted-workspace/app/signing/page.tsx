import {requireChatGPTUser} from '@/app/chatgpt-auth';
import SigningInbox from '@/components/signing-inbox';
import '../policyholder/dashboard.css';
export const dynamic='force-dynamic';export const metadata={title:'My signatures | ADPA'};
export default async function Page(){await requireChatGPTUser('/signing');return <main className="ph-dashboard"><header className="ph-top"><a href="/policyholder">ADPA<span>My signatures</span></a><a href="/company-jobs">Company workspace</a></header><SigningInbox/></main>;}
