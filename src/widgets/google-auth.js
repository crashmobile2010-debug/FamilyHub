/* ====================================================================
   WIDGET · GOOGLE AUTH (Identity Services)
   Handles sign-in + token; calendar.js and tasks.js consume gfetch().
   Each family member signs in on their own device with their own
   Google account (add them as Test Users — docs/SETUP.md §2).
   ==================================================================== */
let accessToken=null,tokenClient=null;
function initGoogle(){
  if(!GOOGLE_CLIENT_ID||typeof google==="undefined"||!google.accounts)return false;
  tokenClient=google.accounts.oauth2.initTokenClient({
    client_id:GOOGLE_CLIENT_ID,
    scope:"https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks",
    callback:r=>{ if(r.access_token){accessToken=r.access_token;
      document.getElementById("signin-label").textContent="Signed in ✓";
      loadCalendar();loadTasks();}}
  });return true;
}
async function gfetch(url,opts={}){
  opts.headers=Object.assign({Authorization:"Bearer "+accessToken},opts.headers||{});
  const res=await fetch(url,opts);
  if(res.status===401&&tokenClient){tokenClient.requestAccessToken();throw new Error("reauth");}
  return res.json();
}
document.getElementById("signin").addEventListener("click",()=>{
  if(!GOOGLE_CLIENT_ID){alert("Add your Google OAuth Client ID to config/config.js to connect Calendar + Tasks. Setup steps: docs/SETUP.md. Sample data is shown until then.");return;}
  if(tokenClient||initGoogle())tokenClient.requestAccessToken();
  else alert("Couldn't reach Google. Serve this page over http://localhost or https (not file://).");
});
