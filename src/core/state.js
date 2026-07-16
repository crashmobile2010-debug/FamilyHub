/* ====================================================================
   CORE · STATE — device persistence + shared app-state globals
   (saves to this device via localStorage; falls back to memory)
   ==================================================================== */

/* shared runtime state used across widgets */
let LAST_EVENTS=null,LAST_WX=null;   // latest calendar events / weather snapshot
let tasksLive=false;                  // true when tasks come from Google (not local)

const DB_KEY="familyHub.v1";
const safeStore=(()=>{let ok=false;try{localStorage.setItem("__t","1");localStorage.removeItem("__t");ok=true;}catch(e){ok=false;}
  const mem={};return{available:ok,
    get(k){if(ok){try{return localStorage.getItem(k);}catch(e){}}return k in mem?mem[k]:null;},
    set(k,v){if(ok){try{localStorage.setItem(k,v);return true;}catch(e){return false;}}mem[k]=v;return true;}};})();

function currentState(){return{v:1,photos:PHOTOS,notes:NOTES,author:activeAuthor,
  music:{station:mIdx,volume},localTasks:tasksLive?null:TASKDATA,night:nightMode,
  meals:MEALS,layout:layout,slots:slotOf,edit:editMode,
  settings:{family:FAMILY,place:PLACE,units:UNITS,clock24:CLOCK_24H,night:NIGHT,commute:COMMUTE,idle:SS_IDLE_MIN,yt:YT_PLAYLIST}};}
function persist(){schedulePush();let tries=0;while(tries<8){const ok=safeStore.set(DB_KEY,JSON.stringify(currentState()));
  if(ok){flashSaved();return;}const i=PHOTOS.findIndex(p=>p.uploaded);if(i<0)return;PHOTOS.splice(i,1);tries++;}}
function loadState(){const raw=safeStore.get(DB_KEY);if(!raw)return null;try{return JSON.parse(raw);}catch(e){return null;}}

const saveTag=document.createElement("div");
saveTag.style.cssText="position:fixed;left:10px;bottom:10px;z-index:70;font-family:'Special Elite',monospace;"+
  "font-size:11px;letter-spacing:.04em;padding:5px 11px;border-radius:14px;background:rgba(90,143,90,.16);"+
  "color:#3f6b3f;opacity:0;transition:opacity .4s;pointer-events:none";
document.body.appendChild(saveTag);
let saveTagTimer;
function flashSaved(){if(!safeStore.available)return;saveTag.textContent="✓ saved on this device";
  saveTag.style.opacity="1";clearTimeout(saveTagTimer);saveTagTimer=setTimeout(()=>saveTag.style.opacity="0",1200);}
if(!safeStore.available){saveTag.textContent="preview — changes won't be saved here";
  saveTag.style.background="rgba(200,85,61,.14)";saveTag.style.color="#9c4530";saveTag.style.opacity="1";}
