import {esc,icon} from '../components/ui.js';
import {TOOLS} from '../config.js';
import {limitsMap,usageRows,istDate} from '../services/usage.js';
export async function init({user,main}){
 main.innerHTML='<div class="mh"><h1>All tools</h1></div><div class="grid g3" id="g"></div><p class="err" id="er"></p>';
 let lim={},use=[];try{[lim,use]=await Promise.all([limitsMap(),usageRows(user.id,1)])}catch(e){document.getElementById('er').textContent='Couldn’t load limits: '+e.message}
 const today=istDate();
 document.getElementById('g').innerHTML=TOOLS.map(t=>{const l=lim[t.key],u=use.filter(r=>r.tool_key===t.key&&String(r.usage_date).slice(0,10)===today).reduce((a,r)=>a+r.usage_count,0);
  return`<a class="card" href="tools/${t.slug}.html"><div class="top"><div class="ico">${icon(t.icon)}</div><span class="tag ${t.ai?'':'live'}">${t.ai?'Not connected':'Works now'}</span></div><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p><p class="note" style="margin-top:10px">${l==null?'':`${Math.max(0,l-u)} of ${l} left today`}</p></a>`}).join('');
}
