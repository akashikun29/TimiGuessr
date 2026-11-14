import { useState } from 'react'
import spotsData from './data/spots.json' // TEMP: Member C owns the real spots.json
import { roundScore } from './utils/score.js' // TEMP: Member A owns the real score.js
import StartScreen from './components/StartScreen.jsx'
import GameRound from './components/GameRound.jsx'
import RevealCard from './components/RevealCard.jsx'
import ResultScreen from './components/ResultScreen.jsx'

const TOTAL_ROUNDS = 5

// B2 — Fisher–Yates shuffle, take the first N spots.
function pickRounds(spots) {
  const arr = [...spots]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, TOTAL_ROUNDS)
}

// B1 — Screen state machine.
// One single state object: {screen, roundIndex, totalScore, guesses[], rounds[]}
// screens: 'start' | 'round' | 'reveal' | 'results'
export default function App() {
  const [state, setState] = useState({
    screen: 'start',
    roundIndex: 0,
    totalScore: 0,
    guesses: [], // one entry per completed round: { spot, guess, points }
    rounds: [], // the 5 shuffled spots for this game (B2)
  })

  function startGame() {
    setState({
      screen: 'round',
      roundIndex: 0,
      totalScore: 0,
      guesses: [],
      rounds: pickRounds(spotsData),
    })
  }

  // Called by GameRound when the player confirms a pin (coords) or when the
  // timer hits 0 (guess = null → 0 points).
  function handleRoundConfirm(guess) {
    setState((prev) => {
      const spot = prev.rounds[prev.roundIndex]
      const points = roundScore(guess, spot)
      return {
        ...prev,
        screen: 'reveal',
        totalScore: prev.totalScore + points,
        guesses: [...prev.guesses, { spot, guess, points }],
      }
    })
  }

  function nextRound() {
    setState((prev) => {
      const next = prev.roundIndex + 1
      if (next >= TOTAL_ROUNDS) {
        return { ...prev, screen: 'results' }
      }
      return { ...prev, screen: 'round', roundIndex: next }
    })
  }

  switch (state.screen) {
    case 'round': {
      const spot = state.rounds[state.roundIndex]
      return (
        <GameRound
          key={state.roundIndex} // remount per round → timer resets (B3)
          spot={spot}
          roundIndex={state.roundIndex}
          totalRounds={TOTAL_ROUNDS}
          onConfirm={handleRoundConfirm}
        />
      )
    }
    case 'reveal': {
      const last = state.guesses[state.guesses.length - 1]
      return (
        <RevealCard
          spot={last.spot}
          guess={last.guess}
          points={last.points}
          totalScore={state.totalScore}
          isLastRound={state.roundIndex === TOTAL_ROUNDS - 1}
          onNext={nextRound}
        />
      )
    }
    case 'results':
      return (
        <ResultScreen
          totalScore={state.totalScore}
          totalPossible={TOTAL_ROUNDS * 5000}
          guesses={state.guesses}
          onPlayAgain={startGame}
        />
      )
    case 'start':
    default:
      return <StartScreen onStart={startGame} />
  }
}
