# CLAUDE.md — instructions for AI assistants working on this repo

This is a family kiosk dashboard. It runs on a wall tablet and the family's
phones. The owner is not a developer. Your job is to make the requested change
**without breaking anything else**. Prefer the smallest possible diff.

## What this is

- Plain HTML/CSS/JS. **No frameworks, no npm dependencies, no ES modules.**
- All JS files share ONE global scope. The build (`build.mjs`) concatenates
  them in a fixed order into a single `dist/index.html`.
- Deploys automatically: push to `main` → GitHub Actions → GitHub Pages.

## Repo map — edit ONLY the file that owns the thing you're changing

The UI is three swipeable pages (scroll-snap): **0 Entertainment** (photos,
music, Bluetooth) · **1 Home**, the default (clock, weather, month calendar,
agenda, alerts, ticker) · **2 Organize** (to-dos, cooking roster, notes).

| Change requested            | File to edit                    |
|-----------------------------|---------------------------------|
| Setup values, family, place | `config/config.js`              |
| Colors, sizes, layout, look | `src/styles/slick.css` (the only stylesheet) |
| Page structure / markup     | `src/index.html`                |
| Swipe/pager behaviour       | `src/widgets/pager.js`          |
| Ticker + alert pop-ups      | `src/widgets/home.js`           |
| Big buttons / Bluetooth sheet | `src/widgets/fun.js`          |
| Clock / greeting            | `src/widgets/clock.js`          |
| Weather                     | `src/widgets/weather.js`        |
| Photo slideshow / upload    | `src/widgets/photos.js`         |
| Google sign-in              | `src/widgets/google-auth.js`    |
| Calendar / month grid       | `src/widgets/calendar.js`       |
| To-do lists                 | `src/widgets/tasks.js`          |
| Sticky notes                | `src/widgets/notes.js`          |
| Meal plan                   | `src/widgets/meals.js`          |
| Music player / YouTube      | `src/widgets/music.js`          |
| Night dim / fullscreen / buttons | `src/widgets/kiosk.js`     |
| Screensaver                 | `src/widgets/screensaver.js`    |
| Settings panel / drag mode  | `src/widgets/settings.js`       |
| Startup sequence            | `src/boot.js`                   |

## Hard rules

1. **NEVER edit `dist/` or `.build/`** — they are generated. Edit `src/`,
   `config/`, or `build.mjs` manifests only.
2. **Do not convert code to ES modules** (no `import`/`export` in `src/`).
   Everything is classic-script globals by design.
3. **Do not reorder** the `CSS_FILES`/`JS_FILES` manifests in `build.mjs`.
   `boot.js` must stay last. New widget files go just before `src/boot.js`.
4. **Do not rename existing global functions/variables** — other files use
   them. Adding new ones is fine.
5. Do not add npm dependencies, build tools, or frameworks.
6. Do not change the shape of the saved-state object (`currentState()` in
   `src/core/state.js`) unless explicitly asked — every device's saved data
   and the cloud-synced row depend on it.
7. JS source must never contain the literal text `</script` (the build
   rejects it). Write `<\/script` inside strings if ever needed.
8. Keep the slick dark-glass aesthetic (`.glass` cards, Inter font, tokens at
   the top of `slick.css`) unless asked to change it. Use `notify(msg, color,
   icon)` from `home.js` for any new pop-up alerts instead of inventing a
   second toast system.

## Adding a new widget (the standard recipe)

1. Add its markup inside the right `<section class="page ...">` in
   `src/index.html` (Home `pg-home`, Organize `pg-do`, Entertainment `pg-fun`)
   — usually as a `<div class="glass docard">`.
2. Style it in `src/styles/slick.css`, reusing the existing tokens/classes.
3. Create `src/widgets/<name>.js` with its logic.
4. Register the file in `build.mjs` `JS_FILES`, just before `src/boot.js`.
5. Call its init/render function at the end of `src/boot.js`.
6. If its data should save/sync: add a field to `currentState()` in
   `src/core/state.js`, restore it in `src/boot.js` AND in
   `applyStateObject()` in `src/core/sync.js`, and call `persist()` when the
   user changes it. (This touches state shape — see escalation below.)

## Verify every change

```
npm run check     # builds + syntax-checks the JS bundle. Must pass.
```

If you can run a browser, also load `dist/index.html` and confirm the hub
renders with no console errors. Then commit and push — the deploy is
automatic.

## Escalate to a stronger model (Claude Fable / Opus) instead of attempting

- Anything in `src/core/sync.js` (sync/merge logic) or `supabase/schema.sql`
- Google auth flow (`src/widgets/google-auth.js` auth internals)
- Changing the saved-state shape or writing a state migration
- Changing `build.mjs` beyond adding a file to a manifest
- Restructuring `src/boot.js` startup order
- Anything you cannot verify with `npm run check` + a reasoned trace

When escalating, say what was requested and why it exceeds this file's
routine-change rules. See docs/WORKFLOWS.md for the owner-facing version.
