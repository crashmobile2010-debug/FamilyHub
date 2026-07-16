/* ====================================================================
   WIDGET · MEAL PLAN — weekly dinners, editable in place, saved.
   Today's row is highlighted (week starts Monday).
   ==================================================================== */
function todayMealIdx(){return (new Date().getDay()+6)%7;}
function renderMeals(){
  const t=todayMealIdx();
  document.getElementById("mealrows").innerHTML=DAYNAMES.map((d,i)=>
    `<div class="mrow ${i===t?'today':''}"><span class="dy">${d}</span>`+
    `<div class="ml" contenteditable="true" spellcheck="false" data-day="${i}">${esc(MEALS[i]||"")}</div></div>`).join("");
}
let mealTimer;
document.getElementById("mealrows").addEventListener("input",e=>{
  const ml=e.target.closest(".ml");if(!ml)return;MEALS[+ml.dataset.day]=ml.textContent;
  clearTimeout(mealTimer);mealTimer=setTimeout(persist,600);});
