// B — Game round: photo + timer + guess map.
// PLACEHOLDER for B1 testing only.
// TODO(B3): replace dev buttons with useTimer(60) auto-confirm.
// TODO(B4): show the real spot photo + "Round X/5" from spots.json (needs B2).
// Member A's <GuessMap spot={spot} onConfirm={...} /> mounts here in B2.
export default function GameRound({ roundIndex, totalRounds, onConfirm }) {
  return (
    <div>
      <p>
        Round {roundIndex + 1}/{totalRounds}
      </p>
      <p>[ photo placeholder ]</p>
      <p>[ GuessMap placeholder — Member A ]</p>
      {/* Dev-only buttons to drive the state machine until A3/B3 land: */}
      <button onClick={() => onConfirm(500)}>dev: confirm guess (+500)</button>
      <button onClick={() => onConfirm(0)}>dev: timer ran out (0 pts)</button>
    </div>
  )
}
