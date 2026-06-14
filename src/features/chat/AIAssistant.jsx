import React, { useState, useRef, useEffect } from 'react'

// ─── Knowledge Base ──────────────────────────────────────────

const KNOWLEDGE = {
  product: {
    'what is pilotiq': "PilotIQ is an AI-powered production readiness assessment platform. Think of it as a structured \"go/no-go\" gate for tech products.\n\nYou feed it your product documentation (BRD, PRD, architecture docs), and it produces a comprehensive readiness assessment — telling you whether your pilot is ready to become a production system.\n\nNo more ad-hoc reviews that depend on who's in the room. PilotIQ gives every team the same structured lens.",
    'who is it for': "PilotIQ serves three primary users:\n\n1. **Engineering Directors/VPs** — deciding whether to invest in scaling a pilot\n2. **CTOs / Tech Leads** — need a structured go/no-go before committing resources\n3. **Product Managers** — assessing technical readiness alongside product-market fit\n\nAnyone who's asked \"is this ready for production?\" and gotten a shrug instead of data.",
    'how does it work': "Three steps:\n\n**1. Feed your docs** — paste your BRD, PRD, or system description. The more detail, the better the assessment.\n\n**2. Framework auto-selected** — PilotIQ detects your product type (AI agent, SaaS, consumer app, etc.) and picks the right assessment framework.\n\n**3. Evidence-based verdict** — GO / CONDITIONAL / NO-GO with per-axis scores, gap analysis, competitor context, and a prioritized roadmap to fix gaps.\n\nThe key: it assesses based on what's IN your docs. Missing info = flagged gap. Can't game it.",
    'what frameworks': "PilotIQ synthesizes from **12 industry-leading frameworks**:\n\n• Google SRE Production Readiness Review\n• Amazon Operational Readiness Review (ORR)\n• DORA Four Key Metrics\n• AWS Well-Architected Framework\n• NASA Technology Readiness Level (TRL)\n• ISO 25010 Software Quality\n• OWASP AI Security Top 10\n• Anthropic Responsible Scaling Policy\n• Google Cloud MLOps Maturity Model\n• SPACE Framework (GitHub/Microsoft)\n• ThoughtWorks Architecture Fitness Functions\n• Accelerate (Forsgren, Humble, Kim)\n\nThe framework applied depends on your product type — an AI agent is assessed differently from a data pipeline.",
    'why not just use chatgpt': "Three problems with ad-hoc LLM assessments:\n\n1. **No structure** — every prompt gets a different format, different axes, different depth\n2. **No evidence tracking** — ChatGPT doesn't cite what's missing from YOUR docs\n3. **No repeatability** — run it again next month and you can't compare\n\nPilotIQ gives you: consistent framework, evidence-based scoring, industry benchmarks, and assessment history you can track over time.",
    'what is the verdict': "Three possible verdicts:\n\n🟢 **GO** — All axes score 7+ . Safe to scale with standard monitoring.\n\n🟡 **CONDITIONAL** — Some areas need improvement but nothing critical. Proceed with a remediation plan.\n\n🔴 **NO-GO** — Critical gaps (axes below 5) that would cause production failures. Fix these first.\n\nPlus a **TRL Level (1-9)** based on NASA's Technology Readiness scale — gives you a universal maturity indicator.",
    'what about cabby': "Cabby is our demo case — an AI-native cab aggregation platform.\n\nIt compares rides across Uber, Ola, Namma Yatri, BluSmart, and Rapido in real-time using 4 AI agents:\n• Price Prediction Agent (surge forecast 15 min ahead)\n• Route Optimization Agent (multi-provider scoring)\n• Provider Orchestration Agent (MCP-based booking)\n• User Preference Agent (learns your habits)\n\nCurrently piloting in 3 Indian cities with 3,200 users. PilotIQ assessed it as **CONDITIONAL GO** — strong PMF (8.4/10) but gaps in observability, reliability, and security.",
    'competitor analysis': "PilotIQ includes competitive context in assessments. For example, the Cabby demo shows:\n\n• **vs Uber** — users see when Uber is overcharging\n• **vs Ola** — aggregated, not locked-in\n• **vs Namma Yatri** — zero-commission option surfaced\n• **vs BluSmart** — EV/fixed-price when user prefers sustainability\n• **vs Rapido** — fastest for short trips\n\nCabby's moat: it's the meta-layer. Not competing with providers — making all of them better for users.",
    'data security': "Your data never leaves your browser.\n\nPilotIQ runs entirely client-side in mock/demo mode. No backend server receives your documents. Assessment processing happens in your browser.\n\nFor production mode (with live LLM calls), data goes only to the configured LLM provider (Claude/GPT) and is not stored. We follow zero-retention principles.\n\nYou can paste proprietary BRDs without risk.",
    'pricing': "PilotIQ is currently free and open-source (buildathon project).\n\nFuture model: freemium — free for individual assessments, paid for team features (assessment history, collaboration, API access, custom frameworks).",
  },
  tech: {
    'architecture': "PilotIQ's architecture:\n\n```\nIntake Layer → Framework Selector → Assessment Engine → TRL Calculator → Output Layer\n```\n\n**Key patterns:**\n• **Strategy Pattern** — LLM providers (Claude/GPT/Mock) are interchangeable strategies\n• **Dependency Injection** — Scorer receives router + axes, owns no infrastructure\n• **Fan-out Scoring** — All axes assessed in parallel via Promise.allSettled\n• **Config-driven** — Axes are JSON config. Add a framework = add config, zero code changes\n• **Typed Error Hierarchy** — RateLimitError, APIError, TimeoutError extend LLMError\n• **Circuit Breaker** — Exponential backoff (1s, 2s, 4s) on retryable errors\n• **Cache Fallback** — If LLM fails, serve last cached assessment with 'stale' flag\n\nAll in vanilla ES modules. No framework lock-in beyond React for UI.",
    'tech stack': "**Frontend:** React 18 + Vite 6 + Tailwind CSS 4\n**Charts:** Recharts (radar visualization)\n**Engine:** Pure ES modules (no framework)\n**LLM Integration:** Provider-agnostic router (Strategy Pattern)\n**State:** React hooks + refs (no Redux/Zustand overhead)\n**Build:** Vite (sub-2s builds)\n**Deployment:** Static site — deploy anywhere (Vercel, S3, Netlify)\n\nNo backend required for demo mode. Full client-side assessment.",
    'how does scoring work': "Technical scoring flow:\n\n1. **Document parsing** — Extract signals from raw text input\n2. **Framework selection** — Match product type to assessment model (strategy pattern)\n3. **Prompt construction** — Per-axis prompt templates with {{variable}} interpolation from intake\n4. **Fan-out execution** — `Promise.allSettled()` fires all axis assessments in parallel\n5. **Response parsing** — Try JSON parse first, fall back to regex extraction (score patterns, reasoning)\n6. **Aggregation** — Weighted sum using axis weights (sum to 1.0)\n7. **TRL mapping** — Score→TRL level function + verdict rules (GO/CONDITIONAL/NO-GO)\n8. **Gap analysis** — Filter axes <5 (blocking) and <7 (warning), generate remediation\n\nMock mode: deterministic — matches axis name in prompt against fixture data.",
    'llm router': "The `llmRouter.js` module implements the Strategy Pattern:\n\n```javascript\ncreateLLMRouter({ provider: 'mock' | 'openai' | 'anthropic', apiKey, model, mockFixture })\n```\n\n**Returns:** `{ complete(prompt), getTokenUsage(), resetTokenUsage() }`\n\n**Features:**\n• Token tracking (input/output per call, cumulative)\n• Exponential backoff retry (1s, 2s, 4s) on 429/500/503\n• Typed errors: RateLimitError, APIError, TimeoutError\n• Timeout: configurable per call (default 30s)\n• Mock provider: parses dimension name from prompt, returns fixture score deterministically\n\nSwap providers without touching scorer. DI at its cleanest.",
    'framework selector': "Dynamic framework selection based on product type:\n\n| Input Type | Framework Applied |\n|---|---|\n| AI Agent / MCP | Agent Readiness Model (ARM) |\n| SaaS Platform | SaaS Production Readiness (SPR) |\n| Consumer App / Marketplace | Platform Scale Readiness (PSR) |\n| API / Service | Service Maturity Model (SMM) |\n| Data Pipeline | DataOps + MLOps Maturity |\n| Infrastructure Tool | Platform Engineering Maturity |\n\nEach framework has different axes, weights, and prompt templates. All config-driven — adding a new framework is adding a JSON file, not writing code.\n\nUser sees which framework was selected and WHY. Can override.",
    'testing': "Testing approach:\n\n• **Engine tests:** Node.js direct execution — mock provider returns fixture scores, verified against expected\n• **Build verification:** Vite build with zero errors as CI gate\n• **Type safety:** JSDoc annotations on all public APIs\n• **Error paths:** Each typed error is testable independently\n• **Mock determinism:** Same input always produces same output (no randomness in mock)\n\nFor production: would add Vitest unit tests, Playwright E2E, and eval suite for LLM output quality.",
    'scalability': "Scaling story:\n\n• **Frontend:** Static site — CDN-served, infinite scale\n• **Assessment Engine:** Stateless — each assessment is independent, horizontally scalable\n• **LLM calls:** Fan-out per axis (8 parallel calls). Add axes without increasing latency.\n• **Storage:** LocalStorage for history (client). For multi-user: swap to any DB (sessionStore pattern)\n• **Cost model:** ~$0.02-0.05 per assessment (8 LLM calls × ~500 tokens each)\n\nNo backend server needed. Could run as a serverless function (Lambda/Cloud Function) for API access.",
    'mcp integration': "PilotIQ can itself be exposed as an MCP tool:\n\n```json\n{\n  \"name\": \"assess_readiness\",\n  \"description\": \"Assess a product's production readiness\",\n  \"inputSchema\": {\n    \"name\": \"string\",\n    \"productType\": \"string\", \n    \"document\": \"string\"\n  }\n}\n```\n\nThis means: another AI agent (like Claude Code or Kiro) could call PilotIQ as a tool to assess any system it's working on. Agent-native from the ground up.",
    'why these frameworks': "We evaluated 20+ frameworks and selected 12 based on:\n\n1. **Industry adoption** — used by top-tier engineering orgs (Google, Amazon, NASA)\n2. **Specificity** — each adds a unique lens (DORA = velocity, SRE = reliability, TRL = maturity staging)\n3. **Measurability** — all axes map to observable, verifiable indicators\n4. **Composability** — frameworks combine cleanly without overlap\n\nThe synthesis isn't averaging — it's selecting which axes from which framework apply to which product type. A data pipeline needs DataOps axes, not OWASP AI.",
    'cabby architecture': "Cabby's AI agent system:\n\n```\n┌─────────────────────────────────────────┐\n│ User Request (\"get me a ride\")          │\n│              ↓                          │\n│ ┌─────────────────────────────────────┐ │\n│ │ Provider Orchestration Agent (MCP)  │ │\n│ │ - Calls 5 provider APIs in parallel │ │\n│ │ - Handles failover + retry          │ │\n│ └──────────┬──────────────────────────┘ │\n│            ↓                            │\n│ ┌─────────────────────────────────────┐ │\n│ │ Price Prediction Agent              │ │\n│ │ - XGBoost + real-time features      │ │\n│ │ - 87% surge accuracy (15 min)       │ │\n│ └──────────┬──────────────────────────┘ │\n│            ↓                            │\n│ ┌─────────────────────────────────────┐ │\n│ │ Route Optimization Agent            │ │\n│ │ - Score: price × ETA × rating ×     │ │\n│ │   carbon footprint                  │ │\n│ └──────────┬──────────────────────────┘ │\n│            ↓                            │\n│ ┌─────────────────────────────────────┐ │\n│ │ User Preference Agent               │ │\n│ │ - Time patterns, price sensitivity  │ │\n│ │ - Gets smarter with use             │ │\n│ └─────────────────────────────────────┘ │\n└─────────────────────────────────────────┘\n```\n\nNode.js microservices (8) on EKS. Redis Streams for event processing. TensorFlow Serving for ML models.",
  },
}

