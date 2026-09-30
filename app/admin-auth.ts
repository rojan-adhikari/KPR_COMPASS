import { env } from 'cloudflare:workers';
import { headers } from 'next/headers';
import { getChatGPTUser } from './chatgpt-auth';
const COOKIE='kpr_compass_admin';
const encode=(bytes:Uint8Array)=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const decode=(value:string)=>Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
async function key(){const secret=(env as unknown as {ADMIN_SESSION_SECRET?:string}).ADMIN_SESSION_SECRET;if(!secret)throw Error('Admin session is not configured');return crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])}
export async function owner(){const user=await getChatGPTUser();const allowed=(env as unknown as {ADMIN_EMAIL?:string}).ADMIN_EMAIL;return user&&allowed?.split(',').some(s=>s.trim().toLowerCase()===user.email.toLowerCase())?user:null}
export async function createAdminCookie(){const user=await owner();if(!user)throw Error('Owner sign-in required');const payload=encode(new TextEncoder().encode(JSON.stringify({u:user.userId,exp:Date.now()+8*60*60*1000})));const signature=encode(new Uint8Array(await crypto.subtle.sign('HMAC',await key(),new TextEncoder().encode(payload))));return `${COOKIE}=${payload}.${signature}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`}
export async function authorizedAdmin(){const user=await owner();if(!user)return false;try{const h=await headers();const token=h.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);if(!token)return false;const [payload,signature]=token.split('.');if(!payload||!signature)return false;const valid=await crypto.subtle.verify('HMAC',await key(),decode(signature),new TextEncoder().encode(payload));if(!valid)return false;const data=JSON.parse(new TextDecoder().decode(decode(payload)));return data.u===user.userId&&Number(data.exp)>Date.now()}catch{return false}}
