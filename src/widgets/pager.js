/* ====================================================================
   WIDGET · PAGER — three swipeable pages via native scroll-snap.
   Page order: 0 Entertainment · 1 Home (default) · 2 Organize
   → swipe right from Home = Entertainment, swipe left = Organize.
   Dots (top) and edge chevrons / arrow keys also navigate.
   ==================================================================== */
const pager=document.getElementById("pager");
let curPage=1;
function goPage(i,smooth){i=Math.max(0,Math.min(2,i));
  pager.scrollTo({left:i*pager.clientWidth,behavior:smooth===false?"auto":"smooth"});}
function pageDots(){document.querySelectorAll(".pgdot").forEach((d,n)=>d.classList.toggle("on",n===curPage));}
pager.addEventListener("scroll",()=>{
  const i=Math.round(pager.scrollLeft/Math.max(1,pager.clientWidth));
  if(i!==curPage){curPage=i;pageDots();}},{passive:true});
window.addEventListener("resize",()=>goPage(curPage,false));
document.getElementById("pgdots").addEventListener("click",e=>{
  const d=e.target.closest(".pgdot");if(d)goPage(+d.dataset.pg);});
document.getElementById("chev-l").addEventListener("click",()=>goPage(curPage-1));
document.getElementById("chev-r").addEventListener("click",()=>goPage(curPage+1));
document.addEventListener("keydown",e=>{
  if(e.target.matches("input,select,[contenteditable=true]"))return;
  if(e.key==="ArrowLeft")goPage(curPage-1);
  if(e.key==="ArrowRight")goPage(curPage+1);});
function initPager(){goPage(1,false);pageDots();
  setTimeout(()=>goPage(1,false),120);}  // re-assert after fonts/layout settle
