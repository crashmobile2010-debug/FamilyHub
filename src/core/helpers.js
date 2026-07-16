/* ====================================================================
   CORE · HELPERS — shared utilities (used by many widgets)
   ==================================================================== */
function esc(s){return(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function attr(s){return (s||"").replace(/"/g,"&quot;");}
function val(id){const e=document.getElementById(id);return e?e.value:"";}
function clampHour(v,def){const n=parseInt(v);return isNaN(n)?def:Math.min(23,Math.max(0,n));}

function confetti(){const m=["★","✦","♥","✿","✶"];for(let i=0;i<14;i++){const s=document.createElement("span");
  s.className="confetti";s.textContent=m[i%m.length];s.style.left=(40+Math.random()*30)+"vw";s.style.top="55vh";
  s.style.color=["#c8553d","#5a8f5a","#3f6f99","#e0a93e","#b07ab0"][i%5];
  s.style.setProperty("--dx",(Math.random()*260-130)+"px");s.style.setProperty("--dy",-(120+Math.random()*220)+"px");
  s.style.setProperty("--r",(Math.random()*540-270)+"deg");document.body.appendChild(s);setTimeout(()=>s.remove(),1000);}}

/* Weather-code → [label, icon] map + SVG icons (used by weather + screensaver) */
const WMO={0:["Clear","sun"],1:["Sunny","sun"],2:["Partly cloudy","partly"],3:["Cloudy","cloud"],
45:["Fog","fog"],48:["Fog","fog"],51:["Drizzle","rain"],53:["Drizzle","rain"],55:["Drizzle","rain"],
61:["Rain","rain"],63:["Rain","rain"],65:["Heavy rain","rain"],71:["Snow","snow"],73:["Snow","snow"],
75:["Snow","snow"],80:["Showers","rain"],81:["Showers","rain"],82:["Showers","rain"],
95:["Storms","storm"],96:["Storms","storm"],99:["Storms","storm"]};
function wxSvg(k){const I={
 sun:`<circle cx="12" cy="12" r="5"/><g stroke-width="1.7"><path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.5 4.5l1.8 1.8M17.7 17.7l1.8 1.8M19.5 4.5l-1.8 1.8M6.3 17.7l-1.8 1.8"/></g>`,
 partly:`<circle cx="8" cy="8.5" r="3.2"/><path d="M9 18h8a3 3 0 0 0 .3-6 4.2 4.2 0 0 0-8 .8A3 3 0 0 0 9 18z"/>`,
 cloud:`<path d="M7 18h10a3.4 3.4 0 0 0 .3-6.8 4.7 4.7 0 0 0-9-.9A3.4 3.4 0 0 0 7 18z"/>`,
 fog:`<path d="M6 13h11a3 3 0 0 0 .3-6 4.3 4.3 0 0 0-8.2-.8A3 3 0 0 0 6 13z"/><g stroke-width="1.7"><path d="M4 17h16M7 20.5h12"/></g>`,
 rain:`<path d="M7 14h9a3.3 3.3 0 0 0 .3-6.6 4.6 4.6 0 0 0-8.7-.8A3.3 3.3 0 0 0 7 14z"/><g stroke-width="1.8"><path d="M9 17.5l-1 3M13 17.5l-1 3M17 17.5l-1 3"/></g>`,
 snow:`<path d="M7 14h9a3.3 3.3 0 0 0 .3-6.6 4.6 4.6 0 0 0-8.7-.8A3.3 3.3 0 0 0 7 14z"/><g stroke-width="1.7"><path d="M9 18h.01M12.5 19.5h.01M16 18h.01"/></g>`,
 storm:`<path d="M7 13h9a3.3 3.3 0 0 0 .3-6.6 4.6 4.6 0 0 0-8.7-.8A3.3 3.3 0 0 0 7 13z"/><path d="M13 13l-3 4.5h3l-2 4" stroke-width="1.8"/>`};
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I[k]||I.cloud}</svg>`;}
