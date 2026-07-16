/* ====================================================================
   WIDGET · CALENDAR — Google Calendar events list, colour-coded
   month grid (colours match family members named in event titles),
   and the tap-a-day popup. Shows demo data until Google is connected.
   ==================================================================== */
async function loadCalendar(){
  try{
    const d=await gfetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?timeMin=${new Date().toISOString()}&maxResults=8&singleEvents=true&orderBy=startTime`);
    renderEvents((d.items||[]).map(ev=>{const allDay=!!ev.start.date;
      return{title:ev.summary||"(busy)",allDay,start:new Date(allDay?ev.start.date+"T09:00":ev.start.dateTime)};}));
  }catch(e){}
}
const EVCOL=["#c8553d","#3f6f99","#7a9e5a","#b07ab0","#cf8a2e"];
function renderEvents(list){
  LAST_EVENTS=list;list.forEach((e,i)=>{e._color=ownerColor(e,i);});
  if(ssActive)ssAgenda();renderMonth();
  const now=new Date(),today=now.toDateString(),tmrw=new Date(now.getTime()+864e5).toDateString();
  const el=document.getElementById("events");
  if(!list.length){el.innerHTML=`<div style="color:var(--ink-soft);font-family:Caveat;font-size:22px">nothing booked — free day! ✦</div>`;return;}
  el.innerHTML=list.map((e,i)=>{const c=e._color;const ds=e.start.toDateString();
    const day=ds===today?"today":ds===tmrw?"tomorrow":e.start.toLocaleDateString(undefined,{weekday:"short",day:"numeric"});
    let when;if(e.allDay)when="all<br>day";else{let h=e.start.getHours();const a=CLOCK_24H?"":(h>=12?"pm":"am");if(!CLOCK_24H)h=h%12||12;when=`${CLOCK_24H?String(h).padStart(2,'0'):h}:${String(e.start.getMinutes()).padStart(2,'0')}<br>${a}`;}
    return`<div class="ev"><span class="when" style="background:${c}">${when}</span><div><div class="ti">${esc(e.title)}</div><div class="dd">${day}</div></div></div>`;}).join("");
}
function demoCalendar(){const now=new Date();renderEvents([
  {title:"Ava swim lesson",start:new Date(now.getTime()+15*36e5)},
  {title:"Leo football training",start:new Date(now.getTime()+27*36e5)},
  {title:"Dad dentist",start:new Date(now.getTime()+32*36e5)},
  {title:"Mum book club",start:new Date(now.getTime()+39*36e5)},
  {title:"Family movie night 🍿",allDay:true,start:new Date(now.getTime()+46*36e5)},
]);}

/* colour-coding: match a family member's name inside the event title */
function eventOwner(t){t=(t||"").toLowerCase();
  for(let i=0;i<FAMILY.length;i++){if(t.includes(FAMILY[i].name.toLowerCase()))return i;}return -1;}
function ownerColor(e,i){const o=eventOwner(e.title);return o>=0?FAMILY[o].color:EVCOL[(i||0)%EVCOL.length];}

/* month grid */
function renderMonth(){
  const now=new Date(),y=now.getFullYear(),m=now.getMonth();
  document.getElementById("month-label").textContent=now.toLocaleDateString(undefined,{month:"long",year:"numeric"});
  const start=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
  const byDay={};
  (LAST_EVENTS||[]).forEach(e=>{if(e.start.getFullYear()===y&&e.start.getMonth()===m){
    const d=e.start.getDate();(byDay[d]=byDay[d]||[]).push(e._color||"#8a8f98");}});
  let h='<div class="mh">S</div><div class="mh">M</div><div class="mh">T</div><div class="mh">W</div><div class="mh">T</div><div class="mh">F</div><div class="mh">S</div>';
  for(let i=0;i<start;i++)h+='<div class="mc out"></div>';
  for(let d=1;d<=days;d++){
    const cols=byDay[d]?[...new Set(byDay[d])].slice(0,3):[];
    const dots=cols.length?'<span class="mdots">'+cols.map(c=>`<span class="mdot" style="background:${c}"></span>`).join("")+'</span>':'';
    h+=`<div class="mc${d===now.getDate()?' today':''}" data-day="${d}">${d}${dots}</div>`;
  }
  document.getElementById("mgrid").innerHTML=h;
}

/* tap-a-day popup */
function openDay(d){
  const now=new Date(),y=now.getFullYear(),m=now.getMonth();
  const list=(LAST_EVENTS||[]).filter(e=>e.start.getFullYear()===y&&e.start.getMonth()===m&&e.start.getDate()===d).sort((a,b)=>a.start-b.start);
  document.getElementById("daysheet-date").textContent=new Date(y,m,d).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
  document.getElementById("daysheet-body").innerHTML=list.length?list.map(e=>{
    let tm;if(e.allDay)tm="All day";else{let h=e.start.getHours();const a=CLOCK_24H?"":(h>=12?" PM":" AM");if(!CLOCK_24H)h=h%12||12;tm=h+":"+String(e.start.getMinutes()).padStart(2,"0")+a;}
    return '<div class="dsrow"><span class="dsdot" style="background:'+(e._color||"#8a8f98")+'"></span>'+
      '<span class="dstime">'+tm+'</span><span class="dstitle">'+esc(e.title)+'</span></div>';
  }).join(""):'<div class="dsempty">Nothing planned ✦</div>';
  document.getElementById("daysheet").classList.add("on");
}
document.getElementById("mgrid").addEventListener("click",e=>{const c=e.target.closest(".mc");
  if(!c||c.classList.contains("out")||!c.dataset.day)return;openDay(+c.dataset.day);});
document.getElementById("daysheet").addEventListener("click",e=>{
  if(e.target.id==="daysheet"||e.target.id==="ds-close")document.getElementById("daysheet").classList.remove("on");});
