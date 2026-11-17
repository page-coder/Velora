import {$,fmt,icon,esc} from '../components/ui.js';
import {TOOLS,byId} from '../config.js';
import {compare} from '../components/compare.js';
import {mountTool} from '../components/tool-widget.js';
function art(){const c=document.createElement('canvas');c.width=960;c.height=600;const x=c.getContext('2d');
 const g=x.createLinearGradient(0,0,960,600);g.addColorStop(0,'#0d1330');g.addColorStop(.55,'#4a2fd0');g.addColorStop(1,'#42d9f5');x.fillStyle=g;x.fillRect(0,0,960,600);
 for(const [px,py,r,col] of [[250,300,190,'rgba(255,255,255,.18)'],[700,220,130,'rgba(8,11,20,.35)'],[620,430,210,'rgba(66,217,245,.25)']]){const rg=x.createRadialGradient(px,py,0,px,py,r);rg.addColorStop(0,col);rg.addColorStop(1,'transparent');x.fillStyle=rg;x.fillRect(0,0,960,600)}
 let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<9000;i++){x.fillStyle=`rgba(255,255,255,${rnd()*.12})`;x.fillRect(rnd()*960,rnd()*600,2,2)}
 x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=2;for(let i=0;i<12;i++){x.beginPath();x.arc(480,300,40+i*22,0,Math.PI*2);x.stroke()}return c}
const toBlob=(c,m,q)=>new Promise(r=>c.toBlob(r,m,q));
export async function init(){
 const c=art(),a=await toBlob(c,'image/png'),b=await toBlob(c,'image/jpeg',.35);
 const box=$('#demo');box.append(compare(URL.createObjectURL(a),URL.createObjectURL(b),'PNG original','JPEG 35%'));
 $('#demoCap').textContent=`Generated sample, processed live in your browser: ${fmt(a.size)} → ${fmt(b.size)} (${Math.round((1-b.size/a.size)*100)}% smaller). Drag to compare.`;
 $('#toolGrid').innerHTML=TOOLS.map(t=>`<a class="card" href="tools.html?tool=${t.id}"><div class="top"><div class="ico">${icon(t.icon)}</div><span class="tag ${t.ai?'':'live'}">${t.ai?'Not connected':'Works now'}</span></div><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p></a>`).join('');
 mountTool($('#try'),byId('compress'));
}
