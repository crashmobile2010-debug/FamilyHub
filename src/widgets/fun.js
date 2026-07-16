/* ====================================================================
   WIDGET · ENTERTAINMENT EXTRAS — the big buttons on the fun page
   (add photos / next song / Bluetooth help sheet). The photo frame
   and transport themselves live in photos.js and music.js.
   ==================================================================== */
document.getElementById("btn-photo").addEventListener("click",()=>{
  document.getElementById("file").click();});
document.getElementById("btn-song").addEventListener("click",()=>{
  document.getElementById("next").click();});
document.getElementById("btn-bt").addEventListener("click",()=>{
  document.getElementById("btsheet").classList.add("on");});
document.getElementById("btsheet").addEventListener("click",e=>{
  if(e.target.id==="btsheet"||e.target.id==="bt-close")
    document.getElementById("btsheet").classList.remove("on");});
