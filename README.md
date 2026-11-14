# TimiGuessr — dev notes (Member B)

GeoGuessr-style game about Timișoara for UniHack 2026 (track: Civicore).
React + Vite, react-leaflet, static `spots.json`, localStorage leaderboard.
Full team plan: `PLAN.md` (kept outside the repo, in the parent folder).

**Repo:** https://github.com/persolly/TimiGuessr.git
**Branch:** `b1-screen-state-machine` (B pushes branches, A merges `main`)

---

## Status: all B tasks (B1–B7) are DONE and pushed

| Task | Where | What |
|---|---|---|
| B1 | `src/App.jsx` | Screen state machine: one state object `{screen: 'start'\|'round'\|'reveal'\|'results', roundIndex, totalScore, guesses[], rounds[]}`. Functions: `startGame()`, `handleRoundConfirm(guess)`, `nextRound()`. |
| B2 | `src/App.jsx` | `pickRounds()` — Fisher–Yates shuffle of spots, first 5 become the game. |
| B3 | `src/hooks/useTimer.js` | `useTimer(60)` → `{seconds, isDone}`. Timeout auto-confirms with `null` guess → 0 points. `GameRound` has `key={roundIndex}` in App so the timer resets each round. |
| B4 | `src/components/GameRound.jsx` | Photo with **empty alt** (alt would reveal the answer), "Round X/5", mounts `<GuessMap>`. |
| B5 | `src/components/RevealCard.jsx` | Info card after each guess — now with **proximity-gated info** (see below). |
| B6 | `src/components/ResultScreen.jsx` | Total /25,000, per-round breakdown, nickname input (saves once), full-tour recap. |
| B7 | `src/components/Leaderboard.jsx` | `localStorage` key `"timiguessr-scores"`, JSON `[{name, score, date}]`, top 10 desc. Exported helpers: `loadScores()`, `addScore(name, score)`. Rendered on start + results screens. |

## Feature: proximity-gated learning (B5/B6)

The closer the guess, the more info unlocks on the reveal card:

| Tier | Points (≈distance) | Shows |
|---|---|---|
| 🎯 close | ≥ 3000 (~≤450 m) | name + neighborhood + **full fact** + attribution |
| 👍 medium | ≥ 750 (~≤2.6 km) | name + **first sentence** of fact |
| 😮 far / timeout | < 750 | name only + teaser line |

- Thresholds: `FULL_INFO_PTS`, `SOME_INFO_PTS` at top of `App.jsx` (`infoLevel()`).
- Tier copy + slots: `RevealCard.jsx` — card is built as **separate units with stable class
  names** (`reveal-card` with `data-level`, `reveal-badge`, `reveal-fact`, `reveal-meta`,
  `reveal-teaser`, `reveal-score`) so Member C can style 3 color variants via CSS only.
- `firstSentence()` splits on `.!?` → **facts must be complete sentences, no "St."-type
  abbreviations** (rule for Member C).
- Results screen always shows the **full tour recap** (all facts, neighborhoods, photos,
  combined credits line) — nothing is lost, just earned.

---

## TEMPORARY test mocks — local only, gitignored (NOT in the repo)

The repo intentionally contains only B-owned files. These exist locally so B can test
end-to-end; they are listed in `.gitignore` under "TEMPORARY test mocks":

| Path | Owner | Interface B codes against |
|---|---|---|
| `src/components/GuessMap.jsx` | A | `<GuessMap spot={spot} onConfirm={(coords) => ...} />`, coords = `{lat, lng}` |
| `src/utils/score.js` | A | `haversine(lat1,lng1,lat2,lng2)` → meters; `roundScore(guess, truth)` → max 5000 via `5000·e^(-m/1000)` |
| `src/data/spots.json` | C | `{id, name, lat, lng, photo, attribution, fact, neighborhood, difficulty}` |

⚠️ Consequence: a fresh clone does **not** run (`App.jsx` imports these). Teammates get the
3 files via chat until the real ones land; then delete mocks, un-ignore, commit real files.

The mock `GuessMap` has 3 dev buttons mapping to the 3 info tiers: very close (~100 m),
mid (~1.3 km), far (~25 km).

## Tuning constants (B's files)

- `TOTAL_ROUNDS = 5`, `ROUND_SECONDS = 60` (`App.jsx`, `GameRound.jsx`)
- `FULL_INFO_PTS = 3000`, `SOME_INFO_PTS = 750` (`App.jsx`)

## Integration checklist (when teammates deliver)

1. **C's `spots.json`** → no code change. Only rule: complete-sentence facts (see above).
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
8. Photo `onError` fallback so one bad URL never breaks a round
9. Mobile-first layout skeleton in `index.css` (stack photo above map < 700px)
10. "How to play" modal (low priority)
11. Sound effects (WebAudio beeps) — plan optional, needs C's sign-off
12. RO/EN toggle — UI strings are B's, but needs C to add both fact languages
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
