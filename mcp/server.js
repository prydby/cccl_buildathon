#!/usr/bin/env node
/**
 * PilotIQ MCP Server
 *
 * Exposes the PilotIQ assessment engine as an MCP tool so any agent
 * (Claude Desktop, Claude Code, custom agents) can call `assess_readiness`.
 *
 * Transport: stdio, JSON-RPC 2.0 (line-delimited).
 * Dependency-free — wraps the same pure core the web app uses.
 *
 * Run:   node mcp/server.js
 * Wire into Claude Desktop via mcp config (see mcp/README.md).
 */

import { runAssessment } from '../src/core/index.js'
import { createInterface } from 'node:readline'

const TOOL = {
  name: 'assess_readiness',
  description:
    'Assess whether a tech product is ready to move from pilot to production. ' +
    'Returns a GO/CONDITIONAL/NO-GO verdict, TRL level (1-9), per-axis scores with evidence, gaps, and a remediation roadmap.',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Product / system name' },
      productType: {
        type: 'string',
        description:
          'One of: AI Agent / MCP Tool, SaaS Platform, Consumer App, API / Platform Service, Data Pipeline / MLOps, Infrastructure / DevTool, Marketplace / Aggregator, Other',
      },
      document: {
        type: 'string',
        description: 'The product document: BRD, PRD, architecture overview, or detailed system description (>=20 chars)',
      },
    },
    required: ['name', 'productType', 'document'],
  },
}

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n')
}

function reply(id, result) {
  send({ jsonrpc: '2.0', id, result })
}

function fail(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } })
}

function handle(req) {
  const { id, method, params } = req

  switch (method) {
    case 'initialize':
      return reply(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'pilotiq', version: '1.0.0' },
      })

    case 'tools/list':
      return reply(id, { tools: [TOOL] })

    case 'tools/call': {
      if (params?.name !== 'assess_readiness') {
        return fail(id, -32602, `Unknown tool: ${params?.name}`)
      }
      try {
        const a = runAssessment(params.arguments || {})
        const summary =
          `PilotIQ Assessment — ${a.intake.name}\n` +
          `Framework: ${a.framework.name}\n` +
          `Verdict: ${a.trl.verdict} · TRL ${a.trl.level}/9 · Overall ${a.scorecard.overall}/10\n\n` +
          a.scorecard.dimensions.map((d) => `  ${d.name}: ${d.score}/10`).join('\n') +
          `\n\nBlocking: ${a.trl.blockingGaps.join(', ') || 'none'}` +
          `\nWarnings: ${a.trl.warnings.join(', ') || 'none'}\n\n` +
          a.narrative
        return reply(id, {
          content: [
            { type: 'text', text: summary },
            { type: 'text', text: '```json\n' + JSON.stringify(a, null, 2) + '\n```' },
          ],
        })
      } catch (err) {
        return reply(id, {
          isError: true,
          content: [{ type: 'text', text: `Assessment failed: ${err.message}` }],
        })
      }
    }

    case 'notifications/initialized':
      return // no response to notifications

    default:
      if (id !== undefined) fail(id, -32601, `Method not found: ${method}`)
  }
}

const rl = createInterface({ input: process.stdin })
rl.on('line', (line) => {
  const trimmed = line.trim()
  if (!trimmed) return
  try {
    handle(JSON.parse(trimmed))
  } catch {
    // ignore malformed lines
  }
})
