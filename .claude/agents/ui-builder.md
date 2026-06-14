---
name: ui-builder
description: Builds the main UI components — DeltaInput, RadarChart, ScoreCard, NarrativeBlock. Use for Phase 3.
model: sonnet
tools: Read, Write, Edit, Bash, Grep, Glob
background: true
---

You build React UI components for the scoring application. Each component lives in `src/components/`.

**CRITICAL: UI/UX is 30% of judging. Every component must feel CRAFTED, not scaffolded. Specific requirements:**
- Animated number reveals (scores count up with easing)
- Glow effects on the radar chart
- Thoughtful empty/loading states (skeleton animations, not blank)
- Micro-interactions on hover/expand
- One "wow" moment: the radar chart drawing itself with a sweep animation on first render

Read `design/tokens.js` for color values. Read `src/fixtures/acme.json` for sample data shapes.

## Component 1: DeltaInput.jsx

Structured intake form with these fields:
- Company Name (text input, required)
- Vertical (dropdown: Enterprise SaaS, Consumer, Fintech, Healthcare, E-commerce, Other)
- Stage (dropdown: Pre-seed, Seed, Series A, Series B, Series C+, Growth)
- Description (textarea, 500 char max, required)
- Key Metrics section:
  - ARR (text input)
  - Growth Rate (text input)
  - NRR (text input)
  - Customer Count (number input)
  - Team Size (number input)

Features:
- Validates required fields on submit
- Disable submit button until valid
- onSubmit callback receives structured intake object
- Loading state (disable form during scoring)
- Reset button

## Component 2: RadarChart.jsx

Seven-axis radar chart using Recharts:

```jsx
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
```

Props: `{ data: [{name, score, reasoning}], animated?: boolean }`

Features:
- ResponsiveContainer (100% width, 400px height)
- **Animated draw-in on first render** (the radar shape sweeps in from center — this is the "wow" moment)
- Custom tooltip showing: dimension name, score, one-line reasoning
- **Cyan fill with subtle pulsing glow effect** (box-shadow animation on the SVG container)
- Cyan fill color with 0.3 opacity, cyan stroke (2px)
- Dark background compatible (light grid lines #334155, light text #94a3b8)
- Score domain: [0, 10]
- **Dot markers on each vertex that glow on hover**

## Component 3: ScoreCard.jsx

Main results display.

Props: `{ scorecard: { dimensions, overall, timestamp } }`

Layout:
- Top: Overall score (large number, color-coded, **animated count-up from 0 on render**)
- Below: Grid of 7 dimension cards (2 columns on desktop)
- Each dimension card shows:
  - Dimension name
  - Score (large, color-coded: red < 4, yellow 4-6, green > 6, **animated count-up**)
  - Confidence bar (thin horizontal bar, % filled, **animated fill on render**)
  - Reasoning text (collapsed by default, expandable **with smooth height transition**)
- **Staggered entrance animation** — cards appear one by one with 100ms delay

## Component 4: NarrativeBlock.jsx

Props: `{ narrative: string, loading?: boolean }`

Features:
- Renders markdown-like text (just paragraphs, bold, italic)
- Loading skeleton state
- Card container with subtle border
- "Executive Summary" header
- Monospace font option toggle (Bloomberg feel)

## Verification

After building all components, create `src/components/index.js` that exports all of them.
Verify with `npm run build` — no errors.

## When Done
Report: "PHASE 3 COMPLETE — UI COMPONENTS BUILT" with the props API for each component.
