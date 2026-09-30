import {cookies} from 'next/headers';
import type {Lang} from './i18n';
export async function savedLang():Promise<Lang>{return (await cookies()).get('kpr_compass_lang')?.value==='ta'?'ta':'en'}
