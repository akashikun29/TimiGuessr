import { useState } from 'react'
import Leaderboard, { addScore } from './Leaderboard.jsx'

// B6 — Results: total out of 25,000, per-round breakdown, nickname input
// (saves to the leaderboard once), "Play again".
// TODO(B7 integration): leaderboard renders right after saving.
export default function ResultScreen({ totalScore, totalPossible, guesses, onPlayAgain }) {
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    if (!name.trim() || saved) return
    addScore(name.trim(), totalScore)
    setSaved(true)
  }

  return (
    <div>
      <h2>Game over!</h2>
      <p>
        <strong>
          Total: {totalScore} / {totalPossible}
        </strong>
      </p>

      <h4>Your rounds:</h4>
      <ol>
        {guesses.map((g, i) => (
          <li key={i}>
            {g.spot.name} — {g.points} pts {g.guess ? '' : '(timed out)'}
          </li>
        ))}
      </ol>

      {/* Full tour recap: every fact, unlocked regardless of guess quality. */}
      <h4>🏛️ Your tour of Timișoara</h4>
      {guesses.map((g, i) => (
        <div key={i} style={{ marginBottom: '1rem' }}>
          <strong>{g.spot.name}</strong> <em>({g.spot.neighborhood})</em>
          <p>💡 {g.spot.fact}</p>
          <img src={g.spot.photo} alt={g.spot.name} style={{ maxWidth: '300px' }} />
        </div>
      ))}
      <p style={{ fontSize: '0.8em', fontStyle: 'italic' }}>
        {[...new Set(guesses.map((g) => g.spot.attribution))].join(' · ')}
      </p>

      {!saved ? (
        <form onSubmit={handleSave}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your nickname"
            maxLength={20}
          />{' '}
          <button type="submit">Save score</button>
        </form>
      ) : (
        <p>Saved! ✔</p>
      )}

      <Leaderboard />

      <button onClick={onPlayAgain}>Play again</button>
    </div>
  )
}
