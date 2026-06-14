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
 * Negation words that flip a positive/strong signal into a gap when they
 * immediately precede the keyword (within a short window).
 */
const NEGATIONS = ['no ', 'not ', 'without ', 'lack of ', 'lacks ', 'missing ', 'never ', "don't ", 'dont ', 'zero ', 'absent ']

/**
 * Returns true if the keyword occurrence at `index` is negated by a
 * preceding negation word within `window` characters.
 */
function isNegated(text, index, window = 18) {
  const start = Math.max(0, index - window)
  const preceding = text.slice(start, index)
  return NEGATIONS.some((neg) => preceding.includes(neg))
}

/**
 * Counts keyword occurrences, separating genuine hits from negated ones.
 * "distributed tracing" → positive hit
 * "no distributed tracing" → negated (treated as a stated gap)
 * @param {string} text - lowercased document text
 * @param {string[]} keywords
 * @returns {{count: number, matched: string[], negated: string[]}}
 */
function countMatches(text, keywords) {
  let count = 0
  const matched = []
  const negated = []
  for (const kw of keywords) {
    const needle = kw.toLowerCase()
    const idx = text.indexOf(needle)
    if (idx !== -1) {
      if (isNegated(text, idx)) {
        negated.push(kw)
      } else {
        count++
        matched.push(kw)
      }
    }
  }
  return { count, matched, negated }
}

/**
 * Extracts signals for a single axis from document text.
 * Negated positive/strong keywords are reclassified as stated gaps.
 * @param {string} text - lowercased document text
 * @param {Object} axis - axis definition with .signals
 * @returns {AxisSignals}
 */
export function extractAxisSignals(text, axis) {
  const strong = countMatches(text, axis.signals.strong)
  const positive = countMatches(text, axis.signals.positive)
  const negative = countMatches(text, axis.signals.negative)

  // Negated strong/positive keywords count as additional stated gaps.
  const negatedAsGaps = [...strong.negated, ...positive.negated]

  return {
    strong: strong.count,
    positive: positive.count,
    negative: negative.count + negatedAsGaps.length,
    foundEvidence: [...strong.matched, ...positive.matched],
    missingEvidence: [...negative.matched, ...negatedAsGaps.map((k) => `no ${k}`)],
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
