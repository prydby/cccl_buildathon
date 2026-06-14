# PilotIQ — Engineering Design Document

**Status:** v1.0 (Buildathon) · **Author:** Engineering · **Audience:** Engineers, reviewers, future maintainers

---

## 1. Problem Statement

Engineering organizations repeatedly ship pilots/POCs that fail to graduate to production. The failure mode is consistent: the system "works" in demo but lacks the operational maturity (observability, reliability, security, testing) required at scale. Existing readiness reviews are:

- **Manual** — a senior engineer eyeballs a doc and gives an opinion.
- **Inconsistent** — different reviewers check different things.
- **Unstructured** — no shared rubric across product types.
- **Non-repeatable** — you can't compare last month's review to today's.

**Goal:** A deterministic, evidence-based assessment that reads a product's documentation and returns a structured production-readiness verdict, grounded in recognized industry frameworks.

### Non-Goals

- Replacing human judgment entirely (it augments, not replaces).
- Static code analysis (v1 assesses documentation/intake, not the repo AST).
- Continuous monitoring (v1 is point-in-time assessment).

---

## 2. Requirements

### Functional
- FR1: Accept a product intake (name, type, document text).
- FR2: Select an appropriate assessment framework by product type.
- FR3: Score the product across the framework's axes (1-10 each).
- FR4: Produce a verdict (GO / CONDITIONAL / NO-GO) and a TRL level (1-9).
- FR5: Identify gaps and generate a prioritized remediation roadmap.
- FR6: Export results (JSON, Markdown).

### Non-Functional
- NFR1 (Determinism): Identical input → identical output. Critical for trust and testability.
- NFR2 (Explainability): Every score must cite the evidence that produced it.
- NFR3 (Privacy): No document content leaves the client in default mode.
- NFR4 (Latency): Assessment completes in < 100ms of compute (deterministic core).
- NFR5 (Extensibility): Adding a framework or axis requires config only, no engine changes.
- NFR6 (Portability): Static deployable; no mandatory backend.

---

## 3. High-Level Design (HLD)

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                       │
│                                                                │
│  ┌────────────┐   ┌──────────────────────────────────────┐  │
│  │  features/ │   │              core/ (engine)            │  │
│  │  (React UI)│──▶│  runAssessment(intake)                 │  │
│  │            │   │   selectFramework → extractSignals     │  │
│  │  useAssess │   │   → scoreDocument → calculateTRL       │  │
│  │   -ment    │◀──│   → analyzeGaps                        │  │
│  └────────────┘   └──────────────────────────────────────┘  │
│        │                          │                           │
│        │                          ▼ (optional)                │
│        │                  ┌──────────────┐                    │
│        │                  │   llm/       │  Strategy:         │
│        │                  │   router     │  Mock/OpenAI/      │
│        │                  └──────┬───────┘  Anthropic         │
└────────┼─────────────────────────┼───────────────────────────┘
         │                         │ (only if LLM mode + key)
         ▼                         ▼
   shared/ui/                External LLM API
   (primitives)              (zero-retention)
