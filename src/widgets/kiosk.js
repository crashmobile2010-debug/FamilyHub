/* ====================================================================
   WIDGET · KIOSK — night dim, screen wake lock, fullscreen, and the
   floating control buttons (⚙️ 🖼️ 🌙 ⛶) that fade when idle.
   ==================================================================== */
let nightMode="auto";                            // "auto" follows schedule · "off" never dims
let layout="command";                            // "command" full hub · "frame" photo-frame mode
let wokenUntil=0,wakeTimer,wakeLock=null;

const nightOverlay=document.createElement("div");
nightOverlay.className="night-overlay";document.body.appendChild(nightOverlay);

const controls=document.createElement("div");controls.className="controls";
controls.innerHTML='<button class="ctl" id="setbtn" title="Settings">⚙️</button>'+
  '<button class="ctl" id="framebtn" title="Photo frame mode">🖼️</button>'+
  '<button class="ctl" id="nightbtn" title="Night dim">🌙</button>'+
  '<button class="ctl" id="fsbtn" title="Fullscreen">⛶</button>';
document.body.appendChild(controls);

function applyLayout(){ /* legacy no-op (kept for saved-state compatibility) */
  const b=document.getElementById("framebtn");if(b){b.textContent="🖼️";b.title="Start screensaver";}
}
document.getElementById("framebtn").addEventListener("click",()=>enterScreensaver());

function inNight(d){const h=d.getHours()+d.getMinutes()/60;
  return NIGHT.start<NIGHT.end?(h>=NIGHT.start&&h<NIGHT.end):(h>=NIGHT.start||h<NIGHT.end);}
function applyNight(){
  const dim=(nightMode==="auto"&&inNight(new Date())&&Date.now()>wokenUntil)?NIGHT.dimOpacity:0;
  nightOverlay.style.opacity=dim;}
function wake(){wokenUntil=Date.now()+60000;applyNight();
  clearTimeout(wakeTimer);wakeTimer=setTimeout(applyNight,60200);}
/* tap-to-wake at night: first tap brightens for 60s instead of hitting a widget */
document.addEventListener("pointerdown",e=>{
  if(ssActive)return;
  if(controls.contains(e.target))return;
  if(nightMode==="auto"&&inNight(new Date())&&Date.now()>wokenUntil){wake();e.stopPropagation();e.preventDefault();}
},true);
function updateNightBtn(){const b=document.getElementById("nightbtn");
  b.textContent=nightMode==="auto"?"🌙":"☀️";b.title=nightMode==="auto"?"Night dim: Auto":"Night dim: Off";}
document.getElementById("nightbtn").addEventListener("click",()=>{
  nightMode=nightMode==="auto"?"off":"auto";wokenUntil=0;updateNightBtn();applyNight();persist();});

async function requestWakeLock(){try{if("wakeLock" in navigator){wakeLock=await navigator.wakeLock.request("screen");}}catch(e){}}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")requestWakeLock();});
window.addEventListener("pointerdown",()=>requestWakeLock(),{once:true});

function isFs(){return document.fullscreenElement||document.webkitFullscreenElement;}
function toggleFs(){const el=document.documentElement;
  if(!isFs()){const r=el.requestFullscreen||el.webkitRequestFullscreen;if(r)r.call(el).catch(()=>{});requestWakeLock();}
  else{const x=document.exitFullscreen||document.webkitExitFullscreen;if(x)x.call(document);}}
document.getElementById("fsbtn").addEventListener("click",toggleFs);
document.addEventListener("fullscreenchange",()=>{document.getElementById("fsbtn").textContent=isFs()?"🗗":"⛶";});

/* fade the controls away when idle so the wall display stays clean */
let idleTimer;
function poke(){controls.style.opacity="1";clearTimeout(idleTimer);idleTimer=setTimeout(()=>controls.style.opacity=".18",4000);}
["pointermove","pointerdown","keydown"].forEach(ev=>document.addEventListener(ev,poke));
poke();
