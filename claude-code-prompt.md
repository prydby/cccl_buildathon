# Build Prompt — Competition Sprint (Parallelized)

You are my build partner for a hackathon/competition sprint. We are building a product evaluation tool with an LLM-powered seven-dimension scoring framework. The deadline is 4:00 PM today. No extensions. Ship or die.

## Execution Model — Parallel Subagent Architecture

This build uses **parallel work streams** to cut wall-clock time. You are the **orchestrator**. You delegate to subagents (or execute parallel tasks yourself) wherever dependencies allow.

### Dependency Graph

```
Phase 1A (Scaffold)  ──┐
                       ├──→ Phase 3A (UI Components) ──┐
Phase 1B (Tokens/DS) ──┘                               │
                                                        ├──→ Phase 4 (Integration) → Phase 6 (QA)
Phase 2A (Engine Core) ──┐                              │
                         ├──→ Phase 2C (Scorer+Fixture)─┘
Phase 2B (LLM Router) ──┘

Phase 5 (Deck) ── runs independently after Phase 4, GATED on my template confirmation
```

### What Can Run in Parallel

| Time Slot | Stream A (Frontend) | Stream B (Engine) | Stream C (Assets) |
|---|---|---|---|
| 0:00–0:25 | 1A: Vite+React+Tailwind scaffold | 2A: dimensions.js + sessionStore.js | 1B: design/tokens.js |
| 0:00–0:25 | 1A: Layout shell + primitives | 2B: llmRouter.js (full impl) | 2C-prep: acme.json fixture |
| 0:25–0:50 | 3A: DeltaInput + RadarChart | 2C: scorer.js (wires 2A+2B) | 3B: NarrativeBlock + ScoreCard |
| 0:50–1:10 | 3C: ScoreHistoryTimeline (if time) | — merges into Stream A — | — merges into Stream A — |
| 1:10–1:40 | Phase 4: Full integration + polish | | |
| 1:40–2:10 | Phase 5: Deck (GATED) | | |
| 2:10–2:25 | Phase 6: QA + Ship | | |

**Total wall-clock: ~2h 25min** (down from ~3h 15min sequential)

---

## Architecture Overview

The product is a web application that:
- Takes intake data about a product/company (via a structured input form)
- Routes it through an LLM pipeline that scores across seven dimensions
- Renders results as a visual scorecard with radar chart, narrative blocks, and actionable insights
- Supports session persistence and demo mode with fixture data

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, custom design tokens (dark Bloomberg-terminal aesthetic)
- **Backend:** Node.js, Express
- **LLM Routing:** Abstracted `llmRouter.js` that wraps all API calls (supports token counting, fallback, caching)
- **State:** `sessionStore.js` keyed by sessionId
- **Charts:** Recharts (radar chart for seven dimensions, sparklines for history)
- **Fixture Data:** Acme Corp demo dataset for deterministic demo mode

## Design System

- Dark mode primary. High contrast. Bloomberg-terminal inspired.
- Tokens live in `design/tokens.js` — single source of truth for colors, spacing, typography.
- Color contrast passes WCAG AA minimum.
- Components: ScoreCard, RadarChart, NarrativeBlock, DeltaInput, ScoreHistoryTimeline.

---

## Parallel Phase Definitions

### STREAM A — Frontend Scaffold (Phase 1A)

**Target: 25 min | No dependencies**

1. Initialize project: Vite + React + Tailwind
2. Create base layout shell (App.jsx, Sidebar, MainContent areas)
3. Create reusable UI primitives: Button, Card, Badge, Input, TextArea
4. Wire in tokens from `design/tokens.js` (created by Stream C)
5. Confirm: app runs, dark mode renders, layout shell is responsive

### STREAM B — Engine Core (Phase 2A + 2B, parallel)

**Target: 25 min | No dependencies**

**Subagent B1 — Dimensions + SessionStore (Phase 2A):**
1. Create `src/engine/dimensions.js` — seven scoring dimensions:
   - Name, description, weight, scoring rubric (1-10 scale), prompt template per dimension
2. Create `src/engine/sessionStore.js`:
   - Key-value store keyed by sessionId
   - Stores score history, intake snapshots, session metadata
   - In-memory (structured for easy swap to persistent store)

**Subagent B2 — LLM Router (Phase 2B):**
1. Create `src/engine/llmRouter.js`:
   - Wraps all LLM API calls
   - Accepts provider config (OpenAI, Anthropic, or mock)
   - Tracks token usage per call
   - Implements retry with exponential backoff
   - Supports a `mock` mode that returns deterministic scores from fixtures

