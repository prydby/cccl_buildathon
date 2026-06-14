# PilotIQ MCP Server

Exposes PilotIQ's assessment engine as an MCP tool — `assess_readiness` — so any
agent (Claude Desktop, Claude Code, custom agents) can call it to evaluate a
product's pilot-to-production readiness.

This makes PilotIQ **agent-native**: it's not just a UI, it's a capability other
AI systems can compose.

## Run

```bash
node mcp/server.js
```

Speaks JSON-RPC 2.0 over stdio (line-delimited). Dependency-free — it wraps the
same pure `src/core` engine the web app uses.

## Smoke test (no client needed)

```bash
printf '%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"assess_readiness","arguments":{"name":"Cabby","productType":"Marketplace / Aggregator","document":"AI cab aggregator. Microservices on EKS, distributed tracing, CI/CD. No encryption at rest, no load testing, no chaos testing."}}}}' \
  | node mcp/server.js
```

## Wire into Claude Desktop

Add to your MCP config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "pilotiq": {
      "command": "node",
      "args": ["/absolute/path/to/cccl_buildathon/mcp/server.js"]
    }
  }
}
```

Then ask Claude: *"Use assess_readiness to evaluate my service — here's the doc..."*

## Tool

| Tool | Input | Output |
|---|---|---|
| `assess_readiness` | `{ name, productType, document }` | Verdict, TRL, per-axis scores, gaps, remediation, narrative (text + full JSON) |
