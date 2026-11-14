import { useRef, useState } from 'react'
import Leaderboard, { addScore } from './Leaderboard.jsx'
import { firstSentence, getFacts } from '../utils/facts.js'

const fmt = (n) => n.toLocaleString('en-US')

// B6 — Results: total out of 25,000, per-round breakdown, nickname input
// (saves to the leaderboard once), "Play again".
export default function ResultScreen({ totalScore, totalPossible, guesses, onPlayAgain }) {
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const savedRef = useRef(false)

  function handleSave(e) {
    e.preventDefault()
    const trimmed = name.trim()
    // Ref guard: two fast clicks can land before the state update re-renders.
    if (!trimmed || savedRef.current) return

    savedRef.current = true
    addScore(trimmed, totalScore)
    setSaved(true)
  }

  const credits = [...new Set(guesses.map((g) => g.spot.attribution).filter(Boolean))].join(' · ')

  return (
    <div className="card results-screen">
      <h2>Game over!</h2>
      <p>
        <strong>
          Total: {fmt(totalScore)} / {fmt(totalPossible)}
        </strong>
      </p>

      <h4>Your rounds:</h4>
      {guesses.length === 0 ? (
        <p>No rounds were played.</p>
      ) : (
        <ol>
          {guesses.map((g, i) => (
            <li key={i}>
              {g.spot.name} — {fmt(g.points)} pts {g.guess ? '' : '(timed out)'}
            </li>
          ))}
        </ol>
      )}

      {/* Earned-info recap: each round shows only what that guess unlocked. */}
      <h4>🏛️ Your tour of Timișoara</h4>
      <p>You keep the stories you earned — the rest stay locked.</p>
      {guesses.map((g, i) => {
        const facts = getFacts(g.spot)
        const level = g.infoLevel ?? 0

        return (
          <div key={i} className="card tour-stop" data-level={level} style={{ marginBottom: '1rem' }}>
            <strong>{g.spot.name}</strong>{' '}
            {level === 2 && g.spot.neighborhood && <em>({g.spot.neighborhood})</em>}
            {level === 2 &&
              facts.map((fact, j) => (
                <p className="reveal-fact" key={j}>
                  💡 {fact}
                </p>
              ))}
            {level === 1 && (
              <p className="reveal-fact">
                💡 {firstSentence(facts[0]) || 'A story about this place is coming soon.'}
              </p>
            )}
            {level === 0 && (
              <p className="reveal-teaser">🔒 Story not unlocked — get closer next time.</p>
            )}
            <img src={g.spot.photo} alt={g.spot.name} style={{ maxWidth: '300px' }} />
          </div>
        )
      })}
      {credits && (
        <p className="reveal-meta" style={{ fontSize: '0.8em', fontStyle: 'italic' }}>
          {credits}
        </p>
      )}

      {!saved ? (
        <form onSubmit={handleSave}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your nickname"
            aria-label="Nickname"
            maxLength={20}
          />{' '}
          <button type="submit" disabled={!name.trim()}>
            Save score
          </button>
        </form>
      ) : (
        <p>Saved! ✔</p>
      )}

      <Leaderboard />

      <button onClick={onPlayAgain}>Play again</button>
    </div>
  )
}
