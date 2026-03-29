# Claude Code Configuration & Workflows (20% of Exam)

## 1. CLAUDE.md Hierarchy

CLAUDE.md files provide persistent instructions that Claude Code loads automatically. They form a hierarchy with increasing specificity.

### Levels

| Level | Location | Shared via VCS? | Scope |
|---|---|---|---|
| **User-level** | `~/.claude/CLAUDE.md` | No (personal) | All projects for this user |
| **Project-level** | `.claude/CLAUDE.md` or `CLAUDE.md` at repo root | Yes | Everyone working on this project |
| **Directory-level** | `CLAUDE.md` in any subdirectory | Yes | Active when working in that directory |

### Key Points

- **User-level is NOT shared** via version control. It is personal to the developer.
- Project-level is checked into the repo and shared with the team.
- Directory-level provides context-specific instructions for subdirectories.
- All levels are merged; more specific levels can override broader ones.

### @import Syntax

CLAUDE.md files support `@import` for modular organization:

```markdown
# Project Instructions

@import ./coding-standards.md
@import ./api-conventions.md
@import ./testing-requirements.md
```

This keeps CLAUDE.md files manageable by splitting instructions into focused modules.

---

## 2. .claude/rules/ Directory

Rules files support YAML frontmatter with glob-pattern matching for conditional loading.

### Structure

```
.claude/
  rules/
    typescript.md      # Loaded for .ts files
    testing.md         # Loaded for test files
    api-routes.md      # Loaded for API route files
```

### YAML Frontmatter with Glob Patterns

```markdown
---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# TypeScript Rules

- Always use explicit return types on exported functions
- Prefer interfaces over type aliases for object shapes
```

```markdown
---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---

# Testing Rules

- Use describe/it blocks, not test()
- Always include edge case tests
```

Rules are only loaded when the agent is working on files matching the glob patterns.

---

## 3. Custom Slash Commands

### Project Commands

Location: `.claude/commands/`

Shared with the team via version control.

```markdown
<!-- .claude/commands/review.md -->
Review the current changes for:
1. Type safety issues
2. Missing error handling
3. Security vulnerabilities

Run `tsc --noEmit` to verify types compile.
```

Invoked as: `/project:review`

### Personal Commands

Location: `~/.claude/commands/`

Personal, not shared via version control.

```markdown
<!-- ~/.claude/commands/ship.md -->
Commit all changes and push to the remote branch.
```

Invoked as: `/user:ship`

---

## 4. Skills: SKILL.md

Skills are reusable capabilities defined with a `SKILL.md` file and frontmatter.

### Frontmatter Options

```markdown
---
context: fork
allowed-tools:
  - Read
  - Grep
  - Glob
argument-hint: "path to file or directory to analyze"
---

# Code Analysis Skill

Analyze the provided code for common issues...
```

| Field | Purpose |
|---|---|
| `context: fork` | Run in an isolated forked session (prevents context pollution) |
| `allowed-tools` | Restrict which tools this skill can use |
| `argument-hint` | Help text shown to the user for the skill's argument |

---

## 5. Plan Mode vs Direct Execution

### Plan Mode

- For **complex architectural tasks** requiring thought before action
- Claude analyzes the problem, proposes a plan, then executes
- Breadth-first exploration: considers multiple approaches
- Use when the scope is large or unclear

### Direct Execution

- For **simple, well-scoped changes** where the path is clear
- Claude executes immediately without a planning phase
- Faster for straightforward tasks
- Use when you know exactly what needs to change

### Plan Mode vs Thinking Mode

| Mode | Focus | When to Use |
|---|---|---|
| **Plan Mode** | Breadth: explore multiple approaches | Complex multi-file changes, architecture decisions |
| **Thinking Mode** | Depth: reason deeply about one approach | Tricky logic, debugging, nuanced decisions |

---

## 6. Key Interaction Patterns

### Explore Subagent

Spawn a subagent specifically for codebase exploration. This isolates verbose discovery output (file listings, search results) from the main conversation, keeping the coordinator's context clean.

### Interview Pattern

Claude asks clarifying questions before implementing. Useful for ambiguous requirements:

```
User: "Add authentication to the app"
Claude: "Before I implement authentication, I have a few questions:
  1. Which auth provider (OAuth, JWT, session-based)?
  2. Which routes need protection?
  3. Do you need role-based access control?"
```

### Iterative Refinement

- Provide **concrete input/output examples** for the desired behavior
- Use **test-driven iteration**: write tests first, then implement until tests pass
- Each iteration narrows the gap between current and desired behavior

---

## 7. CI/CD Integration

### Non-Interactive Mode

Use `-p` flag for non-interactive (headless) execution:

