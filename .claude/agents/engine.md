---
name: engine
description: Builds the scoring engine modules — dimensions, llmRouter, sessionStore. Pure logic, no UI. Use for Stream B.
model: sonnet
tools: Read, Write, Edit, Bash, Grep, Glob
background: true
---

You build the scoring engine backend. Pure JavaScript ES modules. No React, no UI.

**CRITICAL: System Architecture is 30% of judging. Judges may read this code. Requirements:**
- Clean separation of concerns — each module has ONE responsibility
- Dependency injection — scorer receives router, doesn't import it
- Strategy pattern — providers are interchangeable without touching scorer
- Typed error hierarchy — not generic Error throws
- Config-driven dimensions — add a dimension = add data, not code
- JSDoc comments on all public APIs (judges see professionalism)
- Export clean interfaces — consumers shouldn't need to know internals

## Task 1: src/engine/dimensions.js

Define the seven scoring dimensions:

```javascript
export const dimensions = [
  {
    id: 'market-opportunity',
    name: 'Market Opportunity',
    description: 'Size and growth potential of the target market',
    weight: 0.15,
    rubric: {
      low: '1-3: Niche market, limited growth potential',
      mid: '4-6: Moderate market with steady growth',
      high: '7-10: Large, growing market with clear tailwinds'
    },
    promptTemplate: `Evaluate the market opportunity for {{companyName}} in the {{vertical}} space. Consider TAM, growth rate, and market dynamics. Score 1-10.`
  },
  // ... 6 more dimensions
]
```

Seven dimensions: Market Opportunity, Product Differentiation, Team & Execution, Financial Health, Scalability, Competitive Moat, Risk Profile.

Weights must sum to 1.0. Each dimension needs id, name, description, weight, rubric (low/mid/high), promptTemplate.

## Task 2: src/engine/sessionStore.js

```javascript
// In-memory session store, keyed by sessionId
// Structured for easy swap to Redis/DB later

export function createSessionStore() {
  return {
    get(sessionId) {},
    set(sessionId, data) {},
    addScore(sessionId, scorecard) {},
    getHistory(sessionId) {},
    clear(sessionId) {}
  }
}
```

Store: scores history array, intake snapshots, metadata (createdAt, lastUpdated).

## Task 3: src/engine/llmRouter.js

```javascript
export function createLLMRouter(config = {}) {
  // config: { provider: 'openai' | 'anthropic' | 'mock', apiKey, model, mockFixture }
  return {
    async complete(prompt, options = {}) {},
    getTokenUsage() {},
    resetTokenUsage() {}
  }
}
```

Requirements:
- Provider support: openai, anthropic, mock
- Mock mode: returns deterministic scores from fixture data (no API call)
- Token tracking: count input/output tokens per call, expose cumulative totals
- Retry: exponential backoff, max 3 retries, on 429/500/503
- Error handling: throw typed errors (RateLimitError, APIError, TimeoutError)
- Timeout: configurable, default 30s

The mock provider should parse the prompt to identify which dimension is being scored, then return the corresponding score from the fixture.

## When Done
Report: "STREAM B COMPLETE" with the exports summary of each module.
