import {$,esc,fmt} from '../components/ui.js';
import {TOOLS,byKey} from '../config.js';
import {history} from '../services/usage.js';
export async function init({user,main}){
 main.innerHTML=`<div class="mh"><h1>History</h1><label class="fl">Tool<select class="fld" id="flt"><option value="">All tools</option>${TOOLS.filter(t=>!t.ai).map(t=>`<option value="${t.key}">${esc(t.short)}</option>`).join('')}</select></label></div><div class="card"><div class="scroll"><table><thead><tr><th>When</th><th>Tool</th><th>File</th><th>Size</th><th>Status</th></tr></thead><tbody id="tb"></tbody></table></div><div id="em"></div><p class="err" id="er"></p><button class="btn sm hide" id="more" style="margin-top:12px">Load more</button></div>`;
 let from=0,key='';const size=20;
 const load=async reset=>{if(reset){from=0;$('#tb').innerHTML=''}$('#er').textContent='';
  try{const r=await history(user,{toolKey:key,from,size});from+=r.length;
   $('#tb').insertAdjacentHTML('beforeend',r.map(j=>{const m=j.metadata||{};return`<tr><td>${new Date(j.created_at).toLocaleString()}</td><td>${esc(byKey(j.tool_key)?.short||j.tool_key)}</td><td>${esc(j.original_file_name||'')}</td><td>${m.original_bytes!=null?fmt(m.original_bytes)+' → '+fmt(m.result_bytes):'—'}</td><td><span class="tag ${j.status==='completed'?'ok':j.status==='failed'?'bad':''}">${esc(j.status)}</span></td></tr>`}).join(''));
   $('#more').classList.toggle('hide',r.length<size);$('#em').innerHTML=from===0?'<div class="empty"><b>Nothing here yet</b>Processed images will be listed here.</div>':''}
  catch(e){$('#er').textContent='Couldn’t load history: '+e.message}};
 $('#flt').onchange=e=>{key=e.target.value;load(true)};$('#more').onclick=()=>load(false);load(true);
}
