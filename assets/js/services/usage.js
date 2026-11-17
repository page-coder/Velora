import {sb} from './auth.js';
export const LIMIT_MSG='You have reached today’s limit for this tool. Limits reset at midnight India Standard Time.';
export const istDate=(d=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(d);
const one=d=>Array.isArray(d)?d[0]:d;
export async function limitsMap(){const {data,error}=await sb.from('tool_limits').select('tool_key,daily_limit');if(error)throw error;return Object.fromEntries(data.map(r=>[r.tool_key,r.daily_limit]))}
export async function usageRows(uid,days=7){const from=istDate(new Date(Date.now()-(days-1)*864e5));const {data,error}=await sb.from('daily_usage').select('tool_key,usage_date,usage_count').eq('user_id',uid).gte('usage_date',from);if(error)throw error;return data}
export async function remaining(user,tool){const [l,u]=await Promise.all([limitsMap(),usageRows(user.id,1)]);const lim=l[tool.key];if(lim==null)return{left:null,limit:null};
 const used=u.filter(r=>r.tool_key===tool.key&&String(r.usage_date).slice(0,10)===istDate()).reduce((a,r)=>a+r.usage_count,0);return{left:Math.max(0,lim-used),limit:lim}}
/* The RPC is the authority. It is called only AFTER processing succeeded, so failures never consume usage.
   If it refuses, the result is withheld from the user. */
export async function consume(tool){const {data,error}=await sb.rpc('consume_daily_usage',{p_tool_key:tool.key});
 if(error)return{ok:false,msg:/limit|quota|exceed/i.test(error.message)?LIMIT_MSG:'Couldn’t verify your daily limit ('+error.message+'). Nothing was counted.'};
 const d=one(data);if(!d||d.allowed!==true)return{ok:false,msg:LIMIT_MSG};return{ok:true}}
export async function logJob(user,tool,name,status,metadata){try{const {error}=await sb.from('image_jobs').insert({user_id:user.id,tool_key:tool.key,original_file_name:name,status,metadata});if(error)console.warn('image_jobs',error.message)}catch(e){console.warn(e)}}
export async function dashboardData(user){
 const [limits,rows,stats,jobs]=await Promise.all([limitsMap(),usageRows(user.id,7),sb.rpc('get_dashboard_stats'),sb.from('image_jobs').select('id,tool_key,original_file_name,status,metadata,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(6)]);
 if(stats.error)throw stats.error;if(jobs.error)throw jobs.error;return{limits,rows,stats:one(stats.data)||{},jobs:jobs.data}}
export async function history(user,{toolKey='',from=0,size=20}={}){let q=sb.from('image_jobs').select('id,tool_key,original_file_name,status,metadata,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).range(from,from+size-1);if(toolKey)q=q.eq('tool_key',toolKey);const {data,error}=await q;if(error)throw error;return data}
