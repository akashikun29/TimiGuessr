// B5 — Reveal card: the learning moment after each guess.
// Shows spot name, neighborhood, fun fact, photo credit + points earned.
// (The guess→truth line drawing on the map is Member A's task A6.)
export default function RevealCard({ spot, guess, points, totalScore, isLastRound, onNext }) {
  return (
    <div>
      <h2>Round reveal</h2>
      <img src={spot.photo} alt={spot.name} style={{ maxWidth: '100%', maxHeight: '40vh' }} />
      <h3>{spot.name}</h3>
      <p>Neighborhood: {spot.neighborhood}</p>
      <p>💡 {spot.fact}</p>
      <p>
        {guess
          ? `Your guess was ${Math.round(
              // rough reveal hint only; exact scoring math belongs to score.js (A)
              Math.hypot(guess.lat - spot.lat, guess.lng - spot.lng) * 111000
            )} m away`
          : '⏱ Time ran out — no guess placed!'}
      </p>
      <p>
        <strong>+{points} points</strong> — total: {totalScore}
      </p>
      <p style={{ fontStyle: 'italic' }}>{spot.attribution}</p>
      <button onClick={onNext}>{isLastRound ? 'See results' : 'Next round'}</button>
    </div>
  )
}
