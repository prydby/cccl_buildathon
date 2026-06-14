/**
 * LLM Router — Provider-agnostic AI inference layer
 * Strategy pattern: swap providers without touching scorer logic.
 * Supports: OpenAI, Anthropic, Mock (deterministic from fixture)
 * @module llmRouter
 */

// ─── Typed Errors ────────────────────────────────────────────────

export class LLMError extends Error {
  constructor(message, { provider, statusCode, retryable } = {}) {
    super(message)
    this.name = 'LLMError'
    this.provider = provider
    this.statusCode = statusCode
    this.retryable = retryable || false
  }
}

export class RateLimitError extends LLMError {
  constructor(provider) {
    super(`Rate limit exceeded for ${provider}`, {
      provider,
      statusCode: 429,
      retryable: true,
    })
    this.name = 'RateLimitError'
  }
}

export class APIError extends LLMError {
  constructor(message, provider, statusCode) {
    super(message, {
      provider,
      statusCode,
      retryable: [500, 502, 503].includes(statusCode),
    })
    this.name = 'APIError'
  }
}

export class TimeoutError extends LLMError {
  constructor(provider, timeoutMs) {
    super(`Request to ${provider} timed out after ${timeoutMs}ms`, {
      provider,
      retryable: true,
    })
    this.name = 'TimeoutError'
  }
}

// ─── Token Tracking ──────────────────────────────────────────────

function createTokenTracker() {
  let totalInput = 0
  let totalOutput = 0
  let callCount = 0

  return {
    track(inputTokens, outputTokens) {
      totalInput += inputTokens
      totalOutput += outputTokens
      callCount++
    },
    getUsage() {
      return {
        totalInputTokens: totalInput,
        totalOutputTokens: totalOutput,
        totalTokens: totalInput + totalOutput,
        callCount,
      }
    },
    reset() {
      totalInput = 0
      totalOutput = 0
      callCount = 0
    },
  }
}

// ─── Provider Strategies ─────────────────────────────────────────

/**
 * Mock provider — returns deterministic scores from fixture data.
 * Parses dimension name from prompt, looks up in fixture.
 */
function createMockProvider(mockFixture) {
  return async (prompt) => {
    // Identify which dimension is being scored by matching name in prompt
    // Support both { scores: { dimensions: [...] } } and { dimensions: [...] } shapes
    const dimensions = mockFixture?.dimensions || mockFixture?.scores?.dimensions || []

    // Normalize for matching: replace & with "and", collapse whitespace
    const normalizedPrompt = prompt.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ')
    const matchedDimension = dimensions.find((d) => {
      const normalizedName = d.name.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ')
      return normalizedPrompt.includes(normalizedName)
    })

    if (matchedDimension) {
      const response = JSON.stringify({
        score: matchedDimension.score,
        reasoning: matchedDimension.reasoning,
        confidence: matchedDimension.confidence,
      })
      // Estimate tokens (roughly 4 chars per token)
      const inputTokens = Math.ceil(prompt.length / 4)
      const outputTokens = Math.ceil(response.length / 4)
      return { text: response, inputTokens, outputTokens }
    }

    // Fallback: return a generic mid-range score
    const fallback = JSON.stringify({
      score: 5.0,
      reasoning: 'Unable to determine specific dimension context.',
      confidence: 0.5,
    })
    return {
      text: fallback,
      inputTokens: Math.ceil(prompt.length / 4),
      outputTokens: Math.ceil(fallback.length / 4),
    }
  }
}

/**
 * OpenAI provider — calls GPT models via chat completions API
 */
