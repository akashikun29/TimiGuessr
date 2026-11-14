// B — End-of-game results.
// PLACEHOLDER for B1 testing only.
// TODO(B6): nickname input, per-round breakdown from `guesses`,
// and "Play again" state reset (already wired via onPlayAgain).
// TODO(B7): render <Leaderboard /> here.
export default function ResultScreen({ totalScore, totalPossible, guesses, onPlayAgain }) {
  return (
    <div>
      <h2>Game over!</h2>
      <p>
        Total: {totalScore} / {totalPossible}
      </p>
      <p>{guesses.length} rounds played</p>
      <button onClick={onPlayAgain}>Play again</button>
    </div>
  )
}
