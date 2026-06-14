# Step-by-Step: Building in Claude.ai Web → GitHub

## Setup: One-Time (5 min)

### 1. Create a Claude Project

Go to claude.ai → Projects → "New Project"
- Name: `Seven-Dimension Scorer`
- This gives you: persistent instructions, file uploads, and scoped conversations

### 2. Set Project Instructions

Paste this into the Project's "Custom Instructions" field:

---

You are building a product evaluation tool called DimensionScore. It uses an LLM-powered seven-dimension framework to score companies/products.

**Tech Stack:** React (Vite) + Tailwind CSS + Recharts
**Aesthetic:** Dark mode, Bloomberg-terminal inspired, cyan accents, WCAG AA
**Design Tokens Source:** design/tokens.js (I'll provide this)

**Judging Criteria (optimize for this):**
- 30% UI/UX — custom animations, signature visual identity, not generic
- 30% Market Feasibility — demo tells a story, solve real problem for investors/accelerators
- 30% System Architecture — clean DI, strategy pattern, typed errors, JSDoc
- 10% Pitch — clear demo flow

**Rules:**
- Always produce complete, working code (no "..." or "add your code here")
- Use ES modules (import/export)
- Mock mode must always work without API keys
- When I ask for a component, give me the FULL implementation
- Use Tailwind CSS with custom values matching our dark design system
- Every component should have animations/transitions (scores count up, cards stagger in, radar draws itself)

---

### 3. Upload Reference Files to Project

Upload these files to the project's knowledge base:
- `claude-code-prompt.md` (your full build plan — already created)
- You'll also upload `tokens.js` and `acme.json` after Claude generates them

---

## Build Phase: Prompt Sequence (copy-paste these in order)

### Prompt 1: Design Tokens + Fixture Data

```
Create two files for me:

1. **design/tokens.js** — A complete design token system for a dark Bloomberg-terminal aesthetic. Export a `tokens` object with:
   - colors: bg (primary #0a0e17, secondary #111827, tertiary #1e293b, elevated #1e293b), text (primary #f1f5f9, secondary #cbd5e1, muted #64748b), accent (primary #06b6d4 cyan, secondary #8b5cf6 purple), score (low #ef4444, mid #f59e0b, high #22c55e), border (default #1e293b, subtle #334155, focus #06b6d4)
   - spacing, typography (mono + sans), borderRadius, shadows (with glow), transitions
   - All colors must pass WCAG AA against their paired backgrounds

2. **src/fixtures/acme.json** — A demo fixture for "Acme Corp" (Enterprise SaaS, Series B, $12M ARR, 140% YoY growth). Include full intake data and pre-computed scores for all 7 dimensions (Market Opportunity, Product Differentiation, Team & Execution, Financial Health, Scalability, Competitive Moat, Risk Profile). Each dimension has score (1-10), reasoning (1-2 sentences), and confidence (0-1). Overall score ~7.7.

Give me both as complete, copy-paste-ready code.
```

**After this:** Save both outputs. Upload them to your Project files.

---

### Prompt 2: Engine — Dimensions + Session Store

```
Create two engine modules (ES modules with JSDoc):

1. **src/engine/dimensions.js**
Export a `dimensions` array with 7 objects. Each has: id, name, description, weight (sum to 1.0), rubric {low, mid, high}, promptTemplate (using {{companyName}} and {{vertical}} placeholders).

The seven dimensions: Market Opportunity (0.15), Product Differentiation (0.15), Team & Execution (0.20), Financial Health (0.15), Scalability (0.15), Competitive Moat (0.10), Risk Profile (0.10).

2. **src/engine/sessionStore.js**
Export `createSessionStore()` factory. Returns object with methods: get(sessionId), set(sessionId, data), addScore(sessionId, scorecard), getHistory(sessionId), clear(sessionId). In-memory Map-based. Stores scores history, intake snapshots, metadata (createdAt, lastUpdated). Structured so swapping to Redis later requires changing only this file.

Use dependency injection patterns. JSDoc on all public methods. Typed error classes exported from each module.
```

---

### Prompt 3: Engine — LLM Router

```
Create **src/engine/llmRouter.js**

Export `createLLMRouter(config)` factory function.

Config: { provider: 'openai' | 'anthropic' | 'mock', apiKey?, model?, mockFixture? }

Returns: { complete(prompt, options), getTokenUsage(), resetTokenUsage() }

Requirements:
- Strategy pattern: each provider is a separate internal function (openaiProvider, anthropicProvider, mockProvider)
- Mock provider: parses the prompt to identify which dimension is being scored (look for dimension name in prompt text), returns corresponding fixture score. No API call.
- Token tracking: count estimated input/output tokens per call, expose cumulative totals via getTokenUsage()
- Retry: exponential backoff (1s, 2s, 4s), max 3 retries, on 429/500/503 status codes
- Typed errors: export RateLimitError, APIError, TimeoutError classes extending Error
- Timeout: configurable per call, default 30s
- JSDoc on all public methods

The mock provider should be deterministic — same prompt always returns same result. Parse dimension name from prompt, look up in mockFixture.scores.dimensions array.

Give me the complete implementation, not pseudocode.
```

---

### Prompt 4: Engine — Scorer

```
Create **src/engine/scorer.js**

Export `createScorer(llmRouter, dimensions)` — dependency injection, receives router and dimensions config.

Returns: { score(intake), scoreWithCache(intake, sessionStore, sessionId) }

The `score(intake)` method:
1. For each dimension, construct prompt from dimension.promptTemplate (replace {{companyName}}, {{vertical}}, etc with intake data)
2. Call llmRouter.complete() for each dimension (use Promise.all for parallel execution)
3. Parse each response to extract: score (number 1-10), reasoning (string), confidence (0-1)
4. Calculate weighted overall score
5. Return: { dimensions: [{name, score, reasoning, confidence}], overall, timestamp }

The `scoreWithCache` method:
1. Try to score normally
2. On failure, check sessionStore for last successful result
3. If cached result exists, return it with a `stale: true` flag
4. If no cache, throw the error

Error handling: if individual dimension fails, retry that one. If still fails, use score: null for that dimension and note it.

JSDoc. Full implementation. Strategy pattern for response parsing (different providers return different formats).
```

---

### Prompt 5: React App Scaffold + Layout

```
Create a complete Vite+React+Tailwind project. Give me these files:

1. **package.json** — with dependencies: react, react-dom, recharts, tailwindcss, @tailwindcss/vite, vite, @vitejs/plugin-react
2. **vite.config.js** — with React + Tailwind plugins
3. **index.html** — basic HTML shell with dark background
4. **src/main.jsx** — React root render
5. **src/index.css** — @import "tailwindcss" + custom CSS for:
   - Animated dot-grid background (CSS only, subtle)
   - Glow utility classes (.glow-cyan, .glow-green, .glow-red)
   - Custom scrollbar (thin, dark)
   - Score count-up animation keyframes
   - Staggered fade-in animation keyframes
6. **src/App.jsx** — Full-screen dark layout:
   - Sidebar (w-64): logo "DimensionScore" with radar icon, nav items (Evaluate, History, Settings), subtle left-border glow
   - Main area: header bar + scrollable content
   - Animated dot-grid background
   - Smooth transitions between views (input → loading → results)

The layout should feel like a premium fintech product, not a hackathon prototype. Use the token colors (bg-[#0a0e17], text-[#f1f5f9], accent cyan-400).
```

---

### Prompt 6: UI Primitives

```
Create **src/components/ui/** with these primitive components (complete implementations):

1. **Button.jsx** — variants: primary (cyan), secondary (gray), ghost (transparent), danger (red). Sizes: sm, md, lg. Features: hover glow effect, scale transform on press, loading spinner state, disabled state. Smooth 200ms transitions.

2. **Card.jsx** — Dark elevated container. Props: title?, children, className?, glowing? (adds subtle cyan border glow). Subtle border (#1e293b), rounded-xl, padding.

3. **Badge.jsx** — Small label. Variants: success (green), warning (amber), danger (red), info (cyan), neutral (gray). Subtle background tint with text color.

4. **Input.jsx** — Dark input with floating label animation. Props: label, value, onChange, error?, placeholder, type. Focus: cyan border glow + label floats up. Error: red border + error text below.

5. **TextArea.jsx** — Same as Input but multi-line. Character count in corner. Auto-grows to content.

Every component: dark mode, transitions on all state changes, focus-visible ring in cyan, accepts className prop.
```

---

### Prompt 7: DeltaInput (Intake Form)

```
Create **src/components/DeltaInput.jsx** — the main intake form.

Props: { onSubmit(intake), isLoading, onReset, defaultValues? }

Fields:
- Company Name (Input, required)
- Vertical (select/dropdown: Enterprise SaaS, Consumer, Fintech, Healthcare, E-commerce, Other)
- Stage (select: Pre-seed, Seed, Series A, Series B, Series C+, Growth)
- Description (TextArea, 500 char max, required)
- Key Metrics section (collapsible card):
  - ARR, Growth Rate, NRR (text inputs)
  - Customer Count, Team Size (number inputs)

Features:
- Validates required fields, shows inline errors
- Submit button disabled until valid, shows loading spinner when isLoading=true
- Reset button clears all fields
- Staggered field entrance animation on mount
- Section headers with subtle separator lines
- Responsive: single column on mobile, two columns for metrics on desktop

Use our UI primitives (Button, Card, Input, TextArea). Import from '../components/ui/'.
```

---

### Prompt 8: RadarChart (the "wow" moment)

```
Create **src/components/RadarChart.jsx** — seven-axis radar visualization.

Props: { data: [{name, score, reasoning}], animated?: boolean }

Using Recharts: RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip.

Features:
- ResponsiveContainer (100% width, 400px height)
- **SIGNATURE ANIMATION:** On first render, the radar shape draws itself — starts at center (all scores 0) and animates outward to actual values over 1.5 seconds with easeOutCubic. Use a useState + useEffect + requestAnimationFrame approach to interpolate from 0 to actual scores.
- Custom tooltip: dark background, shows dimension name, score (/10), one-line reasoning
- Cyan fill (#06b6d4) at 0.2 opacity, cyan stroke at full opacity (2px)
- PolarGrid: subtle gray lines (#334155)
- Axis labels: light gray text (#94a3b8), fontSize 12
- Domain: [0, 10]
- **Outer glow:** A subtle cyan box-shadow on the chart container that pulses gently (CSS animation, 3s infinite)
- Dot markers on vertices: small cyan circles that scale up on hover

This component IS the product's visual signature. Make it beautiful.
```

---

### Prompt 9: ScoreCard + NarrativeBlock

```
Create two components:

1. **src/components/ScoreCard.jsx**
Props: { scorecard: { dimensions, overall, timestamp } }

Layout:
- Hero section: Overall score as large number (4xl font), color-coded (red <4, amber 4-6, green >6)
  - **Animated count-up** from 0 to actual value over 1 second (easeOut)
  - Subtle glow matching the score color
  - "Overall Score" label below, timestamp in muted text
- Dimensions grid: 2 columns on desktop, 1 on mobile
  - Each dimension card (use Card component):
    - Name (semibold)
    - Score with animated count-up, color-coded
    - Confidence bar: thin horizontal bar, animated fill (width transitions from 0 to confidence%), color matches score
    - Reasoning: collapsed by default, click to expand with smooth height transition (max-h animation)
  - **Staggered entrance:** Cards appear one by one, 100ms delay between each

2. **src/components/NarrativeBlock.jsx**
Props: { narrative: string, loading?: boolean }

Features:
- Card container with "Executive Summary" header and a small sparkle icon
- Renders text as paragraphs (split on \n\n)
- Loading state: 3 skeleton paragraph lines with shimmer animation
- Monospace font option (small toggle in corner: "Terminal view")
- Subtle left border accent (cyan, 2px)
```

---

### Prompt 10: Integration — Wire Everything Together

```
Update **src/App.jsx** to wire the complete application flow:

Import all components and engine modules. The app has three views:

**View 1: Welcome/Input**
- Left side (or top on mobile): DeltaInput form
- Right side: value prop text: "Evaluate any company across 7 research-backed dimensions. Used by investors, accelerators, and product teams for faster, consistent decisions."
- "Try Demo" button that loads Acme Corp fixture

**View 2: Loading**
- Centered loading state
- "Analyzing across 7 dimensions..." text
- Animated radar chart drawing with placeholder data
- 7 progress indicators (one per dimension) that complete sequentially
- Even in mock mode, show this for 2 seconds (sells the experience)

**View 3: Results**
- RadarChart (hero, top center)
- ScoreCard (below radar)
- NarrativeBlock (below scorecard)
- "Evaluate Another" button to return to input
- "Export PDF" button (placeholder, just shows toast "Coming soon")

State management:
- useState for currentView, scorecard, isLoading, error
- useEffect for demo mode auto-trigger
- Import createLLMRouter, createScorer, dimensions from engine
- Default to mock mode (no env var needed)
- Session store for history (optional, nice-to-have)

Error handling:
- ErrorBoundary wrapper around main content
- Toast notifications for errors (simple absolute-positioned div)
- Fallback to cached results if available

The demo flow MUST work without any API keys or environment setup.
```

---

### Prompt 11: Final Polish + Custom Hook

```
Create these final pieces:

1. **src/hooks/useScorer.js** — Custom hook
   - Creates llmRouter (mock mode by default)
   - Creates scorer with router + dimensions
   - Exposes: { score(intake), isLoading, error, result, reset() }
   - Manages loading/error state internally

2. **src/components/ErrorBoundary.jsx**
   - Catches React render errors
   - Shows: "Something went wrong" with retry button and error details in collapsed section
   - Dark themed, matches design system

3. **src/components/Toast.jsx**
   - Simple notification component
   - Props: { message, type: 'success'|'error'|'info', onClose }
   - Slides in from top-right, auto-dismisses after 4s
   - Color-coded by type

4. Update **src/index.css** — add any missing utility classes:
   - .animate-count-up
   - .animate-stagger-in
   - .animate-draw-radar
   - .shimmer (for skeleton loading)
   - Custom scrollbar styles
```

---

## Assembly Phase: Local Machine (15 min)

### Step 1: Create project folder locally

```bash
mkdir ~/seven-dimension-scorer
cd ~/seven-dimension-scorer
```

### Step 2: Copy artifacts from Claude.ai

For EACH artifact Claude produced, copy the code into the correct file path:
```
seven-dimension-scorer/
├── package.json
├── vite.config.js
├── index.html
├── design/
│   └── tokens.js
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── App.jsx
│   ├── engine/
│   │   ├── dimensions.js
│   │   ├── llmRouter.js
│   │   ├── scorer.js
│   │   └── sessionStore.js
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Input.jsx
│   │   │   └── TextArea.jsx
│   │   ├── DeltaInput.jsx
│   │   ├── RadarChart.jsx
│   │   ├── ScoreCard.jsx
│   │   ├── NarrativeBlock.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── Toast.jsx
│   ├── hooks/
│   │   └── useScorer.js
│   └── fixtures/
│       └── acme.json
└── .gitignore
```

### Step 3: Install & Run

```bash
npm install
npm run dev
```

Fix any import errors (most common: wrong relative paths between components).

### Step 4: Verify

- [ ] App loads with dark theme
- [ ] "Try Demo" shows Acme scores with animations
- [ ] Radar chart draws itself (sweep animation)
- [ ] Scores count up
- [ ] Cards stagger in
- [ ] Form validates (empty submit blocked)
- [ ] Mock scoring works (fill form → submit → results)

### Step 5: Fix Issues

Common issues when assembling from artifacts:
- **Import paths wrong** — Claude might use `@/components` but Vite needs `./components`
- **Missing peer deps** — run `npm install` again
- **Tailwind not loading** — verify index.css has `@import "tailwindcss"` and vite.config has the plugin
- **Recharts SSR issue** — shouldn't happen with Vite but if it does, dynamic import

### Step 6: Git + GitHub

```bash
git init
git add .
git commit -m "feat: DimensionScore — LLM-powered seven-dimension product evaluation tool"

# Create repo on GitHub
gh repo create seven-dimension-scorer --public --source=. --push
# OR manually:
# Go to github.com → New repo → copy the URL
git remote add origin https://github.com/YOUR_USERNAME/seven-dimension-scorer.git
git push -u origin main
```

---

## Presentation Deck (Phase 5)

After the app works, go back to Claude.ai:

```
Create a single-page HTML presentation (reveal.js style but self-contained, no CDN needed) with 12 slides:

1. Title: "DimensionScore" — tagline: "Seven dimensions. One decision."
2. Problem: "Investors evaluate 100+ companies/year using gut feel and spreadsheets. Inconsistent, slow, unscalable."
3. Solution: "Structured AI-powered evaluation across 7 research-backed dimensions. Consistent scores in seconds."
4. Framework: Visual of the 7 dimensions with brief descriptions
5. Demo: Screenshot placeholder + "Live Demo" label
6. Architecture: Clean diagram showing DeltaInput → Scorer → LLM Router → Results
7. Why Now (June 2026): LLMs reliable + no standard exists + every accelerator needs this
8. Market: Target users (investors, accelerators, corporate innovation, product teams)
9. Scale Story: Fan-out architecture, config-driven dimensions, provider-agnostic
10. Differentiation: Framework becomes the standard (like NPS for satisfaction)
11. Roadmap: PDF export, team sharing, historical benchmarks, API access
12. Ask: "Try it today. Evaluate your next opportunity in 30 seconds."

Dark theme matching the app. Minimal text. Large visuals. Keyboard navigation (arrow keys).
```

---

## Timeline Estimate (Web Workflow)

| Step | Time | Notes |
|---|---|---|
| Project setup + instructions | 5 min | One-time |
| Prompts 1-4 (engine) | 20 min | Sequential, but fast outputs |
| Prompts 5-6 (scaffold + primitives) | 15 min | |
| Prompts 7-9 (feature components) | 20 min | |
| Prompts 10-11 (integration + polish) | 15 min | |
| Local assembly + npm install | 15 min | Copy-paste files |
| Debug/fix import issues | 10-20 min | This is where time goes |
| Git + GitHub push | 5 min | |
| Presentation deck | 10 min | |
| **Total** | **~2 hours** | |

---

## Pro Tips for Claude.ai Web

1. **Keep artifacts as code blocks, not rendered** — easier to copy-paste
2. **One file per prompt is cleaner** — less chance of truncation
3. **If output gets cut off** — say "continue from where you stopped" 
4. **Upload acme.json and tokens.js to Project files** after Prompt 1 — Claude references them in later prompts
5. **If a component doesn't work** — paste the error back into Claude, it'll fix it
6. **Save artifacts frequently** — browser crash = lost work
7. **Use "give me the complete file, no omissions"** — Claude tends to abbreviate on web

---

## Potential Issues & Mitigations

| Issue | Likelihood | Mitigation |
|---|---|---|
| Context window exhaustion | Medium | Start new conversation within same Project for later prompts |
| Import path mismatches | High | After assembly, grep for broken imports. Tell Claude your file structure. |
| Tailwind not loading | Medium | Double-check @import and vite.config plugin |
| Recharts animation issues | Low | Fallback to static radar if animation fights you |
| Artifact truncation (long files) | Medium | Ask for file in two parts, or ask to split component |
| Claude forgets tokens/fixtures | Low | They're in Project files — remind with "refer to the tokens.js in project files" |
