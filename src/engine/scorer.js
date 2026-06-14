/**
 * Scorer — Orchestrates multi-dimension evaluation
 * Dependency injection: receives router and dimensions, owns no infrastructure.
 * Fan-out pattern: scores all dimensions in parallel for horizontal scalability.
 * @module scorer
 */

/**
 * @typedef {Object} DimensionResult
 * @property {string} name - Dimension name
 * @property {number|null} score - Score 1-10, null if failed
 * @property {string} reasoning - Explanation of the score
 * @property {number} confidence - Confidence level 0-1
 * @property {boolean} [failed] - True if scoring failed for this dimension
 */

/**
 * @typedef {Object} Scorecard
 * @property {DimensionResult[]} dimensions - Individual dimension results
 * @property {number} overall - Weighted overall score
 * @property {string} timestamp - ISO timestamp of evaluation
 * @property {boolean} [stale] - True if result came from cache
 */

/**
 * Parses LLM response text into structured score data.
 * Handles both JSON and natural language responses.
 * @param {string} text - Raw LLM response
 * @returns {{score: number, reasoning: string, confidence: number}}
 */
function parseResponse(text) {
  // Try JSON parse first (mock provider returns JSON directly)
  try {
    const parsed = JSON.parse(text)
    if (parsed.score !== undefined) {
      return {
        score: Math.min(10, Math.max(1, Number(parsed.score))),
        reasoning: parsed.reasoning || '',
        confidence: parsed.confidence || 0.7,
      }
    }
  } catch {
    // Not JSON, try natural language extraction
  }

  // Extract score from natural language (look for patterns like "Score: 7.5" or "7.5/10")
  const scorePatterns = [
    /(?:score|rating)[:\s]*(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*\/\s*10/i,
    /(\d+(?:\.\d+)?)\s*out of\s*10/i,
  ]

  let score = 5.0 // default fallback
  for (const pattern of scorePatterns) {
    const match = text.match(pattern)
    if (match) {
      score = Math.min(10, Math.max(1, parseFloat(match[1])))
      break
    }
  }

  // Extract reasoning (first substantial sentence or paragraph)
  const sentences = text.split(/[.!]\s+/).filter((s) => s.length > 20)
  const reasoning = sentences.slice(0, 2).join('. ') + '.'

  return { score, reasoning, confidence: 0.7 }
}

/**
 * Interpolates template variables in a prompt
 * @param {string} template - Prompt template with {{var}} placeholders
 * @param {Object} intake - Data to fill into template
 * @returns {string}
 */
function buildPrompt(template, intake) {
  let prompt = template
  const flatData = {
    companyName: intake.companyName || '',
    vertical: intake.vertical || '',
    stage: intake.stage || '',
    description: intake.description || '',
    metrics: JSON.stringify(intake.metrics || {}),
    arr: intake.metrics?.arr || 'N/A',
    growth: intake.metrics?.growth || 'N/A',
    nrr: intake.metrics?.nrr || 'N/A',
    customers: intake.metrics?.customers || 'N/A',
    teamSize: intake.metrics?.teamSize || 'N/A',
  }

  for (const [key, value] of Object.entries(flatData)) {
    prompt = prompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value))
  }

  return prompt
}

/**
 * Creates a scorer instance with injected dependencies.
 * @param {Object} llmRouter - LLM router instance (from createLLMRouter)
 * @param {Object[]} dimensions - Dimension definitions (from dimensions.js)
 * @returns {Object} Scorer interface
 */
export function createScorer(llmRouter, dimensions) {
  if (!llmRouter) throw new Error('llmRouter is required')
  if (!dimensions || dimensions.length === 0) throw new Error('dimensions array is required')

  return {
    /**
     * Score intake data across all dimensions.
     * Fan-out pattern: all dimensions evaluated in parallel.
     * @param {Object} intake - Company/product intake data
     * @returns {Promise<Scorecard>}
     */
    async score(intake) {
      if (!intake || !intake.companyName) {
        throw new Error('intake with companyName is required')
      }

      // Fan out scoring calls in parallel (horizontally scalable)
      const results = await Promise.allSettled(
        dimensions.map(async (dimension) => {
          const prompt = buildPrompt(dimension.promptTemplate, intake)
          try {
            const response = await llmRouter.complete(prompt)
            const parsed = parseResponse(response.text)
            return {
              name: dimension.name,
              score: parsed.score,
              reasoning: parsed.reasoning,
              confidence: parsed.confidence,
            }
          } catch (err) {
            // Individual dimension failure doesn't kill the whole scorecard
            return {
              name: dimension.name,
              score: null,
              reasoning: `Scoring failed: ${err.message}`,
              confidence: 0,
              failed: true,
            }
          }
        })
      )

      // Extract results from Promise.allSettled
      const dimensionResults = results.map((r) =>
        r.status === 'fulfilled'
          ? r.value
          : { name: 'Unknown', score: null, reasoning: 'Unexpected failure', confidence: 0, failed: true }
      )

      // Calculate weighted overall score (excluding failed dimensions)
      const validDimensions = dimensionResults.filter((d) => d.score !== null)
      let overall = 0

      if (validDimensions.length > 0) {
        const totalWeight = dimensions
          .filter((d) => {
            const result = dimensionResults.find((r) => r.name === d.name)
            return result && result.score !== null
          })
          .reduce((sum, d) => sum + d.weight, 0)

        overall = dimensions.reduce((sum, d) => {
          const result = dimensionResults.find((r) => r.name === d.name)
          if (!result || result.score === null) return sum
          return sum + (result.score * d.weight) / totalWeight
        }, 0)
      }

      return {
        dimensions: dimensionResults,
        overall: Math.round(overall * 100) / 100,
        timestamp: new Date().toISOString(),
      }
    },

    /**
     * Score with cache fallback — returns stale data on failure.
     * @param {Object} intake - Company/product intake data
     * @param {Object} sessionStore - Session store instance
     * @param {string} sessionId - Current session ID
     * @returns {Promise<Scorecard>}
     */
    async scoreWithCache(intake, sessionStore, sessionId) {
      try {
        const scorecard = await this.score(intake)

        // Cache the successful result
        if (sessionStore && sessionId) {
          sessionStore.addScore(sessionId, scorecard)
        }

        return scorecard
      } catch (err) {
        // Attempt cache fallback
        if (sessionStore && sessionId) {
          const cached = sessionStore.getLatest(sessionId)
          if (cached) {
            return { ...cached, stale: true }
          }
        }
        throw err
      }
    },
  }
}

export default createScorer
