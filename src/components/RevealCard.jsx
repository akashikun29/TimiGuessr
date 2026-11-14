// B — Reveal card after each guess.
// PLACEHOLDER for B1 testing only.
// TODO(B5): show spot name, neighborhood, fun fact, photo credit,
// and the guess→truth line info once B2 wires the real spot data in.
export default function RevealCard({ roundIndex, points, totalScore, isLastRound, onNext }) {
  return (
    <div>
      <h2>Round {roundIndex + 1} — reveal</h2>
      <p>+{points} points</p>
      <p>Total: {totalScore}</p>
      <p>[ fun fact placeholder — needs B2 + Member C data ]</p>
      <button onClick={onNext}>{isLastRound ? 'See results' : 'Next round'}</button>
    </div>
  )
}
