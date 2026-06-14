# core — Assessment Engine

Pure domain logic. **No React. No network. No side effects.** Every function here is deterministic and unit-testable in isolation.

## Public API

Import from the barrel:

```js
import { runAssessment, selectFramework, scoreDocument } from '@/core'
```

## Pipeline

```
runAssessment(intake)
  ├── selectFramework(productType)      → frameworks.js
  ├── scoreDocument(document, framework)
  │     └── extractSignals(text, fw)    → signalExtractor.js
  ├── calculateTRL(scorecard)           → trlCalculator.js
  └── analyzeGaps(scorecard)            → gapAnalyzer.js
```

## Modules

| File | Responsibility |
|---|---|
| `frameworks.js` | Framework + axis definitions. Each axis carries scoring **signals** (strong/positive/negative keywords), weight, benchmark, and remediation steps. |
| `signalExtractor.js` | Reads document text and counts evidence signals per axis. The "is this real?" layer. |
| `scorer.js` | Converts signals → per-axis scores (1-10) + confidence + reasoning. Deterministic formula. |
| `trlCalculator.js` | Maps overall score → NASA TRL (1-9) and GO/CONDITIONAL/NO-GO verdict. |
| `gapAnalyzer.js` | Identifies gaps (axes < 7), ranks by severity, builds a phased remediation roadmap. |
| `assessmentService.js` | Orchestrates the full pipeline. Single entry point: `runAssessment(intake)`. |
| `index.js` | Public API barrel. |

## Scoring Model

Per axis, starting from a neutral baseline of 5.0:

```
score = 5.0
      + (strong signals   × 1.3)
      + (positive signals × 0.6)
      − (negative signals × 1.8)
clamped to [1, 10]
```

Negative signals (explicit gaps like "no monitoring") weigh heaviest — stating a gap is strong evidence of absence.

## Intake Contract

```js
{
  name: string,         // required
  productType: string,  // drives framework selection
  document: string,      // required, ≥20 chars — the BRD/PRD/system description
  state?: string,
  scaleTarget?: string,
}
```

## Testing

Run directly with Node (no test runner required for smoke tests):

```bash
node --input-type=module -e "
  import('./src/core/index.js').then(({ runAssessment }) => {
    console.log(runAssessment({ name:'X', productType:'SaaS Platform', document:'...' }))
  })
"
```
