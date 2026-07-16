/* ====================================================================
   WIDGET · PHOTOS — slideshow, swipe, captions, upload, lightbox.
   Uploads go to Supabase Storage when sync is configured, otherwise
   they're compressed into localStorage as data URLs.
   ==================================================================== */
let pidx=0,slideTimer;
const photoEl=document.getElementById("photo"),pcap=document.getElementById("pcap"),dots=document.getElementById("dots");
function showPhoto(i){if(!PHOTOS.length)return;pidx=(i+PHOTOS.length)%PHOTOS.length;
  photoEl.src=PHOTOS[pidx].src;pcap.textContent=PHOTOS[pidx].cap||"";
  dots.innerHTML=PHOTOS.map((_,n)=>`<span class="dot ${n===pidx?'on':''}"></span>`).join("");}
function autoSlide(){clearInterval(slideTimer);slideTimer=setInterval(()=>showPhoto(pidx+1),8000);}
let capTimer;
pcap.addEventListener("input",()=>{if(PHOTOS[pidx])PHOTOS[pidx].cap=pcap.textContent;
  clearTimeout(capTimer);capTimer=setTimeout(persist,600);});
pcap.addEventListener("pointerdown",e=>e.stopPropagation());
const shot=document.getElementById("shot");let sx=0,moved=false;
shot.addEventListener("pointerdown",e=>{sx=e.clientX;moved=false;clearInterval(slideTimer);});
shot.addEventListener("pointermove",e=>{if(Math.abs(e.clientX-sx)>8)moved=true;});
shot.addEventListener("pointerup",e=>{const dx=e.clientX-sx;
  if(Math.abs(dx)>45)showPhoto(pidx+(dx<0?1:-1));
  else if(!moved){document.getElementById("big").src=PHOTOS[pidx].src;document.getElementById("lightbox").classList.add("on");}
  autoSlide();});
document.getElementById("lightbox").addEventListener("click",e=>e.currentTarget.classList.remove("on"));
const file=document.getElementById("file");
/* upload is triggered by the big "Add photos" button — see fun.js */
function fileToDataURL(file,maxDim=1000,q=0.82){return new Promise(res=>{
  const img=new Image();const u=URL.createObjectURL(file);
  img.onload=()=>{let w=img.width,h=img.height;const s=Math.min(1,maxDim/Math.max(w,h));
    w=Math.round(w*s);h=Math.round(h*s);const c=document.createElement("canvas");c.width=w;c.height=h;
    c.getContext("2d").drawImage(img,0,0,w,h);URL.revokeObjectURL(u);
    try{res(c.toDataURL("image/jpeg",q));}catch(e){res(null);}};
  img.onerror=()=>{URL.revokeObjectURL(u);res(null);};img.src=u;});}
function fileToBlob(file,maxDim,q){return new Promise(res=>{const img=new Image();const u=URL.createObjectURL(file);
  img.onload=()=>{let w=img.width,h=img.height;const s=Math.min(1,maxDim/Math.max(w,h));w=Math.round(w*s);h=Math.round(h*s);
    const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);URL.revokeObjectURL(u);
    c.toBlob(b=>res(b),"image/jpeg",q);};img.onerror=()=>{URL.revokeObjectURL(u);res(null);};img.src=u;});}
async function uploadPhoto(file){try{const blob=await fileToBlob(file,1200,0.85);if(!blob)return null;
  const name=FAMILY_CODE+"/"+Date.now()+"_"+Math.random().toString(36).slice(2)+".jpg";
  const {error}=await sb.storage.from("photos").upload(name,blob,{contentType:"image/jpeg"});
  if(error)return null;const {data}=sb.storage.from("photos").getPublicUrl(name);return data.publicUrl;}catch(e){return null;}}
file.addEventListener("change",async e=>{const fs=[...e.target.files];let added=0;
  for(const f of fs){let src=null;if(sb)src=await uploadPhoto(f);if(!src)src=await fileToDataURL(f);
    if(src){PHOTOS.push({src:src,cap:new Date().toLocaleDateString(undefined,{month:"short",day:"numeric"})+" ✦",uploaded:!sb});added++;}}
  if(added){showPhoto(PHOTOS.length-1);confetti();persist();}file.value="";});
