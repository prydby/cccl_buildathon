import { useState, useCallback, useRef } from 'react'
import { createLLMRouter } from '../engine/llmRouter.js'
import { createScorer } from '../engine/scorer.js'
import { dimensions } from '../engine/dimensions.js'
import acmeFixture from '../fixtures/acme.json'

/**
 * Custom hook for scoring companies.
 * Creates router + scorer on first use, manages loading/error state.
 */
export default function useScorer() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  // Stable references — don't recreate on every render
  const routerRef = useRef(null)
  const scorerRef = useRef(null)

  if (!routerRef.current) {
    routerRef.current = createLLMRouter({
      provider: 'mock',
      mockFixture: acmeFixture.scores,
    })
  }

  if (!scorerRef.current) {
    scorerRef.current = createScorer(routerRef.current, dimensions)
  }

  const score = useCallback(async (intake) => {
    setIsLoading(true)
    setError(null)

    try {
      // Add a small delay in mock mode to simulate real API call (sells the UX)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const scorecard = await scorerRef.current.score(intake)
      setResult(scorecard)
      return scorecard
    } catch (err) {
      setError(err.message || 'Scoring failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    score,
    isLoading,
    error,
    result,
    reset,
    tokenUsage: routerRef.current?.getTokenUsage(),
  }
}
