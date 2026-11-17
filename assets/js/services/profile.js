import {CONFIG} from '../config.js';
import {sb} from './auth.js';
const COLS='id,display_name,avatar_url,created_at';
async function withAvatarUrl(profile){
 if(!profile?.avatar_url||/^https?:\/\//i.test(profile.avatar_url))return profile;
 const {data,error}=await sb.storage.from(CONFIG.BUCKET).createSignedUrl(profile.avatar_url,60*60*24*30);
 if(error)throw error;return {...profile,avatar_url:data.signedUrl};
}
export async function loadProfile(user){
 const {data,error}=await sb.from('profiles').select(COLS).eq('id',user.id).maybeSingle();if(error)throw error;if(data)return withAvatarUrl(data);
 const name=user.user_metadata?.display_name||user.user_metadata?.full_name||user.user_metadata?.name||user.email.split('@')[0];
 const r=await sb.from('profiles').insert({id:user.id,display_name:name}).select(COLS).single();if(r.error)throw r.error;return r.data}
export async function updateName(user,name){const {data,error}=await sb.from('profiles').update({display_name:name}).eq('id',user.id).select(COLS).single();if(error)throw error;return withAvatarUrl(data)}
export async function uploadAvatar(user,file){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Use a JPG, PNG or WebP image.');
 if(file.size>2*1048576)throw new Error('Avatar must be 2 MB or smaller.');
 const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[file.type],path=`${user.id}/avatar-${Date.now()}.${ext}`;
 const up=await sb.storage.from(CONFIG.BUCKET).upload(path,file,{upsert:true,contentType:file.type,cacheControl:'3600'});if(up.error)throw up.error;
 const {data,error}=await sb.from('profiles').update({avatar_url:path}).eq('id',user.id).select(COLS).single();if(error)throw error;return withAvatarUrl(data)}
