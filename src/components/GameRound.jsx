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
        Round {roundIndex + 1}/{totalRounds} — ⏱ {seconds}s
      </p>
      {/* .round is Member C's 2-column grid hook: photo left, map right. */}
      <div className="round">
        <div className="round-photo">
          {photoFailed ? (
            <p className="photo-fallback">📷 Photo unavailable</p>
          ) : (
            /* B4: empty alt on purpose — alt text would reveal the answer */
            <img
              src={spot.photo}
              alt=""
              style={{ maxHeight: '50vh' }}
              onError={() => setPhotoFailed(true)}
            />
          )}
        </div>
        <div className="round-map">
          <GuessMap spot={spot} onConfirm={handleConfirm} />
        </div>
      </div>
    </div>
  )
}
