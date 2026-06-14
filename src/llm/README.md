# llm — LLM Enhancement Layer (Optional)

Provider-agnostic LLM integration. The **core engine works without this** (deterministic mode). This layer exists to optionally augment assessments with LLM reasoning when an API key is available.

## Modules

| File | Pattern | Responsibility |
|---|---|---|
| `router.js` | Strategy | `createLLMRouter({ provider })` — Mock / OpenAI / Anthropic behind one interface. Token tracking, exponential-backoff retry, typed errors (RateLimitError, APIError, TimeoutError). |
| `sessionStore.js` | Repository | In-memory keyed store for assessment history. Swap for Redis/DB by changing only this file. |

## Why It's Separate

- The deterministic core is the source of truth — explainable, testable, free.
- LLM is an *enhancement*, not a dependency. The product never breaks if the API is down.
- Clean boundary: swapping providers or removing LLM entirely touches only this folder.

## Usage

```js
import { createLLMRouter } from '@/llm/router.js'

const router = createLLMRouter({ provider: 'mock' })       // no key needed
// const router = createLLMRouter({ provider: 'anthropic', apiKey })

const { text, inputTokens, outputTokens } = await router.complete(prompt)
router.getTokenUsage()  // cumulative tracking
```
