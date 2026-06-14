# PilotIQ — Production Readiness Document

**Purpose:** A reference for anyone looking to productionalize PilotIQ. It documents the current state honestly, the gaps to close, and the concrete steps to reach production-grade.

> Meta-note: PilotIQ assessed itself with its own engine → **CONDITIONAL GO, TRL 6, ~7.2/10.** This document is effectively its own remediation roadmap.

---

## 1. Current State

| Aspect | Status |
|---|---|
| Core engine | ✅ Deterministic, tested (14/14 UAT), pure functions |
| UI | ✅ Functional, responsive (≥1024px), animated |
| Build | ✅ Vite production build, zero errors |
| Deployment | ⚠️ Static bundle only; no CI/CD pipeline yet |
| Observability | 🔴 None — no error tracking, no analytics |
| Testing | ⚠️ Engine smoke-tested; no automated UI/E2E suite |
| Security | ⚠️ Client-only (low surface); LLM mode needs key handling |
| LLM mode | ⚠️ Router implemented; not wired to live key flow in UI |

---

## 2. Deployment

### 2.1 Build & Artifact

```bash
npm install
npm run build        # → dist/ (static assets)
npm run preview      # local production preview
```

Output: static HTML/CSS/JS. Deployable to any static host (Vercel, Netlify, S3+CloudFront, GitHub Pages).

### 2.2 Recommended Hosting

| Option | Pros | Notes |
|---|---|---|
| Vercel / Netlify | Zero-config, CDN, preview deploys | Recommended for v1 |
| S3 + CloudFront | Full control, cheap at scale | Add cache-control headers |
| Container (nginx) | Portable, K8s-ready | For enterprise internal hosting |

### 2.3 CI/CD (to implement)

```yaml
# .github/workflows/deploy.yml (target state)
on: { push: { branches: [main] } }
jobs:
  build:
    steps:
      - checkout
      - npm ci
      - npm run lint
      - npm run test          # add Vitest
      - npm run build
      - deploy (vercel/s3)
```

**Gap:** No pipeline today. Priority 1 for productionalization.

---

## 3. Configuration & Secrets

- **Default (deterministic) mode:** no secrets. Runs fully client-side.
- **LLM mode:** requires `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`.
  - ⚠️ Never embed keys in the client bundle. Route LLM calls through a thin backend proxy (Lambda/Edge function) that holds the key server-side.
  - Recommended: `POST /api/assess` edge function → calls LLM → returns scores. Keeps key off the client.

---

## 4. Observability (to implement)

| Signal | Tool (recommended) | Priority |
|---|---|---|
| Frontend errors | Sentry | P0 |
| Usage analytics | PostHog / Plausible (privacy-friendly) | P1 |
| LLM tracing (if enabled) | Langfuse / Arize | P1 |
| Performance (Core Web Vitals) | Vercel Analytics | P2 |

**Gap:** Zero observability today. This is the #1 blocker the engine itself flags.

---

## 5. Reliability

- Deterministic core cannot fail at runtime (pure functions, no I/O).
- LLM mode failure modes are handled: typed errors, exponential-backoff retry, and **cache fallback** (serve last result with a `stale` flag).
- **SLO target (when hosted):** 99.9% availability (static hosting makes this trivial).
- **Gap:** No synthetic monitoring / uptime checks configured.

---

## 6. Security Checklist

| Item | Status | Action |
|---|---|---|
| No secrets in client bundle | ✅ (default mode) | Maintain; proxy LLM keys |
| Input sanitization | ✅ | Document text is never executed/eval'd |
| Dependency scanning | 🔴 | Add `npm audit` + Dependabot to CI |
| CSP headers | 🔴 | Add Content-Security-Policy on host |
| Data retention | ✅ | No data persisted server-side in default mode |
| HTTPS | ✅ (via host) | Enforce HSTS |

---

## 7. Scalability

| Concern | Assessment |
|---|---|
| Compute | Core is O(axes × keywords) per assessment, < 100ms. Trivially scalable — it's client-side. |
| Hosting | Static + CDN = effectively infinite read scale. |
| LLM mode cost | ~$0.02–0.05 per assessment (8 axis calls). Add caching + rate limits before public launch. |
| State | Stateless. Multi-user needs only a DB swap in `sessionStore` (Repository pattern already in place). |

---

## 8. Performance Budgets

| Metric | Target | Current |
|---|---|---|
| JS bundle (gzip) | < 200KB | ~170KB ⚠️ (Recharts heavy) |
| Time to Interactive | < 2s | ✅ on broadband |
| Assessment compute | < 100ms | ✅ deterministic |

**Optimization:** code-split Recharts (lazy-load results view) to cut initial bundle.

---

## 9. Productionalization Roadmap

### Phase 1 — Foundations (Week 1-2)
- [ ] Add Vitest + 80% coverage on `core/`
- [ ] Add Playwright E2E for the assess→results flow
- [ ] GitHub Actions CI (lint, test, build, deploy)
- [ ] Sentry error tracking

### Phase 2 — Hardening (Week 3-4)
- [ ] LLM proxy edge function (keys off client)
- [ ] Langfuse tracing for LLM mode
- [ ] Dependency scanning + CSP headers
- [ ] Bundle code-splitting (lazy Recharts)

### Phase 3 — Scale (Week 5-6)
- [ ] Assessment history persistence (sessionStore → Postgres/Redis)
- [ ] Rate limiting on LLM endpoint
- [ ] Load test the proxy at 20x expected
- [ ] MCP server wrapper (`assess_readiness` tool)

---

## 10. Runbook (target state)

| Scenario | Action |
|---|---|
| Build fails | Check `npm run build` logs; verify Node ≥18 |
| LLM errors spike | Router auto-retries; check provider status; falls back to deterministic |
| Bundle too large | Verify code-splitting; audit dependencies |
| User reports wrong score | Reproduce deterministically (same input = same output); inspect signal extraction |
