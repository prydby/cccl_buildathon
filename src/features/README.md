# features — UI Feature Modules

Each folder is a self-contained product feature. Features compose `core/` logic and `shared/ui/` primitives. They never import each other's internals — shared state flows through `App.jsx`.

| Module | Contents | Responsibility |
|---|---|---|
| `landing/` | `LandingPage.jsx` | Entry page: value prop, how-it-works, framework provenance, CTAs. |
| `assessment/` | `AssessmentForm.jsx`, `useAssessment.js` | Document intake form + the React hook binding to `core.runAssessment`. |
| `results/` | `VerdictBanner`, `RadarChart`, `ScoreCard`, `GapReport`, `CompetitorAnalysis`, `NarrativeBlock` | Renders a completed assessment. |
| `chat/` | `AIAssistant.jsx` | Dual-mode assistant (Product / Tech) answering platform questions. |
| `demo/` | `CabbyPage.jsx` | Demo product (Cabby) overview + one-click assessment trigger. |
| `about/` | `FrameworkPage.jsx`, `ArchitecturePage.jsx` | Framework provenance + system architecture explainers. |

## Conventions

- Presentational components receive data via props; the only stateful hook is `useAssessment`.
- UI primitives come from `../../shared/ui/`.
- No business logic in components — scoring lives entirely in `core/`.
