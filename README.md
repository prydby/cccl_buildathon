# PilotIQ

**Production-readiness assessment for tech products — pilot to production, assessed not guessed.**

PilotIQ reads your product documentation (BRD, PRD, architecture doc, or system description), detects what's present and what's missing, and scores readiness across an industry-grounded framework — producing a GO / CONDITIONAL / NO-GO verdict, a NASA TRL level, gap analysis, and a remediation roadmap.

---

## Why

Every engineering org ships pilots that never graduate to production. They work in demo, pass the POC, but lack observability, runbooks, load testing, or SLOs — and the gaps surface in production, under pressure. Readiness reviews today are manual, inconsistent, and depend on who's in the room.

PilotIQ gives every team the same structured, evidence-based lens.

---

## How It Works

```
Intake (document)
   → Framework Selection (by product type)
   → Signal Extraction (evidence detection from text)
   → Scoring (deterministic, per-axis)
   → TRL + Verdict (GO / CONDITIONAL / NO-GO)
   → Gap Analysis + Remediation Roadmap
```

The assessment is **evidence-based and deterministic** — the score reflects what your document actually contains. Missing information is flagged as a gap. You can't game it by omission.

---

## Architecture

```
src/
├── core/            # Pure assessment engine — no React, no I/O, fully testable
│   ├── frameworks.js          Framework + axis definitions (with scoring signals)
│   ├── signalExtractor.js     Detects evidence signals in document text
│   ├── scorer.js              Deterministic scoring from signals
│   ├── trlCalculator.js       Maps scores → TRL level + verdict
│   ├── gapAnalyzer.js         Gaps + remediation roadmap
│   ├── assessmentService.js   Orchestration (single entry point)
│   └── index.js               Public API barrel
│
├── llm/             # Optional LLM enhancement layer (provider-agnostic)
│   ├── router.js              Strategy pattern: Mock / OpenAI / Anthropic
│   └── sessionStore.js        Repository pattern: in-memory, swappable
│
├── features/        # UI feature modules
│   ├── landing/               Marketing / entry page
│   ├── assessment/            Intake form + useAssessment hook
│   ├── results/               Verdict, radar, scorecard, gaps, competitor, narrative
│   ├── chat/                  AI assistant (dual-mode: product / tech)
│   ├── demo/                  Cabby demo product page
│   └── about/                 Framework + Architecture explainer pages
│
├── shared/ui/       # Design-system primitives (Button, Card, Badge, Input, etc.)
├── fixtures/        # Demo data (cabby.json)
├── App.jsx          # Application shell + routing
└── main.jsx         # Entry point
```

### Design Principles

- **Separation of concerns** — `core/` has zero React/UI dependencies and is independently testable.
- **Dependency injection** — the LLM router is injected, never imported by the scorer.
- **Strategy pattern** — LLM providers (Mock/OpenAI/Anthropic) are interchangeable.
- **Config-driven** — frameworks and axes are data. Add a framework = add config, no code changes.
- **Deterministic core** — same input always yields the same assessment (testable, explainable).
- **Local-first** — assessment runs entirely client-side. No document content leaves the browser.

---

## The Assessment Framework

Synthesized from 12 industry-leading frameworks:

Google SRE PRR · Amazon ORR · DORA Four Key Metrics · AWS Well-Architected · NASA TRL · ISO 25010 · OWASP AI Top 10 · Anthropic RSP · Google MLOps Maturity · SPACE Framework · ThoughtWorks Fitness Functions · Accelerate

The framework applied is **selected by product type**:

| Product Type | Framework |
|---|---|
| AI Agent / MCP Tool | Agent Readiness Model (ARM) |
| SaaS Platform / API | SaaS Production Readiness (SPR) |
| Consumer App / Marketplace | Platform Scale Readiness (PSR) |
| Data Pipeline / Infra / Other | General Production Readiness (GPR) |

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle
npm run preview    # preview production build
```

---

## Tech Stack

React 18 · Vite 6 · Tailwind CSS 4 · Recharts · Vanilla ES modules (engine)

---

## Demo

The built-in demo assesses **Cabby** — an AI-native cab aggregation platform (compares Uber, Ola, Namma Yatri, BluSmart, Rapido). It runs the real engine on Cabby's system document and produces a CONDITIONAL verdict with competitor analysis.
