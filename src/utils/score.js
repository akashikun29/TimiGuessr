// ⚠️ TEMPORARY TEST FILE — Member A owns the real one (tasks A3 + A4).
// Delete/replace this file when Member A's real `src/utils/score.js` lands.
// Interface B codes against:
//   haversine(lat1, lng1, lat2, lng2) -> meters
//   roundScore(guess, truth)          -> points (max 5000)

export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function roundScore(guess, truth) {
  if (!guess || !truth) return 0
  const meters = haversine(guess.lat, guess.lng, truth.lat, truth.lng)
  return Math.round(5000 * Math.exp(-meters / 1000))
}
