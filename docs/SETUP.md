# Setup Guide

Three independent parts. Do §1 first; §2 and §3 in any order, whenever you like.
The hub works with demo data until each part is connected.

---

## §1 — Put the hub online (GitHub Pages, free)

1. Create a free account at github.com if you don't have one.
2. Create a **new repository** (e.g. `family-hub`). Public is fine — there are
   no secrets in this code (see note at the bottom).
3. Upload this whole folder to the repo. Easiest ways:
   - **Web:** repo page → "uploading an existing file" → drag the folder's contents in → Commit.
   - **Git:** `git init && git add -A && git commit -m "family hub" && git push` to the new repo.
4. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. Wait ~1 minute (watch the **Actions** tab). Your hub is now live at:
   `https://<your-username>.github.io/<repo-name>/`
6. Open that URL on the tablet and on everyone's phones. Bookmark / add to home screen.

Every future push to `main` redeploys automatically. Nothing else to do.

---

## §2 — Google Calendar + Tasks (~10 minutes)

You'll create a free Google Cloud "OAuth client" that lets the hub read your
calendar and read/write your tasks. Each family member then signs in on their
own device with their own Google account.

1. Go to **console.cloud.google.com** → create a project (name: "Family Hub").
2. **APIs & Services → Library** → enable **Google Calendar API** and **Google Tasks API**.
3. **APIs & Services → OAuth consent screen**:
   - User type: **External** → Create.
   - App name "Family Hub", your email for the contact fields → Save through the steps.
   - Under **Audience / Test users**: **add every family member's Gmail address.**
     (While the app is in "Testing" mode — which is fine forever for a family —
     only listed test users can sign in.)
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized JavaScript origins** — add BOTH:
     - `https://<your-username>.github.io`
     - `http://localhost:8080` (so sign-in also works when testing locally)
   - Create → copy the **Client ID** (ends in `.apps.googleusercontent.com`).
5. Paste it into `config/config.js` → `GOOGLE_CLIENT_ID`. Push. Done.

**Tip — one shared family calendar:** create a "Family" calendar in Google
Calendar, share it with everyone, then put its ID (Calendar settings →
"Integrate calendar" → Calendar ID) into `CALENDAR_ID` in the config. Otherwise
each person sees their own primary calendar.

**Color-coding is automatic:** put a family member's name in the event title
("Ava swim lesson") and the event takes their color.

---

## §3 — Cloud sync + shared photos (Supabase, free tier)

This makes notes, meals, photos and settings shared live across all devices.
Without it, everything still works but saves per-device only.

1. Go to **supabase.com** → New project (free). Pick any name/password/region
   (Sydney is closest to NZ).
2. In the project: **SQL Editor** → paste the entire contents of
   **`supabase/schema.sql`** from this repo → **Run**. (Creates the shared-state
   table, live-sync, and the photo bucket, all in one go.)
3. **Project Settings → API** → copy:
   - **Project URL** → `SUPABASE_URL` in `config/config.js`
   - **anon public key** → `SUPABASE_ANON_KEY`
4. Set `FAMILY_CODE` in the config to something obscure — it's effectively your
   family's password (e.g. `"kereru-42-lasagna"`, not `"smith-family"`).
5. Push. Open the hub on two devices — add a sticky note on one and watch it
   appear on the other.

Photos uploaded via the ＋ button now go to Supabase Storage and show up for
the whole family.

---

## YouTube Music (optional, 1 minute)

1. Open your playlist in YouTube / YouTube Music → Share → copy the link.
2. The playlist ID is the part after `list=` (starts with `PL`).
3. Paste it into `YT_PLAYLIST` in `config/config.js`, or into
   ⚙️ Settings → "YouTube Music playlist ID" right on the hub.
4. The ▶ ⏭ ⏮ buttons and volume now drive the playlist.

> Note: YouTube requires the page to stay open (it does — it's a kiosk) and
> playback starts after the first tap on the page (browser autoplay rules).

---

## Is it safe for the repo to be public?

Yes, by design: the Google Client ID and Supabase anon key are *public*
client-side keys — Google restricts yours to your site's URL, and Supabase
access is governed by the row policies in `schema.sql`. The only "secret" is
`FAMILY_CODE`, which gates your family's data — so pick an obscure one, or
simply make the repo **private** (GitHub Pages works from private repos on
free accounts via Actions too).
