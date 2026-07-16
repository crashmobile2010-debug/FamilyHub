# Update Workflows — running this project with AI

This repo is designed so you never have to write code yourself. You describe a
change to an AI assistant (Claude Code, Claude.ai with the repo, etc.), it
edits the right file, verifies with `npm run check`, and a push to `main`
deploys automatically. `CLAUDE.md` in the repo root contains the rules every
model must follow — point the assistant at it.

## The one-line update loop

> "Read CLAUDE.md, then: *«your change»*. Verify with `npm run check`, then
> commit and push."

That's the whole workflow. The only decision you make is **which model**.

---

## Which model for which job?

### 🟢 Routine — use a small/fast model (Haiku, Sonnet)

Safe because each widget lives in its own file and the check script catches
syntax breakage. Examples:

- "Make the clock bigger" / "change the notes card to pale green" → `theme.css`
- "Rename Ava to Mia and change her color" → `config/config.js` (or just use ⚙️ Settings!)
- "Add Saturday breakfast to the meal planner" → `meals.js`
- "Show 10 calendar events instead of 8" → `calendar.js`
- "Make the screensaver change photos every 20s" → `screensaver.js`
- "Add a simple countdown-to-birthday widget" → the new-widget recipe in CLAUDE.md

**Prompt template:**
> Read CLAUDE.md first. Change: *«describe it»*. Touch only the file(s) that
> own this per the repo map. Run `npm run check` and show me it passing.
> Do not modify build.mjs, boot.js, core/, or the saved-state shape.

### 🔴 Hard — use a frontier model (Claude Fable / Opus)

Anything on CLAUDE.md's escalation list:

- Sync/merge behaviour (`src/core/sync.js`, `supabase/schema.sql`)
- Google auth changes, adding new Google scopes/APIs
- Changing what gets saved (`currentState()`) or migrating old saved data
- Build system changes, startup-order changes in `boot.js`
- "Something broke and I don't know why" — debugging across files
- Big features: chores rota with scoring, shopping list synced to phones,
  voice control, new theme, OMV self-hosting migration

**Prompt template:**
> Read CLAUDE.md. This is an escalation-level change: *«describe it»*.
> Explain your plan before editing, keep the public function names stable,
> update CLAUDE.md/docs if behaviour changes, and verify with `npm run check`.

### A good habit

Ask the small model first; real requests are routine 80% of the time. If it
reports the task touches an escalation area — or its change fails
`npm run check` twice — stop and hand the same request to the frontier model.
Never let a model "fix" a failing check by editing `build.mjs` or deleting
guards.

---

## Verification ladder (what "done" means)

1. `npm run check` passes (build + JS syntax).
2. Open `dist/index.html` locally (or `npm run dev`) — hub renders, no red
   errors in the browser console (F12).
3. Push → **Actions** tab goes green → hard-refresh the live URL.

## If a deploy goes bad

Every version is a git commit, so rollback is one step:
GitHub → repo → **Commits** → find the last good one → revert it (or ask any
model: "revert the last commit and push"). Pages redeploys the old version in
about a minute. Your family's data is safe regardless — it lives in each
device's storage and in Supabase, not in the code.

## Monthly 2-minute health check (optional)

- Actions tab: last deploy green?
- Supabase dashboard: project not paused? (Free projects pause after ~1 week
  of zero traffic; daily hub use prevents this. If paused, one click resumes.)
- Google Cloud: nothing to renew — Test-mode OAuth and both APIs are free at
  family scale.
