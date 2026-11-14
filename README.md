# TimiGuessr — dev notes (Member B)

GeoGuessr-style game about Timișoara for UniHack 2026 (track: Civicore).
React + Vite, react-leaflet, static `spots.json`, localStorage leaderboard.
Full team plan: `PLAN.md` (kept outside the repo, in the parent folder).

**Repo:** https://github.com/persolly/TimiGuessr.git
**Branch:** `b1-screen-state-machine` (B pushes branches, A merges `main`)

---

## Status: all B tasks (B1–B7) are DONE; C's design + data are integrated

C has delivered `src/index.css` and a 23-spot `src/data/spots.json` (pulled into this
branch). B supports both the `fact: string` schema from `PLAN.md` and the delivered
`facts: string[]` array via `src/utils/facts.js` (no data edits needed).

| Task | Where | What |
|---|---|---|
| B1 | `src/App.jsx` | Screen state machine: one state object `{screen: 'start'\|'round'\|'reveal'\|'results', roundIndex, totalScore, guesses[], rounds[]}`. Functions: `startGame()`, `handleRoundConfirm(guess)`, `nextRound()`. |
| B2 | `src/App.jsx` | `pickRounds()` — Fisher–Yates shuffle of spots, first 5 become the game. |
| B3 | `src/hooks/useTimer.js` | `useTimer(60)` → `{seconds, isDone}`. Timeout auto-confirms with `null` guess → 0 points. `GameRound` has `key={roundIndex}` in App so the timer resets each round. |
| B4 | `src/components/GameRound.jsx` | Photo with **empty alt** (alt would reveal the answer), "Round X/5", mounts `<GuessMap>`. |
| B5 | `src/components/RevealCard.jsx` | Info card after each guess — now with **proximity-gated info** (see below). |
| B6 | `src/components/ResultScreen.jsx` | Total /25,000, per-round breakdown, nickname input (saves once), **earned-info recap** (same tier per round as its reveal). |
| B7 | `src/components/Leaderboard.jsx` | `localStorage` key `"timiguessr-scores"`, JSON `[{name, score, date}]`, top 10 desc. Exported helpers: `loadScores()`, `addScore(name, score)`. Rendered on start + results screens. |

## Feature: proximity-gated learning (B5/B6)

The closer the guess, the more info unlocks on the reveal card:

| Tier | Points (≈distance) | Shows |
|---|---|---|
| Close | ≥ 3000 (~≤450 m) | name + neighborhood + **all facts** + attribution |
| Medium | ≥ 750 (~≤2.6 km) | name + **first sentence** of the first fact |
| Far / timeout | < 750 | name only + locked-story line |

- Thresholds: `FULL_INFO_PTS`, `SOME_INFO_PTS` at top of `App.jsx` (`infoLevel()`).
- Tier copy + slots: `RevealCard.jsx` keeps stable class names (`reveal-card` with
  `data-level`, `reveal-badge`, `reveal-fact`, `reveal-meta`, `reveal-teaser`,
  `reveal-score`) as optional hooks. C's current `index.css` styles by structure, so the
  classes are informational rather than required.
- `firstSentence()` splits on `.!?` → **facts must be complete sentences, no "St."-type
  abbreviations** (rule for Member C). It also tolerates missing/empty facts.
- `src/utils/facts.js` normalizes the dataset: `getFacts(spot)` returns `spot.facts[]`
  when present, otherwise falls back to `[spot.fact]`. C's current data uses `facts[]`.
- Results screen shows an **earned-info recap**: every round keeps the same tier it had on
  its reveal card (full facts / first sentence / locked). Nothing unearned is given away.

## Robustness (already handled in B's code)

- A round can only be completed **once** — a late map click, a timer callback and a
  double-click cannot add duplicate guesses or inflate the score.
- Double-clicking "Next round" cannot skip a round.
- Round count adapts to `spots.json`: `TOTAL_ROUNDS = 5` is the target, but a smaller
  dataset plays the rounds it has instead of crashing. Empty dataset → Play is a no-op
  with a console warning.
