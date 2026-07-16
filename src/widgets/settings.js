/* ====================================================================
   WIDGET · SETTINGS PANEL + DRAG-TO-REARRANGE + FAMILY ROSTER
   ==================================================================== */
function renderFamily(){document.getElementById("family").innerHTML=
  FAMILY.map(f=>'<div class="ava" style="background:'+f.color+'">'+f.emoji+'</div>').join("");}

/* ---- legacy layout-edit stubs ----
   The old cork board let you drag cards between grid slots. The paged
   layout is fixed, but these globals stay so old saved states and
   currentState()'s shape keep working unchanged. */
let editMode=false;
let slotOf={};
function applySlots(){}
function setEditMode(on){editMode=!!on;}

/* ---- settings panel ---- */
function openSettings(){buildSettings();document.getElementById("settings").classList.add("on");}
function closeSettings(){document.getElementById("settings").classList.remove("on");}
function buildSettings(){
  const fam=FAMILY.map(f=>'<div class="set-fam"><input class="set-fname" value="'+attr(f.name)+'">'+
    '<input type="color" class="set-fcol" value="'+f.color+'"><input class="set-femoji" value="'+attr(f.emoji)+'" maxlength="2"></div>').join("");
  document.getElementById("set-body").innerHTML=
   '<div class="set-sec"><label>Family members</label>'+fam+'</div>'+
   '<div class="set-sec"><label>Location</label><input id="set-place" value="'+attr(PLACE.label)+'" placeholder="City">'+
     '<div class="set-row"><input id="set-lat" value="'+PLACE.lat+'" placeholder="lat"><input id="set-lon" value="'+PLACE.lon+'" placeholder="lon"></div></div>'+
   '<div class="set-sec"><label>Units</label><div class="set-row">'+
     '<select id="set-units"><option value="celsius"'+(UNITS==="celsius"?" selected":"")+'>°C</option><option value="fahrenheit"'+(UNITS==="fahrenheit"?" selected":"")+'>°F</option></select>'+
     '<label class="set-chk"><input type="checkbox" id="set-24h"'+(CLOCK_24H?" checked":"")+'> 24-hour clock</label></div></div>'+
   '<div class="set-sec"><label>Night dim</label><div class="set-row">'+
     '<label class="set-chk"><input type="checkbox" id="set-night"'+(nightMode==="auto"?" checked":"")+'> auto</label>'+
     '<input id="set-nstart" type="number" min="0" max="23" value="'+NIGHT.start+'" placeholder="start">'+
     '<input id="set-nend" type="number" min="0" max="23" value="'+NIGHT.end+'" placeholder="end"></div></div>'+
   '<div class="set-sec"><label>Commute</label><input id="set-cdest" value="'+attr(COMMUTE?COMMUTE.label:"")+'" placeholder="Destination">'+
     '<div class="set-row"><input id="set-cmin" value="'+(COMMUTE?COMMUTE.minutes:"")+'" placeholder="mins"><input id="set-cdist" value="'+attr(COMMUTE?COMMUTE.distance:"")+'" placeholder="distance"></div></div>'+
   '<div class="set-sec"><label>Screensaver idle (mins · 0 = off)</label><input id="set-idle" type="number" min="0" value="'+SS_IDLE_MIN+'"></div>'+
   '<div class="set-sec"><label>YouTube Music playlist ID</label><input id="set-yt" value="'+attr(YT_PLAYLIST)+'" placeholder="PL..."></div>';
}
function saveSettings(){
  document.querySelectorAll(".set-fname").forEach((inp,i)=>{if(FAMILY[i]&&inp.value.trim())FAMILY[i].name=inp.value.trim();});
  document.querySelectorAll(".set-fcol").forEach((inp,i)=>{if(FAMILY[i])FAMILY[i].color=inp.value;});
  document.querySelectorAll(".set-femoji").forEach((inp,i)=>{if(FAMILY[i]&&inp.value.trim())FAMILY[i].emoji=inp.value.trim();});
  PLACE.label=val("set-place")||PLACE.label;
  PLACE.lat=parseFloat(val("set-lat"))||PLACE.lat;PLACE.lon=parseFloat(val("set-lon"))||PLACE.lon;
  UNITS=val("set-units");CLOCK_24H=document.getElementById("set-24h").checked;
  nightMode=document.getElementById("set-night").checked?"auto":"off";
  NIGHT.start=clampHour(val("set-nstart"),NIGHT.start);NIGHT.end=clampHour(val("set-nend"),NIGHT.end);
  if(COMMUTE){COMMUTE.label=val("set-cdest")||COMMUTE.label;COMMUTE.minutes=parseInt(val("set-cmin"))||COMMUTE.minutes;COMMUTE.distance=val("set-cdist")||COMMUTE.distance;}
  SS_IDLE_MIN=Math.max(0,parseInt(val("set-idle"))||0);
  YT_PLAYLIST=val("set-yt").trim();
  applySettings();persist();closeSettings();
}
function applySettings(){
  renderFamily();renderChips();renderNotes();
  if(LAST_EVENTS&&LAST_EVENTS.length)renderEvents(LAST_EVENTS);else demoCalendar();
  renderMeals();renderMonth();tick();startWeather();
  updateNightBtn();applyNight();armIdle();buildTicker();
  if(YT_PLAYLIST)loadYT();
}
document.getElementById("setbtn").addEventListener("click",openSettings);
document.getElementById("set-close").addEventListener("click",closeSettings);
document.getElementById("settings").addEventListener("click",e=>{if(e.target.id==="settings")closeSettings();});
document.getElementById("set-save").addEventListener("click",saveSettings);
document.getElementById("set-clear").addEventListener("click",()=>{
  if(safeStore.available){try{localStorage.removeItem(DB_KEY);}catch(_){}}location.reload();});
