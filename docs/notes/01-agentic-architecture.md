# Agentic Architecture & Orchestration (27% of Exam)

## 1. The Agentic Loop Lifecycle

The agentic loop is the core execution cycle that powers Claude-based agents. Understanding each phase is critical.

### Loop Steps

1. **Send request** to the model with conversation history and available tools
2. **Inspect `stop_reason`** on the response:
   - `"tool_use"`: the model wants to call one or more tools
   - `"end_turn"`: the model considers the task complete
3. **If `tool_use`**: execute the requested tool(s), collect results
4. **Return tool results** as `tool_result` messages appended to conversation history
5. **Loop back to step 1** with the updated conversation

### Code Example: Basic Agentic Loop

```python
import anthropic

client = anthropic.Anthropic()
messages = [{"role": "user", "content": "Find the largest file in /src"}]

while True:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        tools=tools,
        messages=messages,
    )

    # Append assistant response to history
    messages.append({"role": "assistant", "content": response.content})

    if response.stop_reason == "end_turn":
        break  # Model is done

    if response.stop_reason == "tool_use":
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result,
                })
        messages.append({"role": "user", "content": tool_results})
```

### Anti-Patterns in the Agentic Loop

| Anti-Pattern | Why It Fails | Correct Approach |
|---|---|---|
| Parsing natural language signals (e.g., "I'm done") | Unreliable, the model may say "done" mid-task | Use `stop_reason` field exclusively |
| Arbitrary iteration caps (e.g., `max_loops=10`) | Cuts off legitimate long-running tasks prematurely | Trust the model's `end_turn` signal |
| Checking text content for completion keywords | Fragile, language-dependent | Only check `stop_reason` |
| String-matching tool output for decisions | Breaks on format changes | Let the model interpret tool results |

**Key principle**: The model, not your code, decides when the task is complete. The `stop_reason` is the only reliable signal.

---

## 2. Model-Driven vs Pre-Configured Decision Trees

### Model-Driven Architecture

The model dynamically decides which tools to call, in what order, and when to stop. This is the recommended pattern for agentic systems.

- The model selects tools based on context
- No hardcoded if/else branching in orchestration code
- More flexible, handles novel scenarios
- Relies on good tool descriptions and system prompts

### Pre-Configured Decision Trees

Fixed, hand-coded logic dictates the sequence of tool calls and branching.

- Deterministic and predictable
- Brittle when encountering edge cases
- Difficult to maintain as complexity grows
- Appropriate only when the workflow is completely known in advance

**Exam insight**: The exam favors model-driven approaches. Pre-configured decision trees are generally an anti-pattern in agentic systems.

---

## 3. Hub-and-Spoke Coordinator-Subagent Architecture

This is the primary multi-agent pattern tested on the exam.

### Architecture Overview

```
           ┌─────────────┐
           │ Coordinator  │  (Hub)
           │   Agent      │
           └──────┬───────┘
          ┌───────┼───────┐
          │       │       │
     ┌────▼──┐ ┌─▼────┐ ┌▼─────┐
     │Sub-   │ │Sub-  │ │Sub-  │  (Spokes)
     │agent A│ │agent B│ │agent C│
     └───────┘ └──────┘ └──────┘
```

### Key Properties

- **Coordinator** owns the overall task, delegates subtasks
- **Subagents have isolated context**: they do NOT inherit the coordinator's conversation history
- The coordinator provides explicit instructions when spawning each subagent
- Results flow back to the coordinator, which synthesizes them

### Why Isolated Context Matters

- Prevents context window bloat
- Subagents focus on their narrow task without distraction
- Reduces cost (smaller context per subagent call)
- Prevents information leakage between subtasks

---

## 4. Task Tool for Spawning Subagents

The `Task` tool is the mechanism for spawning subagents in Claude Code.

### Configuration Requirements

- `allowedTools` on the coordinator **must include `"Task"`**
- Each subagent is defined via `AgentDefinition`
- The coordinator can spawn multiple subagents in a single response (parallel execution)

### AgentDefinition Configuration

