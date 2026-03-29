# Tool Design & MCP Integration (18% of Exam)

## 1. Tool Descriptions: The Primary Selection Mechanism

The tool description is the single most important factor in whether a model correctly selects and uses a tool. The model reads tool descriptions to decide:

- Which tool to call
- What parameters to provide
- When to use one tool over another

### What to Include in Tool Descriptions

- **Purpose**: what the tool does in one sentence
- **Input formats**: expected parameter types, acceptable values, units
- **Example queries**: concrete examples of valid invocations
- **Edge cases**: what happens with empty input, null values, boundary conditions
- **Boundary explanations**: when to use this tool vs a similar one

### Example: Well-Designed Tool Description

```json
{
  "name": "search_customers",
  "description": "Search for customers by name, email, or phone number. Returns up to 10 matching customers sorted by relevance. Use this tool when the user asks to find, look up, or search for a customer. Input should be a search query string (e.g., 'John Smith', 'john@example.com', '+1-555-0123'). Returns empty array if no matches found. For retrieving a specific customer by ID, use get_customer instead.",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query: name, email, or phone number"
      }
    },
    "required": ["query"]
  }
}
```

### Splitting Broad Tools into Granular Tools

**Bad**: One `database_query` tool that accepts arbitrary SQL

**Good**: Separate tools with clear purposes:

- `search_customers`: find customers by name/email/phone
- `get_customer`: retrieve a specific customer by ID
- `list_recent_orders`: get recent orders for a customer
- `update_customer_email`: change a customer's email address

Benefits of granular tools:

- Easier for the model to select the right one
- Simpler input schemas
- Better error handling per operation
- Easier to restrict access (principle of least privilege)

---

## 2. Structured Error Responses

Never throw exceptions or return empty strings from tools. Always return structured error objects.

### Error Response Schema

```json
{
  "isError": true,
  "errorCategory": "validation",
  "isRetryable": false,
  "message": "Customer ID must be a positive integer. Received: 'abc'"
}
```

### Error Categories

| Category | Meaning | Retryable? | Example |
|---|---|---|---|
| `transient` | Temporary failure, try again | Yes | Network timeout, rate limit |
| `validation` | Invalid input | No (unless input changes) | Malformed email, wrong type |
| `business` | Business rule violation | No | Cannot cancel shipped order |
| `permission` | Access denied | No | User lacks admin role |

### Key Rules

- **Never throw exceptions**: the model cannot catch or interpret stack traces
- **Never return empty strings**: the model cannot distinguish "no results" from "error"
- **Distinguish access failures from valid empty results**:
  - Access failure: `{"isError": true, "errorCategory": "permission", "message": "..."}`
  - Valid empty: `{"isError": false, "results": [], "message": "No customers match query"}`

### Why This Matters

The model uses error responses to decide next steps:

- `isRetryable: true` with `transient` error: model may retry
- `validation` error: model adjusts input and tries again
- `permission` error: model escalates or informs the user
- `business` error: model explains the constraint to the user

---

## 3. Scoped Tool Access

### Principle: 4-5 Tools Per Agent

- Each agent should have access to a small, focused set of tools
- Do not give a single agent 18 tools
- Reduces confusion, improves selection accuracy
- Aligns with principle of least privilege

### Example Scoping

```
Coordinator Agent:
  tools: [Task]  # Can only spawn subagents

Research Agent:
  tools: [Grep, Glob, Read, web_search]  # Read-only exploration

Editor Agent:
  tools: [Read, Write, Edit, Bash]  # Can modify files

Reviewer Agent:
  tools: [Read, Grep, Glob]  # Read-only analysis
```

---

## 4. tool_choice Parameter

Controls how the model uses tools on each turn.

| Value | Behavior | Use Case |
|---|---|---|
| `"auto"` | Model may or may not call a tool | Default, most flexible |
| `"any"` | Model must call at least one tool | Force tool use when you know a tool is needed |
| `{"type": "tool", "name": "..."}` | Model must call this specific tool | Force a particular tool call |

### Code Example

```python
# Auto: model decides
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    tools=tools,
    tool_choice={"type": "auto"},
    messages=messages,
)

# Any: must use a tool
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    tools=tools,
    tool_choice={"type": "any"},
    messages=messages,
)

# Forced: must use specific tool
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    tools=tools,
    tool_choice={"type": "tool", "name": "search_customers"},
    messages=messages,
)
```

---

## 5. MCP (Model Context Protocol)

### Server Scoping

