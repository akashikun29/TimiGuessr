import Leaderboard from './Leaderboard.jsx'

// B — Start screen. Leaderboard shows here too (B7).
export default function StartScreen({ onStart }) {
  return (
    <div>
      <h1>TimiGuessr</h1>
      <p>Tourists don't learn a city from guides — they learn it by playing.</p>
      <button onClick={onStart}>Play</button>
      <Leaderboard />
    </div>
  )
}
