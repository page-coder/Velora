import {$,$$,esc,fmt,icon} from './ui.js';
import * as Img from '../services/images.js';
import {compare} from './compare.js';
import {makeZip} from '../services/zip.js';
import {remaining,consume,logJob,LIMIT_MSG} from '../services/usage.js';
const PRESETS=[['','Custom size'],['1080x1080','Instagram post 1080×1080'],['1080x1920','Story / Reel 1080×1920'],['1280x720','YouTube thumbnail 1280×720'],['1500x500','X header 1500×500'],['1584x396','LinkedIn banner 1584×396'],['r1:1','Ratio 1:1'],['r4:3','Ratio 4:3'],['r16:9','Ratio 16:9']];
const CROP=[['.5,.5','Centre'],['.5,0','Top'],['.5,1','Bottom'],['0,.5','Left'],['1,.5','Right']];
export function aiPanel(el,tool){el.innerHTML=`<div class="tb"><div class="pending"><span class="tag">Not connected</span><h3 style="margin-top:12px">${esc(tool.name)}</h3><p>${esc(tool.desc)} This needs a server-side AI model and no provider is connected yet, so this tool does not process images. Nothing is faked or returned unchanged.</p><a class="btn" href="${location.pathname.includes('/app/')?'../tools.html':'tools.html?tool=compress'}">${icon('grid')}See working tools</a></div></div>`}
export function mountTool(el,tool,{user=null,onUsage=()=>{}}={}){
 if(tool.ai)return aiPanel(el,tool);
 const multi=tool.id==='bulk',s=Img.support;
 const fm=(first)=>`<option value="${first[0]}">${first[1]}</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option>${s['image/webp']?'<option value="image/webp">WebP</option>':''}${s['image/avif']?'<option value="image/avif">AVIF</option>':'<option disabled>AVIF (not encodable in this browser)</option>'}<option disabled>JPEG XL (no browser encoder)</option>`;
 const q='<label class="full">Quality <output>80</output>%<input type="range" min="10" max="100" value="80" data-k="q"></label>';
 const ctl={compress:q+`<label class="full">Output format<select data-k="mime">${fm(['original','Keep original'])}</select></label>`,
  convert:`<label class="full">Convert to<select data-k="mime">${fm(['','Choose a format…'])}</select></label>`+q,
  resize:`<label class="full">Preset<select data-k="preset">${PRESETS.map(p=>`<option value="${p[0]}">${p[1]}</option>`).join('')}</select></label><label>Width px<input type="number" min="1" max="12000" data-k="w"></label><label>Height px<input type="number" min="1" max="12000" data-k="h"></label><label>Fit<select data-k="fit"><option value="cover">Crop to fill</option><option value="contain">Scale to fit</option></select></label><label>Crop position<select data-k="crop">${CROP.map(c=>`<option value="${c[0]}">${c[1]}</option>`).join('')}</select></label><label class="full">Format<select data-k="mime">${fm(['original','Keep original'])}</select></label>`+q,
  bulk:q+`<label>Max width px (optional)<input type="number" min="1" max="12000" data-k="maxW" placeholder="No limit"></label><label>Format<select data-k="mime">${fm(['original','Keep original'])}</select></label>`}[tool.id];
 el.innerHTML=`<div class="tb"><label class="drop" id="dz"><b>${multi?'Drop images or browse':'Drop an image or browse'}</b>JPG, PNG, WebP, GIF, BMP · up to 80 MB · processed in your browser<input type="file" accept="${Img.OK.join(',')}" ${multi?'multiple':''}></label><div class="ctl">${ctl}</div><button class="btn p" style="width:100%" id="go" disabled>Choose ${multi?'images':'an image'} to begin</button><div class="prog hide" id="pg"><i></i></div><p class="err" id="er" role="alert"></p><div class="res" id="rs" aria-live="polite"></div></div>`;
 const inp=$('input[type=file]',el),dz=$('#dz',el),go=$('#go',el),er=$('#er',el),rs=$('#rs',el),pg=$('#pg',el);let files=[];
 const v=k=>$(`[data-k=${k}]`,el)?.value;
 const verb=multi?'Optimize':{compress:'Compress image',convert:'Convert image',resize:'Resize image'}[tool.id];
 const label=()=>go.textContent=files.length?(multi?`Optimize ${files.length} image${files.length>1?'s':''}`:verb):`Choose ${multi?'images':'an image'} to begin`;
 $$('input[type=range]',el).forEach(r=>r.oninput=()=>r.parentElement.querySelector('output').textContent=r.value);
 const pick=list=>{er.textContent='';rs.innerHTML='';const a=[...list];const bad=a.map(Img.validate).filter(Boolean);if(bad.length){er.textContent=bad.join(' ');return}if(!a.length)return;
  files=multi?a:[a[0]];go.disabled=false;$('b',dz).textContent=files.length>1?`${files.length} images selected`:files[0].name;label();
  if(tool.id==='resize'){const u=URL.createObjectURL(files[0]),i=new Image();i.onload=()=>{$('[data-k=w]',el).value=i.naturalWidth;$('[data-k=h]',el).value=i.naturalHeight;URL.revokeObjectURL(u)};i.src=u}};
 inp.onchange=()=>pick(inp.files);['dragenter','dragover'].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.add('over')}));['dragleave','drop'].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.remove('over')}));dz.addEventListener('drop',e=>pick(e.dataTransfer.files));
 const pre=$('[data-k=preset]',el);if(pre){const ap=()=>{const w=$('[data-k=w]',el),h=$('[data-k=h]',el),p=pre.value;if(!p)return;if(p[0]==='r'){const [a,b]=p.slice(1).split(':').map(Number);if(w.value)h.value=Math.round(w.value*b/a)}else{[w.value,h.value]=p.split('x')}};pre.onchange=ap;$('[data-k=w]',el).oninput=()=>{if(pre.value[0]==='r')ap()}}
 go.onclick=async()=>{
  er.textContent='';if(!files.length)return;
  const [ax,ay]=(v('crop')||'.5,.5').split(',').map(Number),o={q:+v('q')||80,mime:v('mime')||'original',maxW:+v('maxW')||0,w:+v('w')||0,h:+v('h')||0,fit:v('fit'),ax,ay};
  if(tool.id==='convert'&&!o.mime){er.textContent='Choose a target format first.';return}
  if(tool.id==='resize'&&(!o.w||!o.h)){er.textContent='Enter a width and height.';return}
  go.disabled=true;rs.innerHTML='';
  try{
   if(user){const r=await remaining(user,tool);if(r.left!==null&&r.left<=0){er.textContent=LIMIT_MSG;return}}
   pg.classList.remove('hide');const bar=$('i',pg),out=[],fails=[];go.textContent='Processing…';
   for(let i=0;i<files.length;i++){bar.style.width=(i/files.length*100)+'%';await new Promise(r=>setTimeout(r));
    try{out.push({f:files[i],r:await Img.run(files[i],o)})}catch(e){fails.push({f:files[i],msg:e.message})}}
   bar.style.width='100%';
   if(!out.length){er.textContent=fails.map(x=>`${x.f.name}: ${x.msg}`).join(' ');if(user)for(const x of fails)await logJob(user,tool,x.f.name,'failed',{error:x.msg});return}
   if(user){const c=await consume(tool);if(!c.ok){er.textContent=c.msg;out.forEach(x=>{URL.revokeObjectURL(x.r.resUrl);URL.revokeObjectURL(x.r.origUrl)});return}
    for(const x of out)await logJob(user,tool,x.f.name,'completed',{original_bytes:x.f.size,result_bytes:x.r.blob.size,width:x.r.w,height:x.r.h,format:x.r.mime,batch:multi?files.length:undefined});
    for(const x of fails)await logJob(user,tool,x.f.name,'failed',{error:x.msg});onUsage()}
   render(out,fails);
  }catch(e){er.textContent=e.message||'Something went wrong.'}finally{go.disabled=false;label();setTimeout(()=>pg.classList.add('hide'),600)}};
 function render(out,fails){rs.innerHTML='';const names=new Set();let ti=0,to=0;const items=[];
  if(out.length===1){rs.append(compare(out[0].r.origUrl,out[0].r.resUrl))}
  out.forEach(({f,r})=>{ti+=f.size;to+=r.blob.size;let n=f.name.replace(/\.[^.]+$/,'')+`-velora.${r.ext}`,k=1;while(names.has(n))n=f.name.replace(/\.[^.]+$/,'')+`-velora-${k++}.${r.ext}`;names.add(n);items.push({name:n,blob:r.blob});
   const d=(1-r.blob.size/f.size)*100,row=document.createElement('div');row.className='row';row.innerHTML=`<img alt="" src="${r.resUrl}"><div><strong>${esc(n)}</strong><span>${fmt(f.size)} → ${fmt(r.blob.size)} · ${r.w}×${r.h} · ${d>=0?Math.round(d)+'% smaller':Math.round(-d)+'% larger'}</span></div><a class="btn sm p" download="${esc(n)}" href="${r.resUrl}">${icon('down')}Download</a>`;rs.append(row)});
  fails.forEach(x=>{const row=document.createElement('div');row.className='row bad';row.style.gridTemplateColumns='1fr';row.innerHTML=`<div><strong>${esc(x.f.name)} <span class="tag bad">Failed</span></strong><span>${esc(x.msg)}</span></div>`;rs.append(row)});
  if(multi&&out.length){const t=document.createElement('div');t.className='row';t.style.gridTemplateColumns='1fr auto';t.innerHTML=`<div><strong>${out.length} succeeded${fails.length?`, ${fails.length} failed`:''}</strong><span>${fmt(ti)} → ${fmt(to)} total (${Math.round((1-to/ti)*100)}% change)</span></div><button class="btn sm p">${icon('down')}Download ZIP</button>`;
   t.querySelector('button').onclick=async e=>{e.currentTarget.disabled=true;try{const z=URL.createObjectURL(await makeZip(items)),a=document.createElement('a');a.href=z;a.download='velora-optimized.zip';a.click();setTimeout(()=>URL.revokeObjectURL(z),4000)}finally{e.currentTarget.disabled=false}};rs.prepend(t)}}
 label()}