function createOpenAIProvider(apiKey, model = 'gpt-4o') {
  return async (prompt, timeoutMs = 30000) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (response.status === 429) throw new RateLimitError('openai')
      if (!response.ok) throw new APIError(`OpenAI API error`, 'openai', response.status)

      const data = await response.json()
      return {
        text: data.choices[0].message.content,
        inputTokens: data.usage?.prompt_tokens || 0,
        outputTokens: data.usage?.completion_tokens || 0,
      }
    } catch (err) {
      clearTimeout(timeout)
      if (err.name === 'AbortError') throw new TimeoutError('openai', timeoutMs)
      if (err instanceof LLMError) throw err
      throw new APIError(err.message, 'openai', 500)
    }
  }
}

/**
 * Anthropic provider — calls Claude models via messages API
 */
function createAnthropicProvider(apiKey, model = 'claude-sonnet-4-20250514') {
  return async (prompt, timeoutMs = 30000) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (response.status === 429) throw new RateLimitError('anthropic')
      if (!response.ok) throw new APIError(`Anthropic API error`, 'anthropic', response.status)

      const data = await response.json()
      return {
        text: data.content[0].text,
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0,
      }
    } catch (err) {
      clearTimeout(timeout)
      if (err.name === 'AbortError') throw new TimeoutError('anthropic', timeoutMs)
      if (err instanceof LLMError) throw err
      throw new APIError(err.message, 'anthropic', 500)
    }
  }
}

// ─── Retry Logic ─────────────────────────────────────────────────

/**
 * Exponential backoff retry wrapper
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Max attempts (default: 3)
 * @returns {Promise<*>}
 */
async function withRetry(fn, maxRetries = 3) {
  let lastError
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (!err.retryable || attempt === maxRetries - 1) throw err
      const delay = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw lastError
}

// ─── Router Factory ──────────────────────────────────────────────

/**
 * Creates an LLM router instance with the specified provider strategy.
 * @param {Object} config
 * @param {'openai'|'anthropic'|'mock'} config.provider - Which LLM provider to use
 * @param {string} [config.apiKey] - API key (required for openai/anthropic)
 * @param {string} [config.model] - Model name override
 * @param {Object} [config.mockFixture] - Fixture data for mock provider
 * @param {number} [config.timeout] - Request timeout in ms (default: 30000)
 * @param {number} [config.maxRetries] - Max retry attempts (default: 3)
 * @returns {Object} Router interface
 */
export function createLLMRouter(config = {}) {
  const {
    provider = 'mock',
    apiKey,
    model,
    mockFixture,
    timeout = 30000,
    maxRetries = 3,
  } = config

  // Select provider strategy
  let providerFn
  switch (provider) {
    case 'openai':
      if (!apiKey) throw new Error('API key required for OpenAI provider')
      providerFn = createOpenAIProvider(apiKey, model)
      break
    case 'anthropic':
      if (!apiKey) throw new Error('API key required for Anthropic provider')
      providerFn = createAnthropicProvider(apiKey, model)
      break
    case 'mock':
      providerFn = createMockProvider(mockFixture)
      break
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }

  const tokenTracker = createTokenTracker()

  return {
    /**
     * Send a prompt to the configured LLM provider
     * @param {string} prompt - The prompt to send
     * @param {Object} [options] - Override options for this call
     * @param {number} [options.timeout] - Custom timeout for this call
     * @returns {Promise<{text: string, inputTokens: number, outputTokens: number}>}
     */
    async complete(prompt, options = {}) {
      const callTimeout = options.timeout || timeout

      const result = await withRetry(
        () => providerFn(prompt, callTimeout),
        maxRetries
      )

      tokenTracker.track(result.inputTokens, result.outputTokens)
      return result
    },

    /**
     * Get cumulative token usage across all calls
     * @returns {{totalInputTokens: number, totalOutputTokens: number, totalTokens: number, callCount: number}}
     */
    getTokenUsage() {
      return tokenTracker.getUsage()
    },

    /**
     * Reset token counters to zero
     */
    resetTokenUsage() {
      tokenTracker.reset()
    },

    /**
     * Get the current provider name
     * @returns {string}
     */
    getProvider() {
      return provider
    },
  }
}

export default createLLMRouter