// ─── Response Matcher ────────────────────────────────────────

function findResponse(input, mode) {
  const lower = input.toLowerCase().trim()
  const kb = KNOWLEDGE[mode]

  // Direct key match
  for (const [key, value] of Object.entries(kb)) {
    if (lower.includes(key.replace(/_/g, ' '))) return value
  }

  // Fuzzy matching
  const patterns = {
    product: [
      [/what.*(pilotiq|this|platform|tool)/, 'what is pilotiq'],
      [/who.*(for|use|target|audience)/, 'who is it for'],
      [/how.*(work|does|use|function)/, 'how does it work'],
      [/framework|industry|standard|source/, 'what frameworks'],
      [/why not.*(chatgpt|gpt|llm|ai)/, 'why not just use chatgpt'],
      [/verdict|go.*no.*go|result|output/, 'what is the verdict'],
      [/cabby|ride|cab|aggregat/, 'what about cabby'],
      [/competi|uber|ola|namma|blu/, 'competitor analysis'],
      [/secur|priv|data.*safe|pii/, 'data security'],
      [/price|cost|pay|free/, 'pricing'],
    ],
    tech: [
      [/architect|design|pattern|structure/, 'architecture'],
      [/stack|react|node|vite|tailwind/, 'tech stack'],
      [/scor|assess|evaluat|how.*work/, 'how does scoring work'],
      [/router|llm|provider|strategy/, 'llm router'],
      [/framework.*select|dynamic|which.*frame/, 'framework selector'],
      [/test|quality|coverage/, 'testing'],
      [/scal|performance|load|concurrent/, 'scalability'],
      [/mcp|tool.*use|agent.*native/, 'mcp integration'],
      [/why.*these|source|12.*frame/, 'why these frameworks'],
      [/cabby.*arch|agent.*system|ride.*arch/, 'cabby architecture'],
    ],
  }

  for (const [pattern, key] of patterns[mode]) {
    if (pattern.test(lower) && kb[key]) return kb[key]
  }

  // Default
  if (mode === 'product') {
    return "I can help with questions about PilotIQ as a product:\n\n• What is PilotIQ and who is it for?\n• How does the assessment work?\n• What frameworks does it use?\n• How is data handled (security)?\n• What's the Cabby demo about?\n• How is it different from ChatGPT?\n\nAsk me anything!"
  }
  return "I can answer technical questions:\n\n• System architecture & design patterns\n• Tech stack choices\n• How scoring/assessment works internally\n• LLM router implementation\n• Framework selection logic\n• Scalability & deployment\n• MCP integration\n• Cabby's agent architecture\n\nAsk away!"
}

