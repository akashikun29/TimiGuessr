// B5 — Reveal card with proximity-gated info.
// The closer the guess, the more the player learns about the spot:
//   level 2 (close): name + neighborhood + full fact + photo credit
//   level 1 (medium): name + first sentence of the fact
//   level 0 (far / timed out): name only
// The full story is never lost — the results screen shows the complete tour.

// Show only the first sentence of a fact (works however long Member C's facts are).
function firstSentence(text) {
  const parts = text.match(/[^.!?]+[.!?]+/g)
  return parts ? parts[0].trim() : text
}

export default function RevealCard({ spot, guess, points, infoLevel, totalScore, isLastRound, onNext }) {
  return (
    <div>
      <h2>Round reveal</h2>
      <img src={spot.photo} alt={spot.name} style={{ maxWidth: '100%', maxHeight: '40vh' }} />
      <h3>{spot.name}</h3>

      {infoLevel === 2 && (
        <>
          <p>Neighborhood: {spot.neighborhood}</p>
          <p>💡 {spot.fact}</p>
          <p>🎯 Great guess — full story unlocked!</p>
          <p style={{ fontStyle: 'italic' }}>{spot.attribution}</p>
        </>
      )}

      {infoLevel === 1 && (
        <>
          <p>💡 {firstSentence(spot.fact)}</p>
          <p>👍 Good guess — get closer next round to unlock the full story.</p>
        </>
      )}

      {infoLevel === 0 && (
        <p>
          {guess
            ? '😮 Too far away — the full story stays locked for now.'
            : '⏱ Time ran out — no guess placed!'}
        </p>
      )}

      <p>
        <strong>+{points} points</strong> — total: {totalScore}
      </p>
      <button onClick={onNext}>{isLastRound ? 'See results' : 'Next round'}</button>
    </div>
  )
}