```bash
claude -p "Run the test suite and report results"
```

### Structured Output

Use `--output-format json` with `--json-schema` for machine-readable output:

```bash
claude -p "Analyze code quality" \
  --output-format json \
  --json-schema '{"type": "object", "properties": {"score": {"type": "number"}, "issues": {"type": "array"}}}'
```

This enables integration with CI/CD pipelines, dashboards, and automated workflows.

---

## 8. Session Context Isolation

### Self-Review Limitation

The session that generated code is less effective at reviewing it because it retains the reasoning context. The model "remembers" its intent and is biased toward seeing it as correct.

**Solution**: use a separate session (or separate subagent) for review.

### Providing Existing Test Files

When working with existing test files, provide them to Claude to prevent duplicate test suggestions. Without seeing existing tests, Claude may suggest tests that already exist.

---

## 9. Claude Code SDK

### Default Behavior

The SDK is **read-only by default**. Write operations must be explicitly enabled:

```typescript
import { createAgent } from "@anthropic-ai/claude-code-sdk";

const agent = createAgent({
  allowTools: ["Read", "Grep", "Glob", "Write", "Edit"],
  // Without Write and Edit, the agent can only read
});
```

### Key Configuration

- `allowTools`: explicitly list which tools the agent can use
- Default is read-only (safe for analysis tasks)
- Must opt-in to write capabilities

---

## 10. GitHub Integration

- **`/install`**: installs the GitHub app for the repository
- **Mention support**: @mention Claude in PR comments for review
- **PR review**: Claude can review pull requests, suggest changes
- **Git worktrees**: use for running parallel Claude instances on different branches without conflicts

```bash
# Create worktrees for parallel work
git worktree add ../feature-a feature-a
git worktree add ../feature-b feature-b
# Run separate Claude instances in each worktree
```

---

## 11. /init Command

The `/init` command creates a `CLAUDE.md` file for the project. It analyzes the codebase and generates initial instructions covering:

- Project structure
- Build commands
- Testing conventions
- Code style preferences

---

## 12. Three Memory Types

| Type | Location | Shared? | Purpose |
|---|---|---|---|
| **Project memory** | `.claude/CLAUDE.md` | Yes (VCS) | Team-wide project instructions |
| **Local memory** | `.claude/local/CLAUDE.md` (gitignored) | No | Personal project overrides |
| **User memory** | `~/.claude/CLAUDE.md` | No | Global personal preferences |

---

## 13. Keyboard Controls

| Action | Effect |
|---|---|
| **Escape** | Stop current generation |
| **Double Escape** | Rewind to before last action |
| **Compact** | Summarize conversation to reduce context |
| **Clear** | Fresh start, new session |

### Compact vs Clear

- **Compact**: summarizes the conversation but maintains continuity. Use when context is getting long but you want to keep working on the same task.
- **Clear**: completely fresh start. Use when switching to a new task.

---

## 14. Hooks System

Hooks are scripts that run before or after tool executions.

### PreToolUse Hooks

Run **before** a tool executes. Can allow or block the tool call.

| Exit Code | Meaning |
|---|---|
| `0` | Allow the tool call to proceed |
| `2` | Block the tool call |

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "command": "python check_write_path.py $TOOL_INPUT"
      }
    ]
  }
}
```

### PostToolUse Hooks

Run **after** a tool executes. Cannot block (the tool already ran).

Used for:

- Logging and auditing
- Data normalization
- Triggering follow-up actions

### Hook Pattern: TypeScript Type Checker

Run `tsc --noEmit` after every file edit to catch type errors immediately:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "npx tsc --noEmit 2>&1 | head -20"
      }
    ]
  }
}
```

### Hook Pattern: Duplicate Code Prevention

A PreToolUse hook that checks for duplicate code before allowing writes:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "command": "python check_duplicates.py $TOOL_INPUT"
      }
    ]
  }
}
```

---

## 15. Configuration Quick Reference

| Configuration | File | Scope |
|---|---|---|
| Project instructions | `.claude/CLAUDE.md` | Project (shared) |
| Local overrides | `.claude/local/CLAUDE.md` | Personal (gitignored) |
| User preferences | `~/.claude/CLAUDE.md` | Global (personal) |
| Rules with globs | `.claude/rules/*.md` | Conditional per file pattern |
| Project commands | `.claude/commands/*.md` | Project (shared) |
| Personal commands | `~/.claude/commands/*.md` | Global (personal) |
| MCP servers (project) | `.mcp.json` | Project (shared) |
| MCP servers (personal) | `~/.claude.json` | Global (personal) |
| Hooks and settings | `.claude/settings.json` | Project (shared) |
| Skills | `SKILL.md` | Per skill directory |