### STREAM C — Design Tokens + Fixture (Phase 1B + 2C-prep)

**Target: 25 min | No dependencies**

1. Create `design/tokens.js` with full token set (colors, spacing, type scale, radii, shadows)
2. Create `src/fixtures/acme.json` — full Acme Corp demo fixture with realistic intake data and pre-computed scores for all seven dimensions

---

### MERGE POINT 1 — Scorer Assembly (Phase 2C)

**Target: 15 min | Depends on: Stream B (2A + 2B) + Stream C (acme.json)**

1. Create `src/engine/scorer.js`:
   - Takes intake data + dimensions config
   - Fans out scoring calls (one per dimension) via llmRouter
   - Aggregates into a normalized scorecard object
   - Returns: `{ dimensions: [{name, score, reasoning, confidence}], overall, timestamp }`
2. Confirm: scorer returns valid scorecard when called with Acme fixture in mock mode

---

### PARALLEL UI BUILD (Phase 3, split across subagents)

**Target: 25 min | Depends on: Stream A (scaffold) + Stream C (tokens)**

**Subagent UI-1 — Input + Chart:**
1. **DeltaInput** — structured intake form:
   - Company name, vertical, stage, description, key metrics fields
   - Validates required fields before submission
   - Submits to scorer engine
2. **RadarChart** — seven-axis radar visualization:
   - Uses Recharts ResponsiveContainer + RadarChart
   - Animated transitions on score update
   - Tooltips showing dimension name + score + one-line reasoning

**Subagent UI-2 — Results Display:**
1. **ScoreCard** — the main results view:
   - Overall score (large, prominent)
   - Seven dimension cards (score, name, confidence indicator, expandable reasoning)
   - Color-coded by score range (red < 4, yellow 4-6, green > 6)
2. **NarrativeBlock** — LLM-generated prose summary:
   - One-paragraph executive summary of the evaluation
   - Toggle for "explain to non-technical exec" mode (simpler language)
3. **ScoreHistoryTimeline** — sparkline showing score progression (CUTTABLE)

**Confirm:** all components render with Acme fixture data, interactions work

---

### Phase 4 — Integration & Polish (Sequential)

**Target: 30 min | Depends on: Phase 2C (scorer) + Phase 3 (all UI components)**

1. Wire DeltaInput → scorer → ScoreCard + RadarChart + NarrativeBlock flow end-to-end
2. Add loading states, error boundaries, graceful fallback when API unavailable
3. Implement cached fallback: if API fails, serve last cached result with "stale" indicator
4. Add session persistence: scores saved to sessionStore, retrievable on reload
5. Add token usage footer (reads from llmRouter counters)
6. Polish: transitions, micro-interactions, responsive breakpoints
7. Confirm: full flow works in both live mode and demo/mock mode

---

### Phase 5 — Presentation Deck (Independent, GATED)

**Target: 30 min | Depends on: Phase 4 complete + MY TEMPLATE CONFIRMATION**

**GATE: Do NOT start this phase until I confirm the template situation.**

Ask me:
> "Phase 4 complete. Before I build the presentation: did the judges share a template, structural rubric, or required slide list? If yes, paste it now. If no, I proceed with the 15-slide deck in our design system."

Default 15-slide deck if no template provided:
1. Title + tagline
2. Problem statement (with market data)
3. Solution overview (one sentence + visual)
4. Seven-dimension framework explanation
5. Architecture diagram (simple, clean)
6. Live demo screenshot / embed
7. Scoring engine deep-dive
8. LLM routing strategy
9. Competitive differentiation
10. Demo: Acme Corp walkthrough
11. Results interpretation
12. Scalability & roadmap
13. Token economics / cost model
14. Team
15. Ask / next steps

---

### Phase 6 — Final QA & Ship (Sequential)

**Target: 15 min | Depends on: Phase 4 (+ Phase 5 if deck required for ship)**

1. Run through full flow 3x (demo mode, mock API failure, fresh session)
2. Verify all components render without console errors
3. Verify responsive behavior at 1440px, 1024px, 768px
4. Verify color contrast meets WCAG AA
5. Build production bundle, confirm no build errors
6. Ship.

---

## Live Status Tracker

After each task completes, update this status block and print it:

