// ⚠️ TEMPORARY TEST FILE — Member A owns the real one (tasks A1–A7).
// Delete/replace this file when Member A's real GuessMap component lands.
//
// Interface B (and App) codes against:
//   <GuessMap spot={spot} onConfirm={(coords) => ...} />
//   coords: {lat, lng} of the player's pin.
// The real version renders a react-leaflet map, a clickable pin and a
// Confirm button (disabled until a pin exists).

export default function GuessMap({ spot, onConfirm }) {
  return (
    <div style={{ border: '2px dashed #b08060', padding: '1rem' }}>
      <p>
        [ TEMP map placeholder — Member A replaces this file ]
        <br />
        Truth spot (test only): {spot?.name} @ {spot?.lat}, {spot?.lng}
      </p>
      {/* Dev-only buttons simulating pin + Confirm: */}
      <button onClick={() => onConfirm({ lat: spot.lat + 0.0008, lng: spot.lng + 0.0005 })}>
        dev: very close guess (~100 m)
      </button>{' '}
      <button onClick={() => onConfirm({ lat: spot.lat + 0.01, lng: spot.lng + 0.008 })}>
        dev: mid guess (~1.3 km)
      </button>{' '}
      <button onClick={() => onConfirm({ lat: spot.lat + 0.15, lng: spot.lng + 0.2 })}>
        dev: far guess (~25 km)
      </button>
    </div>
  )
}
