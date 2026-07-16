/* ====================================================================
   WIDGET · SCREENSAVER — full-screen idle photo overlay with clock,
   agenda, weather and commute. Arms after SS_IDLE_MIN minutes idle
   (config/config.js); any tap exits. Reads LAST_EVENTS / LAST_WX.
   ==================================================================== */
let ssActive=false,ssIdx=0,ssSlide,ssClock,idleSS;

const ss=document.createElement("div");ss.className="screensaver";
ss.innerHTML='<div class="ss-bg" id="ss-bg"></div><div class="ss-scrim"></div>'+
 '<div class="ss-inner"><div class="ss-left">'+
 '<div><div class="ss-clock" id="ss-clock"></div><div class="ss-date" id="ss-date"></div></div>'+
 '<div class="ss-agenda" id="ss-agenda"></div></div>'+
 '<div class="ss-right"><div class="ss-now"><div class="tmp" id="ss-temp">—°</div><div id="ss-icon"></div></div>'+
 '<div class="ss-fc" id="ss-fc"></div><div class="ss-commute" id="ss-commute"></div></div></div>';
document.body.appendChild(ss);
const CAR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5"/><path d="M3 13h18v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1z"/><circle cx="7" cy="17.5" r="1.3"/><circle cx="17" cy="17.5" r="1.3"/></svg>';

function ssClockTick(){const n=new Date();let h=n.getHours();const m=String(n.getMinutes()).padStart(2,"0");
  let ap="";if(!CLOCK_24H){ap=h>=12?"PM":"AM";h=h%12||12;}
  document.getElementById("ss-clock").innerHTML=(CLOCK_24H?String(h).padStart(2,"0"):h)+":"+m+'<span class="ampm">'+ap+'</span>';
  document.getElementById("ss-date").textContent=n.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});}
function ssAgenda(){const now=new Date(),today=now.toDateString(),tmrw=new Date(now.getTime()+864e5).toDateString();
  const list=LAST_EVENTS&&LAST_EVENTS.length?LAST_EVENTS:[];
  document.getElementById("ss-agenda").innerHTML=list.slice(0,5).map((e,i)=>{const c=e._color||EVCOL[i%EVCOL.length];
    const ds=e.start.toDateString();const lab=ds===today?"Today":ds===tmrw?"Tomorrow":e.start.toLocaleDateString(undefined,{weekday:"long"});
    let tm;if(e.allDay)tm="All day";else{let h=e.start.getHours();const a=CLOCK_24H?"":(h>=12?" PM":" AM");if(!CLOCK_24H)h=h%12||12;tm=h+":"+String(e.start.getMinutes()).padStart(2,"0")+a;}
    return '<div class="ss-ev"><div class="num">'+e.start.getDate()+'<small>'+lab+'</small></div>'+
      '<div class="det" style="border-color:'+c+'"><div class="tm">'+tm+'</div><div class="ti">'+esc(e.title)+'</div></div></div>';
  }).join("")||'<div class="ss-ev"><div class="det"><div class="ti">No upcoming events</div></div></div>';}
function ssWeather(){if(!LAST_WX)return;
  document.getElementById("ss-temp").textContent=LAST_WX.temp+"°";
  document.getElementById("ss-icon").innerHTML=wxSvg(LAST_WX.icon);
  document.getElementById("ss-fc").innerHTML=LAST_WX.days.map(d=>
    '<div class="row"><span class="d">'+d.label+'</span>'+wxSvg(d.icon)+'<span class="hl"><b>'+d.hi+'°</b> <span>'+d.lo+'°</span></span></div>').join("");}
function ssCommute(){const el=document.getElementById("ss-commute");if(!COMMUTE){el.style.display="none";return;}
  el.innerHTML=CAR+'<div><div class="mins">'+COMMUTE.minutes+' mins to '+esc(COMMUTE.label)+'</div>'+
    '<div class="via">'+esc(COMMUTE.distance)+' '+esc(COMMUTE.via||"")+'</div></div>';}
function ssSetBg(){document.getElementById("ss-bg").style.backgroundImage='url("'+PHOTOS[ssIdx%PHOTOS.length].src+'")';}
function enterScreensaver(){if(ssActive||!PHOTOS.length)return;ssActive=true;ss.classList.add("on");controls.style.display="none";
  ssIdx=pidx;ssSetBg();ssClockTick();ssAgenda();ssWeather();ssCommute();
  ssClock=setInterval(ssClockTick,1000);
  ssSlide=setInterval(()=>{ssIdx=(ssIdx+1)%PHOTOS.length;const bg=document.getElementById("ss-bg");
    bg.style.opacity="0";setTimeout(()=>{ssSetBg();bg.style.opacity="1";},700);},10000);}
function exitScreensaver(){if(!ssActive)return;ssActive=false;ss.classList.remove("on");controls.style.display="flex";
  clearInterval(ssClock);clearInterval(ssSlide);armIdle();}
ss.addEventListener("pointerdown",e=>{e.stopPropagation();exitScreensaver();});
function armIdle(){clearTimeout(idleSS);if(SS_IDLE_MIN>0&&!ssActive)idleSS=setTimeout(enterScreensaver,SS_IDLE_MIN*60000);}
["pointerdown","pointermove","keydown"].forEach(ev=>document.addEventListener(ev,()=>{if(!ssActive)armIdle();}));
