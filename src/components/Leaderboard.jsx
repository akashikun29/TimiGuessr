// B7 — localStorage leaderboard.
// Key: "timiguessr-scores" — JSON array [{name, score, date}], top 10, sorted desc.
// Rendered on the start screen and the results screen.

const STORAGE_KEY = 'timiguessr-scores'

export function loadScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const scores = raw ? JSON.parse(raw) : []
    if (!Array.isArray(scores)) return []

    // Ignore malformed old/local data instead of letting it break the list.
    return scores
      .filter(
        (entry) =>
          entry &&
          typeof entry.name === 'string' &&
          typeof entry.score === 'number' &&
          Number.isFinite(entry.score),
      )
      .sort((a, b) => b.score - a.score)
  } catch {
    return []
  }
}

export function addScore(name, score) {
  const scores = loadScores()
  scores.push({ name, score, date: new Date().toISOString() })
  scores.sort((a, b) => b.score - a.score)
  const top10 = scores.slice(0, 10)

  // Private browsing and storage quotas can make localStorage unavailable.
  // The score is still returned so the current results screen remains usable.
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top10))
  } catch {
    // No persistent leaderboard is possible in this browser session.
  }
  return top10
}

export default function Leaderboard() {
  const scores = loadScores()

  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      {scores.length === 0 ? (
        <p>No scores yet.</p>
      ) : (
        <ol>
          {scores.map((entry, i) => (
            <li key={i}>
              {entry.name} — {entry.score.toLocaleString('en-US')} pts
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
