/**
 * Deterministic Scorer
 *
 * Converts extracted signals into per-axis scores (1-10).
 * This is a REAL assessment — the score reflects what evidence the
 * document actually contains, not a fixture lookup.
 *
 * Scoring model per axis:
 *   baseline 5.0 (neutral — "unknown")
 *   + strong signals   × 1.3 each
 *   + positive signals × 0.6 each
 *   − negative signals × 1.8 each   (explicit gaps weigh heavily)
 *   clamped to [1, 10]
 *
 * Confidence reflects how much evidence was found (more = higher).
 *
 * @module core/scorer
 */

import { extractSignals } from './signalExtractor.js'

const BASELINE = 5.0
const STRONG_WEIGHT = 1.3
const POSITIVE_WEIGHT = 0.6
const NEGATIVE_WEIGHT = 1.8

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const round1 = (n) => Math.round(n * 10) / 10

/**
 * Scores a single axis from its signals.
 * @param {Object} axis - axis definition (name, framework, benchmark, remediation)
 * @param {Object} signals - { strong, positive, negative, foundEvidence, missingEvidence }
 * @returns {Object} axis result
 */
function scoreAxis(axis, signals) {
  const raw =
    BASELINE +
    signals.strong * STRONG_WEIGHT +
    signals.positive * POSITIVE_WEIGHT -
    signals.negative * NEGATIVE_WEIGHT

  const score = round1(clamp(raw, 1, 10))

  // Confidence: more total signals → more confident. Caps at 0.95.
  const totalSignals = signals.strong + signals.positive + signals.negative
  const confidence = round1(clamp(0.4 + totalSignals * 0.12, 0.4, 0.95))

  return {
    id: axis.id,
    name: axis.name,
    icon: axis.icon,
    framework: axis.framework,
    weight: axis.weight,
    score,
    confidence,
    reasoning: buildReasoning(axis, signals, score),
    foundEvidence: signals.foundEvidence,
    missingEvidence: signals.missingEvidence,
    benchmark: axis.benchmark,
  }
}

/**
 * Generates human-readable reasoning from signals.
 */
function buildReasoning(axis, signals, score) {
  const parts = []

  if (signals.foundEvidence.length > 0) {
    const top = signals.foundEvidence.slice(0, 4).join(', ')
    parts.push(`Evidence found: ${top}.`)
  } else {
    parts.push(`No clear evidence found in the document for this axis.`)
  }

  if (signals.missingEvidence.length > 0) {
    parts.push(`Explicit gaps stated: ${signals.missingEvidence.slice(0, 3).join(', ')}.`)
  }

  if (score >= 7.5) parts.push('Meets production-readiness bar.')
  else if (score >= 5.5) parts.push('Partial readiness — improvements recommended before scale.')
  else parts.push('Below readiness threshold — this is a blocking concern.')

  return parts.join(' ')
}

/**
 * Runs a full assessment from document text + framework.
 * Pure function — no I/O, fully deterministic, instantly testable.
 *
 * @param {string} documentText - the product document / description
 * @param {Object} framework - selected framework (with .axes)
 * @returns {Object} scorecard { dimensions, overall, timestamp }
 */
export function scoreDocument(documentText, framework) {
  const signalsByAxis = extractSignals(documentText, framework)

  const dimensions = framework.axes.map((axis) =>
    scoreAxis(axis, signalsByAxis[axis.id])
  )

  // Weighted overall (weights sum to 1.0 within a framework)
  const totalWeight = framework.axes.reduce((s, a) => s + a.weight, 0)
  const overall = round1(
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0) / totalWeight
  )

  return {
    framework: { id: framework.id, name: framework.name, sources: framework.sources },
    dimensions,
    overall,
    timestamp: new Date().toISOString(),
  }
}

export default scoreDocument
