# 🏡 The Family Hub

A handwritten cork-board dashboard for your family: calendar, to-dos, photos,
meal plan, sticky notes, music, weather, night-dim kiosk mode and a DAKboard-style
screensaver. Runs on a wall tablet and everyone's phones from one free URL.

**Works instantly with demo data** — integrations light up as you configure them.

## Try it right now

```
node build.mjs        # builds dist/index.html (needs Node 18+, no installs)
npm run dev           # → http://localhost:8080
```

Or just open `dist/index.html` in a browser.

## Put it online (one-time, ~10 minutes)

1. Push this folder to a GitHub repository.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Done — every push to `main` auto-deploys to `https://<you>.github.io/<repo>/`.

Full setup (Google Calendar/Tasks, cloud sync, photos, YouTube Music):
**[docs/SETUP.md](docs/SETUP.md)** · Wall-tablet setup: **[docs/KIOSK.md](docs/KIOSK.md)**

## Everyday changes

Edit **`config/config.js`** (family members, location, playlist, keys) or use the
on-screen ⚙️ Settings. For code changes, hand the repo to an AI assistant — rules
it must follow are in **[CLAUDE.md](CLAUDE.md)**, and **[docs/WORKFLOWS.md](docs/WORKFLOWS.md)**
explains which tasks suit a small fast model vs. a frontier model.

## How the repo works

```
config/config.js      ← the only file you edit for setup
src/index.html        ← page markup (widgets' HTML)
src/styles/           ← base.css then theme.css (order matters)
src/core/             ← helpers, saved state, cloud sync
src/widgets/          ← one file per widget (calendar, tasks, music, …)
src/boot.js           ← startup — always runs last
build.mjs             ← concatenates everything → dist/index.html
```

`node build.mjs` → single-file app in `dist/`. `npm run check` verifies the
bundle. Push to `main` → GitHub Actions deploys it. No dependencies, ever.
