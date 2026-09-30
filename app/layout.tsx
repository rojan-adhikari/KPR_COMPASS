import type { Metadata } from 'next';
import './globals.css';
import {savedLang} from './lang-cookie';
export const metadata:Metadata={title:'KPR Compass | Campus navigation',description:'Find KPRIET places and follow live campus guidance with a clear, accessible map.',icons:{icon:'https://www.kpriet.ac.in/asset/frontend/images/logo/favicon.webp'}};
export default async function RootLayout({children}:{children:React.ReactNode}){return <html lang={await savedLang()}><body>{children}</body></html>}
