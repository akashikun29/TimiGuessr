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
      <h2>Game complete</h2>
      <p>
        <strong>
          Total: {fmt(totalScore)} / {fmt(totalPossible)}
        </strong>
      </p>

      <h4>Round breakdown</h4>
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
      <h4>Your Timișoara tour</h4>
      <p>Stories are unlocked by guess accuracy.</p>
      {guesses.map((g, i) => {
        const facts = getFacts(g.spot)
        const level = g.infoLevel ?? 0

        return (
          <div key={i} className="tour-stop" data-level={level} style={{ marginBottom: '1rem' }}>
            <strong>{g.spot.name}</strong>{' '}
            {level === 2 && g.spot.neighborhood && <em>({g.spot.neighborhood})</em>}
            {level === 2 && facts.length > 0 && (
              <ul className="reveal-facts">
                {facts.map((fact, j) => (
                  <li key={j}>{fact}</li>
                ))}
              </ul>
            )}
            {level === 1 && (
              <ul className="reveal-facts">
                <li>{firstSentence(facts[0]) || 'A story about this place is coming soon.'}</li>
              </ul>
            )}
            {level === 0 && (
              <p className="reveal-teaser">Story locked. A closer guess unlocks it.</p>
            )}
            <img src={g.spot.photo} alt={g.spot.name} />
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
        <p>Score saved.</p>
      )}

      <Leaderboard />

      <button onClick={onPlayAgain}>Play again</button>
    </div>
  )
}
