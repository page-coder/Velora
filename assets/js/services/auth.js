import {CONFIG,ROOT} from '../config.js';
export const sb=(CONFIG.SUPABASE_KEY&&window.supabase)?window.supabase.createClient(CONFIG.SUPABASE_URL,CONFIG.SUPABASE_KEY,{auth:{persistSession:true,detectSessionInUrl:true}}):null;
export const absUrl=p=>new URL(ROOT+p,location.href).href;
export async function getUser(){if(!sb)return null;const {data}=await sb.auth.getSession();return data.session?.user||null}
export function friendly(e){const m=(e?.message||'').toLowerCase();
 if(m.includes('invalid login'))return'Email or password is incorrect.';if(m.includes('already registered'))return'An account with this email already exists. Try logging in.';
 if(m.includes('email not confirmed'))return'Confirm your email first. Check your inbox for the link.';if(m.includes('rate'))return'Too many attempts. Wait a minute and try again.';
 if(m.includes('fetch')||m.includes('network'))return'Network problem. Check your connection and retry.';return e?.message||'Something went wrong. Try again.'}
const need=()=>{if(!sb)throw new Error('Sign-in is not configured: the Supabase publishable key is missing in assets/js/config.js.')};
export const signIn=(email,password)=>{need();return sb.auth.signInWithPassword({email,password})};
export const signUp=(email,password,name)=>{need();return sb.auth.signUp({email,password,options:{data:{display_name:name},emailRedirectTo:absUrl('app/dashboard.html')}})};
export const oauth=provider=>{need();return sb.auth.signInWithOAuth({provider,options:{redirectTo:absUrl('app/dashboard.html')}})};
export const sendReset=email=>{need();return sb.auth.resetPasswordForEmail(email,{redirectTo:absUrl('reset-password.html')})};
export const setPassword=password=>{need();return sb.auth.updateUser({password})};
export const signOut=async(scope='local')=>{if(sb)await sb.auth.signOut({scope});location.href=ROOT+'index.html'};
