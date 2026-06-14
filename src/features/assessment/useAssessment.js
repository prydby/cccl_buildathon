import { useState, useCallback } from 'react'
import { runAssessment } from '../../core/index.js'

/**
 * useAssessment — React binding for the core assessment engine.
 *
 * Wraps the pure `runAssessment` pipeline with loading/error state and a
 * small artificial delay so the progressive loading UI can play.
 *
 * @returns {{
 *   assess: (intake) => Promise<Assessment>,
 *   isLoading: boolean,
 *   error: string|null,
 *   assessment: Assessment|null,
 *   reset: () => void
 * }}
 */
export default function useAssessment() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [assessment, setAssessment] = useState(null)

  const assess = useCallback(async (intake) => {
    setIsLoading(true)
    setError(null)
    try {
      // Core engine is synchronous + instant; delay drives the loading animation.
      await new Promise((r) => setTimeout(r, 1800))
      const result = runAssessment(intake)
      setAssessment(result)
      return result
    } catch (err) {
      setError(err.message || 'Assessment failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setAssessment(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return { assess, isLoading, error, assessment, reset }
}
