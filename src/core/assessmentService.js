/**
 * Assessment Service — Orchestration Layer
 *
 * The single entry point for running a production-readiness assessment.
 * Pipeline:  intake → select framework → score → TRL/verdict → gap analysis
 *
 * Pure, synchronous, deterministic. No network, no React. Fully testable.
 * @module core/assessmentService
 */

import { selectFramework } from './frameworks.js'
import { scoreDocument } from './scorer.js'
import { calculateTRL } from './trlCalculator.js'
import { analyzeGaps } from './gapAnalyzer.js'
import { generateNarrative } from './narrativeGenerator.js'

/**
 * @typedef {Object} Intake
 * @property {string} name - product/system name
 * @property {string} productType - drives framework selection
 * @property {string} document - the BRD/PRD/system description text
 * @property {string} [state] - current lifecycle state
 * @property {string} [scaleTarget] - scale ambition
 */

/**
 * @typedef {Object} Assessment
 * @property {Intake} intake
 * @property {Object} framework - selected framework metadata
 * @property {Object} scorecard - { dimensions, overall, timestamp }
 * @property {Object} trl - { level, label, verdict, verdictReason, ... }
 * @property {Object} gaps - { gaps, blocking, warnings, roadmap }
 */

/**
 * Runs a complete assessment.
 * @param {Intake} intake
 * @returns {Assessment}
 */
export function runAssessment(intake) {
  if (!intake || !intake.name) {
    throw new Error('Intake requires a "name"')
  }
  if (!intake.document || intake.document.trim().length < 20) {
    throw new Error('Intake requires a "document" with at least 20 characters')
  }

  const framework = selectFramework(intake.productType)
  const scorecard = scoreDocument(intake.document, framework)
  const trl = calculateTRL(scorecard)
  const gaps = analyzeGaps(scorecard)
  const narrative = generateNarrative({ intake, scorecard, trl, gaps })

  return { intake, framework, scorecard, trl, gaps, narrative }
}

export default runAssessment
