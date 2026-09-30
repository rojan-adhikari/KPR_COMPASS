import KPRCompass from './visitor';
import {savedLang} from './lang-cookie';
export default async function Home(){return <KPRCompass initialLang={await savedLang()}/>}
