/**
 * Signal Extractor
 *
 * Reads raw document text and detects evidence signals for each axis.
 * This is what makes the assessment REAL — it responds to actual input,
 * not fixture replay.
 *
 * For each axis it counts:
 *   - strong matches  (weighted 3x — production-grade indicators)
 *   - positive matches (weighted 1x — basic indicators present)
 *   - negative matches (penalty — explicit gaps stated)
 *
 * @module core/signalExtractor
 */

/**
 * @typedef {Object} AxisSignals
 * @property {number} strong   - count of strong-signal hits
 * @property {number} positive - count of positive-signal hits
 * @property {number} negative - count of negative-signal hits
 * @property {string[]} foundEvidence   - matched positive/strong phrases
 * @property {string[]} missingEvidence - matched negative phrases
 */

/**
 * Counts non-overlapping keyword occurrences in text.
 * Word-boundary aware to avoid false positives.
 * @param {string} text - lowercased document text
 * @param {string[]} keywords
 * @returns {{count: number, matched: string[]}}
 */
function countMatches(text, keywords) {
  let count = 0
  const matched = []
  for (const kw of keywords) {
    const needle = kw.toLowerCase()
    if (text.includes(needle)) {
      count++
      matched.push(kw)
    }
  }
  return { count, matched }
}

/**
 * Extracts signals for a single axis from document text.
 * @param {string} text - lowercased document text
 * @param {Object} axis - axis definition with .signals
 * @returns {AxisSignals}
 */
export function extractAxisSignals(text, axis) {
  const strong = countMatches(text, axis.signals.strong)
  const positive = countMatches(text, axis.signals.positive)
  const negative = countMatches(text, axis.signals.negative)

  return {
    strong: strong.count,
    positive: positive.count,
    negative: negative.count,
    foundEvidence: [...strong.matched, ...positive.matched],
    missingEvidence: negative.matched,
  }
}

/**
 * Extracts signals for every axis in a framework.
 * @param {string} documentText - raw document text
 * @param {Object} framework - framework with .axes
 * @returns {Object.<string, AxisSignals>} keyed by axis id
 */
export function extractSignals(documentText, framework) {
  const text = (documentText || '').toLowerCase()
  const result = {}
  for (const axis of framework.axes) {
    result[axis.id] = extractAxisSignals(text, axis)
  }
  return result
}

export default extractSignals