```

### Layered Architecture

| Layer | Folder | Depends On | Rule |
|---|---|---|---|
| Presentation | `features/`, `shared/ui/` | core (via hook), llm | No business logic |
| Application | `features/*/use*.js` | core | Binds engine to React state |
| Domain | `core/` | nothing | Pure, deterministic, testable |
| Infrastructure | `llm/` | external APIs | Isolated, swappable |

**Dependency rule:** dependencies point inward. `core/` depends on nothing. UI depends on `core/`. This is a Clean/Hexagonal architecture boundary.

---

## 4. Low-Level Design (LLD)

### 4.1 Assessment Pipeline

```
runAssessment(intake)                          [assessmentService.js]
  1. validate(intake)                          → throws on missing name/document
  2. framework = selectFramework(productType)  [frameworks.js]
  3. scorecard = scoreDocument(document, fw)   [scorer.js]
       a. signals = extractSignals(text, fw)   [signalExtractor.js]
       b. per axis: scoreAxis(axis, signals)
       c. overall = Σ(score × weight)
  4. trl = calculateTRL(scorecard)             [trlCalculator.js]
  5. gaps = analyzeGaps(scorecard)             [gapAnalyzer.js]
  return { intake, framework, scorecard, trl, gaps }
```

### 4.2 Signal Extraction (the "is this real" layer)

Each axis defines three keyword sets:
- `strong[]` — production-grade indicators (e.g., "distributed tracing", "circuit breaker")
- `positive[]` — basic presence (e.g., "monitoring", "tests")
- `negative[]` — explicit gaps (e.g., "no monitoring", "hardcoded secrets")

`extractSignals` lowercases the document and counts substring matches per set. Output per axis: `{ strong, positive, negative, foundEvidence[], missingEvidence[] }`.

**Why keyword/signal-based and not pure-LLM?** Determinism (NFR1), explainability (NFR2), zero-cost, and offline capability (NFR3). LLM is layered on top as enhancement, not foundation.

### 4.3 Scoring Function

```
score = clamp(
  5.0
  + strong   × 1.3
  + positive × 0.6
  − negative × 1.8,
  1, 10
)
confidence = clamp(0.4 + totalSignals × 0.12, 0.4, 0.95)
```

Rationale:
- Baseline 5.0 = "unknown/neutral" — absence of evidence is neither good nor bad until stated.
- Negative weight (1.8) > strong (1.3): an explicitly stated gap is stronger evidence than a claimed strength.
- Confidence scales with evidence volume — more signals = more defensible score.

### 4.4 Framework Selection (Strategy Pattern)

```
selectFramework(productType):
  for fw in FRAMEWORKS:
    if productType in fw.appliesTo: return fw
  return GENERAL_PRODUCTION_READINESS   // safe default
```

Frameworks compose axes from a shared `AXIS_LIBRARY` with framework-specific weights. Weights within a framework sum to 1.0 (enforced by test).

### 4.5 TRL + Verdict Logic

```
level = scoreToTRL(overall)            // 1-10 score → 1-9 NASA TRL
blockingGaps = axes where score < 5
warnings      = axes where 5 ≤ score < 7

verdict =
  NO_GO       if blockingGaps > 0
  CONDITIONAL if warnings > 2 OR overall < 6.5
  GO          otherwise

estimatedWeeks = blockingGaps×3 + warnings×1.5
```

---

## 5. Key Design Decisions & Trade-offs

| # | Decision | Alternatives Considered | Why |
|---|---|---|---|
| D1 | Deterministic signal-based core | Pure LLM scoring | Determinism, explainability, zero-cost, testable. LLM is non-reproducible and costs per call. |
| D2 | Config-driven frameworks | Hardcoded axes | Add a framework = add data. No engine changes. Open/Closed principle. |
| D3 | Client-side only (default) | Backend API | Privacy (NFR3), zero infra cost, instant. Backend optional for team features. |
| D4 | LLM as optional enhancement | LLM as core | Product must work with zero dependencies. Graceful degradation. |
| D5 | Feature-folder structure | Type-folder (components/, hooks/) | Scales better; each feature is cohesive and independently ownable. |
| D6 | Strategy pattern for LLM providers | Direct SDK calls | Swap OpenAI↔Anthropic↔Mock without touching scorer. |

---

## 6. Module Boundaries

```
core/        → imports: nothing (pure)
llm/         → imports: external fetch only
features/    → imports: core/, shared/ui/, llm/ (via hook)
shared/ui/   → imports: nothing (presentational)
App.jsx      → composes features
```

Violation of these boundaries should fail review. `core/` importing React would be a critical defect.

---

## 7. Error Handling

- Input validation throws typed errors at the service boundary (`runAssessment`).
- LLM layer defines a typed hierarchy: `LLMError` → `RateLimitError | APIError | TimeoutError`, each with a `retryable` flag.
- Retry uses exponential backoff (1s, 2s, 4s) on retryable errors only.
- UI catches at the hook boundary and surfaces a friendly message; never crashes the app.

---

## 8. Testing Strategy

| Level | Scope | Tooling |
|---|---|---|
| Unit | Each core function (extract, score, TRL, gaps) | Node smoke tests (Vitest in prod) |
| Contract | Framework weights sum to 1.0; intake validation | Assertion suite |
| Integration | Full `runAssessment` pipeline | Node harness |
| E2E | UI flows (assess → results) | Playwright (planned) |
| Property | Strong-doc score > weak-doc score (invariant) | Assertion suite |

Current: 14/14 core UAT assertions passing.

---

## 9. Future Evolution

- **v2:** Repository ingestion — parse actual code/config (coverage badges, CI files, IaC) as signals.
- **v2:** LLM-augmented reasoning behind a feature flag (deterministic remains source of truth).
- **v3:** MCP server — expose `assess_readiness` as a tool other agents can call.
- **v3:** Assessment history + trend tracking (re-assess, compare over time).
- **v3:** Team workspace with shared frameworks and custom axes.
