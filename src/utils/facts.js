// B-owned data adapter for Member C's spots.
//
// The frozen schema in PLAN.md described `fact: string`, but the delivered
// `spots.json` uses `facts: string[]`. Support both so a data change can never
// blank out the reveal card or the results recap.

export function getFacts(spot) {
  if (!spot) return []

  if (Array.isArray(spot.facts)) {
    return spot.facts
      .map((fact) => (typeof fact === 'string' ? fact.trim() : ''))
      .filter(Boolean)
  }

  if (typeof spot.fact === 'string' && spot.fact.trim()) {
    return [spot.fact.trim()]
  }

  return []
}

// Show only the first sentence of a fact (works however long C's facts are).
export function firstSentence(text) {
  if (typeof text !== 'string' || !text.trim()) return ''
  const parts = text.match(/[^.!?]+[.!?]+/g)
  return parts ? parts[0].trim() : text.trim()
}
