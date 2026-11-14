import { useEffect, useRef, useState } from 'react'
import useTimer from '../hooks/useTimer.js'
import GuessMap from './GuessMap.jsx' // TEMP: Member A owns the real GuessMap

const ROUND_SECONDS = 60

// B3 + B4 — Game round: photo + 60s timer + guess map.
// When the timer hits 0 the round auto-confirms with a null guess → 0 points.
export default function GameRound({ spot, roundIndex, totalRounds, onConfirm }) {
  const { seconds, isDone } = useTimer(ROUND_SECONDS)
  const hasSubmitted = useRef(false)
  const [photoFailed, setPhotoFailed] = useState(false)

  // Auto-confirm on timeout (B3). Effect so we don't call onConfirm during render.
  useEffect(() => {
    if (isDone && !hasSubmitted.current) {
      hasSubmitted.current = true
      onConfirm(null)
    }
  }, [isDone, onConfirm])

  function handleConfirm(guess) {
    if (hasSubmitted.current) return
    hasSubmitted.current = true
    onConfirm(guess)
  }

  return (
    <div>
      <p className="round-header" role="timer">
        Round {roundIndex + 1} of {totalRounds} · {seconds}s remaining
      </p>
      {/* C's CSS makes this screen a grid with the photo and map as direct children. */}
      {photoFailed ? (
        <div className="photo-fallback">Photo unavailable.</div>
      ) : (
        /* B4: empty alt on purpose — alt text would reveal the answer */
        <img src={spot.photo} alt="" onError={() => setPhotoFailed(true)} />
      )}
      <GuessMap spot={spot} onConfirm={handleConfirm} />
    </div>
  )
}
