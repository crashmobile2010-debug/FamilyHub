/* ====================================================================
   WIDGET · FAMILY NOTES — sticky notes, colour-tinted per author.
   Synced across devices when Supabase is configured.
   ==================================================================== */
let NOTES=[
  {text:"Leo has a dentist appt Thursday!",author:0},
  {text:"We're out of milk 🥛",author:2},
  {text:"Pizza Friday 🍕",author:1},
];
let activeAuthor=0;
function renderNotes(){
  const w=document.getElementById("notewrap");
  w.innerHTML=NOTES.map((n,i)=>{const f=FAMILY[n.author%FAMILY.length];
    const rot=((i*7)%7-3)+"deg";const tint=hexTint(f.color);
    return`<div class="note" style="--rot:${rot};background:${tint}">
      <span class="del" data-del="${i}">×</span>${esc(n.text)}
      <span class="au">— ${f.name}</span></div>`;}).join("");
}
function hexTint(hex){const n=parseInt(hex.slice(1),16);const r=n>>16&255,g=n>>8&255,b=n&255;
  return`rgb(${Math.round(r+(255-r)*.72)},${Math.round(g+(255-g)*.72)},${Math.round(b+(255-b)*.72)})`;}
document.getElementById("notewrap").addEventListener("click",e=>{
  const d=e.target.closest("[data-del]");if(d){NOTES.splice(+d.dataset.del,1);renderNotes();persist();}});
function renderChips(){
  document.getElementById("authchips").innerHTML=FAMILY.map((f,i)=>
    `<button class="authchip ${i===activeAuthor?'sel':''}" data-auth="${i}" style="background:${f.color}">${f.emoji}</button>`).join("");
}
document.getElementById("authchips").addEventListener("click",e=>{
  const c=e.target.closest("[data-auth]");if(c){activeAuthor=+c.dataset.auth;renderChips();persist();}});
function addNote(){const inp=document.getElementById("noteinput");const t=inp.value.trim();if(!t)return;
  NOTES.unshift({text:t,author:activeAuthor});inp.value="";renderNotes();persist();}
document.getElementById("addnote").addEventListener("click",addNote);
document.getElementById("noteinput").addEventListener("keydown",e=>{if(e.key==="Enter")addNote();});
