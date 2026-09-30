'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {type Campus} from './data';
import {type GPSFix,liveRoute,liveInstruction} from './geo';
import {t} from './i18n';
export function useLiveGuide(data:Campus,target:string,accessible:boolean,lang:'en'|'ta'){
 const [active,setActive]=useState(false),[voice,setVoice]=useState(false),[fix,setFix]=useState<GPSFix|null>(null),[error,setError]=useState('');const watch=useRef<number|null>(null),spoken=useRef('');
 const path=useMemo(()=>active&&fix&&target&&fix.accuracy<=35?liveRoute(data,fix,target,accessible&&!!data.accessibilityVerified):null,[active,fix,target,accessible,data]);
 const instruction=useMemo(()=>active&&fix&&path?liveInstruction(data,path.ids,fix,lang):null,[active,fix,path,data,lang]);
 function stop(){if(watch.current!==null&&typeof navigator!=='undefined'&&navigator.geolocation)navigator.geolocation.clearWatch(watch.current);watch.current=null;setActive(false);setVoice(false);if(typeof window!=='undefined'&&'speechSynthesis'in window)window.speechSynthesis.cancel()}
 function start(force=false){if(watch.current!==null){if(!force&&!error)return;navigator.geolocation.clearWatch(watch.current);watch.current=null}if(!navigator.geolocation){setError(t(lang,'Live location is unavailable on this device.'));return}setError('');setFix(null);spoken.current='';setActive(true);watch.current=navigator.geolocation.watchPosition(position=>{setFix({lat:position.coords.latitude,lon:position.coords.longitude,accuracy:position.coords.accuracy,heading:position.coords.heading,timestamp:position.timestamp});setError('')},err=>setError(t(lang,err.code===1?'Location permission was denied. Enable it in your browser settings.':'Could not get your location. Move outdoors or try again.')),{enableHighAccuracy:true,maximumAge:1500,timeout:12000})}
 useEffect(()=>()=>{if(watch.current!==null&&navigator.geolocation)navigator.geolocation.clearWatch(watch.current)},[]);
 useEffect(()=>{if(!active||!voice||!instruction?.speak||!('speechSynthesis'in window))return;if(instruction.text===spoken.current)return;spoken.current=instruction.text;window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(instruction.text);utterance.lang=lang==='ta'?'ta-IN':'en-IN';utterance.rate=.92;window.speechSynthesis.speak(utterance)},[active,voice,instruction,lang]);
 return {active,voice,fix,error,path,instruction,start,stop,setVoice};
}
