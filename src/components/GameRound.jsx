import { useEffect } from 'react'
import useTimer from '../hooks/useTimer.js'
import GuessMap from './GuessMap.jsx' // TEMP: Member A owns the real GuessMap

const ROUND_SECONDS = 60

// B3 + B4 — Game round: photo + 60s timer + guess map.
// When the timer hits 0 the round auto-confirms with a null guess → 0 points.
export default function GameRound({ spot, roundIndex, totalRounds, onConfirm }) {
  const { seconds, isDone } = useTimer(ROUND_SECONDS)

  // Auto-confirm on timeout (B3). Effect so we don't call onConfirm during render.
  useEffect(() => {
    if (isDone) onConfirm(null)
  }, [isDone]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <p>
        Round {roundIndex + 1}/{totalRounds} — ⏱ {seconds}s
      </p>
      {/* B4: empty alt on purpose — alt text would reveal the answer */}
      <img src={spot.photo} alt="" style={{ maxWidth: '100%', maxHeight: '50vh' }} />
      <GuessMap spot={spot} onConfirm={onConfirm} />
    </div>
  )
}
