import React, { useState } from 'react'
import Button from './ui/Button.jsx'
import Card from './ui/Card.jsx'
import Input from './ui/Input.jsx'
import TextArea from './ui/TextArea.jsx'
import Select from './ui/Select.jsx'

const VERTICALS = ['Enterprise SaaS', 'Consumer', 'Fintech', 'Healthcare', 'E-commerce', 'Other']
const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth']

export default function DeltaInput({ onSubmit, isLoading = false, onReset, defaultValues }) {
  const [form, setForm] = useState({
    companyName: defaultValues?.companyName || '',
    vertical: defaultValues?.vertical || '',
    stage: defaultValues?.stage || '',
    description: defaultValues?.description || '',
    metrics: {
      arr: defaultValues?.metrics?.arr || '',
      growth: defaultValues?.metrics?.growth || '',
      nrr: defaultValues?.metrics?.nrr || '',
      customers: defaultValues?.metrics?.customers || '',
      teamSize: defaultValues?.metrics?.teamSize || '',
    },
  })
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!form.companyName.trim()) errs.companyName = 'Company name is required'
    if (!form.vertical) errs.vertical = 'Select a vertical'
    if (!form.stage) errs.stage = 'Select a stage'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (form.description.trim().length < 20) errs.description = 'At least 20 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  function handleReset() {
    setForm({
      companyName: '',
      vertical: '',
      stage: '',
      description: '',
      metrics: { arr: '', growth: '', nrr: '', customers: '', teamSize: '' },
    })
    setErrors({})
    onReset?.()
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function updateMetric(field, value) {
    setForm((prev) => ({
      ...prev,
      metrics: { ...prev.metrics, [field]: value },
    }))
  }

  const isValid = form.companyName.trim() && form.vertical && form.stage && form.description.trim().length >= 20

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
      <Input
        label="Company Name"
        value={form.companyName}
        onChange={(e) => updateField('companyName', e.target.value)}
        placeholder="e.g., Acme Corp"
        error={errors.companyName}
        required
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Vertical"
          value={form.vertical}
          onChange={(e) => updateField('vertical', e.target.value)}
          options={VERTICALS}
          error={errors.vertical}
          required
          disabled={isLoading}
        />
        <Select
          label="Stage"
          value={form.stage}
          onChange={(e) => updateField('stage', e.target.value)}
          options={STAGES}
          error={errors.stage}
          required
          disabled={isLoading}
        />
      </div>

      <TextArea
        label="Company Description"
        value={form.description}
        onChange={(e) => updateField('description', e.target.value)}
        placeholder="Describe what the company does, its key value proposition, and target market..."
        error={errors.description}
        required
        maxLength={500}
        disabled={isLoading}
      />

      <Card title="Key Metrics (optional)" className="!p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Input
            label="ARR"
            value={form.metrics.arr}
            onChange={(e) => updateMetric('arr', e.target.value)}
            placeholder="$12M"
            disabled={isLoading}
          />
          <Input
            label="Growth Rate"
            value={form.metrics.growth}
            onChange={(e) => updateMetric('growth', e.target.value)}
            placeholder="140% YoY"
            disabled={isLoading}
          />
          <Input
            label="NRR"
            value={form.metrics.nrr}
            onChange={(e) => updateMetric('nrr', e.target.value)}
            placeholder="125%"
            disabled={isLoading}
          />
          <Input
            label="Customers"
            value={form.metrics.customers}
            onChange={(e) => updateMetric('customers', e.target.value)}
            placeholder="340"
            type="number"
            disabled={isLoading}
          />
          <Input
            label="Team Size"
            value={form.metrics.teamSize}
            onChange={(e) => updateMetric('teamSize', e.target.value)}
            placeholder="85"
            type="number"
            disabled={isLoading}
          />
        </div>
      </Card>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isLoading} disabled={!isValid}>
          {isLoading ? 'Evaluating...' : 'Evaluate Company'}
        </Button>
        <Button type="button" variant="ghost" onClick={handleReset} disabled={isLoading}>
          Reset
        </Button>
      </div>
    </form>
  )
}
