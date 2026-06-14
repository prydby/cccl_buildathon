import React, { useState } from 'react'
import Button from '../../shared/ui/Button.jsx'
import Card from '../../shared/ui/Card.jsx'
import Input from '../../shared/ui/Input.jsx'
import TextArea from '../../shared/ui/TextArea.jsx'
import Select from '../../shared/ui/Select.jsx'

const PRODUCT_TYPES = [
  'AI Agent / MCP Tool',
  'SaaS Platform',
  'Consumer App',
  'API / Platform Service',
  'Data Pipeline / MLOps',
  'Infrastructure / DevTool',
  'Marketplace / Aggregator',
  'Other',
]

const STATES = ['POC / Prototype', 'Internal Pilot', 'External Pilot', 'Beta', 'Limited GA', 'Scaling']
const SCALE_TARGETS = ['1,000 users', '10,000 users', '100,000 users', '1M+ users']

export default function AgentReadinessForm({ onSubmit, isLoading = false, onReset }) {
  const [form, setForm] = useState({
    name: '',
    productType: '',
    state: '',
    scaleTarget: '',
    description: '',
  })
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.productType) errs.productType = 'Select product type (drives framework selection)'
    if (!form.description.trim() || form.description.trim().length < 50) {
      errs.description = 'Paste your product document or describe the system in detail (50+ chars)'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const isValid = form.name.trim() && form.productType && form.description.trim().length >= 50

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
      {/* Product identity */}
      <Input
        label="Product / System Name"
        value={form.name}
        onChange={(e) => updateField('name', e.target.value)}
        placeholder="e.g., RidePool AI, DocSearch Agent"
        error={errors.name}
        required
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Product Type"
          value={form.productType}
          onChange={(e) => updateField('productType', e.target.value)}
          options={PRODUCT_TYPES}
          error={errors.productType}
          required
          disabled={isLoading}
        />
        <Select
          label="Current State"
          value={form.state}
          onChange={(e) => updateField('state', e.target.value)}
          options={STATES}
          disabled={isLoading}
        />
        <Select
          label="Scale Target"
          value={form.scaleTarget}
          onChange={(e) => updateField('scaleTarget', e.target.value)}
          options={SCALE_TARGETS}
          disabled={isLoading}
        />
      </div>

      {/* The main input: document paste */}
      <div>
        <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
          Product Document <span className="text-cyan-400">*</span>
          <span className="text-xs text-[#4b5563] ml-2 font-normal">
            (BRD, PRD, architecture doc, or system description)
          </span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder={"Paste your BRD, PRD, or describe your system in detail:\n\n• What does it do?\n• Tech stack & architecture\n• Current scale (users, requests, data)\n• Known issues or gaps\n• Integration points\n• Team size & velocity\n\nThe more detail, the better the assessment. PilotIQ extracts evidence from what you provide."}
          rows={12}
          className={`
            w-full px-4 py-3 rounded-xl text-sm font-mono leading-relaxed resize-none
            bg-[#0a0e17] border text-[#f1f5f9]
            placeholder:text-[#334155]
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-500
            ${errors.description ? 'border-red-500' : 'border-[#1e293b] hover:border-[#334155]'}
          `}
          disabled={isLoading}
        />
        {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-[10px] text-[#334155]">
            Tip: Include tech stack, architecture decisions, current metrics, known gaps
          </p>
          <p className={`text-[10px] ${form.description.length > 100 ? 'text-[#4b5563]' : 'text-[#334155]'}`}>
            {form.description.length} chars
          </p>
        </div>
      </div>

      {/* Framework preview */}
      {form.productType && (
        <Card className="!p-3 !bg-[#111827] animate-fade-in-up">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#4b5563]">Assessment framework:</span>
            <span className="text-xs font-medium text-cyan-400">
              {getFrameworkName(form.productType)}
            </span>
          </div>
          <p className="text-[10px] text-[#4b5563] mt-1">
            {getFrameworkSources(form.productType)}
          </p>
        </Card>
      )}

      {/* Data notice */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/10">
        <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-[10px] text-green-400/80">
          All processing runs locally in your browser. No document content is sent to any server.
        </p>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" loading={isLoading} disabled={!isValid}>
          {isLoading ? 'Assessing...' : 'Run Assessment'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => { setForm({ name: '', productType: '', state: '', scaleTarget: '', description: '' }); setErrors({}); onReset?.() }} disabled={isLoading}>
          Clear
        </Button>
      </div>
    </form>
  )
}

function getFrameworkName(productType) {
  const map = {
    'AI Agent / MCP Tool': 'Agent Readiness Model (ARM)',
    'SaaS Platform': 'SaaS Production Readiness (SPR)',
    'Consumer App': 'Platform Scale Readiness (PSR)',
    'API / Platform Service': 'Service Maturity Model (SMM)',
    'Data Pipeline / MLOps': 'DataOps + MLOps Maturity',
    'Infrastructure / DevTool': 'Platform Engineering Maturity (PEM)',
    'Marketplace / Aggregator': 'Platform Scale Readiness (PSR)',
    'Other': 'General Production Readiness (GPR)',
  }
  return map[productType] || 'General Production Readiness'
}

function getFrameworkSources(productType) {
  const map = {
    'AI Agent / MCP Tool': 'Sources: Anthropic RSP, MLOps Maturity, OWASP AI, Google SRE PRR',
    'SaaS Platform': 'Sources: AWS Well-Architected, DORA Metrics, ISO 25010, Google SRE PRR',
    'Consumer App': 'Sources: Google SRE PRR, DORA Metrics, SPACE Framework, Accelerate',
    'API / Platform Service': 'Sources: Google SRE PRR, DORA Metrics, ThoughtWorks Fitness Functions',
    'Data Pipeline / MLOps': 'Sources: Google MLOps Maturity, DataOps Principles, DORA Metrics',
    'Infrastructure / DevTool': 'Sources: Platform Engineering Maturity, SPACE Framework, DORA',
    'Marketplace / Aggregator': 'Sources: Google SRE PRR, AWS Well-Architected, DORA, ISO 25010',
    'Other': 'Sources: Google SRE PRR, DORA Metrics, AWS Well-Architected, NASA TRL',
  }
  return map[productType] || ''
}