- Timer stops its interval at 0 and resets per round (`key={roundIndex}`).
- Leaderboard ignores malformed stored entries and survives `localStorage` being
  unavailable (private mode / quota).
- Nickname save has a ref guard against double-submit; save is disabled while empty.
- Broken photo URLs show a small "📷 Photo unavailable" placeholder instead of a blank/
  broken image (round + reveal).
- Markup matches C's structural CSS: round header, photo and map stay **direct children**
  of the round screen; facts render as `ul/li`; nickname input is `type="text"`.

---

## TEMPORARY test mocks — local only, gitignored (NOT in the repo)

C's `src/index.css` and `src/data/spots.json` are now real, committed files. Only A's two
files are still local mocks, listed in `.gitignore` under "TEMPORARY test mocks":

| Path | Owner | Interface B codes against |
|---|---|---|
| `src/components/GuessMap.jsx` | A | `<GuessMap spot={spot} onConfirm={(coords) => ...} />`, coords = `{lat, lng}` |
| `src/utils/score.js` | A | `haversine(lat1,lng1,lat2,lng2)` → meters; `roundScore(guess, truth)` → max 5000 via `5000·e^(-m/1000)` |

⚠️ Consequence: a fresh clone does **not** run (`App.jsx` imports these two files).
When A delivers them, delete the mocks, remove their lines from `.gitignore`, and commit
the real files.

The mock `GuessMap` has 3 dev buttons mapping to the 3 info tiers: very close (~100 m),
mid (~1.3 km), far (~25 km).

## Tuning constants (B's files)

- `TOTAL_ROUNDS = 5`, `ROUND_SECONDS = 60` (`App.jsx`, `GameRound.jsx`)
- `FULL_INFO_PTS = 3000`, `SOME_INFO_PTS = 750` (`App.jsx`)

## Integration checklist (when teammates deliver)

1. **C's `spots.json`** → ✅ delivered (23 spots, `facts: string[]`) and integrated via
   `src/utils/facts.js`. Only rule going forward: complete-sentence facts (see above).
2. **A's `score.js`** → confirm max points is 5000 and decay /1000; if different, retune
   `FULL_INFO_PTS`/`SOME_INFO_PTS` (misclassification would be silent). Alternative: switch
   `infoLevel()` to distance-based via A's `haversine`.
3. **A's `GuessMap`** → planned change: reveal screen must keep the map mounted (A6 draws
   the guess→truth polyline there; current screen-swap unmounts it). Agreed new prop:
   `<GuessMap spot onConfirm reveal={{guess}} />` — discuss with A **early**.

## B-only backlog ideas (not started)

1. Difficulty modes (timer 90/60/30 s; filter by C's `difficulty` field)
2. Round progress HUD (5 dots/chips + timer red pulse under 10 s)
3. Streak bonus (two ≥3000-pt rounds in a row → +250, applied in App)
4. Remember nickname in localStorage
5. "You're #N!" rank display after saving score
6. Share-result card (Web Share API / clipboard) — plan optional task
7. Personal stats (games played, best score) on start screen
8. "How to play" modal (low priority)
9. Sound effects (WebAudio beeps) — plan optional, needs C's sign-off
10. RO/EN toggle — UI strings are B's, but needs C to add both fact languages
- NOT B: route map on results screen (needs Leaflet = A's files)

## How to run

```bash
npm install   # already done locally
npm run dev   # http://localhost:5173
```

Testing tips: dev buttons in mock GuessMap drive all 3 info tiers; reset leaderboard with
`localStorage.removeItem('timiguessr-scores')` in the browser console; timer-timeout tier is
tested by waiting 60 s.

## Ownership rules (from PLAN.md — respect these)

A never touches `App.jsx` state; B never touches `score.js` math; C never touches
component logic. Need something from another member's file → ask for a prop/callback.
