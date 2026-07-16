/* ====================================================================
   WIDGET · CLOCK + GREETING + DATE (top bar)
   ==================================================================== */
function tick(){
  const n=new Date();let h=n.getHours();const m=String(n.getMinutes()).padStart(2,"0");
  let ap="";if(!CLOCK_24H){ap=h>=12?"PM":"AM";h=h%12||12;}
  document.getElementById("clock").innerHTML=`${CLOCK_24H?String(h).padStart(2,"0"):h}<span class="colon">:</span>${m}<span class="ampm">${ap}</span>`;
  document.getElementById("date").textContent=n.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
  const hr=n.getHours();
  document.getElementById("greet").textContent=hr<12?"good morning":hr<17?"good afternoon":hr<21?"good evening":"good night";
}
