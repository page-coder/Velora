/* Single place for configuration. The publishable (anon) key is public by design; never put a service-role key here. */
export const CONFIG={
  SUPABASE_URL:'https://ezdykghrpbosvlfdbuis.supabase.co',
  SUPABASE_KEY:'sb_publishable_ttlXLlxissOWsauox4LevA_KnyLg1r3', // public publishable key
  BUCKET:'velora-images',
  CONTACT_EMAIL:''
};
export const ROOT=document.body.dataset.root||'./';
/* id = frontend id, key = database tool_key, slug = app page name */
export const TOOLS=[
 {id:'upscale',key:'upscale',slug:'upscale',name:'AI Image Upscaling',short:'Upscaling',icon:'up',ai:true,desc:'Enlarge images with AI-generated detail.'},
 {id:'bgremove',key:'background_removal',slug:'background-removal',name:'AI Background Removal',short:'Background removal',icon:'cut',ai:true,desc:'Cut subjects out to a transparent PNG.'},
 {id:'convert',key:'format_conversion',slug:'convert',name:'Format Conversion',short:'Format conversion',icon:'swap',desc:'Convert between JPEG, PNG, WebP and AVIF.'},
 {id:'resize',key:'smart_resize',slug:'resize',name:'Smart Resize & Crop',short:'Smart resize',icon:'size',desc:'Exact sizes, social presets and crop position.'},
 {id:'restore',key:'restoration',slug:'restore',name:'AI Image Restoration',short:'Restoration',icon:'fix',ai:true,desc:'Repair blurry or damaged photos with AI.'},
 {id:'bulk',key:'bulk_optimization',slug:'bulk',name:'Bulk Optimization',short:'Bulk optimization',icon:'stack',desc:'Optimize many images and download a ZIP.'},
 {id:'compress',key:'compression',slug:'compress',name:'Image Compressor',short:'Compression',icon:'down',desc:'Shrink file size and compare before you download.'}
];
export const byId=id=>TOOLS.find(t=>t.id===id);
export const byKey=k=>TOOLS.find(t=>t.key===k);
