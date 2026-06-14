import React, { useState } from 'react'
import Button from './ui/Button.jsx'
import Card from './ui/Card.jsx'
import Input from './ui/Input.jsx'
import TextArea from './ui/TextArea.jsx'
import Select from './ui/Select.jsx'

const CATEGORIES = ['SaaS', 'Mobile App', 'Hardware', 'Marketplace', 'API/Platform', 'Consumer', 'Other']
const STAGES = ['Idea/Concept', 'MVP', 'Beta', 'Launched', 'Growth', 'Mature']

export default function ProductEvalForm({ onSubmit, isLoading = false, onReset }) {
  const [form, setForm] = useState({
    productName: '',
    category: '',
    stage: '',
    description: '',
    targetUser: '',
    metrics: {
      mau: '',
      retention: '',
      nps: '',
      conversionRate: '',
      churnRate: '',
    },
  })
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!form.productName.trim()) errs.productName = 'Product name is required'
    if (!form.category) errs.category = 'Select a category'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (form.description.trim().length < 20) errs.description = 'At least 20 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, evaluationType: 'product' })
  }

  function handleReset() {
    setForm({
      productName: '', category: '', stage: '', description: '', targetUser: '',
      metrics: { mau: '', retention: '', nps: '', conversionRate: '', churnRate: '' },
    })
    setErrors({})
    onReset?.()
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function updateMetric(field, value) {
    setForm((prev) => ({ ...prev, metrics: { ...prev.metrics, [field]: value } }))
  }

  const isValid = form.productName.trim() && form.category && form.description.trim().length >= 20

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
      <Input
        label="Product Name"
        value={form.productName}
        onChange={(e) => updateField('productName', e.target.value)}
        placeholder="e.g., Notion, Figma, Stripe"
        error={errors.productName}
        required
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => updateField('category', e.target.value)}
          options={CATEGORIES}
          error={errors.category}
          required
          disabled={isLoading}
        />
        <Select
          label="Stage"
          value={form.stage}
          onChange={(e) => updateField('stage', e.target.value)}
          options={STAGES}
          disabled={isLoading}
        />
      </div>

      <TextArea
        label="Product Description"
        value={form.description}
        onChange={(e) => updateField('description', e.target.value)}
        placeholder="What does the product do? Who is it for? What problem does it solve?"
        error={errors.description}
        required
        maxLength={500}
        disabled={isLoading}
      />

      <Input
        label="Target User"
        value={form.targetUser}
        onChange={(e) => updateField('targetUser', e.target.value)}
        placeholder="e.g., Product managers at mid-size companies"
        disabled={isLoading}
      />

      <Card title="Product Metrics (optional)" className="!p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Input label="MAU" value={form.metrics.mau} onChange={(e) => updateMetric('mau', e.target.value)} placeholder="50K" disabled={isLoading} />
          <Input label="Retention (D30)" value={form.metrics.retention} onChange={(e) => updateMetric('retention', e.target.value)} placeholder="40%" disabled={isLoading} />
          <Input label="NPS" value={form.metrics.nps} onChange={(e) => updateMetric('nps', e.target.value)} placeholder="72" disabled={isLoading} />
          <Input label="Conversion Rate" value={form.metrics.conversionRate} onChange={(e) => updateMetric('conversionRate', e.target.value)} placeholder="4.2%" disabled={isLoading} />
          <Input label="Churn Rate" value={form.metrics.churnRate} onChange={(e) => updateMetric('churnRate', e.target.value)} placeholder="2.1%" disabled={isLoading} />
        </div>
      </Card>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isLoading} disabled={!isValid}>
          {isLoading ? 'Evaluating...' : 'Evaluate Product'}
        </Button>
        <Button type="button" variant="ghost" onClick={handleReset} disabled={isLoading}>
          Reset
        </Button>
      </div>
    </form>
  )
}
