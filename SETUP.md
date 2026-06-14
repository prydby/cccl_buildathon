# Setup & Execution Guide

## Prerequisites
- Node.js 18+ installed
- Claude Code CLI installed (`claude` command available)
- GitHub CLI installed (`gh` command) — for final push
- Git configured with your identity

---

## Step-by-Step Execution

### Step 1: Initialize Git (do this ONCE)

```bash
cd ~/kiro_priyaay/cccl_buildathon
git init
git add .
git commit -m "chore: initial workspace setup with Claude Code agents"
```

### Step 2: Create GitHub Repo

```bash
gh repo create seven-dimension-scorer --public --source=. --remote=origin
# OR if repo already exists:
git remote add origin https://github.com/YOUR_USERNAME/seven-dimension-scorer.git
```

### Step 3: Launch the Build

```bash
claude --agent orchestrator
```

Then type: **"build it"**

The orchestrator will:
1. Spawn 3 background subagents (assets, engine, scaffold) — runs in parallel
2. When dependencies met → build scorer
3. When dependencies met → spawn ui-builder
4. When all components ready → spawn integrator
5. Ask you about presentation template (Phase 5 gate)
6. Final QA

### Step 4: Monitor Progress

While running, you'll see:
- Subagent panel below the prompt (shows running/completed agents)
- Status tracker printed after each phase
- Use `↑/↓` to browse subagent outputs
- Press `Ctrl+B` to background any long-running task

### Step 5: If Something Goes Wrong

```bash
# Check what's been built so far
git status
git diff --stat

# If you need to restart a phase, tell the orchestrator:
"Stream B failed. Redo the engine modules yourself."

# If you want to start fresh from last good state:
git stash
# or
git checkout -- .
```

### Step 6: After Build Completes — Push to GitHub

```bash
# The orchestrator commits after each phase. Verify:
git log --oneline

# Push everything:
git push -u origin main

# If you want a clean single commit instead:
git reset --soft $(git rev-list --max-parents=0 HEAD)
git commit -m "feat: Seven-Dimension Scorer — complete build"
git push -u origin main --force
```

### Step 7: (Optional) Create a Release

```bash
gh release create v1.0.0 --title "v1.0.0 — Buildathon Ship" --notes "Seven-dimension product evaluation tool with LLM-powered scoring."
```

---

## Alternative: Manual Step-by-Step (no orchestrator)

If you prefer controlling each step yourself in Claude Code:

```bash
claude
```

Then paste prompts one at a time:

**Prompt 1 (Stream C + B):**
> Create design/tokens.js (Bloomberg dark aesthetic, WCAG AA) and src/fixtures/acme.json (Acme Corp, 7 dimensions with realistic scores). Then create src/engine/dimensions.js (7 dimensions), src/engine/sessionStore.js (in-memory), and src/engine/llmRouter.js (with mock mode, retry, token tracking).

**Prompt 2 (Stream A):**
> Initialize this as a Vite+React+Tailwind project. Create layout shell in App.jsx (dark mode, sidebar + main). Create UI primitives in src/components/ui/: Button, Card, Badge, Input, TextArea.

**Prompt 3 (Scorer):**
> Create src/engine/scorer.js that uses dimensions.js and llmRouter.js. It should fan out scoring calls per dimension and return a normalized scorecard. Verify it works with the Acme fixture in mock mode.

**Prompt 4 (UI Components):**
> Build src/components/DeltaInput.jsx (intake form), RadarChart.jsx (Recharts radar), ScoreCard.jsx (results grid), NarrativeBlock.jsx (prose summary). Use tokens from design/tokens.js, data shapes from acme.json.

**Prompt 5 (Integration):**
> Wire everything end-to-end in App.jsx. Add demo mode toggle, error boundaries, loading states, cached fallback. Verify with npm run build.

**Prompt 6 (Ship):**
> Run npm run build, fix any errors. Commit everything. We're done.

---

## Workspace Structure (what Claude Code sees)

```
cccl_buildathon/
├── CLAUDE.md                    ← Project memory (loaded every session)
├── .claude/
│   ├── agents/
│   │   ├── orchestrator.md      ← Main session agent
│   │   ├── assets.md            ← Stream C (tokens + fixture)
│   │   ├── engine.md            ← Stream B (scoring engine)
│   │   ├── scaffold.md          ← Stream A (Vite + React + Tailwind)
│   │   ├── ui-builder.md        ← Phase 3 (components)
│   │   └── integrator.md        ← Phase 4 (wiring)
│   └── settings.json            ← Permission pre-approvals
├── .gitignore
├── claude-code-prompt.md        ← Reference doc (full plan)
└── SETUP.md                     ← This file
```

After build completes:
```
cccl_buildathon/
├── (all the above, plus:)
├── package.json
├── vite.config.js
├── design/
│   └── tokens.js
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── engine/
│   │   ├── dimensions.js
│   │   ├── llmRouter.js
│   │   ├── scorer.js
│   │   └── sessionStore.js
│   ├── components/
│   │   ├── ui/ (Button, Card, Badge, Input, TextArea)
│   │   ├── DeltaInput.jsx
│   │   ├── RadarChart.jsx
│   │   ├── ScoreCard.jsx
│   │   └── NarrativeBlock.jsx
│   ├── fixtures/
│   │   └── acme.json
│   └── hooks/
│       └── useScorer.js
└── dist/                        ← Production build output
```
