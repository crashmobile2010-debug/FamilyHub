/* ====================================================================
   BOOT — runs LAST. Restores saved state from this device, then
   renders everything and starts timers/sync. If you add a widget,
   initialize it here.
   ==================================================================== */
const saved=loadState();
if(saved){
  if(Array.isArray(saved.photos)&&saved.photos.length)PHOTOS=saved.photos;
  if(Array.isArray(saved.notes))NOTES=saved.notes;
  if(Number.isInteger(saved.author))activeAuthor=saved.author;
  if(saved.music){if(Number.isInteger(saved.music.station))mIdx=saved.music.station%STATIONS.length;
    if(typeof saved.music.volume==="number")volume=saved.music.volume;}
  if(typeof saved.night==="string")nightMode=saved.night;
  if(Array.isArray(saved.meals)&&saved.meals.length)MEALS=saved.meals;
  if(typeof saved.layout==="string")layout=saved.layout;
  if(saved.settings){const s=saved.settings;
    if(Array.isArray(s.family))s.family.forEach((f,i)=>{if(FAMILY[i]){FAMILY[i].name=f.name;FAMILY[i].color=f.color;FAMILY[i].emoji=f.emoji;}});
    if(s.place){PLACE.label=s.place.label;PLACE.lat=s.place.lat;PLACE.lon=s.place.lon;}
    if(typeof s.units==="string")UNITS=s.units;
    if(typeof s.clock24==="boolean")CLOCK_24H=s.clock24;
    if(s.night){if(s.night.start!=null)NIGHT.start=s.night.start;if(s.night.end!=null)NIGHT.end=s.night.end;if(s.night.dimOpacity!=null)NIGHT.dimOpacity=s.night.dimOpacity;}
    if(s.commute&&COMMUTE){COMMUTE.label=s.commute.label;COMMUTE.minutes=s.commute.minutes;COMMUTE.distance=s.commute.distance;}
    if(typeof s.idle==="number")SS_IDLE_MIN=s.idle;
    if(typeof s.yt==="string")YT_PLAYLIST=s.yt;}
  if(saved.slots)slotOf=Object.assign({},slotOf,saved.slots);
  if(typeof saved.edit==="boolean")editMode=saved.edit;
}
showPhoto(0);autoSlide();
tick();setInterval(tick,1000);
startWeather();setInterval(startWeather,15*60000);
demoCalendar();
if(saved&&Array.isArray(saved.localTasks)&&saved.localTasks.length)renderTasks(saved.localTasks,false);
else demoTasks();
renderNotes();renderChips();renderMeals();renderMonth();
document.getElementById("vol").value=Math.round(volume*100);
document.getElementById("track").textContent=STATIONS[mIdx].name;
updateNightBtn();applyNight();setInterval(applyNight,30000);requestWakeLock();applyLayout();armIdle();
renderFamily();applySlots();setEditMode(editMode);if(YT_PLAYLIST)loadYT();initSync();
initPager();startHome();
