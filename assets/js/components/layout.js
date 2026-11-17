import {ROOT,TOOLS} from '../config.js';
import {$,$$,icon,logo,toggleTheme,avatar,esc} from './ui.js';
import {signOut} from '../services/auth.js';
const R=p=>ROOT+p;
export function publicShell(user){
 const menu=TOOLS.map(t=>`<a href="${R('tools.html?tool='+t.id)}"><span class="ic">${icon(t.icon)}</span><span>${esc(t.short)}<small>${t.ai?'Not connected yet':esc(t.desc)}</small></span></a>`).join('');
 const h=document.createElement('header');h.className='hdr';
 h.innerHTML=`<div class="wrap nav" id="nav"><a class="brand" href="${R('index.html')}">${logo}VELORA</a><nav class="links" aria-label="Main"><a href="${R('index.html')}">Home</a><a href="${R('features.html')}">Features</a><div class="dd" id="dd"><button type="button" aria-expanded="false" aria-haspopup="true">Tools ${icon('chev')}</button><div class="menu">${menu}</div></div><a href="${R('how-it-works.html')}">How it works</a><a href="${R('about.html')}">About</a></nav><span class="sp"></span><div class="acts"><button class="btn sm g" id="thm" aria-label="Toggle theme">${icon('moon')}</button>${user?`<a class="btn sm p" href="${R('app/dashboard.html')}">Open workspace</a>`:`<a class="btn sm hide-m" href="${R('login.html')}">Login</a><a class="btn sm p" href="${R('signup.html')}">Get started</a>`}<button class="btn sm g burger" id="bg" aria-label="Menu" aria-expanded="false">${icon('menu')}</button></div></div>`;
 document.body.prepend(h);
 const nav=$('#nav'),dd=$('#dd');$('#bg').onclick=e=>{const o=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
 $('button',dd).onclick=e=>{const o=dd.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
 document.addEventListener('click',e=>{if(!dd.contains(e.target))dd.classList.remove('open')});document.addEventListener('keydown',e=>{if(e.key==='Escape')dd.classList.remove('open')});
 $('#thm').onclick=toggleTheme;
 const here=location.pathname.split('/').pop()||'index.html';$$('.links>a',h).forEach(a=>{if(a.getAttribute('href').split('/').pop()===here)a.classList.add('on')});
 const f=document.createElement('footer');f.className='foot';
 f.innerHTML=`<div class="wrap"><div class="cols"><div><a class="brand" href="${R('index.html')}">${logo}VELORA</a><p style="max-width:34ch">Private image tools that run in your browser. Free at launch.</p></div><div><h4>Product</h4><a href="${R('features.html')}">Features</a><a href="${R('tools.html')}">Tools</a><a href="${R('how-it-works.html')}">How it works</a><a href="${R('login.html')}">Login</a></div><div><h4>Company</h4><a href="${R('about.html')}">About</a><a href="${R('faq.html')}">FAQ</a><a href="${R('contact.html')}">Contact</a></div><div><h4>Legal</h4><a href="${R('privacy.html')}">Privacy</a><a href="${R('terms.html')}">Terms</a></div></div><div class="base">© ${new Date().getFullYear()} VELORA 2.0</div></div>`;
 document.body.append(f);
}
const NAV=[['dashboard','Overview','home'],['tools','All tools','grid']];
export function appShell(user,prof,main){
 const here=location.pathname.split('/').pop();
 const link=(href,label,ic)=>`<a href="${R(href)}" class="${location.pathname.endsWith(href.replace('app/',''))?'on':''}">${icon(ic)}${esc(label)}</a>`;
 const side=document.createElement('aside');side.className='side';side.id='side';
 side.innerHTML=`<a class="brand" href="${R('app/dashboard.html')}">${logo}VELORA</a><div class="who">${avatar(prof,user)}<div style="min-width:0"><b>${esc(prof?.display_name||'Account')}</b><small>${esc(user.email)}</small></div></div>
 ${link('app/dashboard.html','Overview','home')}${link('app/tools.html','All tools','grid')}<h5>Tools</h5>${TOOLS.map(t=>link('app/tools/'+t.slug+'.html',t.short,t.icon)).join('')}<h5>Account</h5>${link('app/history.html','History','clock')}${link('app/profile.html','Profile','user')}${link('app/settings.html','Settings','cog')}<span class="sp"></span><a href="${R('index.html')}">${icon('home')}Public site</a><button class="nv" id="lo">${icon('out')}Log out</button>`;
 const top=document.createElement('div');top.className='atop';top.innerHTML=`<button class="btn sm g" id="sb" aria-label="Open menu">${icon('menu')}</button><b>VELORA</b><button class="btn sm g" id="thm" aria-label="Toggle theme">${icon('moon')}</button>`;
 const shell=document.createElement('div');shell.className='shell';const col=document.createElement('div');col.append(top,main);shell.append(side,col);document.body.prepend(shell);
 $('#lo').onclick=()=>signOut();$('#thm').onclick=toggleTheme;$('#sb').onclick=()=>side.classList.toggle('open');
 side.addEventListener('click',e=>{if(e.target.closest('a'))side.classList.remove('open')});
}