// ─── Component ───────────────────────────────────────────────

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState('product') // 'product' | 'tech'
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Hey! I'm PilotIQ's assistant. I can answer questions from two perspectives:\n\n**🎯 Product** — what it does, who it's for, how it helps\n**⚙️ Tech** — architecture, patterns, implementation details\n\nPick a mode above, then ask me anything!" }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = findResponse(userMsg.content, mode)
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 600 + Math.random() * 400)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function switchMode(newMode) {
    setMode(newMode)
    const modeLabel = newMode === 'product' ? '🎯 Product mode' : '⚙️ Tech mode'
    const modeDesc = newMode === 'product'
      ? "I'll answer as a product person — plain language, user-focused, business value."
      : "I'll answer as a Principal SDE — architecture, patterns, implementation details, code."
    setMessages((prev) => [...prev, { role: 'assistant', content: `Switched to **${modeLabel}**\n\n${modeDesc}\n\nWhat would you like to know?` }])
  }

  return (
    <>
      {/* Floating button with bounce animation */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group ${
          isOpen
            ? 'bg-[#1e293b] border border-[#334155] rotate-45 scale-90'
            : 'bg-gradient-to-br from-cyan-400 to-cyan-600 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-110 animate-bounce-slow'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-[#f1f5f9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] h-[540px] bg-[#0f1419] border border-[#1e293b] rounded-2xl shadow-2xl flex flex-col animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#1e293b] bg-[#070b12]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                  <span className="text-xs">🤖</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#f1f5f9]">PilotIQ Assistant</p>
                  <p className="text-[9px] text-green-400">● Always available</p>
                </div>
              </div>
            </div>
            {/* Mode toggle */}
            <div className="flex gap-1.5">
              <button
                onClick={() => switchMode('product')}
                className={`flex-1 px-2 py-1.5 text-[10px] rounded-lg transition-all font-medium ${
                  mode === 'product'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-[#4b5563] hover:text-[#94a3b8] border border-transparent'
                }`}
              >
                🎯 Product / Founder
              </button>
              <button
                onClick={() => switchMode('tech')}
                className={`flex-1 px-2 py-1.5 text-[10px] rounded-lg transition-all font-medium ${
                  mode === 'tech'
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                    : 'text-[#4b5563] hover:text-[#94a3b8] border border-transparent'
                }`}
              >
                ⚙️ Tech / Engineering
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-msg-in`}>
                <div className={`max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/15 text-[#f1f5f9] border border-cyan-500/20'
                    : 'bg-[#1a2332] text-[#cbd5e1] border border-[#1e293b]'
                }`}>
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className={j > 0 ? 'mt-1.5' : ''}>
                      {line.startsWith('•') || line.startsWith('|') ? (
                        <span className="text-[#94a3b8]">{line}</span>
                      ) : line.startsWith('```') ? (
                        <code className="text-cyan-400 text-[10px] font-mono">{line.replace(/```/g, '')}</code>
                      ) : (
                        renderBold(line)
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1a2332] border border-[#1e293b] rounded-xl px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 border-t border-[#1e293b] flex gap-1.5 overflow-x-auto">
            {(mode === 'product' 
              ? ['How does it work?', 'What about Cabby?', 'Data security?']
              : ['Architecture?', 'LLM router?', 'How scoring works?']
            ).map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="flex-shrink-0 px-2 py-1 text-[9px] rounded-full bg-[#1e293b] text-[#64748b] hover:text-cyan-400 hover:border-cyan-500/30 border border-transparent transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#1e293b] bg-[#070b12]">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === 'product' ? 'Ask about the product...' : 'Ask a technical question...'}
                className="flex-1 bg-[#0a0e17] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-[#f1f5f9] placeholder:text-[#334155] focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#0a0e17] rounded-lg hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-30 disabled:shadow-none transition-all text-xs font-bold"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function renderBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) => 
    i % 2 === 1 
      ? <strong key={i} className="text-[#f1f5f9] font-semibold">{part}</strong> 
      : <span key={i}>{part}</span>
  )
}
