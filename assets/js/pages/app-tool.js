import {$,esc,icon} from '../components/ui.js';
import {byId} from '../config.js';
import {mountTool} from '../components/tool-widget.js';
import {remaining} from '../services/usage.js';
export async function init({user,main}){
 const tool=byId(document.body.dataset.tool);document.title=`VELORA — ${tool.name}`;
 main.innerHTML=`<div class="mh"><div><h1>${esc(tool.name)}</h1><p class="note" style="margin:8px 0 0">${esc(tool.desc)}</p></div><span class="tag live" id="left">${tool.ai?'Not connected':'Checking limit…'}</span></div><div class="tw" id="tool"></div>`;
 const upd=async()=>{if(tool.ai)return;try{const r=await remaining(user,tool);$('#left').textContent=r.left===null?'No limit set':`${r.left} of ${r.limit} left today${tool.id==='bulk'?' (batches)':''}`;$('#left').className='tag '+(r.left===0?'bad':'live')}catch(e){$('#left').textContent='Limit unavailable'}};
 mountTool($('#tool'),tool,{user,onUsage:upd});upd();
}
