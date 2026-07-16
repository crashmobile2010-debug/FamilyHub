# Wall Tablet (Kiosk) Setup

The hub is built to live on an always-on tablet: it dims itself at night,
keeps the screen awake, hides its buttons when idle, and drifts into the
photo screensaver after a few minutes. You just need the tablet to open the
URL and stay on it.

Your hub URL: `https://<your-username>.github.io/<repo-name>/`

---

## Android tablet — best option: Fully Kiosk Browser (free)

1. Install **Fully Kiosk Browser** from the Play Store.
2. Set **Start URL** to your hub URL.
3. Recommended settings inside Fully Kiosk:
   - Web Content Settings → ✅ Enable JavaScript, ✅ Autoplay Videos
     (needed for music), ✅ Enable Geolocation Access (for local weather).
   - Device Management → ✅ Keep Screen On, Screen Brightness as you like.
   - Kiosk Mode (optional) → pin the app so kids can't wander off it.
4. Plug the tablet in permanently. Done.

The hub asks the browser for a *screen wake lock* too, so even plain Chrome
works: open the URL → ⋮ menu → **Add to Home screen**, launch it from that
icon (fullscreen), and set Display → Screen timeout to 30 min or max.

## iPad

1. Open the URL in Safari → Share → **Add to Home Screen** → launch from the
   new icon (runs fullscreen, no browser chrome).
2. Settings → Display & Brightness → **Auto-Lock: Never**.
3. Optional "can't escape" mode: Settings → Accessibility → **Guided Access**
   → on. Triple-click the side button while the hub is open to lock the iPad
   to it.
4. Keep it plugged in.

## Old laptop / monitor / TV stick

Any device with Chrome works: open the URL, press the ⛶ button on the hub
(bottom-right) for fullscreen, and disable sleep in the OS power settings.

---

## Family phones

Nothing to install — everyone opens the same URL and adds it to their home
screen. With Supabase sync configured (SETUP.md §3), notes, meals, photos and
settings are live-shared: tick off a task from the couch, it updates on the
wall.

Each person taps **Sign in with Google** on *their own* device to see their
own calendar/tasks (they must be listed as Test Users — SETUP.md §2).

---

## The on-screen controls (bottom-right, fade when idle)

| Button | Does |
|--------|------|
| ⚙️ | Settings — family, location, night hours, playlist, edit-layout mode |
| 🖼️ | Start the photo screensaver immediately |
| 🌙 / ☀️ | Toggle automatic night dimming |
| ⛶ | Fullscreen |

Night mode dims the screen between the configured hours (default 22:00–06:00);
a tap brightens it for 60 seconds. The screensaver starts after the configured
idle minutes (default 3) and exits on any tap.

## Sound through a speaker/amp

Pair the tablet to your speaker or amp in the tablet's own Bluetooth settings —
the hub's music follows automatically. (Also noted inside ⚙️ Settings.)

## Troubleshooting

- **Blank/old version after an update** — pull down to refresh, or in Fully
  Kiosk set Web Auto Reload. GitHub Pages can take a minute to update after a
  push.
- **Music won't start on its own** — browsers require one tap on the page
  before audio can play. Tap play once after a reboot.
- **Weather says "offline"** — the tablet blocked geolocation; either allow
  it or set your town's lat/lon in ⚙️ Settings (it then uses that, no
  permission needed).
- **Screen still sleeps** — the wake lock only engages after the first tap
  (browser rule), and some tablets override it; use Fully Kiosk's Keep Screen
  On or the OS display timeout as the belt-and-braces fix.
