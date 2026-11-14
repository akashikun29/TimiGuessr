// B3 — Timer hook.
// useTimer(60) counts down from 60, returns { seconds, isDone }.
// The effect re-runs when totalSeconds changes — and because App gives each
// GameRound a key={roundIndex}, the timer resets fresh every round.
import { useEffect, useState } from 'react'

export default function useTimer(totalSeconds) {
  const [seconds, setSeconds] = useState(totalSeconds)

  useEffect(() => {
    setSeconds(totalSeconds)
    const id = setInterval(() => {
      setSeconds((s) => (s <= 0 ? 0 : s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [totalSeconds])

  return { seconds, isDone: seconds <= 0 }
}
