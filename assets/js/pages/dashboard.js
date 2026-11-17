import {$,esc,fmt,icon} from '../components/ui.js';
import {TOOLS,byKey} from '../config.js';
import {dashboardData,istDate} from '../services/usage.js';
import {bars,columns} from '../components/charts.js';
export async function init({user,prof,main}){
 main.innerHTML=`<div class="mh"><div><h1>Welcome back, ${esc(prof?.display_name||'there')}</h1><p class="note" style="margin:8px 0 0">Usage resets at midnight India Standard Time.</p></div><a class="btn p" href="tools.html">${icon('grid')}Open tools</a></div><div id="body"><p class="note">Loading your workspace…</p></div>`;
 let d;try{d=await dashboardData(user)}catch(e){$('#body').innerHTML=`<p class="err">Couldn’t load dashboard data: ${esc(e.message)}</p>`;return}
 const today=istDate(),s=d.stats,rows=d.rows;
 const perTool=TOOLS.map(t=>({label:t.short,limit:d.limits[t.key]??null,used:rows.filter(r=>r.tool_key===t.key&&String(r.usage_date).slice(0,10)===today).reduce((a,r)=>a+r.usage_count,0)}));
 const days=[...Array(7)].map((_,i)=>{const dt=new Date(Date.now()-(6-i)*864e5),k=istDate(dt);return{label:dt.toLocaleDateString(undefined,{weekday:'short'}),value:rows.filter(r=>String(r.usage_date).slice(0,10)===k).reduce((a,r)=>a+r.usage_count,0)}});
 const stat=(n,l)=>`<div class="card stat"><b>${esc(n??'—')}</b><span>${l}</span></div>`;
 const act=d.jobs.length?`<div class="res">${d.jobs.map(j=>`<div class="row" style="grid-template-columns:1fr auto"><div><strong>${esc(j.original_file_name||'Image')}</strong><span>${esc(byKey(j.tool_key)?.short||j.tool_key)} · ${new Date(j.created_at).toLocaleString()}</span></div><span class="tag ${j.status==='completed'?'ok':j.status==='failed'?'bad':''}">${esc(j.status)}</span></div>`).join('')}</div><p style="margin:12px 0 0"><a href="history.html" style="text-decoration:underline" class="note">View full history</a></p>`:`<div class="empty"><b>No activity yet</b>Process your first image and it will appear here.</div>`;
 $('#body').innerHTML=`<div class="stats">${stat(s.images_processed,'Images processed')}${stat(s.daily_used,'Used today')}${stat(s.daily_limit,'Daily limit')}</div>
 <div class="grid g2"><div class="card"><h3 style="margin-top:0">Usage today by tool</h3><div id="b" style="margin-top:16px"></div></div><div class="card"><h3 style="margin-top:0">Last 7 days</h3><div class="chart" id="c" style="margin-top:12px"></div></div></div>
 <div class="grid g2" style="margin-top:14px"><div class="card"><h3 style="margin-top:0">Recent activity</h3><div style="margin-top:12px">${act}</div></div><div class="card"><h3 style="margin-top:0">Quick access</h3><div class="grid" style="margin-top:14px;grid-template-columns:1fr 1fr">${TOOLS.map(t=>`<a class="btn sm" href="tools/${t.slug}.html">${icon(t.icon)}${esc(t.short)}</a>`).join('')}</div></div></div>`;
 bars($('#b'),perTool);columns($('#c'),days);
}
