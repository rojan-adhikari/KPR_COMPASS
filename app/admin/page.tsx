import KPRCompass from '../visitor';
import {savedLang} from '../lang-cookie';
export default async function AdminPage(){return <KPRCompass initialView="admin" initialLang={await savedLang()}/>}
