/* Minimal store-only ZIP writer (no compression; images are already compressed). */
const T=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=u=>{let c=~0;for(const b of u)c=T[(c^b)&255]^(c>>>8);return ~c>>>0};
export async function makeZip(files){const parts=[],cen=[],enc=new TextEncoder();let off=0,cl=0;
 for(const f of files){const d=new Uint8Array(await f.blob.arrayBuffer()),nm=enc.encode(f.name),c=crc(d);
  const l=new DataView(new ArrayBuffer(30));l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x0800,true);l.setUint16(12,0x21,true);l.setUint32(14,c,true);l.setUint32(18,d.length,true);l.setUint32(22,d.length,true);l.setUint16(26,nm.length,true);
  parts.push(l.buffer,nm,d);
  const h=new DataView(new ArrayBuffer(46));h.setUint32(0,0x02014b50,true);h.setUint16(4,20,true);h.setUint16(6,20,true);h.setUint16(8,0x0800,true);h.setUint16(14,0x21,true);h.setUint32(16,c,true);h.setUint32(20,d.length,true);h.setUint32(24,d.length,true);h.setUint16(28,nm.length,true);h.setUint32(42,off,true);
  cen.push(h.buffer,nm);cl+=46+nm.length;off+=30+nm.length+d.length}
 const e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cl,true);e.setUint32(16,off,true);
 return new Blob([...parts,...cen,e.buffer],{type:'application/zip'})}
