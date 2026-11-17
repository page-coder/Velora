import {$,toast,toggleTheme} from '../components/ui.js';
import {setPassword,signOut,sb,friendly} from '../services/auth.js';
export function init({user,main}){
 const prov=(user.app_metadata?.providers||[user.app_metadata?.provider]).filter(Boolean).join(', ');
 main.innerHTML=`<div class="mh"><h1>Settings</h1></div><div class="grid" style="max-width:520px"><div class="card" style="display:grid;gap:12px"><h3 style="margin:0">Account</h3><p class="note" style="margin:0">Email: ${user.email}<br>Sign-in method: ${prov||'email'}<br>Last sign-in: ${new Date(user.last_sign_in_at||Date.now()).toLocaleString()}</p></div>
 <div class="card" style="display:grid;gap:12px"><h3 style="margin:0">Change password</h3><label class="fl">New password<input class="fld" id="pw" type="password" minlength="8" autocomplete="new-password"></label><p class="err" id="er" role="alert"></p><button class="btn p" id="sv" style="justify-self:start">Update password</button></div>
 <div class="card" style="display:grid;gap:12px"><h3 style="margin:0">Appearance</h3><button class="btn" id="th" style="justify-self:start">Switch light / dark theme</button></div>
 <div class="card" style="display:grid;gap:12px"><h3 style="margin:0">Sessions</h3><p class="note" style="margin:0">Sign out of other browsers and devices, or everywhere including this one.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="oth">Sign out other devices</button><button class="btn" id="all">Sign out everywhere</button></div></div></div>`;
 $('#th').onclick=toggleTheme;
 $('#sv').onclick=async()=>{const p=$('#pw').value,er=$('#er');er.textContent='';if(p.length<8){er.textContent='Password must be at least 8 characters.';return}const {error}=await setPassword(p);if(error){er.textContent=friendly(error);return}$('#pw').value='';toast('Password updated')};
 $('#oth').onclick=async()=>{const {error}=await sb.auth.signOut({scope:'others'});toast(error?friendly(error):'Other devices signed out')};
 $('#all').onclick=()=>signOut('global');
}
