/* ====================================================================
   WIDGET · TASKS — Google Tasks lists (two-way: tick + add) with a
   local fallback when not signed in. Ticking a task fires confetti.
   ==================================================================== */
async function loadTasks(){
  try{
    const lists=(await gfetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists")).items||[];
    const data=[];
    for(const l of lists.slice(0,4)){
      const t=(await gfetch(`https://tasks.googleapis.com/tasks/v1/lists/${l.id}/tasks?showCompleted=false&maxResults=12`)).items||[];
      data.push({id:l.id,title:l.title,tasks:t.map(x=>({id:x.id,title:x.title,done:x.status==="completed"}))});
    }
    renderTasks(data,true);
  }catch(e){}
}
let TASKDATA=[];
function renderTasks(data,live){
  TASKDATA=data;
  const el=document.getElementById("lists");
  el.innerHTML=data.map((l,li)=>{const c=FAMILY[li%FAMILY.length].color;
    return`<div class="tlist" data-list="${li}">
      <div class="hd"><span class="swatch" style="background:${c}"></span>${esc(l.title)}</div>
      ${l.tasks.map((t,ti)=>`<div class="task ${t.done?'done':''}" data-li="${li}" data-ti="${ti}">
        <span class="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></span>
        <span class="tx">${esc(t.title)}</span></div>`).join("")}
      <div class="addtask"><input placeholder="add a task…" data-add="${li}"><button data-addbtn="${li}">＋</button></div>
    </div>`;}).join("");
  el.dataset.live=live?"1":"";tasksLive=!!live;
}
document.getElementById("lists").addEventListener("click",async e=>{
  const box=e.target.closest(".box");
  if(box){const row=box.closest(".task");const li=+row.dataset.li,ti=+row.dataset.ti;
    const t=TASKDATA[li].tasks[ti];t.done=!t.done;row.classList.toggle("done",t.done);
    if(t.done)confetti();
    if(accessToken&&document.getElementById("lists").dataset.live){
      try{await gfetch(`https://tasks.googleapis.com/tasks/v1/lists/${TASKDATA[li].id}/tasks/${t.id}`,
        {method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:t.done?"completed":"needsAction"})});}catch(_){}}
    if(!tasksLive)persist();
    return;}
  const addbtn=e.target.closest("[data-addbtn]");
  if(addbtn){const li=+addbtn.dataset.addbtn;const inp=document.querySelector(`[data-add="${li}"]`);
    const title=inp.value.trim();if(!title)return;
    TASKDATA[li].tasks.push({id:"local"+Date.now(),title,done:false});inp.value="";
    if(accessToken&&document.getElementById("lists").dataset.live){
      try{const r=await gfetch(`https://tasks.googleapis.com/tasks/v1/lists/${TASKDATA[li].id}/tasks`,
        {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title})});
        TASKDATA[li].tasks[TASKDATA[li].tasks.length-1].id=r.id;}catch(_){}}
    renderTasks(TASKDATA,document.getElementById("lists").dataset.live);if(!tasksLive)persist();}
});
function demoTasks(){renderTasks([
  {id:"d1",title:"Mum",tasks:[{id:"a",title:"Book dentist",done:false},{id:"b",title:"Grocery run",done:false}]},
  {id:"d2",title:"Ava",tasks:[{id:"c",title:"Reading homework",done:true},{id:"d",title:"Pack swim bag",done:false}]},
  {id:"d3",title:"House",tasks:[{id:"e",title:"Water plants",done:false},{id:"f",title:"Take out bins",done:false}]},
],false);}
