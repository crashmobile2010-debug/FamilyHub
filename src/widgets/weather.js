/* ====================================================================
   WIDGET · WEATHER (Open-Meteo, no API key needed)
   Populates the top-bar badge + forecast strip, and LAST_WX
   which the screensaver reads.
   ==================================================================== */
async function loadWeather(lat,lon,label){
  const u=UNITS==="fahrenheit"?"fahrenheit":"celsius";
  try{
    const d=await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=${u}&timezone=auto&forecast_days=5`)).json();
    const[c,ic]=WMO[d.current.weather_code]||["—","cloud"];
    document.getElementById("wx-temp").textContent=Math.round(d.current.temperature_2m)+"°";
    document.getElementById("wx-meta").textContent=`${c} · ${label}`;
    document.getElementById("wx-icon").innerHTML=wxSvg(ic);
    const fc=document.getElementById("forecast");
    if(fc&&d.daily){fc.innerHTML="";for(let i=1;i<Math.min(5,d.daily.time.length);i++){
      const day=new Date(d.daily.time[i]+"T00:00").toLocaleDateString(undefined,{weekday:"short"});
      const dic=(WMO[d.daily.weather_code[i]]||["","cloud"])[1];
      fc.insertAdjacentHTML("beforeend",`<div class="fcd"><span class="dd">${day}</span>${wxSvg(dic)}<span class="tt">${Math.round(d.daily.temperature_2m_max[i])}°</span></div>`);
    }}
    LAST_WX={temp:Math.round(d.current.temperature_2m),icon:ic,days:[]};
    if(d.daily)for(let i=0;i<Math.min(4,d.daily.time.length);i++){
      LAST_WX.days.push({label:i===0?"Today":new Date(d.daily.time[i]+"T00:00").toLocaleDateString(undefined,{weekday:"long"}),
        icon:(WMO[d.daily.weather_code[i]]||["","cloud"])[1],
        hi:Math.round(d.daily.temperature_2m_max[i]),lo:Math.round(d.daily.temperature_2m_min[i])});}
    if(ssActive)ssWeather();
  }catch(e){document.getElementById("wx-meta").textContent="weather offline";document.getElementById("wx-icon").innerHTML=wxSvg("cloud");}
}
function startWeather(){
  if(USE_GEOLOCATION&&navigator.geolocation){let done=false;const fb=setTimeout(()=>{if(!done){done=true;loadWeather(PLACE.lat,PLACE.lon,PLACE.label);}},4000);
    navigator.geolocation.getCurrentPosition(p=>{if(done)return;done=true;clearTimeout(fb);loadWeather(p.coords.latitude,p.coords.longitude,"here");},
    ()=>{if(done)return;done=true;clearTimeout(fb);loadWeather(PLACE.lat,PLACE.lon,PLACE.label);},{timeout:3500});
  }else loadWeather(PLACE.lat,PLACE.lon,PLACE.label);
}
