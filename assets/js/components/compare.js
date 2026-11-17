export function compare(a,b,la='Original',lb='Result'){const d=document.createElement('div');d.className='cmp';
 d.innerHTML=`<img src="${a}" alt="${la}"><div class="cmp-top"><img src="${b}" alt="${lb}"></div><span class="cl l">${la}</span><span class="cl r">${lb}</span><i class="cmp-h"></i><input type="range" min="0" max="100" value="50" aria-label="Drag to compare original and result">`;
 const r=d.querySelector('input'),set=()=>d.style.setProperty('--p',r.value+'%');r.oninput=set;set();return d}
