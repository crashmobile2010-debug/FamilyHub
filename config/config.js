/* ====================================================================
   FAMILY HUB — CONFIG
   This is the ONLY file you need to edit for setup.
   Everything here is safe to publish (these are public client-side
   keys, protected by Google origin rules and Supabase row policies).
   Setup steps: see docs/SETUP.md
   ==================================================================== */

/* ---- Google (Calendar + Tasks) ---- */
const GOOGLE_CLIENT_ID = "";              // OAuth Web client ID — docs/SETUP.md §2
const CALENDAR_ID = "primary";            // or a shared family calendar's ID

/* ---- Location + display ---- */
const PLACE = { label:"Auckland", lat:-36.8485, lon:174.7633 };
let USE_GEOLOCATION = true, UNITS = "celsius", CLOCK_24H = false;

/* ---- Music ---- */
let YT_PLAYLIST = "";   // YouTube / YouTube Music playlist ID (starts with PL...)
/* Station 0 is a built-in generative pad (always works);
   add stream URLs to play internet radio through the same controls. */
const STATIONS = [
  { name:"Calm", type:"generative" },
  { name:"Radio 1", type:"stream", url:"" },   // paste a stream URL to enable
  { name:"Radio 2", type:"stream", url:"" },
];

/* ---- Cloud sync (Supabase) — docs/SETUP.md §3 ---- */
const SUPABASE_URL = "";        // e.g. https://abcdefgh.supabase.co
const SUPABASE_ANON_KEY = "";   // your project's public anon key
const FAMILY_CODE = "our-home"; // any shared word — use the SAME one on every device + phones.
                                // Pick something obscure; it is effectively your family's password.

/* ---- Family members ---- */
const FAMILY = [
  { name:"Mum",  color:"#c8553d", emoji:"👩" },
  { name:"Dad",  color:"#3f6f99", emoji:"🧔" },
  { name:"Ava",  color:"#7a9e5a", emoji:"🧒" },
  { name:"Leo",  color:"#b07ab0", emoji:"👦" },
];

/* ---- Starter photos (replaced once you upload your own) ---- */
let PHOTOS = [
  { src:"https://picsum.photos/seed/family1/700/700", cap:"beach day ♡" },
  { src:"https://picsum.photos/seed/family2/700/700", cap:"birthday cake!" },
  { src:"https://picsum.photos/seed/family3/700/700", cap:"sunday hike" },
];

/* ---- Kiosk defaults (all changeable in the on-screen ⚙️ Settings) ---- */
const NIGHT = { start:22, end:6, dimOpacity:0.82 };  // dims 10pm–6am
let SS_IDLE_MIN = 3;                                  // minutes idle before screensaver (0 = off)
const COMMUTE = { label:"School", minutes:18, distance:"5.2 mi", via:"via Main Rd" }; // null to hide

/* ---- Family wire ticker ----
   The home-screen ticker auto-fills with tonight's dinner, upcoming
   events, notes and weather. Add your own standing messages here: */
const TICKER_EXTRA = [];   // e.g. ["♻️ Recycling goes out Tuesday night"]

/* ---- Weekly dinner defaults ---- */
const DAYNAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
let MEALS = ["Pasta night 🍝","Tacos 🌮","Stir-fry 🥢","Roast chicken 🍗","Pizza Friday 🍕","BBQ / leftovers","Soup & bread 🥣"];
