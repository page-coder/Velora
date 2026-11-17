import {$,icon} from '../components/ui.js';
import {ROOT} from '../config.js';
import {signIn,signUp,oauth,sendReset,setPassword,friendly,sb} from '../services/auth.js';
export async function init(){
 const kind=document.body.dataset.auth,f=$('#f'),er=$('#er'),go=$('#go'),next=new URLSearchParams(location.search).get('next');
 const dest=()=>next&&next.startsWith('/')&&!next.startsWith('//')?next:ROOT+'app/dashboard.html';
 const msg=(t,ok)=>{er.textContent=t;er.classList.toggle('okmsg',!!ok)};
 const eye=$('#eye');if(eye)eye.onclick=()=>{const p=$('#pw'),s=p.type==='password';p.type=s?'text':'password';eye.setAttribute('aria-label',s?'Hide password':'Show password')};
 $$s('[data-oauth]').forEach(b=>b.onclick=async()=>{msg('');try{const {error}=await oauth(b.dataset.oauth);if(error)msg(friendly(error))}catch(e){msg(e.message)}});
 let recovered=false;if(kind==='reset'){sb?.auth.onAuthStateChange(ev=>{if(ev==='PASSWORD_RECOVERY'||ev==='SIGNED_IN')recovered=true});}
 f.onsubmit=async e=>{e.preventDefault();msg('');const email=$('#email')?.value.trim(),pw=$('#pw')?.value,name=$('#name')?.value.trim();
  if(kind!=='reset'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email||'')){msg('Enter a valid email address.');return}
  if(kind!=='forgot'&&(pw||'').length<8){msg('Password must be at least 8 characters.');return}
  if(kind==='signup'&&!name){msg('Enter your name.');return}
  go.disabled=true;const old=go.textContent;go.textContent='Please wait…';
  try{let r;
   if(kind==='login'){r=await signIn(email,pw);if(r.error)throw r.error;location.href=dest()}
   else if(kind==='signup'){r=await signUp(email,pw,name);if(r.error)throw r.error;if(r.data.session)location.href=ROOT+'app/dashboard.html';else msg('Check your email to confirm your account, then log in.',true)}
   else if(kind==='forgot'){r=await sendReset(email);if(r.error)throw r.error;msg('If that email has an account, a reset link is on its way.',true)}
   else{const {data}=await sb.auth.getSession();if(!data.session)throw new Error('This reset link is invalid or has expired. Request a new one.');r=await setPassword(pw);if(r.error)throw r.error;msg('Password updated. Redirecting…',true);setTimeout(()=>location.href=ROOT+'app/dashboard.html',900)}
  }catch(x){msg(friendly(x))}finally{go.disabled=false;go.textContent=old}};
}
const $$s=s=>[...document.querySelectorAll(s)];