| File | Scope | Version Controlled? | Use Case |
|---|---|---|---|
| `.mcp.json` | Project-level | Yes | Shared project tools |
| `~/.claude.json` | Personal/global | No | Personal tools, API keys |

### Environment Variable Expansion

`.mcp.json` supports environment variable expansion for secrets:

```json
{
  "mcpServers": {
    "database": {
      "command": "mcp-server-postgres",
      "args": ["--connection-string", "${DATABASE_URL}"]
    }
  }
}
```

This keeps secrets out of version control while allowing project-level MCP configuration.

### MCP Primitives

| Primitive | Controlled By | Description |
|---|---|---|
| **Resources** | Application (app-controlled) | Content catalogs the application exposes to the model. The app decides when to attach resources to context. |
| **Tools** | Model (model-controlled) | Functions the model can call. The model decides when and how to invoke tools. |
| **Prompts** | User (user-controlled) | Pre-built prompt templates the user selects. The user triggers prompt execution. |

### MCP Transports

#### Stdio Transport

- **Same-machine** communication
- Full bidirectional streaming
- Uses stdin/stdout pipes
- Best for local tools and development
- Supports all MCP features (progress, sampling, etc.)

```json
{
  "mcpServers": {
    "local-db": {
      "command": "mcp-server-sqlite",
      "args": ["/path/to/database.db"]
    }
  }
}
```

#### StreamableHTTP Transport

- **Remote** communication over HTTP
- Server-to-client communication uses SSE (Server-Sent Events)
- Limited compared to Stdio (some features not available)
- Best for remote/hosted MCP servers

#### Stateless HTTP Flag

- Disables sessions, progress reporting, and sampling
- Use when the server is a simple request-response API
- Reduces complexity for simple tool servers

### MCP Sampling

MCP Sampling allows **servers to request LLM generation from clients**. This inverts the normal flow:

Normal: Client sends prompt to server's LLM
Sampling: Server asks client's LLM to generate text

Use case: an MCP server needs the model to analyze or transform data as part of tool execution.

---

## 6. Built-in Tools in Claude Code

| Tool | Purpose | Notes |
|---|---|---|
| `Grep` | Content search (ripgrep-based) | Search file contents by regex |
| `Glob` | File pattern matching | Find files by name patterns |
| `Read` | Read file contents | Supports line ranges |
| `Write` | Create/overwrite files | Must Read first for existing files |
| `Edit` | Surgical text replacement | Preferred over Write for modifications |
| `Bash` | Shell command execution | Full shell access |

### Edit Fallback Pattern

When `Edit` fails because `old_string` is not unique in the file:

1. Use `Read` to get the full file contents
2. Use `Write` to overwrite with the corrected version

This is the standard fallback when Edit cannot find a unique match.

---

## 7. Batch Tool Pattern

Multiple tools can be called in a single model response turn. This enables parallel execution:

```json
// Model response includes multiple tool_use blocks:
[
  {"type": "tool_use", "id": "1", "name": "read_file", "input": {"path": "a.ts"}},
  {"type": "tool_use", "id": "2", "name": "read_file", "input": {"path": "b.ts"}},
  {"type": "tool_use", "id": "3", "name": "read_file", "input": {"path": "c.ts"}}
]
```

All three reads execute in parallel, and all results are returned together. This reduces round trips and speeds up agentic execution.

---

## 8. Built-in API Tools

### Web Search Tool

Claude API includes a built-in `web_search` tool:

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    tools=[{"type": "web_search_20250305"}],
    messages=[{"role": "user", "content": "What is the current price of AAPL?"}],
)
```

- No MCP server needed
- Built into the API
- Model decides when to search

### Text Editor Tool

Built-in tool for file editing in the API (separate from Claude Code's Edit tool):

```python
tools=[{
    "type": "text_editor_20250429",
    "name": "str_replace_based_edit_tool"
}]
```

### Computer Use

- A tool system for controlling a computer (mouse, keyboard, screen)
- Typically runs inside a Docker container for safety
- The model sees screenshots and issues actions
- Use for tasks requiring GUI interaction

---

## 9. Tool Design Principles Summary

1. **Descriptions are everything**: the model selects tools based on descriptions alone
2. **One tool, one purpose**: split broad tools into focused, single-purpose tools
3. **Structured errors**: always return `isError`, `errorCategory`, `isRetryable`
4. **Never throw, never return empty**: the model needs interpretable responses
5. **Scope access**: 4-5 tools per agent, not the entire toolkit
6. **Distinguish empty from error**: valid empty results are not errors
7. **Include examples in descriptions**: concrete usage examples improve selection
8. **Edge cases in descriptions**: document boundary conditions and limitations