```json
{
  "name": "code-reviewer",
  "description": "Reviews code for style, bugs, and security issues",
  "systemPrompt": "You are a code review specialist. Focus on...",
  "allowedTools": ["Read", "Grep", "Glob"]
}
```

Key fields:

- **`description`**: tells the coordinator when to use this subagent. This is the primary routing mechanism.
- **`systemPrompt`**: scopes the subagent's behavior and expertise
- **`allowedTools`**: restricts what the subagent can do (principle of least privilege)

### Parallel Subagent Spawning

The coordinator can issue multiple `Task` calls in a single response turn:

```
Coordinator response:
  - Task(agent="file-analyzer", input="Analyze src/auth.ts")
  - Task(agent="file-analyzer", input="Analyze src/db.ts")
  - Task(agent="test-writer", input="Write tests for auth module")
```

All three execute concurrently, and results are returned together.

---

## 5. fork_session for Parallel Exploration

`fork_session` creates parallel branches of a session for exploration without contaminating the main conversation.

### Use Cases

- Exploring multiple solution approaches simultaneously
- Testing different strategies before committing
- Parallel investigation of separate concerns

### Properties

- Each fork gets its own isolated context
- Forks do not affect the parent session
- Results can be brought back to the parent by the coordinator

---

## 6. Programmatic Enforcement vs Prompt-Based Guidance

This is a critical distinction for the exam.

### Programmatic Enforcement (Hooks)

- **Deterministic guarantees**: always executes, cannot be bypassed
- Implemented via `PreToolUse` and `PostToolUse` hooks
- Example: blocking file writes to production directories

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "command": "python /scripts/check_write_allowed.py"
      }
    ]
  }
}
```

- `PreToolUse`: runs before a tool executes
  - Exit code 0: allow the tool call
  - Exit code 2: block the tool call
- `PostToolUse`: runs after a tool executes
  - Cannot block (tool already ran)
  - Used for logging, normalization, compliance checks

### Prompt-Based Guidance

- **Probabilistic compliance**: usually followed, but not guaranteed
- Implemented via system prompts, CLAUDE.md instructions
- Example: "Always run tests before committing"
- The model may skip instructions under pressure or ambiguity

### PostToolUse Hooks for Compliance

Common patterns:

- **Data normalization**: standardize phone numbers, addresses after data retrieval
- **Compliance enforcement**: redact PII from tool outputs before they enter context
- **Audit logging**: record every tool invocation for compliance trails

### Summary Table

| Property | Hooks (Programmatic) | Prompts (Guidance) |
|---|---|---|
| Reliability | Deterministic, 100% | Probabilistic, ~95% |
| Bypass risk | None (code-enforced) | Model may ignore |
| Flexibility | Rigid, must be coded | Natural language, easy to add |
| Use case | Security, compliance | Style, preferences |

---

## 7. Structured Handoff Protocols

When escalating from an agent to a human (or between agents), use structured payloads, not free-form text.

### Escalation Payload Example

```json
{
  "customer_id": "C-12345",
  "root_cause": "Duplicate charge on order #98765",
  "amount": 49.99,
  "currency": "USD",
  "recommended_action": "Refund full amount",
  "confidence": 0.92,
  "conversation_summary": "Customer reported duplicate charge...",
  "attempted_resolutions": ["Checked order status", "Verified payment records"]
}
```

### Why Structured Handoffs Matter

- Receiving agent (or human) gets all context immediately
- No re-discovery or re-asking for basic information
- Standardized format enables automation on the receiving end
- Audit trail with machine-readable fields

---

## 8. Task Decomposition Patterns

### Prompt Chaining (Static Decomposition)

- Pre-defined sequence of steps
- Output of step N feeds into step N+1
- Works well for known, repeatable workflows
- Example: Extract data, then transform, then load

```
Step 1: Parse PDF → extracted_text
Step 2: Classify(extracted_text) → category
Step 3: Route(category) → appropriate_handler
```

### Dynamic Adaptive Decomposition

- The agent discovers subtasks at runtime
- Subtasks generated based on what the agent finds
- Better for open-ended or exploratory tasks
- Example: "Fix all bugs in this codebase" (agent must find bugs first, then fix each one)

---

## 9. Multi-Pass Review Pattern

### Structure

1. **Per-file local passes**: each file reviewed independently for local issues
2. **Cross-file integration pass**: review relationships between files, API contracts, data flow

### Why Two Passes?

- Local passes catch file-specific bugs (syntax, logic, style)
- Integration pass catches systemic issues (broken contracts, inconsistent types, circular dependencies)
- Parallel local passes, then a single integration pass

### Implementation

```
Coordinator:
  → Spawn SubAgent("review", file="auth.ts")      # parallel
  → Spawn SubAgent("review", file="db.ts")         # parallel
  → Spawn SubAgent("review", file="api.ts")        # parallel
  → Wait for all results
  → Spawn SubAgent("integration-review", files=["auth.ts", "db.ts", "api.ts"])
