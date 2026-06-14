/**
 * Core Assessment Engine — Public API
 *
 * Import from here, not individual files:
 *   import { runAssessment, selectFramework } from '@/core'
 *
 * @module core
 */

export { runAssessment } from './assessmentService.js'
export { selectFramework, FRAMEWORKS, AXIS_LIBRARY } from './frameworks.js'
export { scoreDocument } from './scorer.js'
export { extractSignals, extractAxisSignals } from './signalExtractor.js'
export { calculateTRL } from './trlCalculator.js'
export { analyzeGaps } from './gapAnalyzer.js'
export { generateNarrative } from './narrativeGenerator.js'
