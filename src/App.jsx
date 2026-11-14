import { useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import GameRound from './components/GameRound.jsx'
import RevealCard from './components/RevealCard.jsx'
import ResultScreen from './components/ResultScreen.jsx'

const TOTAL_ROUNDS = 5

// B1 — Screen state machine.
// One single state object: {screen, roundIndex, totalScore, guesses[]}
// screens: 'start' | 'round' | 'reveal' | 'results'
export default function App() {
  const [state, setState] = useState({
    screen: 'start',
    roundIndex: 0,
    totalScore: 0,
    guesses: [], // one entry per completed round: { spot, guess, points }
  })

  function startGame() {
    // TODO(B2): shuffle spots.json here (Fisher–Yates) and take the first 5
    setState({
      screen: 'round',
      roundIndex: 0,
      totalScore: 0,
      guesses: [],
    })
  }

  // Called by GameRound when the player confirms a guess (or the timer hits 0).
  // points: number awarded for this round (0 if timed out).
  function handleRoundConfirm(points) {
    setState((prev) => ({
      ...prev,
      screen: 'reveal',
      totalScore: prev.totalScore + points,
      guesses: [...prev.guesses, { roundIndex: prev.roundIndex, points }],
    }))
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

  function endGame() {
    setState((prev) => ({ ...prev, screen: 'results' }))
  }

  switch (state.screen) {
    case 'round':
      return (
        <GameRound
          roundIndex={state.roundIndex}
          totalRounds={TOTAL_ROUNDS}
          onConfirm={handleRoundConfirm}
        />
      )
    case 'reveal':
      return (
        <RevealCard
          // TODO(B5): pass the real spot + guess data once B2 wires spots in
          roundIndex={state.roundIndex}
          points={state.guesses[state.guesses.length - 1]?.points ?? 0}
          totalScore={state.totalScore}
          isLastRound={state.roundIndex === TOTAL_ROUNDS - 1}
          onNext={nextRound}
        />
      )
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