```

---

## 10. Session Management

### --resume

Resume a previous session to continue where you left off. Restores full conversation history.

### fork_session

Create a parallel branch for exploration without affecting the main session.

### update_context

Inject new information into a running session dynamically.

### Scratchpad Pattern

For long-running sessions, maintain a structured scratchpad file:

```markdown
## Key Findings
- Database schema has 3 tables: users, orders, products
- Auth uses JWT with 1-hour expiry

## Current Status
- [x] Explored database layer
- [ ] Review API routes
- [ ] Write integration tests

## Open Questions
- Why does the orders table lack a foreign key to products?
```

The agent reads/writes this file to maintain continuity across long sessions where context compression may lose details.

---

## 11. Workflow Patterns

### Parallelization

Run multiple independent tasks simultaneously:

```
Input → [Task A, Task B, Task C] → Combine Results → Output
```

Use when subtasks are independent and can execute concurrently.

### Chaining

Sequential pipeline where each step's output feeds the next:

```
Input → Step 1 → Step 2 → Step 3 → Output
```

Use when each step depends on the previous step's result.

### Routing

Classify input, then direct to the appropriate handler:

```
Input → Classifier → Route A (if type X)
                   → Route B (if type Y)
                   → Route C (if type Z)
```

Use when different inputs require fundamentally different processing.

### Evaluator-Optimizer

Generate output, evaluate quality, refine iteratively:

```
Input → Generator → Evaluator → (if not good enough) → Generator → ...
                              → (if good enough) → Output
```

Use when quality matters and automated evaluation is possible.

---

## 12. Agents vs Workflows

| Dimension | Workflows | Agents |
|---|---|---|
| When to use | Known steps, repeatable processes | Unknown tasks, open-ended exploration |
| Reliability | Higher (deterministic paths) | Lower (model decides dynamically) |
| Flexibility | Lower (predefined structure) | Higher (adapts to novel situations) |
| Completion rate | Higher | Lower |
| Complexity | Fixed, easier to debug | Dynamic, harder to debug |
| Cost predictability | More predictable | Less predictable |

**Exam tip**: If the question describes a well-defined process with known steps, the answer is likely "workflow." If the task is open-ended or requires exploration, the answer is likely "agent."

---

## 13. Agent Design Principles

### Small Set of Abstract Tools

- Provide 4-5 well-designed tools, not 18 specialized ones
- Abstract tools are more composable
- Example: `Read`, `Write`, `Search`, `Execute` covers most needs

### Environment Inspection After Actions

- After executing a tool, the agent should verify the result
- Don't assume success; check the outcome
- Example: after writing a file, read it back to confirm; after running a command, check exit code

---

## 14. Model Selection

| Model | Best For | Trade-offs |
|---|---|---|
| **Opus** | Complex multi-step reasoning, nuanced analysis, long context tasks | Highest cost, slower |
| **Sonnet** | Balanced performance, most agentic tasks | Good cost/performance ratio |
| **Haiku** | Speed-critical tasks, simple classification, high-volume processing | Lowest cost, least capable for complex reasoning |

### Selection Guidelines

- Default to **Sonnet** for agentic workloads
- Use **Opus** when reasoning depth is critical (complex debugging, architectural decisions)
- Use **Haiku** for high-volume, simple tasks (classification, extraction, routing)
- Consider cost: Opus is significantly more expensive per token than Haiku
