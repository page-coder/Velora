/* Browser-side image engine (preserved from the original VELORA: canvas compress / resize / convert). Nothing is uploaded. */
export const OK=['image/jpeg','image/png','image/webp','image/gif','image/bmp'],MAX=80*1048576;
export const support={'image/webp':false,'image/avif':false};
export async function probe(){const c=document.createElement('canvas');c.width=c.height=2;for(const m of Object.keys(support))support[m]=await new Promise(r=>c.toBlob(b=>r(!!b&&b.type===m),m))}
export const validate=f=>!OK.includes(f.type)?`${f.name}: unsupported type. Use JPG, PNG, WebP, GIF or BMP.`:f.size>MAX?`${f.name}: larger than 80 MB.`:'';
const load=u=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('The browser could not read this image.'));i.src=u});
const EXT={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'};
export async function run(file,o){
 const url=URL.createObjectURL(file);
 try{const im=await load(url);let sw=im.naturalWidth,sh=im.naturalHeight,sx=0,sy=0,tw=sw,th=sh;
  if(o.maxW&&sw>o.maxW){tw=o.maxW;th=Math.round(sh*o.maxW/sw)}
  if(o.w&&o.h){if(o.fit==='contain'){const k=Math.min(o.w/sw,o.h/sh);tw=Math.max(1,Math.round(sw*k));th=Math.max(1,Math.round(sh*k))}
   else{const tr=o.w/o.h,sr=sw/sh;if(sr>tr){const nw=sh*tr;sx=(sw-nw)*(o.ax??.5);sw=nw}else{const nh=sw/tr;sy=(sh-nh)*(o.ay??.5);sh=nh}tw=o.w;th=o.h}}
  if(tw*th>40e6)throw new Error('Output is over 40 megapixels. Choose smaller dimensions.');
  let mime=!o.mime||o.mime==='original'?file.type:o.mime;if(!EXT[mime])mime='image/png';
  const c=document.createElement('canvas');c.width=tw;c.height=th;const x=c.getContext('2d');
  if(mime==='image/jpeg'){x.fillStyle='#fff';x.fillRect(0,0,tw,th)}x.imageSmoothingQuality='high';x.drawImage(im,sx,sy,sw,sh,0,0,tw,th);
  const blob=await new Promise(r=>c.toBlob(r,mime,(o.q||80)/100));
  if(!blob||blob.type!==mime)throw new Error('Your browser cannot export this format. Try PNG, JPG or WebP.');
  return{blob,w:tw,h:th,mime,ext:EXT[mime],origUrl:url,resUrl:URL.createObjectURL(blob)}
 }catch(e){URL.revokeObjectURL(url);throw e}}
