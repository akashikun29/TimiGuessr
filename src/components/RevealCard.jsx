import { useState } from 'react'
import { firstSentence, getFacts } from '../utils/facts.js'

// B5 — Reveal card with proximity-gated info.
// The closer the guess, the more the player learns about the spot:
//   level 2 (close): name + neighborhood + full fact + photo credit
//   level 1 (medium): name + first sentence of the fact
//   level 0 (far / timed out): name only
// The full story is never lost — the results screen shows the complete tour.

export default function RevealCard({ spot, guess, points, infoLevel, totalScore, isLastRound, onNext }) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const facts = getFacts(spot)

  return (
    <div className="card reveal-card" data-level={infoLevel}>
      <h2>Round reveal</h2>
      {photoFailed ? (
        <p className="photo-fallback">📷 Photo unavailable</p>
      ) : (
        <img
          src={spot.photo}
          alt={spot.name}
          style={{ maxHeight: '40vh' }}
          onError={() => setPhotoFailed(true)}
        />
      )}
      <h3>{spot.name}</h3>

      {infoLevel === 2 && (
        <>
          <p className="reveal-meta">Neighborhood: {spot.neighborhood}</p>
          {facts.length > 0 ? (
            facts.map((fact, i) => (
              <p className="reveal-fact" key={i}>
                💡 {fact}
              </p>
            ))
          ) : (
            <p className="reveal-fact">💡 A story about this place is coming soon.</p>
          )}
          <p className="reveal-badge">🎯 Great guess — full story unlocked!</p>
          {spot.attribution && (
            <p className="reveal-meta" style={{ fontStyle: 'italic' }}>
              {spot.attribution}
            </p>
          )}
        </>
      )}

      {infoLevel === 1 && (
        <>
          <p className="reveal-fact">
            💡 {firstSentence(facts[0]) || 'A story about this place is coming soon.'}
          </p>
          <p className="reveal-badge">👍 Good guess — get closer next round to unlock the full story.</p>
        </>
      )}

      {infoLevel === 0 && (
        <p className="reveal-teaser">
          {guess
            ? '😮 Too far away — the full story stays locked for now.'
            : '⏱ Time ran out — no guess placed!'}
        </p>
      )}

      <p className="reveal-score">
        <strong>+{points} points</strong> — total: {totalScore}
      </p>
      <button onClick={onNext}>{isLastRound ? 'See results' : 'Next round'}</button>
    </div>
  )
}
