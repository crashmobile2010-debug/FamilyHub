/* ====================================================================
   WIDGET · MUSIC — three sources through one set of controls:
   1) built-in generative pad (always works, no config)
   2) internet radio streams (add URLs in config/config.js STATIONS)
   3) YouTube / YouTube Music playlist (set YT_PLAYLIST in config —
      when set, the transport buttons drive the hidden YT player)
   ==================================================================== */
let mIdx=0,playing=false,audioCtx,nodes=null,streamEl=new Audio(),volume=.55;
streamEl.crossOrigin="anonymous";
function buildPad(){
  audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
  const master=audioCtx.createGain();master.gain.value=0;master.connect(audioCtx.destination);
  const filter=audioCtx.createBiquadFilter();filter.type="lowpass";filter.frequency.value=700;filter.Q.value=6;filter.connect(master);
  const freqs=[110,164.81,220,329.63];const oscs=freqs.map((f,i)=>{
    const o=audioCtx.createOscillator();o.type=i%2?"triangle":"sine";o.frequency.value=f;
    o.detune.value=(i-1.5)*6;const g=audioCtx.createGain();g.gain.value=.16;o.connect(g);g.connect(filter);o.start();return o;});
  const lfo=audioCtx.createOscillator();lfo.frequency.value=.06;const lg=audioCtx.createGain();lg.gain.value=260;
  lfo.connect(lg);lg.connect(filter.frequency);lfo.start();
  return{master,filter,oscs,lfo};
}
function setVolume(v){volume=v;
  if(nodes)nodes.master.gain.setTargetAtTime(playing?volume*.8:0,audioCtx.currentTime,.3);
  streamEl.volume=v;}
function stopAll(){
  if(nodes){nodes.master.gain.setTargetAtTime(0,audioCtx.currentTime,.2);}
  streamEl.pause();
}
function startStation(){
  const s=STATIONS[mIdx];
  document.getElementById("track").textContent=s.name;
  if(s.type==="generative"){
    streamEl.pause();
    if(!nodes)nodes=buildPad();
    if(audioCtx.state==="suspended")audioCtx.resume();
    nodes.master.gain.setTargetAtTime(volume*.8,audioCtx.currentTime,.4);
  }else{
    if(nodes)nodes.master.gain.setTargetAtTime(0,audioCtx.currentTime,.2);
    if(!s.url){document.getElementById("tstate").textContent="add a stream URL in config";playing=false;reflectPlay();return;}
    streamEl.src=s.url;streamEl.volume=volume;streamEl.play().catch(()=>{document.getElementById("tstate").textContent="stream unavailable";});
  }
}
function reflectPlay(){
  document.getElementById("playicon").innerHTML=playing?'<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>':'<path d="M7 5l12 7-12 7z"/>';
  document.getElementById("tstate").textContent=playing?"now playing":"paused";
  document.getElementById("disc").classList.toggle("spin",playing);
}
document.getElementById("play").addEventListener("click",()=>{
  if(musicIsYT()){if(playing)ytPlayer.pauseVideo();else ytPlayer.playVideo();persist();return;}
  playing=!playing;
  if(playing)startStation();else stopAll();
  reflectPlay();persist();
});
document.getElementById("next").addEventListener("click",()=>{if(musicIsYT()){ytPlayer.nextVideo();persist();return;}mIdx=(mIdx+1)%STATIONS.length;if(playing)startStation();else document.getElementById("track").textContent=STATIONS[mIdx].name;persist();});
document.getElementById("prev").addEventListener("click",()=>{if(musicIsYT()){ytPlayer.previousVideo();persist();return;}mIdx=(mIdx-1+STATIONS.length)%STATIONS.length;if(playing)startStation();else document.getElementById("track").textContent=STATIONS[mIdx].name;persist();});
let volTimer;
document.getElementById("vol").addEventListener("input",e=>{const v=e.target.value/100;setVolume(v);if(musicIsYT())ytPlayer.setVolume(Math.round(v*100));clearTimeout(volTimer);volTimer=setTimeout(persist,500);});

/* ---- YouTube music (drives the existing transport when a playlist is set) ---- */
let ytPlayer=null,ytReady=false;
function musicIsYT(){return ytReady&&!!ytPlayer;}
function loadYT(){if(!YT_PLAYLIST)return;
  if(window.YT&&window.YT.Player){onYouTubeIframeAPIReady();return;}
  if(document.getElementById("yt-api"))return;
  const t=document.createElement("script");t.id="yt-api";t.src="https://www.youtube.com/iframe_api";document.head.appendChild(t);}
function onYouTubeIframeAPIReady(){if(!YT_PLAYLIST||!window.YT)return;
  if(ytPlayer){try{ytPlayer.loadPlaylist({listType:"playlist",list:YT_PLAYLIST});}catch(_){}return;}
  ytPlayer=new YT.Player("ytplayer",{height:"0",width:"0",
    playerVars:{listType:"playlist",list:YT_PLAYLIST,controls:0,disablekb:1},
    events:{onReady:e=>{ytReady=true;try{e.target.setVolume(Math.round(volume*100));}catch(_){}
      document.getElementById("track").textContent="YouTube Music";},onStateChange:onYtState}});}
function onYtState(e){if(!window.YT)return;playing=(e.data===YT.PlayerState.PLAYING);reflectPlay();
  try{const v=ytPlayer.getVideoData();if(v&&v.title)document.getElementById("track").textContent=v.title;}catch(_){}}
