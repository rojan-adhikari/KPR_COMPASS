import { env } from 'cloudflare:workers';
import { validCampus } from '../../data';
import {readCampus} from '../../campus-store';
import { authorizedAdmin } from '../../admin-auth';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await readCampus(),{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'Campus data temporarily unavailable'}, {status:503})}}
export async function PUT(req:Request){if(!await authorizedAdmin())return Response.json({error:'Admin sign-in required.'},{status:403});
 try{const data=await req.json();if(!validCampus(data))return Response.json({error:'Invalid map data. Check nodes, edges, venues, and required lists.'},{status:400});
 if(new Set(data.events.map((event:{id:string})=>event.id)).size!==data.events.length||data.events.some((event:{startsAt?:string;endsAt?:string})=>event.startsAt&&event.endsAt&&Date.parse(event.endsAt)<=Date.parse(event.startsAt)))return Response.json({error:'Event IDs must be unique and end times must follow start times.'},{status:400});
 const previous=await readCampus();data.version=previous.version+1;
 await env.DB!.prepare('INSERT INTO campus_data (id,payload,version,updated_at) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload, version=excluded.version, updated_at=excluded.updated_at').bind('main',JSON.stringify(data),data.version,new Date().toISOString()).run();
 const removed=previous.events.map((event:{posterUrl?:string})=>event.posterUrl).filter((url:string|undefined):url is string=>!!url&&url.startsWith('/api/event-poster?key=')&&!data.events.some((event:{posterUrl?:string})=>event.posterUrl===url));await Promise.allSettled(removed.map((url:string)=>env.BUCKET!.delete(decodeURIComponent(url.split('key=')[1]))));
 return Response.json(data);
 }catch{return Response.json({error:'Could not save. Check the data and retry.'},{status:500})}}
