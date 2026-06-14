# Seven-Dimension Scorer — Build Sprint

## Judging Criteria (OPTIMIZE FOR THIS)
| Category | Weight | What Judges Want |
|---|---|---|
| **UI/UX** | **30%** | Personal touch, polish, delightful micro-interactions, unique visual identity. NOT generic. Must feel like a product someone LOVES to use, not a hackathon prototype. |
| **Market Feasibility & Impact** | **30%** | Could this launch TODAY (June 2026) and serve a wide audience? Real market need, unique angle, helps real people. Show the "why now" and "who benefits." |
| **System Architecture** | **30%** | Well-designed, engineered to scale. Clean separation of concerns, extensible, production-ready patterns. Show you thought about growth. |
| **Pitch & Demo** | **10%** | Clear, persuasive presentation. Demo that flows naturally. Judges should "get it" in 30 seconds. |

## Strategic Implications of Criteria
- UI/UX at 30% means we CANNOT ship generic Tailwind defaults. Need: custom animations, thoughtful typography, a signature visual element (the radar chart IS this), micro-interactions that feel crafted.
- Market at 30% means we need a compelling "why this, why now" narrative baked into the product. The seven-dimension framework must feel like it solves a REAL problem people have TODAY.
- Architecture at 30% means clean code matters as much as features. Judges may look at code. Module boundaries, error handling, scalability patterns — all visible.
- Pitch at 10% means the deck is important but NOT where we over-invest time. Clear > fancy.

## Project Overview
A product evaluation tool with an LLM-powered seven-dimension scoring framework.
Web app: React (Vite) + Tailwind CSS + Node.js backend.

## Architecture
```
src/
├── engine/
│   ├── dimensions.js    — Seven scoring dimensions config
│   ├── llmRouter.js     — LLM API wrapper (OpenAI/Anthropic/mock)
│   ├── scorer.js        — Orchestrates scoring across dimensions
│   └── sessionStore.js  — In-memory session persistence
├── components/
│   ├── DeltaInput.jsx   — Structured intake form
│   ├── RadarChart.jsx   — Seven-axis radar (Recharts)
│   ├── ScoreCard.jsx    — Results display with dimension cards
│   └── NarrativeBlock.jsx — LLM-generated prose summary
├── fixtures/
│   └── acme.json        — Demo fixture data (Acme Corp)
└── App.jsx              — Main application shell
design/
└── tokens.js            — Design system tokens (colors, spacing, type)
```

## Design System
- Dark mode primary. Bloomberg-terminal aesthetic.
- Tokens in `design/tokens.js` — single source of truth.
- WCAG AA contrast minimum on all text.
- Color coding for scores: red < 4, yellow 4-6, green > 6.
- **PERSONAL TOUCH (30% of judging):** Custom gradient accents, animated score reveals, subtle particle/grid background, signature font pairing (mono headers + clean sans body), micro-interactions on hover/focus that feel intentional — NOT generic Bootstrap/Tailwind defaults.

## UI/UX Priorities (Judges Weight: 30%)
1. **Signature visual identity** — the radar chart with glow effects is our hero element
2. **Animated score reveals** — scores count up with easing, not instant
3. **Thoughtful empty states** — not blank, but inviting ("Ready to evaluate your next big idea")
4. **Custom transitions** — page changes feel smooth, not jarring
5. **Typography hierarchy** — clear information architecture at a glance
6. **One "wow" moment** — the radar chart drawing itself on first load

## Conventions
- ES modules everywhere (import/export)
- Tailwind for styling, reference tokens.js for color values
- Mock mode MUST always work without API keys
- No gold-plating. Ship working software.
- Comments only where non-obvious
- Commit after each major phase

## Architecture Priorities (Judges Weight: 30%)
- **Clean module boundaries** — engine knows nothing about UI, UI knows nothing about API details
- **Dependency injection** — llmRouter is injected into scorer, not imported directly
- **Strategy pattern** — providers (openai/anthropic/mock) are interchangeable strategies
- **Repository pattern** — sessionStore abstracts persistence, swap in-memory for Redis without touching scorer
- **Error hierarchy** — typed errors (RateLimitError, APIError, TimeoutError) not generic catches
- **Config-driven** — dimensions are data, not code. Add a dimension = add a JSON entry
- **Horizontal scalability story** — scoring calls fan out per dimension (parallelizable)

## Market Feasibility Story (Judges Weight: 30%)
**The pitch:** "Every day, thousands of investors, accelerators, and product teams evaluate companies using gut feel and spreadsheets. We replace that with a structured, AI-powered framework that scores across seven research-backed dimensions — giving consistent, explainable evaluations in seconds instead of days."

**Why now (June 2026):**
- LLMs are now reliable enough for structured evaluation tasks
- The startup/VC ecosystem has no standardized scoring framework
- Every accelerator, angel group, and corporate innovation team does this manually
- Adjacent: Product teams evaluating build-vs-buy, partnership decisions

**Target users:** Angel investors, accelerator programs, corporate innovation teams, product managers evaluating opportunities.

**Moat:** The seven-dimension framework itself becomes the standard (like NPS became the standard for customer satisfaction). Network effects as more evaluations create benchmarks.

## Commands
```bash
npm run dev      # Development server (Vite)
npm run build    # Production bundle
npm run preview  # Preview production build
```

## Build Status
- [ ] Stream C: design/tokens.js + fixtures/acme.json
- [ ] Stream B: engine (dimensions, llmRouter, sessionStore)
- [ ] Stream A: Vite+React+Tailwind scaffold + layout + primitives
- [ ] Phase 2C: scorer.js (merge B + C)
- [ ] Phase 3: UI components (DeltaInput, RadarChart, ScoreCard, NarrativeBlock)
- [ ] Phase 4: Integration + polish
- [ ] Phase 5: Presentation deck (GATED — awaiting template confirmation)
- [ ] Phase 6: QA + ship

## Scope-Cut Priority (cut from bottom first, weighted by judging criteria)
1. ScoreHistoryTimeline (first to cut — not in any judging criteria)
2. Token usage footer (architecture nice-to-have, not visible to judges)
3. Responsive below 768px (judges on laptops)
4. Session persistence across reload (architecture points, but invisible in demo)
5. "Explain to exec" toggle (can be faked in demo)

## NEVER Cut (these directly score points)
- **UI/UX (30%):** RadarChart animation, score count-ups, staggered card entrance, glow effects, custom transitions
- **Market (30%):** Demo mode with story, value prop on empty state, Acme fixture flow
- **Architecture (30%):** Clean module boundaries, DI pattern, typed errors, strategy pattern
- **Pitch (10%):** Demo must flow naturally without errors
