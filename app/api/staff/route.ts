import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { owner,authorizedAdmin } from '../../admin-auth';
export const dynamic='force-dynamic';
export async function GET(){const user=await getChatGPTUser();const allowed=(env as unknown as {ADMIN_EMAIL?:string}).ADMIN_EMAIL;return Response.json({authorized:await authorizedAdmin(),owner:!!await owner(),signedIn:!!user,email:user?.email??null,configured:!!allowed},{headers:{'Cache-Control':'no-store'}})}
