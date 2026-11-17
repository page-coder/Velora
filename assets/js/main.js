import {ROOT} from './config.js';
import {getUser,sb} from './services/auth.js';
import {loadProfile} from './services/profile.js';
import {publicShell,appShell} from './components/layout.js';
import {probe} from './services/images.js';
import {toast} from './components/ui.js';
const b=document.body,page=b.dataset.page,isApp=b.dataset.app==='1';
async function boot(){
 await probe();
 const user=await getUser();
 if(isApp&&!user){location.replace(ROOT+'login.html?next='+encodeURIComponent(location.pathname+location.search));return}
 if(page==='auth'&&user&&b.dataset.auth!=='reset'){location.replace(ROOT+'app/dashboard.html');return}
 const main=document.getElementById('main');let prof=null;
 if(isApp){try{prof=await loadProfile(user)}catch(e){console.warn(e);toast('Couldn’t load your profile: '+e.message)}appShell(user,prof,main);main.classList.add('content')}
 else publicShell(user);
 const mods={home:'home',tools:'tools',auth:'auth',dashboard:'dashboard','app-tools':'app-tools','app-tool':'app-tool',history:'history',profile:'profile',settings:'settings'};
 if(mods[page]){const m=await import(`./pages/${mods[page]}.js`);await m.init({user,prof,main})}
}
boot().catch(e=>{console.error(e);const m=document.getElementById('main');if(m)m.insertAdjacentHTML('afterbegin',`<p class="err" style="padding:20px">This page failed to load: ${String(e.message||e).replace(/</g,'&lt;')}</p>`)});
