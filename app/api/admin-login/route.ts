import { env } from 'cloudflare:workers';
import { owner,createAdminCookie } from '../../admin-auth';
export const dynamic='force-dynamic';
export async function POST(req:Request){if(!await owner())return Response.json({error:'Sign in with the site owner account first.'},{status:403});try{const body=await req.json() as {username?:string;password?:string};const password=(env as unknown as {ADMIN_PASSWORD?:string}).ADMIN_PASSWORD;if(body.username!=='admin'||!password||body.password!==password)return Response.json({error:'Incorrect username or password.'},{status:401});return Response.json({authorized:true},{headers:{'Set-Cookie':await createAdminCookie(),'Cache-Control':'no-store'}})}catch{return Response.json({error:'Could not sign in.'},{status:400})}}
export async function DELETE(){return Response.json({authorized:false},{headers:{'Set-Cookie':'kpr_compass_admin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'}})}