```
╔══════════════════════════════════════════════════════════════════════╗
║                    BUILD STATUS — LIVE TRACKER                       ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  STREAM A (Frontend Scaffold)                                        ║
║  ░░░░░░░░░░░░░░░░░░░░  0%   ⚪ AWAITING START                       ║
║    [ ] Vite + React + Tailwind init                                  ║
║    [ ] Layout shell (App, Sidebar, Main)                             ║
║    [ ] UI Primitives (Button, Card, Badge, Input, TextArea)          ║
║    [ ] Tokens wired + dark mode confirmed                            ║
║                                                                      ║
║  STREAM B (Engine Core)                                              ║
║  ░░░░░░░░░░░░░░░░░░░░  0%   ⚪ AWAITING START                       ║
║    [ ] B1: dimensions.js                                             ║
║    [ ] B1: sessionStore.js                                           ║
║    [ ] B2: llmRouter.js                                              ║
║                                                                      ║
║  STREAM C (Tokens + Fixture)                                         ║
║  ░░░░░░░░░░░░░░░░░░░░  0%   ⚪ AWAITING START                       ║
║    [ ] design/tokens.js                                              ║
║    [ ] fixtures/acme.json                                            ║
║                                                                      ║
║  MERGE: SCORER (Phase 2C)                                            ║
║  ░░░░░░░░░░░░░░░░░░░░  0%   ⚪ BLOCKED on Stream B + C              ║
║    [ ] scorer.js                                                     ║
║    [ ] Mock mode verified with Acme fixture                          ║
║                                                                      ║
║  PARALLEL UI (Phase 3)                                               ║
║  ░░░░░░░░░░░░░░░░░░░░  0%   ⚪ BLOCKED on Stream A + C              ║
║    [ ] UI-1: DeltaInput                                              ║
║    [ ] UI-1: RadarChart                                              ║
║    [ ] UI-2: ScoreCard                                               ║
║    [ ] UI-2: NarrativeBlock                                          ║
║    [ ] UI-2: ScoreHistoryTimeline (CUTTABLE)                         ║
║                                                                      ║
║  PHASE 4 (Integration)                                               ║
║  ░░░░░░░░░░░░░░░░░░░░  0%   ⚪ BLOCKED on Phase 2C + Phase 3        ║
║    [ ] End-to-end wiring                                             ║
║    [ ] Error boundaries + fallback                                   ║
║    [ ] Session persistence                                           ║
║    [ ] Polish + responsive                                           ║
║                                                                      ║
║  PHASE 5 (Deck)                                                      ║
║  ░░░░░░░░░░░░░░░░░░░░  0%   🟠 GATED — TEMPLATE CHECK REQUIRED     ║
║                                                                      ║
║  PHASE 6 (QA + Ship)                                                 ║
║  ░░░░░░░░░░░░░░░░░░░░  0%   ⚪ BLOCKED on Phase 4                   ║
║                                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║  PROTOCOLS                                                           ║
║  Wheel-Spin Absorption:  ARMED                                       ║
║  Template Gate:           ACTIVE                                      ║
║  Scope-Cut List:          LOCKED                                      ║
║  Course-Correction:       LOCKED                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Status symbols:**
- `⚪` AWAITING START
- `🔵` IN PROGRESS
- `✅` COMPLETE
- `🟠` GATED (waiting on human input)
- `🔴` BLOCKED (dependency not met)
- `⚠️` COURSE-CORRECTING

**Update rules:**
- Print the tracker after completing any stream/phase
- Mark individual tasks with `[x]` when done
- Update percentage based on completed subtasks
- If a course-correction trigger fires, mark the affected stream with `⚠️` and explain

---

## Constraint Absorption Protocol

If at any point I tell you a new constraint has been dropped (judges changed the rules mid-sprint), here is how to respond:

1. **Restate** the constraint in one sentence to confirm understanding
2. **Classify** it: Additive (new feature), Substitutive (swap something), Restrictive (remove/limit), or Reframe (change narrative)
3. **Blast radius**: which streams/phases are affected, which are untouched
4. **Recommend** ONE absorption strategy — not options, a single defended recommendation
5. **Name the cut**: what gets deprioritized to make room
6. **Wait for my go/adjust/veto** before proceeding

## Judging Criteria (OPTIMIZE ALL DECISIONS AGAINST THIS)

| Category | Weight | Optimization Strategy |
|---|---|---|
| UI/UX | 30% | Custom animations, glow effects, signature radar chart, animated score reveals, crafted empty states. NOT generic Tailwind. Every interaction must feel intentional. |
| Market Feasibility & Impact | 30% | Demo tells a story. Value prop visible on first load. "Launch today" narrative: investors/accelerators/product teams use this. Why June 2026 is the right time (LLMs reliable, no standard framework exists). |
| System Architecture | 30% | DI, strategy pattern, typed errors, config-driven dimensions, clean module boundaries. Judges may read code. JSDoc on public APIs. Show horizontal scalability (fan-out scoring). |
| Pitch & Demo | 10% | Clear 15-slide deck. Demo flows without errors. Judge "gets it" in 30 seconds. Don't over-invest time here. |

Pre-staged patterns for likely curveballs:
- "No external chart lib" → Hand-rolled SVG radar. Cut ScoreHistoryTimeline to simple sparkline. ~15 min. Affects: UI-1 only.
- "Must work offline" → Cached fallback becomes primary path. Demo runs on Acme fixture. ~5 min. Affects: Phase 4 only.
- "Add a new persona/vertical" → New fixture alongside Acme. Zero architecture change. ~10 min. Affects: Stream C only.
- "Change branding/colors" → Update `design/tokens.js`. ~5 min. Affects: Stream C only.
- "Add chat interface" → DeltaInput becomes chat thread. Same router, different UI shell. ~20 min. Affects: UI-1 only.
- "Show cost/token usage" → llmRouter already tracks. Surface in footer. ~10 min. Affects: Phase 4 only.
- "Multi-user/sessions" → sessionStore keys by sessionId (already structured for this). ~10 min. Affects: B1 only.
- "Remove all AI, use rules" → Weighted heuristic scoring over intake fields. ~25 min. Affects: B2 + Phase 2C.
- "Accessibility/WCAG" → Aria-labels, keyboard nav, contrast already passing. ~15 min. Affects: Phase 4 polish.
- "Explain to non-technical exec" → Sonnet call translating scorecard to one-paragraph summary. Slots into NarrativeBlock toggle. ~15 min. Affects: UI-2 only.

**Hard no (with defended reasoning):**
- Rebuilding LLM routing from scratch (cost: 60+ min, breaks everything downstream)
- Removing the seven-dimension framework (that IS the product)
- Anything that pushes past the 4:00 ship deadline

## Scope-Cut Priority List (cut from bottom first)

1. ~~ScoreHistoryTimeline~~ (first to go — sparkline or nothing)
2. ~~Token usage footer~~ (nice-to-have, not core)
3. ~~"Explain to exec" toggle~~ (can be faked in demo)
4. ~~Responsive below 768px~~ (judges are on laptops)
5. NarrativeBlock (keep static version, cut LLM-generated if time-crunched)
6. Session persistence (keep in-memory, cut reload survival)
7. RadarChart animation (static radar still ships the message)

**Never cut:** DeltaInput, Scorer, ScoreCard, RadarChart (static), Demo mode with Acme fixture.

## Course-Correction Triggers

If any of these happen, stop and tell me immediately:
- A stream takes 2x its time budget → we re-scope that stream
- Build fails and fix isn't obvious in 5 min → we route around
- LLM API is down/unreachable → we switch to full mock mode permanently
- A component is fighting the framework → we simplify, not force
- Two parallel streams conflict on a shared file → orchestrator resolves, names the winner

## Rules of Engagement

1. Ship working software. Incomplete features get cut, not half-shipped.
2. Maximize parallelism. If two tasks have no dependency, run them simultaneously.
3. Every merge point gets a confirmation check. Don't proceed past a merge without verifying both inputs.
4. No gold-plating. Good enough that works beats perfect that doesn't ship.
5. If you're unsure about a decision, pick the faster path and tell me what you chose.
6. Comments in code only where non-obvious. Don't narrate the obvious.
7. Commit after each phase/merge completes successfully.
8. Print the status tracker after every stream completion or merge point.

---

## Orchestration Instructions

When you receive "build it":

1. **Kick off Streams A, B, and C simultaneously.** These have zero dependencies on each other.
   - Stream A: scaffold the frontend
   - Stream B (split B1 + B2 in parallel): build dimensions + sessionStore, and llmRouter simultaneously
   - Stream C: create tokens file + Acme fixture

2. **When Streams B + C complete → trigger Merge Point 1** (scorer.js assembly). Stream A can still be in progress — that's fine.

3. **When Streams A + C complete → trigger Phase 3** (parallel UI build, split across UI-1 and UI-2 subagents).

4. **When Phase 2C (scorer) + Phase 3 (UI) both complete → trigger Phase 4** (integration). This is sequential and cannot be split.

5. **When Phase 4 complete → ask me about template → Phase 5** (deck, GATED).

6. **When Phase 4 complete (+ Phase 5 if applicable) → Phase 6** (QA + Ship).

**Print status tracker after each stream/phase completion.**

---

**Say "STREAMS A+B+C LAUNCHED" when you begin. Print the status tracker with those streams marked 🔵 IN PROGRESS.**

**Start on "build it".**
