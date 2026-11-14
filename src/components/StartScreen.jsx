// B — Start screen (real design comes with C5/C6 styling).
// TODO(B7): render <Leaderboard /> here once it exists.
export default function StartScreen({ onStart }) {
  return (
    <div>
      <h1>TimiGuessr</h1>
      <p>Guess the spot in Timișoara from a photo.</p>
      <button onClick={onStart}>Play</button>
    </div>
  )
}
