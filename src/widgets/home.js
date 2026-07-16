/* ====================================================================
   WIDGET · HOME EXTRAS — the "family wire" news ticker along the
   bottom of the home page, and pop-up alert toasts (upcoming events,
   new notes arriving from other devices via sync, etc.).
   Other code can call notify(msg,color,icon) to raise a toast.
   ==================================================================== */

/* ---- alert toasts ---- */
const ALERTED=new Set();
function notify(msg,color,icon){
  const el=document.createElement("div");el.className="toast";
  el.innerHTML='<span class="tbar" style="background:'+(color||"#7fd1c0")+'"></span>'+
    '<span class="ticon">'+(icon||"🔔")+'</span><div class="tmsg">'+esc(msg)+'</div>'+
    '<span class="tx-close">×</span>';
  document.getElementById("alerts").appendChild(el);
  const kill=()=>{if(!el.isConnected)return;el.classList.add("out");setTimeout(()=>el.remove(),320);};
  el.querySelector(".tx-close").addEventListener("click",kill);
  setTimeout(kill,9000);
}
/* events starting within the next 45 minutes get one alert each */
function checkUpcoming(){
  const now=Date.now();
  (LAST_EVENTS||[]).forEach(e=>{
    if(e.allDay)return;
    const dt=e.start.getTime()-now;
    if(dt>0&&dt<45*60000){
      const k=e.title+"@"+e.start.getTime();
      if(ALERTED.has(k))return;ALERTED.add(k);
      notify(e.title+" · in "+Math.max(1,Math.round(dt/60000))+" min",e._color,"🗓️");
    }});
}

/* ---- family wire ticker ---- */
function buildTicker(){
  const el=document.getElementById("ticker");if(!el)return;
  const bits=[];
  const tm=MEALS[todayMealIdx()];if(tm)bits.push("🍽️ Tonight: "+tm);
  (LAST_EVENTS||[]).slice(0,4).forEach(e=>{
    let t;if(e.allDay)t="all day";
    else{let h=e.start.getHours();const a=CLOCK_24H?"":(h>=12?"pm":"am");if(!CLOCK_24H)h=h%12||12;
      t=h+":"+String(e.start.getMinutes()).padStart(2,"0")+a;}
    bits.push("🗓️ "+t+" — "+e.title);});
  NOTES.slice(0,5).forEach(n=>bits.push("📌 "+n.text+" — "+FAMILY[n.author%FAMILY.length].name));
  if(LAST_WX)bits.push("🌤️ "+LAST_WX.temp+"° "+PLACE.label);
  if(typeof TICKER_EXTRA!=="undefined"&&Array.isArray(TICKER_EXTRA))TICKER_EXTRA.forEach(x=>bits.push(x));
  if(!bits.length)bits.push("Welcome to the Family Hub ✦");
  const line=bits.map(b=>esc(b)).join('<span class="tksep">•</span>');
  el.innerHTML='<span class="tkchunk">'+line+'</span><span class="tkchunk">'+line+'</span>';
  el.style.animationDuration=Math.max(35,Math.round(bits.join("").length/3))+"s";
}
function startHome(){
  buildTicker();setInterval(buildTicker,30000);
  checkUpcoming();setInterval(checkUpcoming,60000);
}
