# PilotIQ — Product Functional Document

**Audience:** Product, founders, stakeholders, judges. **Purpose:** What PilotIQ is, what it does, who it's for, and where it goes.

---

## 1. The Product in One Line

**PilotIQ tells you whether your tech product is ready to graduate from pilot to production — with evidence, not opinion.**

---

## 2. The Problem

The hardest question in engineering isn't "does it work?" — it's "is it *ready*?"

- 70%+ of internal pilots and POCs never reach production. (Industry-observed pattern.)
- The gap between "works in demo" and "survives production" is operational maturity: observability, reliability, security, testing, scale.
- Today, this judgment is made ad-hoc by whichever senior engineer is in the room. It's inconsistent, unrepeatable, and undocumented.

As AI agents and MCP-based products explode in 2026, this problem multiplies — teams ship agent pilots fast but have no structured way to know if they're production-safe.

---

## 3. The Solution

A structured, evidence-based readiness assessment:

1. **Feed it your product document** (BRD, PRD, architecture overview, or system description).
2. **It selects the right framework** for your product type.
3. **It scores you across readiness axes**, citing evidence from your document.
4. **It gives a verdict** — GO / CONDITIONAL / NO-GO — with a TRL level, gap report, and remediation roadmap.

The output is shareable, exportable, and repeatable — re-run it after fixing gaps to track progress.

---

## 4. Who It's For

| Persona | Job To Be Done |
|---|---|
| **Eng Director / VP** | "Should I invest in scaling this pilot, or is it not ready?" |
| **CTO / Tech Lead** | "Give me a structured go/no-go before I commit the team." |
| **Principal / Staff Eng** | "Run a consistent readiness review without doing it all by hand." |
| **Product Manager** | "Is the technical foundation ready to match our product ambition?" |
| **Due Diligence / M&A** | "Assess the technical maturity of an acquisition target." |

---

## 5. Core Features

| Feature | Description |
|---|---|
| **Document-fed assessment** | Paste a BRD/PRD/system doc. No long forms. Evidence extracted from text. |
| **Dynamic framework selection** | Product type drives which framework applies. AI agents ≠ data pipelines ≠ SaaS. |
| **8-axis scoring** | Architecture, Reliability, Delivery, Observability, Security, Scalability, Testing, Product Signal. |
| **Verdict + TRL** | GO / CONDITIONAL / NO-GO, plus NASA TRL level (1-9). |
| **Evidence citation** | Every score shows what was found and what was missing. |
| **Gap report** | Blocking gaps vs. warnings, ranked by severity. |
| **Remediation roadmap** | Phased plan (weeks) to close gaps and reach readiness. |
| **Competitor context** | (Demo) How the product stacks against market alternatives. |
| **AI assistant** | Dual-mode (Product / Tech) — answers any question about the platform. |
| **Export** | JSON + Markdown. Drop results into Slack, Notion, Jira. |
| **Local-first** | Runs in-browser. No document content leaves the device. |

---

## 6. The Framework — Research Foundation

PilotIQ's assessment model is **synthesized from 12 industry-leading frameworks** — not invented:

| Framework | Source | Contribution |
|---|---|---|
| Production Readiness Review | Google SRE | Operability, incident readiness |
| Operational Readiness Review | Amazon | Pre-launch bar-raising |
| Four Key Metrics | DORA / Google | Delivery velocity & stability |
| Well-Architected | AWS | 6-pillar architecture lens |
| Technology Readiness Level | NASA / DoD | 1-9 maturity staging, go/no-go gates |
| SQuaRE (25010) | ISO | Software quality model |
| AI Security Top 10 | OWASP | AI-specific risk |
| Responsible Scaling Policy | Anthropic | AI safety & evals |
| MLOps Maturity | Google Cloud | ML deployment maturity |
| SPACE | GitHub / Microsoft | Developer productivity |
| Fitness Functions | ThoughtWorks | Architecture evolvability |
| Accelerate | Forsgren/Humble/Kim | High-performing org traits |

### Framework Routing

| Product Type | Framework Applied |
|---|---|
| AI Agent / MCP Tool | Agent Readiness Model (ARM) |
| SaaS Platform / API | SaaS Production Readiness (SPR) |
| Consumer App / Marketplace | Platform Scale Readiness (PSR) |
| Data Pipeline / Infra / Other | General Production Readiness (GPR) |

---

## 7. Demo: Cabby

The built-in demo assesses **Cabby** — an AI-native cab aggregation platform comparing Uber, Ola, Namma Yatri, BluSmart, and Rapido in real time using 4 AI agents (price prediction, route optimization, provider orchestration via MCP, user preference learning).

Running the real engine on Cabby's system document yields:
- **Verdict:** CONDITIONAL GO · **TRL 7** · **7.6/10**
- **Strengths:** Architecture (9.4), Product Signal (9.4)
- **Warnings:** Observability, Security, Scalability
- **Plus:** competitor analysis showing Cabby's meta-layer advantage over each provider.

---

## 8. Differentiation

| Alternative | Limitation | PilotIQ Advantage |
|---|---|---|
| Manual review | Inconsistent, slow, unrepeatable | Structured, instant, repeatable |
| Generic ChatGPT prompt | No framework, no evidence tracking, non-reproducible | Deterministic, evidence-cited, framework-grounded |
| Checklists / spreadsheets | Static, no scoring, no roadmap | Dynamic scoring, verdict, remediation plan |
| APM tools (Datadog etc.) | Monitor *running* systems | Assess *readiness before* scaling |

---

## 9. Scalability (Product & Business)

- **Product:** Stateless deterministic engine — scales infinitely as a static app. New frameworks/axes are config additions.
- **Adoption:** Land via individual assessments → expand to team workspaces with shared/custom frameworks.
- **Network effect:** As more assessments accumulate, benchmark data improves ("top quartile in your category looks like X").
- **Moat:** The framework synthesis + the evidence-extraction method. The 8-axis model becomes a shared standard (like NPS for satisfaction).

---

## 10. Roadmap

| Phase | Capability |
|---|---|
| v1 (now) | Document-fed deterministic assessment, 4 frameworks, demo, export |
| v2 | Repository ingestion (read CI config, coverage, IaC as signals); LLM-augmented reasoning |
| v3 | MCP server (`assess_readiness` callable by other agents); assessment history & trends |
| v4 | Team workspaces, custom frameworks, benchmark database, integrations (Jira/Slack/GitHub) |

---

## 11. Success Metrics

- Time-to-verdict: < 2 minutes (vs. days for manual review)
- Assessment consistency: 100% (deterministic — same input, same output)
- Gap-to-fix conversion: % of flagged gaps closed before scaling
- Re-assessment rate: teams returning to track improvement (retention signal)
