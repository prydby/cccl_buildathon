import React, { useState, useRef, useEffect } from 'react'
import Button from './ui/Button.jsx'

const PRESET_RESPONSES = {
  'help': "I can help you with:\n• **Company Evaluation** — assess a startup across 7 dimensions\n• **Product Evaluation** — score a product's market fit, UX, and scalability\n• **Strategy** — generate improvement plans based on scores\n• **Comparison** — understand how dimensions relate\n\nWhat would you like to do?",
  'what is pilotiq': "PilotIQ is an AI-powered evaluation intelligence platform. It scores companies and products across structured frameworks — giving you consistent, explainable assessments in seconds instead of days.\n\nThink of it as a co-pilot for decision-making. Whether you're evaluating an investment, a product launch, or a partnership — PilotIQ gives you a structured lens.",
  'how does scoring work': "PilotIQ evaluates across 7 dimensions:\n\n1. **Market Opportunity** (15%) — TAM, growth, timing\n2. **Product Differentiation** (15%) — uniqueness, moat\n3. **Team & Execution** (20%) — track record, velocity\n4. **Financial Health** (15%) — revenue, burn, runway\n5. **Scalability** (15%) — unit economics, automation\n6. **Competitive Moat** (10%) — defensibility\n7. **Risk Profile** (10%) — concentration, mitigation\n\nEach gets a 1-10 score with reasoning and confidence. The overall is a weighted average.",
  'what dimensions': "The 7 evaluation dimensions are:\n\n🎯 Market Opportunity (15%)\n💎 Product Differentiation (15%)\n👥 Team & Execution (20%)\n💰 Financial Health (15%)\n📈 Scalability (15%)\n🏰 Competitive Moat (10%)\n⚠️ Risk Profile (10%)\n\nWeights reflect importance for growth-stage companies. The framework is research-backed and config-driven — dimensions can be customized per use case.",
  'default': "I'm your PilotIQ assistant. I can help you understand evaluations, explain dimensions, suggest improvements, or guide you through the platform.\n\nTry asking:\n• \"How does scoring work?\"\n• \"What are the dimensions?\"\n• \"Help me evaluate a company\"\n• \"What is PilotIQ?\"",
}

function getResponse(input) {
  const lower = input.toLowerCase().trim()
  if (lower.includes('help') || lower.includes('what can you')) return PRESET_RESPONSES['help']
  if (lower.includes('pilotiq') || lower.includes('what is this')) return PRESET_RESPONSES['what is pilotiq']
  if (lower.includes('scoring') || lower.includes('how does') || lower.includes('how it works')) return PRESET_RESPONSES['how does scoring work']
  if (lower.includes('dimension') || lower.includes('criteria') || lower.includes('framework')) return PRESET_RESPONSES['what dimensions']
  if (lower.includes('evaluate') || lower.includes('score') || lower.includes('assess')) {
    return "To evaluate a company or product:\n\n1. Click **Company Eval** or **Product Eval** in the sidebar\n2. Fill in the details form\n3. Click **Evaluate** — I'll score across all 7 dimensions\n4. View your radar chart, scorecards, and recommendations\n5. Click **Strategize** for an action plan\n\nWant me to run a demo evaluation for you? Click 'Try Demo' in the sidebar!"
  }
  if (lower.includes('improve') || lower.includes('strategy') || lower.includes('recommendation')) {
    return "After any evaluation, scroll to the **Suggested Next Steps** section. It identifies your weakest dimensions and gives actionable recommendations.\n\nClick the **⚡ Strategize** button to generate a phased improvement plan with:\n• Quick wins (0-30 days)\n• Foundation building (30-90 days)\n• Execution phase (90-180 days)\n\nThe plan targets a 1.0+ point improvement in overall score."
  }
  return PRESET_RESPONSES['default']
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Hi! I'm your PilotIQ assistant. Ask me anything about evaluations, dimensions, or how to use the platform." }
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

    // Simulate typing delay
    setTimeout(() => {
      const response = getResponse(userMsg.content)
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 800 + Math.random() * 500)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isOpen
            ? 'bg-[#1e293b] border border-[#334155] rotate-45'
            : 'bg-cyan-500 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-[#f1f5f9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-[#0a0e17]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] bg-[#111827] border border-[#1e293b] rounded-2xl shadow-2xl flex flex-col animate-fade-in-up overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#1e293b] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#f1f5f9]">PilotIQ Assistant</p>
              <p className="text-xs text-green-400">● Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/20 text-[#f1f5f9] border border-cyan-500/30'
                    : 'bg-[#1a2332] text-[#cbd5e1] border border-[#1e293b]'
                }`}>
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className={j > 0 ? 'mt-1' : ''}>
                      {line.replace(/\*\*(.*?)\*\*/g, '⟨$1⟩').split('⟨').map((part, k) => {
                        if (part.includes('⟩')) {
                          const [bold, rest] = part.split('⟩')
                          return <span key={k}><strong className="text-[#f1f5f9]">{bold}</strong>{rest}</span>
                        }
                        return <span key={k}>{part}</span>
                      })}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1a2332] border border-[#1e293b] rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#4b5563] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#4b5563] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#4b5563] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#1e293b]">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about evaluations, dimensions..."
                className="flex-1 bg-[#0a0e17] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder:text-[#4b5563] focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-3 py-2 bg-cyan-500 text-[#0a0e17] rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
