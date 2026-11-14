// B7 — localStorage leaderboard.
// Key: "timiguessr-scores" — JSON array [{name, score, date}], top 10, sorted desc.
// Rendered on the start screen and the results screen.

const STORAGE_KEY = 'timiguessr-scores'

export function loadScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const scores = raw ? JSON.parse(raw) : []
    return Array.isArray(scores) ? scores : []
  } catch {
    return []
  }
}

export function addScore(name, score) {
  const scores = loadScores()
  scores.push({ name, score, date: new Date().toISOString() })
  scores.sort((a, b) => b.score - a.score)
  const top10 = scores.slice(0, 10)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top10))
  return top10
}

export default function Leaderboard() {
  const scores = loadScores()

  return (
    <div>
      <h3>🏆 Leaderboard</h3>
      {scores.length === 0 ? (
        <p>No scores yet — be the first!</p>
      ) : (
        <ol>
          {scores.map((entry, i) => (
            <li key={i}>
              {entry.name} — {entry.score} pts
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
