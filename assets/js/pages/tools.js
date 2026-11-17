import {$,esc} from '../components/ui.js';
import {TOOLS,byId} from '../config.js';
import {mountTool} from '../components/tool-widget.js';
export function init({user}){
 const id=new URLSearchParams(location.search).get('tool'),tool=byId(id)||byId('compress');
 $('#tabs').innerHTML=TOOLS.map(t=>`<a href="tools.html?tool=${t.id}" class="${t.id===tool.id?'on':''}" ${t.id===tool.id?'aria-current="page"':''}>${esc(t.short)}${t.ai?' ·soon':''}</a>`).join('');
 $('#tname').textContent=tool.name;$('#tdesc').textContent=tool.desc;document.title=`VELORA — ${tool.name}`;
 $('#guestNote').innerHTML=user?'You are signed in. Your usage is tracked and your daily limit applies to this tool.':'No account needed. Guest use is not tracked. <a href="signup.html" style="text-decoration:underline">Create an account</a> for history and a dashboard.';
 mountTool($('#tool'),tool,{user});
}
