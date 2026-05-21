import type { Question } from "./types";

export const questions: Question[] = [
  // ============================================================
  // DOMAIN 1: Agentic Architecture & Orchestration (27%)
  // ============================================================

  // Task 1.1: Agentic loop lifecycle
  {
    id: "d1-001",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "In the agentic loop lifecycle, what determines whether the loop should continue iterating or terminate?",
    options: [
      "A counter tracking completed iterations against a configured maximum",
      "The stop_reason field, where 'tool_use' continues and 'end_turn' stops",
      "Parsing assistant text content to detect natural language completion cues",
      "A timer-based timeout that triggers termination after a set duration",
    ],
    correctIndex: 1,
    explanation:
      "The agentic loop inspects the stop_reason field. When it's 'tool_use', the loop continues by executing the requested tool and returning results. When it's 'end_turn', the model has finished and the loop terminates. Parsing text content or using iteration caps are anti-patterns.",
  },
  {
    id: "d1-002",
    domain: "agentic-architecture",
    question:
      "Which of the following is an anti-pattern for determining when an agentic loop should terminate?",
    options: [
      "Checking the stop_reason field for 'end_turn' to signal completion",
      "Setting arbitrary iteration caps as the primary stopping mechanism",
      "Executing requested tools and returning their results to the model",
      "Appending tool results to conversation history between iterations",
    ],
    correctIndex: 1,
    explanation:
      "Setting arbitrary iteration caps, parsing natural language signals, or checking assistant text content as completion indicators are all anti-patterns. The primary mechanism should be inspecting stop_reason ('tool_use' vs 'end_turn').",
  },
  {
    id: "d1-003",
    domain: "agentic-architecture",
    question:
      "What is the distinction between model-driven decision-making and pre-configured decision trees in agentic systems?",
    options: [
      "Model-driven uses more tokens per call, so it is always worse overall",
      "Pre-configured decision trees are always more reliable for every task",
      "Model-driven lets Claude reason about which tool to call per context",
      "There is no practical difference between model-driven and fixed trees",
    ],
    correctIndex: 2,
    explanation:
      "Model-driven decision-making allows Claude to reason about which tool to call based on context, providing flexibility. Pre-configured decision trees use fixed sequences, offering predictability. The choice depends on whether the workflow requires flexibility or determinism.",
  },

  // Task 1.2: Multi-agent coordinator-subagent patterns
  {
    id: "d1-004",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "In a hub-and-spoke multi-agent architecture, how do subagents relate to the coordinator's conversation history?",
    options: [
      "Subagents automatically inherit the coordinator's full conversation log",
      "Subagents share a synchronized global memory store with the coordinator",
      "Subagents operate with isolated context, not inheriting parent history",
      "Subagents receive a compressed summary of the coordinator's prior turns",
    ],
    correctIndex: 2,
    explanation:
      "Subagents operate with isolated context. They do not automatically inherit the coordinator's conversation history. Context must be explicitly provided in the subagent's prompt, which is a key design consideration.",
  },
  {
    id: "d1-005",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "What is a key risk of overly narrow task decomposition by a coordinator agent?",
    options: [
      "It dramatically increases token consumption across all subagent calls",
      "It leads to incomplete coverage of broad research topics or queries",
      "It makes the entire multi-agent pipeline run significantly more slowly",
      "It causes subagents to inadvertently share context and contaminate data",
    ],
    correctIndex: 1,
    explanation:
      "Overly narrow task decomposition by the coordinator can lead to incomplete coverage of broad research topics. The coordinator should analyze query requirements and dynamically select which subagents to invoke rather than always routing through the full pipeline.",
  },
  {
    id: "d1-006",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "How should a coordinator agent handle iterative refinement in a multi-agent research system?",
    options: [
      "Run all subagents once and immediately accept the combined output as final",
      "Evaluate synthesis output for gaps, re-delegate targeted queries, repeat",
      "Ask the user to review results and manually request each subsequent re-run",
      "Increase the temperature parameter for each subsequent run of subagents",
    ],
    correctIndex: 1,
    explanation:
      "The coordinator should implement iterative refinement loops where it evaluates synthesis output for gaps, re-delegates to search and analysis subagents with targeted queries, and re-invokes synthesis until coverage is sufficient.",
  },

  // Task 1.3: Subagent invocation, context passing, spawning
  {
    id: "d1-007",
    domain: "agentic-architecture",
    question:
      "When using the Claude Agent SDK, what must be included in allowedTools for a coordinator to spawn subagents?",
    options: [
      "The 'Bash' tool for shell execution access",
      "The 'Read' tool for file system operations",
      "The 'Task' tool for subagent invocation",
      "The 'Write' tool for file modification use",
    ],
    correctIndex: 2,
    explanation:
      "The Task tool is the mechanism for spawning subagents. The allowedTools configuration must include 'Task' for a coordinator to invoke subagents. Each subagent type is defined via AgentDefinition with its own system prompt and tool restrictions.",
  },
  {
    id: "d1-008",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "How should a coordinator pass context to a synthesis subagent that needs findings from prior search and analysis agents?",
    options: [
      "Store findings in a shared database that the synthesis agent queries on demand",
      "Include complete findings directly in the synthesis subagent's prompt text",
      "Let the synthesis agent autonomously re-run the searches by itself each time",
      "Pass only the original search queries to the synthesis agent without results",
    ],
    correctIndex: 1,
    explanation:
      "Complete findings from prior agents should be included directly in the subagent's prompt. Since subagents don't inherit parent context or share memory, all necessary information must be explicitly provided. Using structured data formats helps preserve attribution (source URLs, page numbers).",
  },
  {
    id: "d1-009",
    domain: "agentic-architecture",
    question:
      "How can you spawn parallel subagents efficiently in the Claude Agent SDK?",
    options: [
      "Emit multiple Task tool calls across separate coordinator turns sequentially",
      "Emit multiple Task tool calls in a single coordinator response at once",
      "Use a dedicated batch API endpoint specifically for subagent spawning tasks",
      "Configure parallel execution flags directly in the AgentDefinition object",
    ],
    correctIndex: 1,
    explanation:
      "To spawn parallel subagents, emit multiple Task tool calls in a single coordinator response rather than across separate turns. This enables concurrent execution and is more efficient.",
  },
  {
    id: "d1-010",
    domain: "agentic-architecture",
    question:
      "What is fork_session used for in the Claude Agent SDK?",
    options: [
      "Creating a backup snapshot of the current session for later recovery",
      "Branching from a shared baseline to explore divergent approaches",
      "Splitting a large file into smaller processable chunks for analysis",
      "Forking a Git repository into a new branch from the current session",
    ],
    correctIndex: 1,
    explanation:
      "fork_session creates independent branches from a shared analysis baseline to explore divergent approaches without context contamination. For example, comparing two refactoring strategies or testing approaches from the same codebase analysis.",
  },

  // Task 1.4: Multi-step workflows with enforcement
  {
    id: "d1-011",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "A customer support agent needs to process a refund. Identity verification must happen first. What is the most reliable approach?",
    options: [
      "Add 'always verify identity before processing refunds' to the system prompt",
      "Use a programmatic gate that blocks process_refund until verified",
      "Include the verification requirement in several few-shot example prompts",
      "Set temperature to 0 for fully deterministic and predictable behavior",
    ],
    correctIndex: 1,
    explanation:
      "When deterministic compliance is required (e.g., identity verification before financial operations), prompt instructions alone have a non-zero failure rate. Programmatic enforcement through hooks or prerequisite gates provides guaranteed compliance.",
  },
  {
    id: "d1-012",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "When escalating a customer issue to a human agent, what should the handoff payload contain?",
    options: [
      "The complete raw conversation transcript from the entire session",
      "Only the customer's most recent message text without any context",
      "A structured summary: customer ID, root cause, and next action",
      "A hyperlink pointing to the full conversation log in the system",
    ],
    correctIndex: 2,
    explanation:
      "Structured handoff summaries (customer ID, root cause, refund amount, recommended action) are preferred because human agents who receive escalations may lack access to the full conversation transcript. Raw transcripts are hard to parse quickly.",
  },

  // Task 1.5: Agent SDK hooks
  {
    id: "d1-013",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "Your customer support agent must NEVER process refunds over $500 without human approval. The prompt says 'CRITICAL POLICY: NEVER process refunds >$500'. What is the correct architectural approach?",
    options: [
      "Make the prompt instruction more emphatic with capitalization and repetition",
      "Implement a hook that intercepts process_refund and blocks over $500",
      "Add the critical policy to the system prompt at least three times for emphasis",
      "Use extended thinking mode so the agent reasons more about the policy",
    ],
    correctIndex: 1,
    explanation:
      "Relying on emphatic system prompts still yields ~3% failure rate. The architectural standard is to implement an application-layer hook (PostToolUse or pre-tool intercept) that deterministically blocks tool calls violating business rules and redirects to human escalation. Model discretion is removed from compliance decisions.",
  },
  {
    id: "d1-014",
    domain: "agentic-architecture",
    question:
      "What is the purpose of a PostToolUse hook that normalizes data formats?",
    options: [
      "To make the data output look prettier and more readable for end users",
      "To convert heterogeneous formats into consistent ones before processing",
      "To compress the data payload in order to save context window space overall",
      "To validate that the tool executed its function successfully and completely",
    ],
    correctIndex: 1,
    explanation:
      "PostToolUse hooks can normalize heterogeneous data formats from different MCP tools (e.g., converting Unix timestamps to ISO 8601, standardizing status codes) before the agent processes them, ensuring consistent reasoning.",
  },
  {
    id: "d1-015",
    domain: "agentic-architecture",
    question:
      "What is the key distinction between using hooks for enforcement versus prompt instructions for compliance?",
    options: [
      "Hooks are slower to execute but significantly more readable than prompts",
      "Hooks give deterministic guarantees; prompts give probabilistic ones",
      "Prompt instructions are more reliable than hooks in production systems",
      "There is no meaningful difference between hooks and prompt instructions",
    ],
    correctIndex: 1,
    explanation:
      "Hooks provide deterministic guarantees (the code always runs). Prompt instructions provide probabilistic compliance (the model usually follows them but has a non-zero failure rate). For business-critical rules, hooks should be preferred.",
  },

  // Task 1.6: Task decomposition strategies
  {
    id: "d1-016",
    domain: "agentic-architecture",
    scenario: "ci-cd",
    question:
      "When should you use fixed sequential pipelines (prompt chaining) versus dynamic adaptive decomposition?",
    options: [
      "Always use dynamic decomposition because it produces better results overall",
      "Chaining for predictable reviews; dynamic for open-ended investigations",
      "Always use prompt chaining because it has lower cost per invocation",
      "The choice does not matter in any meaningful way for production systems",
    ],
    correctIndex: 1,
    explanation:
      "Fixed sequential pipelines (prompt chaining) work well for predictable, multi-aspect reviews. Dynamic adaptive decomposition is better for open-ended investigation tasks where subtasks depend on what is discovered at each step.",
  },
  {
    id: "d1-017",
    domain: "agentic-architecture",
    scenario: "ci-cd",
    question:
      "How should large code reviews be decomposed to avoid attention dilution?",
    options: [
      "Send all files to Claude in a single prompt with very detailed instructions",
      "Split into per-file analysis passes plus a cross-file integration pass",
      "Only review the most recently changed files and ignore all other changes",
      "Use extended thinking mode to handle all files at once in a single call",
    ],
    correctIndex: 1,
    explanation:
      "Large code reviews should be split into per-file local analysis passes plus a separate cross-file integration pass. This avoids attention dilution that occurs when a model tries to analyze many files simultaneously.",
  },

  // Task 1.7: Session state, resumption, forking
  {
    id: "d1-018",
    domain: "agentic-architecture",
    question:
      "When resuming a session after code modifications have occurred, what is the recommended approach?",
    options: [
      "Resume the session with --resume and proceed as if nothing changed at all",
      "Always start a completely brand new session, discarding all prior context",
      "Inform the resumed session about specific file changes for re-analysis",
      "Re-read every single file in the codebase to rebuild full understanding",
    ],
    correctIndex: 2,
    explanation:
      "When resuming a session, explicitly inform the agent which specific files or functions changed for targeted re-analysis. Don't force a complete re-read, and don't pretend nothing changed. If prior tool results are mostly stale, starting fresh with a structured summary may be better.",
  },
  {
    id: "d1-019",
    domain: "agentic-architecture",
    question:
      "Why might starting a new session with a structured summary be more reliable than resuming with --resume?",
    options: [
      "New sessions are always faster because they skip loading cached state",
      "Prior tool results may be stale, leading to incorrect reasoning paths",
      "The --resume flag is not actually supported in the Claude Code platform",
      "New sessions are allocated a larger context window size than old ones",
    ],
    correctIndex: 1,
    explanation:
      "When prior tool results are stale (e.g., file contents have changed, statuses have been updated), the resumed session may reason based on outdated information. Starting fresh with an injected structured summary ensures current information while preserving key decisions.",
  },

  // ============================================================
  // DOMAIN 2: Tool Design & MCP Integration (18%)
  // ============================================================

  // Task 2.1: Tool descriptions and boundaries
  {
    id: "d2-001",
    domain: "tool-design-mcp",
    question:
      "Two MCP tools named 'analyze_content' and 'analyze_document' have near-identical descriptions. What problem does this cause?",
    options: [
      "Significantly increased token usage due to redundant tool schema loading",
      "The LLM may misroute calls due to ambiguous overlapping descriptions",
      "The tools will conflict at runtime and crash the entire agent pipeline",
      "No real problem; the LLM will figure out the correct tool on its own",
    ],
    correctIndex: 1,
    explanation:
      "Ambiguous or overlapping tool descriptions cause misrouting. The fix is to rename tools and update descriptions to clearly differentiate purpose. For example, rename 'analyze_content' to 'extract_web_results' with a web-specific description.",
  },
  {
    id: "d2-002",
    domain: "tool-design-mcp",
    question:
      "What should a well-written tool description include?",
    options: [
      "Just the tool name and the return type it produces in its output",
      "Input formats, example queries, edge cases, and usage boundaries",
      "A brief one-line summary of the tool's name and general category",
      "The internal implementation details showing how it works underneath",
    ],
    correctIndex: 1,
    explanation:
      "Tool descriptions are the primary mechanism LLMs use for tool selection. They should include input formats, example queries, edge cases, boundary explanations, and when to use the tool versus similar alternatives. Minimal descriptions lead to unreliable selection.",
  },
  {
    id: "d2-003",
    domain: "tool-design-mcp",
    scenario: "developer-productivity",
    question:
      "An MCP server has a broad 'analyze_dependencies' tool alongside Claude Code's built-in Grep. The agent keeps using Grep instead of the custom tool. What is the fix?",
    options: [
      "Remove the Grep tool entirely from the agent's available tool set",
      "Split into granular tools like list_imports and detect_circular_deps",
      "Add 'always prefer analyze_dependencies over Grep' to the system prompt",
      "Increase the custom tool's internal priority setting in the MCP config",
    ],
    correctIndex: 1,
    explanation:
      "When a broad custom tool competes with familiar built-in tools like Grep, the agent defaults to Grep. The fix is to split into granular, single-purpose tools with detailed descriptions explaining capabilities, expected outputs, and when to prefer them over text manipulation.",
  },

  // Task 2.2: Structured error responses for MCP tools
  {
    id: "d2-004",
    domain: "tool-design-mcp",
    question:
      "An MCP tool returns { isError: true } with the message 'Operation failed'. Why is this problematic?",
    options: [
      "The isError flag is deprecated and should not be used in new tools",
      "Generic errors prevent the agent from choosing retry vs escalate",
      "Error messages from tools should never be returned to the model at all",
      "The error message is too short and must be at least 100 characters long",
    ],
    correctIndex: 1,
    explanation:
      "Uniform error responses like 'Operation failed' prevent the agent from distinguishing between transient errors (retry), validation errors (fix input), business errors (inform user), and permission errors (escalate). Structured error metadata (errorCategory, isRetryable, human-readable description) enables appropriate recovery.",
  },
  {
    id: "d2-005",
    domain: "tool-design-mcp",
    question:
      "What should a structured MCP error response include for a business rule violation (e.g., refund exceeds policy limit)?",
    options: [
      "Just the basic { isError: true } flag with no additional metadata",
      "A full stack trace along with an internal numeric error code for debugging",
      "isError, errorCategory: 'business', isRetryable: false, plus explanation",
      "An HTTP status code mapped to the closest standard error classification",
    ],
    correctIndex: 2,
    explanation:
      "Business rule violations should include isRetryable: false (retrying won't help) and a customer-friendly explanation so the agent can communicate appropriately. The errorCategory helps the agent decide to inform the user rather than retry.",
  },
  {
    id: "d2-006",
    domain: "tool-design-mcp",
    question:
      "How should an agent distinguish between an access failure (the tool errored) and a valid empty result (no matches found)?",
    options: [
      "Both cases should return empty strings with no metadata to differentiate",
      "Failures use { isError: true, isRetryable: true }; empty results succeed",
      "Use different HTTP status codes to signal failures versus empty results",
      "The agent has no mechanism to distinguish between failures and empties",
    ],
    correctIndex: 1,
    explanation:
      "Access failures should use the isError flag with retry metadata, while valid empty results (successful queries with no matches) should return as successful tool results with empty data. This distinction prevents wasted retry attempts on valid empty results.",
  },

  // Task 2.3: Tool distribution and tool_choice
  {
    id: "d2-007",
    domain: "tool-design-mcp",
    question:
      "A research agent has access to 18 tools. Tool selection reliability has degraded. What is the likely cause and fix?",
    options: [
      "The model needs a much larger context window to hold all tool schemas",
      "Too many tools raise decision complexity; restrict to 4-5 per agent",
      "The tool descriptions are too long and should each be made much shorter",
      "The model must be upgraded to a larger, more capable version of Claude",
    ],
    correctIndex: 1,
    explanation:
      "Giving an agent access to too many tools (e.g., 18 instead of 4-5) degrades tool selection reliability by increasing decision complexity. The fix is scoped tool access: give each agent only the tools needed for its role.",
  },
  {
    id: "d2-008",
    domain: "tool-design-mcp",
    question:
      'What is the effect of setting tool_choice: "any" versus tool_choice: "auto"?',
    options: [
      "They are identical in behavior and produce the same results every time",
      "'any' forces the model to call a tool; 'auto' allows text responses",
      "'any' makes the model faster; 'auto' makes the model more accurate",
      "'auto' forces a tool call each turn; 'any' makes tool calls optional",
    ],
    correctIndex: 1,
    explanation:
      'tool_choice: "auto" means the model may return text instead of calling a tool. "any" means the model must call a tool but can choose which one. Forced tool selection ({type: "tool", name: "..."}) requires a specific named tool.',
  },
  {
    id: "d2-009",
    domain: "tool-design-mcp",
    scenario: "structured-data",
    question:
      "You want to ensure that extract_metadata always runs before any enrichment tools in your pipeline. How do you enforce this?",
    options: [
      "Put extract_metadata first in the tools array definition ordering value",
      "Use forced tool selection targeting extract_metadata on first turn",
      "Add a system prompt instruction to always call extract_metadata first",
      "Use a pre-tool hook to intercept and reorder all outgoing tool calls",
    ],
    correctIndex: 1,
    explanation:
      "Forced tool selection (tool_choice with type: 'tool' and the specific name) guarantees a specific tool is called first. After that initial forced call, subsequent steps can use 'auto' or 'any' for follow-up turns.",
  },

  // Task 2.4: MCP in Claude Code and agent workflows
  {
    id: "d2-010",
    domain: "tool-design-mcp",
    question:
      "Where should shared team MCP servers be configured, and where should personal/experimental ones go?",
    options: [
      "Both belong in ~/.claude.json for centralized user-level configuration only",
      "Shared in .mcp.json (project-level, versioned); personal in ~/.claude.json",
      "Both belong in .mcp.json so the project maintains a single source of truth",
      "Shared in the system prompt text; personal ones go in environment variables",
    ],
    correctIndex: 1,
    explanation:
      "Shared MCP servers belong in project-level .mcp.json (committed to version control, shared with team). Personal/experimental servers go in user-level ~/.claude.json (not shared). Environment variable expansion in .mcp.json (e.g., ${GITHUB_TOKEN}) enables credential management without committing secrets.",
  },
  {
    id: "d2-011",
    domain: "tool-design-mcp",
    question:
      "What are MCP resources, and how do they differ from MCP tools?",
    options: [
      "Resources and tools are the same thing with different naming conventions",
      "Resources expose content catalogs to reduce exploratory tool calls",
      "Resources are simply faster, optimized versions of equivalent MCP tools",
      "Resources are only available in Claude Code, never in the Agent SDK",
    ],
    correctIndex: 1,
    explanation:
      "MCP resources expose content catalogs (issue summaries, documentation hierarchies, database schemas) giving agents visibility into available data without requiring exploratory tool calls. Tools perform actions. Resources are app-controlled; tools are model-controlled.",
  },

  // Task 2.5: Built-in tools
  {
    id: "d2-012",
    domain: "tool-design-mcp",
    scenario: "developer-productivity",
    question:
      "When should you use Grep vs Glob vs Read in Claude Code?",
    options: [
      "They all perform the same function and are fully interchangeable",
      "Grep for content search; Glob for file name patterns; Read for files",
      "Always use Read for everything because it is the most comprehensive",
      "Grep for finding files; Glob for content search; Read for directories",
    ],
    correctIndex: 1,
    explanation:
      "Grep searches file contents for patterns (function names, error messages, import statements). Glob finds files matching naming patterns (e.g., **/*.test.tsx). Read loads full file contents. Each has a distinct purpose.",
  },
  {
    id: "d2-013",
    domain: "tool-design-mcp",
    question:
      "The Edit tool fails because the old_string matches multiple locations in the file. What is the recommended fallback?",
    options: [
      "Retry the same Edit operation with the identical old_string argument",
      "Use Read to load full file contents, then Write the modified version",
      "Use Bash with a sed command to find and make the required text change",
      "Ask the user to open the file and make the specific edit by hand now",
    ],
    correctIndex: 1,
    explanation:
      "When Edit fails due to non-unique text matches, using Read to load the full file contents followed by Write with the complete modified file is a reliable fallback for file modifications.",
  },

  // ============================================================
  // DOMAIN 3: Claude Code Configuration & Workflows (20%)
  // ============================================================

  // Task 3.1: CLAUDE.md hierarchy
  {
    id: "d3-001",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "A new team member reports that Claude Code is not following project conventions. The instructions are in ~/.claude/CLAUDE.md. What is the likely issue?",
    options: [
      "The CLAUDE.md file must be re-generated after each dependency update",
      "User-level CLAUDE.md applies to that user only, not shared via VCS",
      "CLAUDE.md requires a YAML frontmatter block with a valid schema version",
      "Claude Code caches CLAUDE.md at startup and ignores later file changes",
    ],
    correctIndex: 1,
    explanation:
      "User-level settings in ~/.claude/CLAUDE.md apply only to that user and are not shared with teammates via version control. For shared team conventions, use project-level configuration (.claude/CLAUDE.md or root CLAUDE.md).",
  },
  {
    id: "d3-002",
    domain: "claude-code-config",
    question:
      "What is the @import syntax used for in CLAUDE.md files?",
    options: [
      "Importing shared ESLint or Prettier rule configs into the session",
      "Referencing external files to keep CLAUDE.md modular and organized",
      "Loading environment variables from dotenv files into Claude context",
      "Pulling remote tool schemas from a JSON registry into the session",
    ],
    correctIndex: 1,
    explanation:
      "@import references external files to keep CLAUDE.md modular. For example, importing specific standards files relevant to each package rather than having one monolithic CLAUDE.md file.",
  },
  {
    id: "d3-003",
    domain: "claude-code-config",
    question:
      "What is the advantage of .claude/rules/ files with YAML frontmatter paths fields over directory-level CLAUDE.md files?",
    options: [
      "Rules files are parsed faster because they use an optimized loader",
      "Rules with globs apply by file type across all directories at once",
      "Rules files support structured YAML blocks that CLAUDE.md cannot use",
      "There is no practical advantage; both mechanisms are fully equivalent",
    ],
    correctIndex: 1,
    explanation:
      ".claude/rules/ files with glob patterns in the paths frontmatter can apply conventions to files by type regardless of directory location. This is better than directory-level CLAUDE.md when conventions span multiple directories (e.g., test files spread throughout a codebase).",
  },

  // Task 3.2: Custom slash commands and skills
  {
    id: "d3-004",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "What is the difference between project-scoped commands in .claude/commands/ and user-scoped commands in ~/.claude/commands/?",
    options: [
      "No functional difference exists; both scopes behave the same at runtime",
      "Project commands are shared via VCS; user commands stay personal only",
      "User-scoped commands always take higher execution priority than project",
      "Project-scoped commands are cached locally, making execution much faster",
    ],
    correctIndex: 1,
    explanation:
      "Project-scoped commands in .claude/commands/ are shared via version control for team-wide availability. User-scoped commands in ~/.claude/commands/ are personal customizations not committed to the repository.",
  },
  {
    id: "d3-005",
    domain: "claude-code-config",
    question:
      "What does the context: fork frontmatter option do in a SKILL.md file?",
    options: [
      "Creates a Git fork of the repository for isolated branch development",
      "Runs the skill in a sub-agent, keeping the main context window clean",
      "Splits the skill into multiple parallel execution threads at runtime",
      "Forks the current terminal session into a new background process tab",
    ],
    correctIndex: 1,
    explanation:
      "context: fork runs skills in an isolated sub-agent, preventing verbose output (codebase analysis, brainstorming alternatives) from polluting the main conversation session. It keeps the main session context clean.",
  },
  {
    id: "d3-006",
    domain: "claude-code-config",
    question:
      "How does the allowed-tools frontmatter in SKILL.md help with safety?",
    options: [
      "It pre-loads only the listed tool schemas, speeding up execution time",
      "It restricts which tools the skill can use, blocking destructive ops",
      "It registers new custom tools that only exist within the skill scope",
      "It auto-approves all listed tools so no permission prompts are shown",
    ],
    correctIndex: 1,
    explanation:
      "allowed-tools restricts tool access during skill execution. For example, you can limit a skill to file read operations only, preventing it from making destructive write operations. This is a safety mechanism.",
  },

  // Task 3.3: Path-specific rules
  {
    id: "d3-007",
    domain: "claude-code-config",
    question:
      'A .claude/rules/terraform.md file has frontmatter paths: ["terraform/**/*"]. When does this rule load?',
    options: [
      "At every Claude Code session start, regardless of the files being edited",
      "Only when editing files that match the terraform/**/* glob pattern",
      "When the user explicitly runs the /terraform slash command in the chat",
      "When a Terraform CLI binary is found anywhere on the system search path",
    ],
    correctIndex: 1,
    explanation:
      "Path-scoped rules load only when editing files matching the specified glob patterns. This reduces irrelevant context and token usage by only loading rules when they are relevant to the current work.",
  },

  // Task 3.4: Plan mode vs direct execution
  {
    id: "d3-008",
    domain: "claude-code-config",
    question:
      "When should you use plan mode instead of direct execution in Claude Code?",
    options: [
      "For every task without exception, since planning always reduces errors",
      "For complex tasks with architectural impact or multi-file refactors",
      "Only for bug fixes that require careful, step-by-step root cause work",
      "Never, because direct execution is faster and produces better results",
    ],
    correctIndex: 1,
    explanation:
      "Plan mode is designed for complex tasks involving large-scale changes, multiple valid approaches, and multi-file modifications. Direct execution is appropriate for simple, well-scoped changes like a single-file bug fix. Plan mode enables safe exploration before committing to changes.",
  },
  {
    id: "d3-009",
    domain: "claude-code-config",
    question:
      "What is the Explore subagent used for in Claude Code?",
    options: [
      "Browsing the web for relevant documentation and external code samples",
      "Isolating verbose discovery work and returning concise summaries back",
      "Testing different model configurations to find the best parameter set",
      "Running exploratory test suites against the codebase for regressions",
    ],
    correctIndex: 1,
    explanation:
      "The Explore subagent isolates verbose discovery output (searching codebases, reading many files) and returns summaries to the main conversation. This prevents context window exhaustion during multi-phase tasks.",
  },

  // Task 3.5: Iterative refinement
  {
    id: "d3-010",
    domain: "claude-code-config",
    question:
      "When prose descriptions produce inconsistent output, what is the most effective way to communicate expected transformations?",
    options: [
      "Write significantly longer prose descriptions with exact field names",
      "Provide 2-3 concrete input/output examples of expected results",
      "Raise the temperature parameter so the model explores more variations",
      "Switch to a larger model with stronger natural language comprehension",
    ],
    correctIndex: 1,
    explanation:
      "Concrete input/output examples are the most effective way to communicate expected transformations when prose descriptions are interpreted inconsistently. They show exactly what is expected rather than relying on the model's interpretation of natural language.",
  },
  {
    id: "d3-011",
    domain: "claude-code-config",
    question:
      "What is the 'interview pattern' in Claude Code workflows?",
    options: [
      "Having Claude generate technical screening questions for job candidates",
      "Having Claude ask questions to surface unanticipated design concerns",
      "A pattern for producing structured behavioral interview question banks",
      "A workflow for onboarding new developers to the existing codebase now",
    ],
    correctIndex: 1,
    explanation:
      "The interview pattern involves having Claude ask questions to surface considerations (cache invalidation strategies, failure modes, edge cases) that the developer may not have anticipated before implementing. It's useful in unfamiliar domains.",
  },

  // Task 3.6: CI/CD integration
  {
    id: "d3-012",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "What flag must be used when running Claude Code in a CI/CD pipeline to prevent interactive input hangs?",
    options: [
      "The --no-input flag that disables stdin to prevent blocking on reads",
      "The -p (--print) flag for non-interactive single-response execution",
      "The --ci-mode flag built specifically for continuous integration runs",
      "The --batch flag that queues all prompts and processes them serially",
    ],
    correctIndex: 1,
    explanation:
      "The -p (or --print) flag runs Claude Code in non-interactive mode, preventing interactive input hangs in automated pipelines. This outputs the response and exits.",
  },
  {
    id: "d3-013",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "How do you get machine-parseable structured output from Claude Code for automated posting as inline PR comments?",
    options: [
      "Parse the default text output with regex to extract structured fields",
      "Use --output-format json with --json-schema for typed structure",
      "Use --format=xml to produce structured XML that CI tools can parse",
      "Pipe stdout through jq to convert the raw text into a JSON document",
    ],
    correctIndex: 1,
    explanation:
      "--output-format json with --json-schema produces machine-parseable structured findings that can be automatically posted as inline PR comments in CI/CD pipelines.",
  },
  {
    id: "d3-014",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "Why should a different Claude session review code than the one that generated it?",
    options: [
      "The generating session becomes slower from accumulated context weight",
      "The session retains its reasoning context, which biases self-review",
      "The session has consumed its token budget and cannot process more input",
      "There is no proven benefit; the same session reviews equally well now",
    ],
    correctIndex: 1,
    explanation:
      "A model retains reasoning context from generation, making it less likely to question its own decisions in the same session. An independent review instance (without prior reasoning context) is more effective at catching subtle issues. This is the self-review limitation.",
  },

  // ============================================================
  // DOMAIN 4: Prompt Engineering & Structured Output (20%)
  // ============================================================

  // Task 4.1: Explicit criteria
  {
    id: "d4-001",
    domain: "prompt-engineering",
    scenario: "ci-cd",
    question:
      'Your code review prompt says "be conservative and only report high-confidence findings." Developers complain about inconsistent results. What is the fix?',
    options: [
      "Make the instruction more emphatic by adding stronger emphasis words",
      "Replace vague terms with explicit criteria: report bugs, skip style",
      "Increase the model's temperature to generate more diverse findings",
      "Add more few-shot examples specifically of high-confidence findings",
    ],
    correctIndex: 1,
    explanation:
      'General instructions like "be conservative" fail to improve precision compared to specific categorical criteria. Defining explicit criteria for what to report (bugs, security vulnerabilities) vs. what to skip (minor style, local patterns) produces consistent results.',
  },
  {
    id: "d4-002",
    domain: "prompt-engineering",
    scenario: "ci-cd",
    question:
      "A CI code review category has a high false positive rate, causing developers to distrust all findings. What is the recommended approach?",
    options: [
      "Remove the category permanently from the code review configuration",
      "Temporarily disable it to restore trust while improving its prompts",
      "Add a disclaimer about potential false positives to all the findings",
      "Reduce the model's temperature for that specific review category only",
    ],
    correctIndex: 1,
    explanation:
      "High false positive rates in some categories undermine developer confidence in accurate categories too. Temporarily disabling problematic categories while improving their prompts restores overall trust in the system.",
  },

  // Task 4.2: Few-shot prompting
  {
    id: "d4-003",
    domain: "prompt-engineering",
    question:
      "When are few-shot examples most critical for improving output quality?",
    options: [
      "When the model is producing correct but overly verbose output results",
      "When instructions alone yield inconsistent ambiguous-case handling",
      "When you need to reduce token usage and lower overall API call costs",
      "Only for creative writing tasks requiring a specific authorial voice",
    ],
    correctIndex: 1,
    explanation:
      "Few-shot examples are most effective when detailed instructions alone produce inconsistent results. They are particularly valuable for demonstrating ambiguous-case handling (e.g., tool selection for ambiguous requests), consistent output formatting, and enabling the model to generalize patterns to novel cases.",
  },
  {
    id: "d4-004",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "Your extraction system handles varied document structures (inline citations vs bibliographies, methodology sections vs embedded details). How should few-shot examples be designed?",
    options: [
      "Use only one example of the most common document format encountered",
      "Include examples showing correct handling of each document structure",
      "Skip few-shot examples entirely and use more detailed instructions",
      "Use synthetic examples that do not closely match real document inputs",
    ],
    correctIndex: 1,
    explanation:
      "Few-shot examples should demonstrate correct handling of varied document structures (inline citations vs bibliographies, methodology sections vs embedded details). This enables the model to generalize judgment to novel patterns rather than only matching pre-specified cases.",
  },
  {
    id: "d4-005",
    domain: "prompt-engineering",
    question:
      "How do few-shot examples reduce hallucination in data extraction tasks?",
    options: [
      "They do not reduce hallucination; it is an unavoidable model behavior",
      "By showing null for missing data and standard formats, curbing faking",
      "By increasing the model's overall confidence in its generated outputs",
      "By reducing the number of input tokens that need to be processed here",
    ],
    correctIndex: 1,
    explanation:
      "Few-shot examples demonstrating correct null handling (returning null when information is not mentioned) and standardized formatting reduce hallucination by showing the model the expected behavior for missing or inconsistent data rather than fabricating plausible values.",
  },

  // Task 4.3: Structured output with tool use and JSON schemas
  {
    id: "d4-006",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "What is the most reliable approach for getting guaranteed schema-compliant JSON output from Claude?",
    options: [
      "Ask Claude to output JSON by adding a directive in the system prompt",
      "Use tool_use with JSON schemas, which eliminates syntax errors fully",
      "Use response prefilling with a ```json prefix to start the JSON block",
      "Parse and fix any invalid JSON from the output after generation ends",
    ],
    correctIndex: 1,
    explanation:
      "Tool use (tool_use) with JSON schemas is the most reliable approach for guaranteed schema-compliant structured output. It eliminates JSON syntax errors entirely. However, it does not prevent semantic errors (e.g., line items that don't sum to total).",
  },
  {
    id: "d4-007",
    domain: "prompt-engineering",
    question:
      "JSON schemas via tool use eliminate syntax errors, but what type of errors do they NOT prevent?",
    options: [
      "Formatting errors in the JSON output string representation itself",
      "Type errors where string fields receive integer or boolean values",
      "Semantic errors like line items that do not sum to stated totals",
      "Encoding errors related to Unicode character set representation",
    ],
    correctIndex: 2,
    explanation:
      "Strict JSON schemas via tool use eliminate syntax errors but do not prevent semantic validation errors, such as line items that don't sum to the stated total, or values being placed in the wrong fields. Additional validation logic is needed for semantic correctness.",
  },
  {
    id: "d4-008",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "When designing a schema for extracting data from documents that may not contain all fields, should fields be required or optional?",
    options: [
      "All fields should be required to ensure complete extraction every time",
      "Fields should be nullable when sources may lack that information",
      "Use a single flat string field for everything to avoid type complexity",
      "Simply skip any fields that might be missing from the source document",
    ],
    correctIndex: 1,
    explanation:
      "Schema fields should be optional (nullable) when source documents may not contain the information. Making them required forces the model to fabricate values, increasing hallucination. Nullable fields allow honest 'null' responses.",
  },
  {
    id: "d4-009",
    domain: "prompt-engineering",
    question:
      "What is the 'resilient catch-all' pattern for enum fields in JSON schemas?",
    options: [
      "Adding every single possible value to the enum until it is exhaustive",
      "Adding 'other' plus a detail string field for extensible categories",
      "Using a free-text string field instead of a constrained enum entirely",
      "Removing the enum constraint and allowing any arbitrary string values",
    ],
    correctIndex: 1,
    explanation:
      "The resilient catch-all pattern adds an 'other' value to the enum paired with a detail string field (e.g., property_type_detail). This handles edge cases without continuously expanding enums as new categories arise (fragile expansion anti-pattern).",
  },

  // Task 4.4: Validation, retry, and feedback loops
  {
    id: "d4-010",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "Your extraction system has a 15% validation failure rate on invoices where line items don't sum to the stated total. What is the recommended schema-level fix?",
    options: [
      "Add a simple retry loop that sends the same extraction prompt again",
      "Extract both calculated_total and stated_total, flag mismatches",
      "Increase the model temperature to get more varied extraction attempts",
      "Pre-calculate the totals yourself and inject them into the prompt text",
    ],
    correctIndex: 1,
    explanation:
      "The schema redundancy pattern extracts both calculated_total (model sums line items) and stated_total (extracted directly from document). When they don't match, the record is flagged for human review. This catches extraction errors, OCR errors, and mathematical inconsistencies.",
  },
  {
    id: "d4-011",
    domain: "prompt-engineering",
    question:
      "When is the retry-with-error-feedback pattern effective, and when is it ineffective?",
    options: [
      "It is always effective for any type of error the model encounters",
      "Effective for formatting errors; ineffective when data is absent",
      "It is never effective and only wastes tokens with no real improvement",
      "Only effective for JSON syntax errors, not other structural problems",
    ],
    correctIndex: 1,
    explanation:
      "Retry-with-error-feedback works for formatting and structural output errors (the model can self-correct). It's ineffective when the required information is simply absent from the source document, as retrying the same extraction with the same missing data won't produce different results.",
  },
  {
    id: "d4-012",
    domain: "prompt-engineering",
    question:
      "What is the purpose of adding a 'detected_pattern' field to structured code review findings?",
    options: [
      "To track which programming language was used in the reviewed code file",
      "To record which construct triggered the finding for dismissal analysis",
      "To store the regex pattern used in the search that found the code issue",
      "To formally document the review methodology used for each finding made",
    ],
    correctIndex: 1,
    explanation:
      "Adding a detected_pattern field to structured findings enables systematic analysis of false positive patterns. When developers dismiss findings, you can analyze which detected_patterns are most often dismissed and use that data to improve prompts.",
  },

  // Task 4.5: Batch processing strategies
  {
    id: "d4-013",
    domain: "prompt-engineering",
    question:
      "The Message Batches API offers 50% cost savings. Which workloads are appropriate for batch processing?",
    options: [
      "Pre-merge code review checks that block pull request submission",
      "Real-time customer chat responses requiring immediate low-latency reply",
      "Non-blocking workloads like overnight reports and weekly audits",
      "Interactive debugging sessions where developers await each response",
    ],
    correctIndex: 2,
    explanation:
      "Batch processing (up to 24-hour processing window, no guaranteed latency SLA) is appropriate for non-blocking, latency-tolerant workloads: overnight reports, weekly audits, nightly test generation. It's inappropriate for blocking workflows like pre-merge checks.",
  },
  {
    id: "d4-014",
    domain: "prompt-engineering",
    question:
      "What is a key limitation of the Message Batches API?",
    options: [
      "It only supports plain text input, not images or other media types",
      "No multi-turn tool calling within a single request is supported",
      "It has a hard maximum of only 10 individual requests per batch job",
      "It requires a minimum of 1000 requests before a batch can be started",
    ],
    correctIndex: 1,
    explanation:
      "The batch API does not support multi-turn tool calling within a single request. It cannot execute tools mid-request and return results. This limits it to single-turn extraction or generation tasks. Use custom_id fields for correlating batch request/response pairs.",
  },
  {
    id: "d4-015",
    domain: "prompt-engineering",
    question:
      "Your SLA requires documents to be processed within 30 hours, and the batch API has a 24-hour processing window. How should you calculate batch submission frequency?",
    options: [
      "Submit everything once per day in a single large batch at midnight",
      "Submit batches every 4-6 hours to ensure the 30-hour SLA is met",
      "Submit in real-time as each individual document arrives for processing",
      "Wait until the 30-hour deadline approaches, then submit everything",
    ],
    correctIndex: 1,
    explanation:
      "With a 30-hour SLA and 24-hour batch processing window, submit batches every 4-6 hours. This ensures even the oldest document in a batch (up to 6 hours old when submitted) completes within 30 hours (6 + 24 = 30).",
  },

  // Task 4.6: Multi-instance and multi-pass review
  {
    id: "d4-016",
    domain: "prompt-engineering",
    scenario: "ci-cd",
    question:
      "Why is a self-review by the same Claude session that generated code less effective than an independent review?",
    options: [
      "The generating session runs out of available memory for the review",
      "The model retains prior reasoning context, biasing its self-review",
      "Self-review uses significantly more tokens than independent review",
      "Claude is architecturally unable to review any of its own code output",
    ],
    correctIndex: 1,
    explanation:
      "Self-review limitations arise because the model retains reasoning context from generation, making it less likely to question its own decisions. Independent review instances (without prior reasoning context) are more effective at catching subtle issues than self-review instructions or extended thinking.",
  },

  // ============================================================
  // DOMAIN 5: Context Management & Reliability (15%)
  // ============================================================

  // Task 5.1: Context window optimization
  {
    id: "d5-001",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "A customer support agent repeatedly calls lookup_order, filling the context window with verbose shipping and payment data when only the return status is needed. What is the fix?",
    options: [
      "Increase the context window size to accommodate all the verbose data",
      "Filter tool responses to extract only relevant fields before adding",
      "Summarize all tool results automatically using an intermediate model",
      "Limit the agent to making only one single tool call per conversation",
    ],
    correctIndex: 1,
    explanation:
      "Tool context pruning uses application-side filtering to extract only relevant fields from verbose tool responses before adding them to the conversation. This prevents context bloat while preserving the information the agent actually needs.",
  },
  {
    id: "d5-002",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "A customer support session covers a refund inquiry, a subscription question, and a payment update across 48 turns. The context is approaching limits. What is the recommended strategy?",
    options: [
      "Start a completely new session and lose all previous conversation",
      "Summarize resolved turns; keep full verbatim history for active issue",
      "Delete all tool_result messages from the conversation history entirely",
      "Reduce the response quality to save tokens on each subsequent reply",
    ],
    correctIndex: 1,
    explanation:
      "For long multi-topic sessions approaching context limits, summarize earlier resolved turns into a narrative description while preserving full verbatim message history only for the active, unresolved issue. This balances context preservation with space efficiency.",
  },

  // Task 5.2: Resuming asynchronous sessions
  {
    id: "d5-003",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "A customer returns 4 hours later to continue a support session. The order status may have changed. What should happen before resuming?",
    options: [
      "Resume the exact prior conversation state as-is without any modifications",
      "Start a completely new conversation with no history from the prior one",
      "Keep human/assistant turns but filter old tool_results to force refresh",
      "Send the returning customer to an entirely different support agent right away",
    ],
    correctIndex: 2,
    explanation:
      "When resuming asynchronous sessions, keep human/assistant turns for continuity but filter out previous tool_result messages. This forces the agent to re-fetch needed data upon resumption, ensuring customers always receive fresh, current information rather than stale data from hours ago.",
  },

  // Task 5.3: Scratchpad pattern
  {
    id: "d5-004",
    domain: "context-management",
    scenario: "developer-productivity",
    question:
      "During a 30+ minute exploration session, an agent starts giving inconsistent answers about early discoveries. What is the recommended mitigation?",
    options: [
      "Restart the session entirely to clear the accumulated state bloat",
      "Maintain a scratchpad file of key findings for the agent to consult",
      "Increase the model's memory allocation in the runtime configuration",
      "Ask the agent to output a summary every 10 messages automatically",
    ],
    correctIndex: 1,
    explanation:
      "The scratchpad pattern has the agent actively maintain a structured file (scratchpad.md) recording key findings, architectural maps, and decisions. The agent references this dense file for subsequent questions instead of relying on raw message history that may have decayed due to token bloat.",
  },

  // Task 5.4: Codebase exploration strategies
  {
    id: "d5-005",
    domain: "context-management",
    scenario: "developer-productivity",
    question:
      "A new engineer asks an agent to understand a codebase with 800+ files. What is the recommended exploration strategy?",
    options: [
      "Read all 800 files sequentially to build a complete understanding first",
      "Start broad with README, then dynamically generate investigation tasks",
      "Only read files that the engineer specifically mentions by file path",
      "Use Grep to search for all function definitions across every file now",
    ],
    correctIndex: 1,
    explanation:
      "The directed exploration strategy starts broad (reading CLAUDE.md/README for architecture overview, asking the human engineer for priority files), then dynamically generates investigation subtasks based on what is discovered. Sequential reading of all files overloads the context window with unrelated data.",
  },

  // Task 5.5: Error handling and escalation
  {
    id: "d5-006",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "An MCP tool call returns an error. The anti-pattern is to throw an application exception that crashes the agent. What is the correct pattern?",
    options: [
      "Silently ignore the error entirely and continue with the next step",
      "Return the error in tool result content with the isError flag as true",
      "Retry the tool call indefinitely in a loop until it finally succeeds",
      "Log the error to a file and return an empty string to the agent model",
    ],
    correctIndex: 1,
    explanation:
      "The correct pattern for graceful tool failure is to return the error message in the tool result content with the isError flag set to true. This lets the agent reason about the error and respond appropriately (e.g., telling the user about a delay). Throwing exceptions crashes the agent; empty strings give no information.",
  },

  // Task 5.6: Human-in-the-loop calibration
  {
    id: "d5-007",
    domain: "context-management",
    scenario: "structured-data",
    question:
      "You want to automate data extractions when model confidence is >90% and route to human review otherwise. What is a critical validation step before deploying this threshold?",
    options: [
      "Test the threshold on just 10 representative sample documents before deploy",
      "Verify accuracy by document type and field, not just in the aggregate",
      "Check that the model actually outputs numeric confidence scores at all",
      "Set the threshold to 95% instead of 90% to be safe against all errors",
    ],
    correctIndex: 1,
    explanation:
      "Before deploying confidence-based routing, you must analyze accuracy by document type and field to verify high-confidence extractions perform consistently across all segments. Aggregate accuracy can mask poor performance on specific document types or fields.",
  },

  // Task 5.7: Escalation handoff
  {
    id: "d5-008",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "A customer says 'I want a human NOW.' What should the agent do?",
    options: [
      "Try to resolve the issue first before considering any escalation path",
      "Ask clarifying questions about the issue to gather more context first",
      "Honor it immediately by calling escalate_to_human without delay",
      "Explain that AI assistance is faster and more efficient than a human",
    ],
    correctIndex: 2,
    explanation:
      "When a customer explicitly requests a human agent ('I want a human NOW'), honor it immediately. Do not ask for more clarification or attempt further resolution. Call escalate_to_human directly. For complex policy issues, gather account context first, then escalate with a structured summary.",
  },

  // ============================================================
  // Additional questions from The Architect's Playbook
  // ============================================================

  {
    id: "d4-020",
    domain: "prompt-engineering",
    question:
      "The Architect's Playbook describes four constraint dimensions. What are they, and how is each mitigated?",
    options: [
      "Speed, Quality, Size, and Format are the four core constraint dimensions",
      "Latency (caching), Accuracy (few-shot), Cost (batching), Compliance",
      "Input, Output, Processing, and Storage are the four constraint categories",
      "Security, Performance, Reliability, and Scalability are the four concerns",
    ],
    correctIndex: 1,
    explanation:
      "The four constraints are: Latency (mitigated by parallelization & caching), Accuracy (mitigated by structured intermediates & few-shot prompts), Cost (mitigated by batch APIs & context pruning), and Compliance (enforced by application-layer intercepts, NOT prompts).",
  },
  {
    id: "d4-021",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "When extracting data from a document with nullable fields, the model hallucinates plausible values (e.g., 'attendee_count: 500'). What two-step fix does the Playbook recommend?",
    options: [
      "Increase temperature and add more examples to handle more edge cases",
      "Add explicit null instructions, then add few-shot format examples",
      "Remove all nullable fields from the schema to avoid the issue entirely",
      "Use a different, larger model that hallucinates less on extraction work",
    ],
    correctIndex: 1,
    explanation:
      "Step 1: Add explicit prompt instructions to return null if the information is not directly stated. Step 2: Add few-shot examples with standardized formats (e.g., 'cotton blend' -> 'Cotton Blend') to handle both missing data and inconsistent formatting.",
  },
  {
    id: "d5-010",
    domain: "context-management",
    question:
      "What is the 'Data Evolution Rule' for schemas handling amended documents (e.g., contracts with amendments)?",
    options: [
      "Always overwrite original values with the latest amendment values found",
      "Capture multiple values per field, each with source and effective date",
      "Ignore all amendments entirely and only extract original document data",
      "Create completely separate schemas for each individual amendment version",
    ],
    correctIndex: 1,
    explanation:
      "The Data Evolution Rule says to redesign schemas so amended fields capture multiple values, each with a source location and effective date. For example, payment_terms becomes an array with entries like [{value: '30 days', source: 'Original Contract, Clause 4.1', effective_date: '2023-01-01'}].",
  },

  // ============================================================
  // Questions from Course Notes (Claude Code, SDK, Hooks)
  // ============================================================

  {
    id: "d3-020",
    domain: "claude-code-config",
    question:
      "What does the /init command do in Claude Code?",
    options: [
      "Initializes a new Git repo with a default branch and remote settings",
      "Scans the codebase and generates a CLAUDE.md with project context",
      "Scaffolds a new project directory from a built-in starter template",
      "Sets up the Claude API client with stored auth and token credentials",
    ],
    correctIndex: 1,
    explanation:
      "The /init command analyzes the entire codebase on first run and creates a CLAUDE.md file with project summary, architecture, and key files. This file's contents are included in every subsequent request as context.",
  },
  {
    id: "d3-021",
    domain: "claude-code-config",
    question:
      "What are the three levels of CLAUDE.md files in Claude Code?",
    options: [
      "Dev, Staging, and Production levels matching deployment environments",
      "Project (shared via VCS), Local (personal), User (global per machine)",
      "Public, Private, and Protected levels governing team access controls",
      "Root, Package, and Module levels corresponding to directory hierarchy",
    ],
    correctIndex: 1,
    explanation:
      "The three levels are: Project level (shared with team, committed to source control), Local level (personal instructions, not committed), and Machine/User level (~/.claude/CLAUDE.md, global instructions for all projects).",
  },
  {
    id: "d3-022",
    domain: "claude-code-config",
    question:
      "What is the difference between Plan Mode and Thinking Mode in Claude Code?",
    options: [
      "They are identical features with different names across documentation",
      "Plan handles breadth across files; Thinking handles deep reasoning",
      "Plan is for high-level project planning; Thinking for abstract topics",
      "Plan produces documents and specs; Thinking produces runnable code now",
    ],
    correctIndex: 1,
    explanation:
      "Plan Mode handles breadth: it researches more files and creates detailed implementation plans before executing. Thinking Mode handles depth: it gives Claude extended reasoning budget for complex logic or debugging specific issues. They can be combined for complex tasks.",
  },
  {
    id: "d3-023",
    domain: "claude-code-config",
    question:
      "What do the Escape, Double Escape, and Compact commands do in Claude Code?",
    options: [
      "Exit the program, force quit the active process, and clear the screen",
      "Escape stops response; Double Escape rewinds; Compact summarizes",
      "Cancel the current operation, undo the last change, then redo it next",
      "Escape switches modes; Double Escape exits Claude; Compact reformats",
    ],
    correctIndex: 1,
    explanation:
      "Escape stops Claude mid-response to redirect. Double Escape shows all previous messages, allowing jump-back to an earlier point while maintaining relevant context. Compact summarizes the entire conversation history while preserving Claude's learned knowledge about the current task.",
  },
  {
    id: "d1-020",
    domain: "agentic-architecture",
    question:
      "In Claude Code's hook system, what exit codes do pre-tool-use hooks use, and what do they mean?",
    options: [
      "Exit 0 means an error occurred; Exit 1 means the tool call succeeded",
      "Exit 0 allows the tool call to proceed; Exit 2 blocks its execution",
      "Exit 0 skips the tool call entirely; Exit 1 allows it to run as usual",
      "Exit 1 allows the tool call to run; Exit 2 allows with a log warning",
    ],
    correctIndex: 1,
    explanation:
      "Pre-tool-use hooks use exit code 0 to allow the tool call to proceed and exit code 2 to block it. When blocked (exit 2), the stderr output is sent as feedback to Claude. Post-tool-use hooks run after execution and cannot block.",
  },
  {
    id: "d1-021",
    domain: "agentic-architecture",
    question:
      "What is the TypeScript Type Checker hook pattern, and when is it useful?",
    options: [
      "A hook that checks TypeScript syntax before any new file is created",
      "A post-tool hook running tsc after edits, feeding errors back to fix",
      "A pre-tool-use hook that validates TypeScript imports before execution",
      "A hook that enforces TypeScript usage over JavaScript in all projects",
    ],
    correctIndex: 1,
    explanation:
      "The TypeScript Type Checker hook is a post-tool-use hook that runs 'tsc --no-emit' after TypeScript file changes. It detects type errors immediately and feeds them back to Claude, which then fixes the call sites automatically. This catches issues when Claude changes a function signature without updating all callers.",
  },

  // MCP-specific questions from course notes
  {
    id: "d2-020",
    domain: "tool-design-mcp",
    question:
      "What are the three primitives an MCP server can expose?",
    options: [
      "Functions, Classes, and Modules in the standard MCP specification",
      "Tools (model-controlled), Resources (app-controlled), Prompts (user)",
      "Read operations, Write operations, and Execute operations exclusively",
      "Input primitives, Process primitives, and Output primitives together",
    ],
    correctIndex: 1,
    explanation:
      "MCP servers expose three primitives: Tools (model-controlled, Claude decides when to execute), Resources (app-controlled, application decides when to fetch data), and Prompts (user-controlled, triggered by user actions like slash commands).",
  },
  {
    id: "d2-021",
    domain: "tool-design-mcp",
    question:
      "How do you add an MCP server to Claude Code?",
    options: [
      "Edit the system prompt to include the server connection details directly",
      "Run 'claude mcp add [server-name] [startup-command]' in the terminal",
      "Add the MCP server package as a dependency entry in package.json file",
      "Import the MCP server module directly in your main application source",
    ],
    correctIndex: 1,
    explanation:
      "MCP servers are added to Claude Code with the command 'claude mcp add [server-name] [startup-command]'. After adding, restart Claude Code to access the new capabilities. Permissions for MCP tools can be auto-approved via settings.",
  },
  {
    id: "d2-022",
    domain: "tool-design-mcp",
    question:
      "What is the difference between MCP Resources and MCP Tools in terms of control?",
    options: [
      "Resources are faster than tools due to their caching infrastructure",
      "Resources are app-controlled; Tools are model-controlled by Claude",
      "There is no difference in control; both work exactly the same way",
      "Tools are app-controlled for fetching; Resources are model-controlled",
    ],
    correctIndex: 1,
    explanation:
      "Resources are app-controlled: the application decides when to fetch data (e.g., for UI display, autocomplete, prompt augmentation). Tools are model-controlled: Claude decides when to execute them based on conversation context. Prompts are user-controlled (triggered by slash commands).",
  },

  // API-specific questions
  {
    id: "d4-030",
    domain: "prompt-engineering",
    question:
      "What is response prefilling, and how is it used for structured output?",
    options: [
      "Pre-loading the model with extra training data before it generates output",
      "Adding an assistant message like '```json' to steer response format",
      "Caching the first response from a prompt so it can be reused more quickly",
      "Pre-computing the full response on the server before returning it to client",
    ],
    correctIndex: 1,
    explanation:
      "Response prefilling adds a manual assistant message at the end of the conversation. Claude sees it as already authored content and continues from there. Combined with stop sequences (e.g., '```' to stop JSON output), this produces clean structured data without markdown formatting or commentary.",
  },
  {
    id: "d4-031",
    domain: "prompt-engineering",
    question:
      "What is the key advantage of using tool_use for structured data extraction over response prefilling?",
    options: [
      "It is significantly faster at generating the structured output results",
      "It guarantees schema-compliant JSON; prefilling may produce invalid",
      "It uses fewer tokens per request than the response prefilling approach",
      "It supports more programming languages in the tool schema definition",
    ],
    correctIndex: 1,
    explanation:
      "Tool use with JSON schemas guarantees schema-compliant output by validating against the schema definition. Response prefilling is simpler but may produce invalid JSON. Tool use is more reliable but more complex to set up.",
  },
  {
    id: "d5-020",
    domain: "context-management",
    question:
      "What is prompt caching, and when is it most beneficial?",
    options: [
      "Caching Claude's final responses for identical queries in a database",
      "Storing input processing work so identical content reuses cached work",
      "Caching prompt templates in a database for quick reuse across systems",
      "Pre-loading common prompts into server memory at application startup",
    ],
    correctIndex: 1,
    explanation:
      "Prompt caching stores the results of input message processing in a temporary cache. When identical input appears in subsequent requests, Claude retrieves cached work instead of reprocessing. This speeds up responses and reduces costs, especially for repeated system prompts, tool schemas, and static message prefixes. Cache lasts 1 hour.",
  },
  {
    id: "d5-021",
    domain: "context-management",
    question:
      "What is the minimum token threshold for prompt caching, and what invalidates the cache?",
    options: [
      "100 tokens minimum; nothing invalidates it once cached permanently",
      "1024 tokens; any change before the cache breakpoint invalidates all",
      "512 tokens minimum; the cache expires after 5 minutes of inactivity",
      "No minimum token count; cache entries are stored permanently forever",
    ],
    correctIndex: 1,
    explanation:
      "Prompt caching requires a minimum of 1024 tokens of content to be cached. Any change in content before the cache breakpoint invalidates the entire cache. Cache duration is 1 hour maximum. Up to 4 cache breakpoints can be placed per request.",
  },

  // Extended thinking
  {
    id: "d4-040",
    domain: "prompt-engineering",
    question:
      "What is extended thinking in Claude, and when should it be used?",
    options: [
      "A feature that makes Claude process all responses faster than normal",
      "Extra reasoning time before responding, for complex accuracy needs",
      "A method for extending the context window beyond its normal limits",
      "A way to generate longer responses that exceed the default max length",
    ],
    correctIndex: 1,
    explanation:
      "Extended thinking gives Claude a separate reasoning phase before generating the final response. It increases accuracy for complex tasks but adds cost (thinking tokens are charged) and latency. Use it after prompt engineering techniques have been exhausted and you still need higher accuracy.",
  },

  // RAG questions
  {
    id: "d5-030",
    domain: "context-management",
    question:
      "In a RAG pipeline, what is the purpose of 'contextual retrieval'?",
    options: [
      "Making the retrieval step faster by using optimized vector indexes",
      "Adding context to chunks before embedding so they keep document ties",
      "Retrieving contextual data from the user's browser or local machine",
      "Contextualizing the user's query before sending it to the search step",
    ],
    correctIndex: 1,
    explanation:
      "Contextual retrieval is a pre-processing step that uses an LLM to add situating context to each chunk before embedding. The LLM generates a brief explanation of the chunk's relationship to the larger document, improving retrieval accuracy for chunks that would otherwise lose context when separated from the source.",
  },
  {
    id: "d5-031",
    domain: "context-management",
    question:
      "What is Reciprocal Rank Fusion (RRF) used for in multi-index RAG pipelines?",
    options: [
      "Fusing multiple language models together into a single ensemble model",
      "Merging results from different indexes by combining rank-based scores",
      "Combining multiple document chunks into one single consolidated chunk",
      "Ranking user queries by how frequently they are submitted to the system",
    ],
    correctIndex: 1,
    explanation:
      "Reciprocal Rank Fusion merges search results from different indexes (vector + BM25/lexical). Formula: RRF_score = sum of (1/(rank + 1)) across all search methods for each document. Documents are then ranked by highest combined score, leveraging the strengths of both semantic and keyword search.",
  },

  // Workflows vs Agents
  {
    id: "d1-030",
    domain: "agentic-architecture",
    question:
      "When should you prefer a workflow pattern over an agent pattern?",
    options: [
      "When you want maximum flexibility for handling unpredictable tasks",
      "When you know the exact steps, since workflows have higher completion",
      "When the task is completely unknown and requires open-ended reasoning",
      "Always; agents are never recommended for any production application",
    ],
    correctIndex: 1,
    explanation:
      "Workflows are preferred when you have precise task understanding and know the exact steps. They have higher task completion rates due to their structured approach. Agents provide flexibility for varied challenges but have lower completion rates. Prioritize workflows for reliability; use agents only when flexibility is truly required.",
  },
  {
    id: "d1-031",
    domain: "agentic-architecture",
    question:
      "What are the main workflow patterns described in the course material?",
    options: [
      "Sequential execution, Parallel execution, and Recursive processing",
      "Parallelization (subtasks + aggregate), Chaining, and Routing",
      "Batch processing, Stream processing, and Event-driven processing",
      "Synchronous workflows, Asynchronous workflows, and Hybrid workflows",
    ],
    correctIndex: 1,
    explanation:
      "The main workflow patterns are: Parallelization (break task into simultaneous subtasks, then aggregate), Chaining (sequential steps where each focuses on one subtask), and Routing (categorize user input first, then route to specialized pipeline with customized prompts/tools).",
  },

  // Claude Code SDK
  {
    id: "d3-030",
    domain: "claude-code-config",
    question:
      "What are the default permissions when using the Claude Code SDK, and how do you enable write operations?",
    options: [
      "Full read and write permissions are granted by default with no setup",
      "Read-only by default; write needs allowTools config like 'edit'",
      "No permissions exist by default; every tool must be configured first",
      "Write-only by default; read permissions require explicit enablement",
    ],
    correctIndex: 1,
    explanation:
      "The Claude Code SDK defaults to read-only permissions (files, directories, grep operations). Write permissions must be manually enabled by specifying tools like 'edit' in the options.allowTools array when making query calls.",
  },

  // GitHub integration
  {
    id: "d3-031",
    domain: "claude-code-config",
    question:
      "How does Claude Code's GitHub integration work for automated code reviews?",
    options: [
      "It monitors repository webhooks via a manually configured webhook server",
      "It installs a GitHub app adding mention support and auto PR review",
      "It requires a fully custom CI/CD pipeline built and maintained manually",
      "It relies on GitLab-specific merge request hooks, not GitHub PR events",
    ],
    correctIndex: 1,
    explanation:
      "The GitHub integration installs via '/install GitHub app', adding two default actions: mention support (@Claude in issues/PRs to assign tasks) and automatic PR review on new pull requests. Actions are customizable via config files in .github/workflows, and MCP servers can be integrated.",
  },

  // Parallelizing Claude Code
  {
    id: "d3-032",
    domain: "claude-code-config",
    question:
      "How do you safely run multiple Claude Code instances in parallel on the same codebase?",
    options: [
      "Run multiple terminals in the same directory with no extra isolation",
      "Use Git worktrees for isolated workspaces per instance, then merge",
      "Use Docker containers to sandbox each Claude Code instance at runtime",
      "Parallelization is unsupported; only one instance can run at a time",
    ],
    correctIndex: 1,
    explanation:
      "Git worktrees create complete project copies in separate directories, each on a different branch. Each Claude instance works in isolation, commits changes to its branch, then merges back to main. This prevents file conflicts from simultaneous modifications.",
  },

  // Temperature
  {
    id: "d4-050",
    domain: "prompt-engineering",
    question:
      "How does the temperature parameter affect Claude's output, and when should you use low vs high values?",
    options: [
      "Temperature controls the maximum response length Claude produces",
      "Low for deterministic extraction; high for creative brainstorming",
      "Temperature controls which knowledge base the model draws answers from",
      "Temperature has no measurable effect on Claude's output whatsoever",
    ],
    correctIndex: 1,
    explanation:
      "Temperature (0-1) controls randomness in token selection. At 0, Claude always picks the highest probability token (deterministic). Higher values increase chances of selecting lower probability tokens. Use low temperature for data extraction, factual tasks. Use high temperature for creative tasks like brainstorming.",
  },

  // Stop sequences
  {
    id: "d4-051",
    domain: "prompt-engineering",
    question:
      "What are stop sequences, and how are they used in practice?",
    options: [
      "Sequences that prevent the model from starting any generation at all",
      "Strings that halt generation when produced, for clean output format",
      "Error codes that terminate the active API connection to the server",
      "Special tokens that reset the conversation history to an empty state",
    ],
    correctIndex: 1,
    explanation:
      "Stop sequences are strings that force Claude to halt generation when produced. Combined with assistant message prefilling (e.g., prefill with '```json' and stop on '```'), they produce clean structured output without Claude's natural explanatory headers/footers.",
  },

  // Model selection
  {
    id: "d1-040",
    domain: "agentic-architecture",
    question:
      "When should you use different Claude models (Opus, Sonnet, Haiku) in the same application?",
    options: [
      "Always use the same model across the entire application for consistency",
      "Opus for complex reasoning; Sonnet for general tasks; Haiku for speed",
      "Only use Opus for production; others are just for development testing",
      "Model selection does not meaningfully impact results in any situation",
    ],
    correctIndex: 1,
    explanation:
      "Using multiple models in the same application is common. Opus for complex, multi-step tasks requiring deep reasoning. Sonnet for balanced intelligence, speed, and cost (most practical use cases, strong coding). Haiku for speed-optimized real-time interactions and high-volume processing.",
  },

  // Streaming
  {
    id: "d5-040",
    domain: "context-management",
    question:
      "Why is response streaming important for AI applications, and how does it work?",
    options: [
      "It reduces API costs by sending less data over the network connection",
      "It shows chunks as generated via SSE, giving immediate user feedback",
      "It speeds up the model's internal generation process significantly",
      "It compresses the response payload to reduce bandwidth requirements",
    ],
    correctIndex: 1,
    explanation:
      "Streaming displays responses chunk-by-chunk via Server-Sent Events (content_block_delta events containing text chunks). This provides immediate user feedback instead of waiting 10-30 seconds. Implementation: client.messages.create(stream=True) or client.messages.stream() with text_stream.",
  },

  // Citations
  {
    id: "d5-041",
    domain: "context-management",
    question:
      "What does the citations feature in the Claude API provide?",
    options: [
      "Academic citation formatting following APA, MLA, and Chicago styles",
      "Source references with page or character positions for verification",
      "A bibliography generator that compiles all referenced sources neatly",
      "Hyperlinks to web sources that Claude used during response generation",
    ],
    correctIndex: 1,
    explanation:
      "Citations allow Claude to reference source documents and show exactly where information comes from. For PDFs, citations include page locations (citation_page_location). For text, character positions (citation_char_location). This enables transparency and user verification of Claude's responses.",
  },

  // Batch tool for parallel execution
  {
    id: "d2-030",
    domain: "tool-design-mcp",
    question:
      "Claude can technically send multiple tool_use blocks in one message but rarely does. What is the 'batch tool' pattern to fix this?",
    options: [
      "Submit multiple API requests simultaneously from the client application",
      "Create a batch tool that takes a list of invocations to run together",
      "Use the Message Batches API endpoint instead of the standard messages",
      "Set tool_choice to 'any' so Claude calls tools more aggressively now",
    ],
    correctIndex: 1,
    explanation:
      "The batch tool pattern creates a higher-level tool that accepts a list of invocations (each with tool name + arguments). Instead of relying on Claude to send multiple tool_use blocks, the batch tool manually iterates through invocations and calls each tool, achieving parallel execution in a single request-response cycle.",
  },

  // Web Search tool
  {
    id: "d2-031",
    domain: "tool-design-mcp",
    question:
      "What is the built-in web_search tool in the Claude API, and what does it return?",
    options: [
      "A simple wrapper around Google Search that returns raw HTML content",
      "A built-in tool returning text, search results, and citation blocks",
      "A tool that requires full custom implementation by the developer team",
      "A paid add-on feature that must be enabled separately in the console",
    ],
    correctIndex: 1,
    explanation:
      "The built-in web search tool (schema type: web_search_20250305) requires no custom code. Claude handles searches automatically. Responses include text blocks, web search result blocks (title, URL), and citation blocks linking statements to source material. max_uses and allowed_domains can be configured.",
  },

  // Computer use
  {
    id: "d2-032",
    domain: "tool-design-mcp",
    question:
      "How does Claude's computer use capability work architecturally?",
    options: [
      "Claude directly controls the mouse and keyboard via native OS access",
      "Claude sends action requests; developers fulfill them via a container",
      "Claude runs inside a virtual machine with full desktop GUI access",
      "It uses screen recording software to observe and replicate user input",
    ],
    correctIndex: 1,
    explanation:
      "Computer use is a tool system. Claude sends tool_use requests for actions (mouse move, left click, screenshot). Developers fulfill these via a computing environment (typically a Docker container with pre-built mouse/keyboard execution code from Anthropic's reference implementation). Results flow back to Claude for the next action.",
  },

  // Multi-turn conversations
  {
    id: "d5-050",
    domain: "context-management",
    question:
      "Why must the entire conversation history be sent with every API request to Claude?",
    options: [
      "For security verification and authentication of each individual request",
      "The API stores no messages; each request is independent, no memory",
      "To improve the overall quality of responses across the conversation",
      "It is optional but recommended as a best practice for better answers",
    ],
    correctIndex: 1,
    explanation:
      "The Anthropic API stores no messages. Each request is completely independent with no memory of previous exchanges. To maintain conversation context, you must manually maintain a message list in code and send the entire conversation history with every follow-up request.",
  },
  // ============================================================
  // Additional from Course Notes: API, Streaming, RAG, MCP Transports
  // ============================================================

  {
    id: "d5-060",
    domain: "context-management",
    question:
      "In the Claude API, what is the role of the max_tokens parameter?",
    options: [
      "It sets the target length of the response that Claude should produce",
      "A safety limit on max generated tokens; also stops at end_of_sequence",
      "It controls the quality of the output based on how many tokens to use",
      "It determines how many conversation turns are allowed per API session",
    ],
    correctIndex: 1,
    explanation:
      "max_tokens is a safety limit (not a target) on the maximum number of tokens in the response. Generation stops when either max_tokens is reached or the model generates a special end_of_sequence token. Setting it higher does not force longer responses.",
  },
  {
    id: "d4-060",
    domain: "prompt-engineering",
    question:
      "What is chain-of-thought prompting?",
    options: [
      "Chaining multiple separate API calls together in a sequential pipeline",
      "Encouraging step-by-step reasoning to break complex tasks into parts",
      "Linking multiple different models together into a single processing flow",
      "Creating a chain of few-shot examples that build on each other in order",
    ],
    correctIndex: 1,
    explanation:
      "Chain-of-thought prompting encourages the AI to work through a problem step by step, breaking down complex tasks into smaller steps that help deliver better, more thorough results. It's a core prompt engineering technique.",
  },
  {
    id: "d4-061",
    domain: "prompt-engineering",
    question:
      "What is the recommended approach for structuring prompts that contain multiple types of interpolated content (code, docs, user data)?",
    options: [
      "Separate each content section with blank lines and no other markers",
      "Use XML tags with descriptive names to wrap each content section",
      "Put all the content in a single paragraph without any delimiters",
      "Use JSON formatting to wrap and structure every piece of content",
    ],
    correctIndex: 1,
    explanation:
      "XML tags with descriptive names help AI models distinguish between different types of content when large amounts of text are interpolated into prompts. This reduces ambiguity about content boundaries and improves output quality.",
  },
  {
    id: "d4-062",
    domain: "prompt-engineering",
    question:
      "What are the three types of graders used in prompt evaluation pipelines?",
    options: [
      "Fast graders, Medium graders, and Slow graders based on speed tier",
      "Code graders (programmatic), Model graders (LLM), Human graders",
      "Input graders, Output graders, and Format graders in the pipeline",
      "Binary graders, Scale graders, and Rubric graders for scoring types",
    ],
    correctIndex: 1,
    explanation:
      "The three grader types are: Code graders (programmatic checks like syntax validation, length, keyword presence), Model graders (additional LLM call to evaluate quality/instruction-following), and Human graders (manual evaluation, most flexible but time-consuming).",
  },
  {
    id: "d4-063",
    domain: "prompt-engineering",
    question:
      "In the prompt evaluation workflow, why should the model grader prompt request reasoning/strengths/weaknesses before a score, rather than just a score?",
    options: [
      "It uses more tokens which mechanically improves model accuracy here",
      "Without reasoning, models default to middling scores without thought",
      "It makes the evaluation output more visually appealing and readable",
      "It is required by the API; the endpoint rejects score-only responses",
    ],
    correctIndex: 1,
    explanation:
      "If you only ask for a score, models tend to default to middling values (around 5-6). Requiring reasoning, strengths, and weaknesses forces the model to actually evaluate the output before scoring, producing more differentiated and useful scores.",
  },

  // MCP Transport questions
  {
    id: "d2-040",
    domain: "tool-design-mcp",
    question:
      "What are the two main MCP transport mechanisms, and what is the key limitation of StreamableHTTP?",
    options: [
      "REST and GraphQL are the two transports; GraphQL is significantly slower",
      "Stdio (same-machine, bidirectional) and StreamableHTTP (remote, limited)",
      "TCP and UDP are the two transports; UDP loses packets during transfer",
      "WebSocket and HTTP are the two transports; no meaningful difference here",
    ],
    correctIndex: 1,
    explanation:
      "Stdio transport enables full bidirectional communication but requires same-machine operation. StreamableHTTP enables remote hosting but has restricted server-to-client messaging. StreamableHTTP uses SSE (Server-Sent Events) as a workaround for server-initiated communication.",
  },
  {
    id: "d2-041",
    domain: "tool-design-mcp",
    question:
      "What is MCP Sampling, and why is it useful?",
    options: [
      "Taking random samples of tool results for quality assurance purposes",
      "Servers request LLM generation from clients, needing no own API keys",
      "Sampling different MCP servers for load balancing across the cluster",
      "Testing MCP tools against sample data before deploying to production",
    ],
    correctIndex: 1,
    explanation:
      "Sampling shifts LLM access responsibility from server to client. The server creates a message request, the client handles the LLM call, and returns generated text to the server. This eliminates the need for servers to manage API keys, authentication, or token costs.",
  },
  {
    id: "d2-042",
    domain: "tool-design-mcp",
    question:
      "What happens when you set stateless=true on a StreamableHTTP MCP server?",
    options: [
      "Nothing meaningful changes; the server behaves exactly the same way",
      "No sessions, no GET SSE, no sampling or progress, no initialization",
      "The server becomes faster due to reduced session tracking overhead",
      "It enables horizontal scaling with no trade-offs or lost capabilities",
    ],
    correctIndex: 1,
    explanation:
      "Setting stateless=true disables session tracking, eliminates the GET SSE response pathway (server cannot send requests to client), removes sampling/progress/logging/subscriptions, and skips client initialization. This enables horizontal scaling but significantly reduces server-to-client communication capabilities.",
  },

  // Workflows and Agents patterns
  {
    id: "d1-050",
    domain: "agentic-architecture",
    question:
      "What is the evaluator-optimizer workflow pattern?",
    options: [
      "A pattern for optimizing model parameters through gradient descent tuning",
      "A loop where a producer generates and an evaluator accepts or repeats",
      "A pattern for evaluating and comparing different LLM providers on cost",
      "An A/B testing framework for comparing two model configurations live now",
    ],
    correctIndex: 1,
    explanation:
      "The evaluator-optimizer pattern has two components: a producer that generates output and an evaluator that assesses quality. If the evaluator rejects the output, the loop returns to the producer with feedback. This continues until the evaluator accepts. Example: generating a 3D model from an image, then comparing the rendering to the original.",
  },
  {
    id: "d1-051",
    domain: "agentic-architecture",
    question:
      "What is the key principle for designing agent tool sets?",
    options: [
      "Provide as many specialized tools as possible for comprehensive coverage",
      "Provide a small set of abstract, composable tools for creative use",
      "Only provide one single tool at a time to keep decision-making simple",
      "Match each possible user request to its own dedicated specialized tool",
    ],
    correctIndex: 1,
    explanation:
      "Agents work best with abstract, general-purpose tools (like bash, web_fetch, file_write) that can be combined creatively for various tasks. Hyper-specialized tools (like refactor_tool) limit the agent's flexibility. Claude Code exemplifies this with a small set of versatile tools.",
  },
  {
    id: "d1-052",
    domain: "agentic-architecture",
    question:
      "What is the routing workflow pattern?",
    options: [
      "Routing network traffic between microservices in a distributed system",
      "Classifying input first, then routing to a specialized pipeline for it",
      "Routing requests to different LLM providers based on cost and latency",
      "A load balancing strategy distributing requests across server replicas",
    ],
    correctIndex: 1,
    explanation:
      "The routing pattern first classifies user input (e.g., 'educational' vs 'entertainment'), then routes to a specialized pipeline with prompts/tools tailored for that category. This ensures output style matches the input type rather than using a one-size-fits-all approach.",
  },
  {
    id: "d1-053",
    domain: "agentic-architecture",
    question:
      "Why is environment inspection important for agents?",
    options: [
      "It helps with logging and monitoring the agent's resource utilization",
      "Agents need feedback on state to track their progress and errors",
      "It improves the overall performance speed of the agent's tool calling",
      "It is required by the API specification and causes errors if not done",
    ],
    correctIndex: 1,
    explanation:
      "Environment inspection (e.g., taking screenshots after clicks in computer use, reading files before editing) gives agents feedback about the current state. Without it, agents operate blindly and cannot gauge progress, detect errors, or adapt to unexpected results.",
  },

  // RAG Pipeline questions
  {
    id: "d5-070",
    domain: "context-management",
    question:
      "What are the three main text chunking strategies for RAG, and when should you use each?",
    options: [
      "Small chunks, Medium chunks, and Large chunks based on token size only",
      "Size-based (equal-length), Structure-based (headers), Semantic (NLP)",
      "Random chunking, Sequential chunking, and Hierarchical chunking types",
      "Word-level, Sentence-level, and Paragraph-level chunking as approaches",
    ],
    correctIndex: 1,
    explanation:
      "Size-based chunking divides into equal-length strings (easiest, most common, works with any format). Structure-based splits on document structure like headers (best for markdown/HTML but requires structured input). Semantic-based uses NLP to group related content (most advanced). Size-based with overlap is the most reliable fallback.",
  },
  {
    id: "d5-071",
    domain: "context-management",
    question:
      "What is cosine similarity, and how is it used in RAG pipelines?",
    options: [
      "A measure of text length similarity between two document chunks",
      "Angle between embedding vectors, -1 to 1, finding relevant chunks",
      "A measure of keyword overlap between a query and stored documents",
      "A compression algorithm for reducing the size of embedding vectors",
    ],
    correctIndex: 1,
    explanation:
      "Cosine similarity measures the angle between embedding vectors, returning values from -1 to 1 (1 = very similar). Cosine distance (1 minus similarity) is also used, where values closer to 0 mean higher similarity. Vector databases use this to find chunks semantically related to user queries.",
  },
  {
    id: "d5-072",
    domain: "context-management",
    question:
      "Why does a hybrid RAG pipeline combine vector search with BM25 lexical search?",
    options: [
      "BM25 is faster so it handles overflow when vector search is too slow",
      "Vectors understand meaning but miss exact terms; BM25 catches them",
      "They are interchangeable and either alone works equally well in practice",
      "BM25 handles images while vector search handles text-based documents",
    ],
    correctIndex: 1,
    explanation:
      "Semantic search (vectors) understands meaning but can miss exact keyword matches. BM25 lexical search excels at finding documents with specific rare terms (like 'incident 2023 Q4 011'). Combining both via Reciprocal Rank Fusion leverages the strengths of both approaches.",
  },
  {
    id: "d5-073",
    domain: "context-management",
    question:
      "What problem does contextual retrieval solve in RAG pipelines?",
    options: [
      "Slow retrieval speed when vector databases grow beyond memory limits",
      "Chunks lose document context when split; LLM adds it back before embed",
      "Duplicate chunk detection and removal across multiple document sources",
      "Vector database storage limits when indexing very large document sets",
    ],
    correctIndex: 1,
    explanation:
      "When documents are chunked, each chunk loses its relationship to the larger document. Contextual retrieval pre-processes each chunk by using an LLM to generate a brief contextual description of how the chunk relates to the overall document, then prepends this context before embedding.",
  },

  // AI Fluency Framework questions
  {
    id: "d4-070",
    domain: "prompt-engineering",
    question:
      "What are the '4 Ds' of AI Fluency?",
    options: [
      "Design, Develop, Deploy, and Debug for the full development lifecycle",
      "Delegation, Description, Discernment, and Diligence in AI practices",
      "Data, Distribution, Deployment, and Documentation for AI operations",
      "Discovery, Development, Delivery, and Diagnostics for AI workflows",
    ],
    correctIndex: 1,
    explanation:
      "The 4 Ds of AI Fluency are: Delegation (distributing work between humans and AI), Description (communicating effectively with AI), Discernment (critically evaluating AI outputs), and Diligence (using AI responsibly and ethically).",
  },
  {
    id: "d4-071",
    domain: "prompt-engineering",
    question:
      "What are the three Human-AI Interaction Modes?",
    options: [
      "Input mode, Processing mode, and Output mode for each pipeline stage only",
      "Automation (executes), Augmentation (collaboration), Agency (autonomous)",
      "Text mode, Voice mode, and Visual mode for different interface types used",
      "Synchronous mode, Asynchronous mode, and Batch mode for timing controls",
    ],
    correctIndex: 1,
    explanation:
      "The three modes are: Automation (human defines task, AI executes), Augmentation (iterative collaboration where both contribute), and Agency (human establishes knowledge/behavior patterns, AI works independently including interacting with other systems).",
  },
  {
    id: "d4-072",
    domain: "prompt-engineering",
    question:
      "In the AI Fluency framework, what does 'Product Discernment' mean?",
    options: [
      "Choosing which AI product to buy based on features and pricing tiers",
      "Evaluating AI output quality: accuracy, coherence, and relevance",
      "Discerning which product or feature to build based on user feedback",
      "Marketing AI products effectively to reach the right target audience",
    ],
    correctIndex: 1,
    explanation:
      "Product Discernment means evaluating the quality of AI outputs for accuracy, appropriateness, coherence, and relevance. It's one of three discernment types alongside Process Discernment (evaluating AI's reasoning) and Performance Discernment (evaluating interaction behavior).",
  },

  // Technical concepts from vocabulary sheet
  {
    id: "d5-080",
    domain: "context-management",
    question:
      "What is a hallucination in the context of AI?",
    options: [
      "When the AI generates creative fiction at the user's explicit request",
      "When AI confidently states something plausible but actually incorrect",
      "When the AI refuses to answer a question due to safety restrictions",
      "When the AI repeats itself in loops without producing new information",
    ],
    correctIndex: 1,
    explanation:
      "A hallucination is when AI confidently states something that sounds plausible but is actually incorrect. This is a key reliability concern, especially for data extraction tasks where the model may fabricate values to satisfy required fields.",
  },
  {
    id: "d5-081",
    domain: "context-management",
    question:
      "What is the 'context window' of an AI model?",
    options: [
      "The browser window or UI where you interact with the AI application",
      "Total information the AI can consider at once, with a token limit",
      "The time window during which a conversation session remains active",
      "The range of topics an AI can discuss based on its training corpus",
    ],
    correctIndex: 1,
    explanation:
      "The context window is the total amount of information an AI can consider in a single interaction, including all conversation history and shared documents. It has a maximum token limit that varies by model. Managing context window usage is critical for long conversations and large document processing.",
  },
  {
    id: "d5-082",
    domain: "context-management",
    question:
      "What is the transformer architecture, and why is it significant?",
    options: [
      "A type of electrical transformer used in AI hardware infrastructure",
      "The 2017 AI design enabling parallel text processing with attention",
      "A data transformation pipeline for preprocessing training datasets",
      "A network architecture designed specifically for IoT device clusters",
    ],
    correctIndex: 1,
    explanation:
      "The transformer architecture (2017) is the breakthrough design enabling modern LLMs to process sequences of text in parallel while paying attention to relationships between words across long passages. It's the foundation of Claude and other large language models.",
  },
  {
    id: "d4-073",
    domain: "prompt-engineering",
    question:
      "What is 'scaling laws' in the context of AI?",
    options: [
      "Rules for scaling AI infrastructure horizontally across server nodes",
      "More data, parameters, and compute yield consistent performance gains",
      "Pricing models for AI services based on usage volume and tier level",
      "Load balancing algorithms distributing requests across model replicas",
    ],
    correctIndex: 1,
    explanation:
      "Scaling laws refer to the empirical observation that AI model performance improves consistently with more data, more parameters, and more compute. Most interestingly, entirely new capabilities can emerge at certain scale thresholds that weren't explicitly programmed.",
  },

  // Tool use mechanics
  {
    id: "d2-050",
    domain: "tool-design-mcp",
    question:
      "In the Claude API tool use flow, what does a stop_reason of 'tool_use' indicate?",
    options: [
      "The tool has finished executing and returned its result successfully",
      "Claude wants to call a tool; execute it and send the result back",
      "An error occurred during tool use that requires developer attention",
      "The user explicitly requested a tool call in their message content",
    ],
    correctIndex: 1,
    explanation:
      "stop_reason: 'tool_use' means Claude wants to call a tool. The response contains a tool_use block with the tool name and arguments. The developer executes the tool function, creates a tool_result block with the output and matching tool_use_id, and sends it back as a user message.",
  },
  {
    id: "d2-051",
    domain: "tool-design-mcp",
    question:
      "Why must tool schemas be included in every follow-up API request, even after the initial tool call?",
    options: [
      "For billing purposes so Anthropic can track tool usage per request",
      "The API is stateless; schemas are needed each time to know the tools",
      "To improve response speed through schema pre-compilation each time",
      "Schemas are only needed in the first request, not in follow-up calls",
    ],
    correctIndex: 1,
    explanation:
      "The Anthropic API is stateless and stores nothing between requests. Tool schemas must be included in every request so Claude knows which tools are available and can correctly interpret tool results. Omitting schemas in follow-up calls causes confusion.",
  },
  {
    id: "d2-052",
    domain: "tool-design-mcp",
    question:
      "What is the built-in Text Editor tool in the Claude API?",
    options: [
      "A full IDE embedded in Claude for editing code within the conversation",
      "A schema Claude knows, but developers must implement file operations",
      "A cloud-hosted code editor accessible through the Claude API endpoint",
      "A syntax highlighting library for rendering code blocks in responses",
    ],
    correctIndex: 1,
    explanation:
      "The Text Editor tool provides a JSON schema that Claude already knows (supporting view, str_replace, create, insert, undo_edit commands). However, only the schema is built in; developers must implement the actual file system operations that handle Claude's tool requests.",
  },

  // Diligence and safety
  {
    id: "d4-074",
    domain: "prompt-engineering",
    question:
      "In the AI Fluency framework, what does 'Deployment Diligence' mean?",
    options: [
      "Deploying AI models to production infrastructure with zero downtime",
      "Verifying and vouching for AI-assisted outputs before using them",
      "Monitoring deployment metrics and dashboards for model performance",
      "Automating deployment pipelines to reduce manual intervention steps",
    ],
    correctIndex: 1,
    explanation:
      "Deployment Diligence means taking responsibility for verifying and vouching for AI-assisted outputs before using or sharing them. It sits alongside Creation Diligence (thoughtful AI system choices) and Transparency Diligence (being honest about AI's role in your work).",
  },
  // ============================================================
  // Skilljar-style questions (from course quizzes)
  // ============================================================
  {
    id: "d2-060",
    domain: "tool-design-mcp",
    question:
      "What is the fundamental limitation of language models that necessitates the use of a tool system in coding assistants?",
    options: [
      "They can only generate code in a few specific programming languages",
      "They have limited memory capacity for processing large codebase files",
      "They cannot understand complex programming concepts or design patterns",
      "They only process text, not directly interact with external systems",
    ],
    correctIndex: 3,
    explanation:
      "Language models only process text input and produce text output. They cannot directly read files, run commands, or interact with external systems. The tool use system bridges this gap by enabling formatted action requests that an assistant executes on behalf of the model.",
  },
  {
    id: "d3-040",
    domain: "claude-code-config",
    question:
      "What permission configuration is required when integrating MCP servers with Claude Code in GitHub Actions?",
    options: [
      "Each MCP server tool must be individually listed in the permissions",
      "No special permissions are needed when running inside GitHub Actions",
      "Permissions are automatically inherited from the repository settings",
      "A single blanket permission covering all MCP operations is sufficient",
    ],
    correctIndex: 0,
    explanation:
      "When using MCP servers in GitHub Actions, each MCP server tool must be individually listed in the permissions. There are no shortcuts: every tool requires explicit permission listing for Claude Code to use it in CI/CD workflows.",
  },
  {
    id: "d3-041",
    domain: "claude-code-config",
    question:
      "How do you create a custom command in Claude Code that accepts runtime parameters?",
    options: [
      "Use the @parameters decorator inside the YAML frontmatter of commands",
      "Define parameters in the settings.json global configuration file block",
      "Pass command-line flags when invoking the command from the terminal app",
      "Include $ARGUMENTS placeholder in the markdown command file template",
    ],
    correctIndex: 3,
    explanation:
      "Custom commands use $ARGUMENTS placeholder in the markdown file to accept runtime parameters. When the command is invoked, any text after the command name replaces the $ARGUMENTS placeholder. Arguments can be file paths, descriptive text, or any string.",
  },
  {
    id: "d1-060",
    domain: "agentic-architecture",
    question:
      "Which type of hook can prevent a tool call from happening if certain conditions are met?",
    options: [
      "PostToolUse hook runs after and can undo the tool call if needed",
      "Project hook that applies rules to all tools in the current project",
      "Global hook that applies rules to all tools across every project now",
      "PreToolUse hook runs before execution and can block the tool call",
    ],
    correctIndex: 3,
    explanation:
      "PreToolUse hooks run before tool execution and can block it by exiting with code 2. PostToolUse hooks run after execution and cannot block. When a PreToolUse hook blocks, its stderr output is sent as feedback to Claude.",
  },
  {
    id: "d1-061",
    domain: "agentic-architecture",
    question:
      "A developer wants to prevent Claude from reading sensitive .env files. Which type of hook should they set up, and what tool names would they match?",
    options: [
      "PostToolUse hook, matching the Write and Edit tools specifically",
      "PreToolUse hook, matching the Write and Create tools for new files",
      "PreToolUse hook, matching Read and Grep tools that access contents",
      "PostToolUse hook, matching Read and Delete tools after execution",
    ],
    correctIndex: 2,
    explanation:
      "A PreToolUse hook matching 'read|grep' (the tools that can access file contents) should be used. The hook script checks if the file path includes '.env' and exits with code 2 to block access. PreToolUse is needed because it can prevent the action; PostToolUse runs too late.",
  },

  {
    id: "d5-083",
    domain: "context-management",
    question:
      "What is 'bias' in AI systems?",
    options: [
      "A preference for certain programming languages in code generation",
      "Systematic patterns that unfairly favor or disadvantage some groups",
      "A technical parameter of the model that controls output distribution",
      "The model's built-in preference for longer responses over short ones",
    ],
    correctIndex: 1,
    explanation:
      "AI bias refers to systematic patterns in outputs that unfairly favor or disadvantage certain groups or perspectives. These biases often reflect patterns present in the training data. Being aware of and mitigating bias is part of the Diligence competency in AI Fluency.",
  },

  // ============================================================
  // Scenario 7: Conversational AI Architecture Patterns
  // ============================================================

  // Instruction drift / system-prompt dilution over turns
  {
    id: "d5-090",
    domain: "context-management",
    scenario: "conversational-architecture",
    question:
      "An assistant follows its contractor-persona system prompt for the first turns, but by turn 7 it gives generic advice. Total conversation length is only 2,500 tokens. What is the most likely cause?",
    options: [
      "System prompts only establish the assistant's initial behavior once",
      "Model attention degrades sharply as the number of turns accumulates",
      "Accumulated assistant responses dilute the system prompt's influence",
      "The system prompt is transmitted only on the first request, not after",
    ],
    correctIndex: 2,
    explanation:
      "As assistant responses accumulate in history, the proportion of text reflecting the system prompt shrinks relative to growing model-generated content. The model increasingly pattern-matches to its own prior outputs, causing drift even at short token counts. The system prompt is resent every call (it is not sent only once), and attention degradation does not operate at 2,500 tokens.",
  },
  {
    id: "d5-091",
    domain: "context-management",
    scenario: "conversational-architecture",
    question:
      "During QA, Claude follows system-prompt guidelines for the first 10 to 15 turns, then deviates. The conversation is still well within token limits. What is the best solution?",
    options: [
      "Move the behavioral guidelines into the very first user message",
      "Start a fresh conversation automatically once 20 turns are reached",
      "Validate every response and regenerate any non-compliant outputs",
      "Insert user-role reminders reinforcing guidelines at breakpoints",
    ],
    correctIndex: 3,
    explanation:
      "Periodic injection of behavioral reminders re-establishes constraints at intervals as history accumulates, directly countering instruction drift. Moving guidelines to the first user message lowers their authority; starting over destroys context; post-response validation is corrective rather than preventive and adds latency.",
  },
  {
    id: "d4-080",
    domain: "prompt-engineering",
    scenario: "conversational-architecture",
    question:
      "An AI tutor has a 2,800-token system prompt of declarative teaching rules. After 12 turns it stops adapting to student proficiency levels. What is the most effective fix?",
    options: [
      "Inject short rule reminders into the conversation every 4 to 5 turns",
      "Replace the verbose rules with few-shot examples of level adaptation",
      "Relocate the most critical rules to the end of the system prompt",
      "Evaluate each response and regenerate when difficulty mismatches",
    ],
    correctIndex: 1,
    explanation:
      "A long declarative system prompt is vulnerable to drift because abstract rules must be re-reasoned every turn. Concrete few-shot examples demonstrating correct proficiency-level adaptation give the model behavioral patterns to match, which is followed more reliably over many turns. Reminder injection treats symptoms; end-placement helps only initially; regeneration is expensive and corrective.",
  },
  {
    id: "d4-081",
    domain: "prompt-engineering",
    scenario: "conversational-architecture",
    question:
      "An assistant must maintain an enthusiastic tone, explain its reasoning, and ask clarifying questions throughout a multi-turn session. Where should these persistent behavioral guidelines be defined?",
    options: [
      "Prepended as a block to every individual user message sent",
      "In the system prompt, which persists across the conversation",
      "In the first assistant message at the start of the dialogue",
      "In application environment variables read at session start",
    ],
    correctIndex: 1,
    explanation:
      "The system prompt is designed for persistent behavioral constraints that apply for the whole conversation. Prepending to every user message is redundant overhead; the first assistant message is unreliable because the model can deviate from its own prior statements; environment variables have no effect on model behavior.",
  },

  // Tool design for safe execution
  {
    id: "d1-070",
    domain: "agentic-architecture",
    scenario: "conversational-architecture",
    question:
      "A remove_team_member tool has a dry_run boolean for previewing impact, but monitoring shows the agent often calls it with dry_run=false directly, skipping the preview. You must guarantee every removal is preceded by a confirmed preview. What is the most reliable approach?",
    options: [
      "Add few-shot examples and detailed tool-description instructions to always preview first",
      "Allow dry_run=false only if an identical dry_run=true call occurred in the last 60 seconds",
      "Split into preview_remove_member returning a single-use token and execute_remove_member requiring it",
      "Annotate the tool as confirmation-required so the orchestration layer prompts before forwarding",
    ],
    correctIndex: 2,
    explanation:
      "The two-tool token-binding design makes execution architecturally impossible without a prior preview: the execute tool requires a token only the preview tool can mint. This enforces the constraint at the code level rather than relying on LLM compliance with instructions, a fragile timing heuristic, or orchestration infrastructure that may not exist.",
  },
  {
    id: "d2-070",
    domain: "tool-design-mcp",
    scenario: "conversational-architecture",
    question:
      "A search_catalog tool fails 12% of the time: 8% are network timeouts that succeed on retry, and 4% are query syntax errors that never succeed. Both are currently returned identically, wasting retries. How should you modify error handling?",
    options: [
      "Apply uniform exponential-backoff retry logic to every error the tool returns",
      "Retry timeouts with backoff inside the tool; return syntax errors immediately with details",
      "Return all errors with a retryable boolean and error-type metadata for the agent",
      "Add system-prompt few-shot examples teaching the agent to tell the error types apart",
    ],
    correctIndex: 1,
    explanation:
      "The tool has definitive knowledge of the error type, so handling transient retries inside the tool is the correct abstraction boundary, while syntax errors are returned immediately with validation details. Uniform backoff wastes time on errors that never succeed; a retryable flag pushes interpretation onto the agent; prompt instructions are probabilistic.",
  },
  {
    id: "d1-071",
    domain: "agentic-architecture",
    scenario: "conversational-architecture",
    question:
      "A webhook reports that a user's package shipped while the user is actively chatting. You want the assistant to weave this into its next reply naturally. What is the best approach?",
    options: [
      "Append the shipping status as a prefix to the next user message",
      "Add the current shipping status into the conversation system prompt",
      "Send an immediate synthetic user message containing the status update",
      "Force the assistant to call a shipment-status tool on every single turn",
    ],
    correctIndex: 0,
    explanation:
      "Prefixing the update to the next user message injects real-time context at a natural conversation boundary without disrupting flow. Modifying the system prompt mid-session is architecturally cumbersome; a synthetic user message breaks dialogue flow and confuses attribution; forcing a tool call every turn is wasteful when such events are rare.",
  },

  // Handling ambiguous / conflicting user inputs
  {
    id: "d4-082",
    domain: "prompt-engineering",
    scenario: "conversational-architecture",
    question:
      "Across several turns a user said 'I have a very low risk tolerance' and later 'I want to maximize my returns,' then asks 'What should I invest in?' Which approach best ensures the recommendation matches their true priority?",
    options: [
      "Provide two separate recommendations, one for each stated preference",
      "Proceed using the most recently stated preference as authoritative",
      "Recommend a balanced portfolio without addressing the contradiction",
      "Surface the contradiction and ask the user which priority matters more",
    ],
    correctIndex: 3,
    explanation:
      "Low risk tolerance and return maximization are fundamentally incompatible, so any silent assumption may be wrong. Surfacing the conflict and asking for clarification is the only way to guarantee the recommendation aligns with the user's actual intent; the other options each guess on the user's behalf.",
  },
  {
    id: "d4-083",
    domain: "prompt-engineering",
    scenario: "conversational-architecture",
    question:
      "Users send vague requests like 'Can you help with the report?' The assistant responds with several clarifying questions (which report? what help? deadline?), and 40% of users abandon the conversation. What is the best solution?",
    options: [
      "Make reasonable assumptions, state them explicitly, and offer to adjust",
      "Classify request ambiguity with a smaller model before each response",
      "Apply predefined interpretations silently without stating any assumptions",
      "Restrict the assistant to asking only one clarifying question per turn",
    ],
    correctIndex: 0,
    explanation:
      "Proceeding with reasonable, explicitly stated assumptions removes the back-and-forth while keeping the user informed and in control. Silent predefined interpretations leave users confused when the answer misses intent; a one-question limit still forces multiple turns; a smaller classifier adds latency and infrastructure without solving the UX problem.",
  },
  {
    id: "d4-084",
    domain: "prompt-engineering",
    scenario: "conversational-architecture",
    question:
      "Users report repetitive response openings like 'Certainly!' and 'I'd be happy to help!' What is the most effective way to eliminate them?",
    options: [
      "Lower the temperature setting to reduce variation in phrasing",
      "Post-process every response to strip leading greeting phrases",
      "Append a partial assistant message that begins the direct answer",
      "Add system-prompt instructions explicitly banning those phrases",
    ],
    correctIndex: 2,
    explanation:
      "Prefilling the assistant's response with the start of a direct answer prevents greeting patterns at generation time, since the model continues from the prefill. System-prompt bans are less reliable (the model produces variants); post-processing is fragile; temperature controls randomness, not specific opening patterns.",
  },

  // Conversation memory and context window management
  {
    id: "d5-092",
    domain: "context-management",
    scenario: "conversational-architecture",
    question:
      "Two messages after a user said 'I love jazz,' the assistant asks 'What genres do you enjoy?' What is the most likely cause?",
    options: [
      "Claude needs a connected vector database to retain conversation memory",
      "The model's context window has already been exceeded by the exchange",
      "The Claude API requires a session_id parameter to track the dialogue",
      "The application is not including prior messages in the messages array",
    ],
    correctIndex: 3,
    explanation:
      "Claude has no server-side memory; every API call is stateless. If the full conversation history is not included in the messages array of each request, the model has no knowledge of prior turns. Vector databases and session_id are not part of Claude's architecture, and a two-message exchange cannot overflow the context window.",
  },
  {
    id: "d5-093",
    domain: "context-management",
    scenario: "conversational-architecture",
    question:
      "Users report that latency and cost both rise as a conversation exceeds 50 turns. What is the primary cause?",
    options: [
      "The entire conversation history is resent with every API request",
      "The model generates progressively longer responses as turns grow",
      "Backing-store database operations slow down as history accumulates",
      "The model builds an internal user profile that needs more compute",
    ],
    correctIndex: 0,
    explanation:
      "Because the API is stateless, every request must carry the complete conversation history. As the dialogue grows, each request carries more input tokens, directly increasing both processing latency and cost. The model keeps no internal state between calls, and response length is not inherently tied to conversation length.",
  },
  {
    id: "d5-094",
    domain: "context-management",
    scenario: "conversational-architecture",
    question:
      "After a 40-minute cooking session the conversation reaches 78,000 tokens, including allergies, recipe scaling, clarified terms, and small talk. You must reduce tokens while preserving important information. What approach is best?",
    options: [
      "Summarize the entire conversation history into one compact paragraph",
      "Keep only the most recent 20,000 tokens and discard everything older",
      "Extract critical structured data, summarize general talk, keep recent verbatim",
      "Move the full conversation to external storage and retrieve via semantic search",
    ],
    correctIndex: 2,
    explanation:
      "The hybrid approach preserves the highest-value information at lowest cost: critical facts like allergies and quantities go into a compact structured block (avoiding the precision loss of summarization), general discussion is summarized, and recent exchanges stay verbatim for coherence. Whole-history summarization or hard truncation risks losing dietary data; external semantic search is overkill for one session.",
  },
  {
    id: "d5-095",
    domain: "context-management",
    scenario: "conversational-architecture",
    question:
      "An implementation keeps only the last 25 message pairs, and users complain the assistant loses earlier topics and preferences. What is the most effective solution?",
    options: [
      "Run vector similarity search over the entire conversation history",
      "Summarize older messages while keeping recent ones fully verbatim",
      "Increase the retained window from 25 to 50 message pairs instead",
      "Summarize dropped messages each turn and prepend a running summary",
    ],
    correctIndex: 1,
    explanation:
      "The hybrid approach addresses both dimensions: exact recent context for coherence plus a compressed representation of earlier preferences so they are not lost when pairs drop. Enlarging the window only delays the same failure; vector search may miss context not semantically similar to the current query; per-turn summarization adds overhead and compounds summarization errors.",
  },
  {
    id: "d5-096",
    domain: "context-management",
    scenario: "conversational-architecture",
    question:
      "After three months of weekly sessions a conversation reaches 85,000 tokens. Asked 'What did we conclude about the theme of isolation?' the assistant gives generic answers instead of citing prior discussion. What is the most effective approach?",
    options: [
      "Apply rolling-window truncation to keep only the latest exchanges",
      "Use progressive summarization that captures key conclusions over time",
      "Add structured XML tags marking conclusions throughout past content",
      "Use semantic embeddings to retrieve the specific relevant exchanges",
    ],
    correctIndex: 3,
    explanation:
      "Semantic search over conversation history is the only approach that scales to three months while surfacing specific relevant exchanges on demand. Rolling-window truncation discards most history; progressive summarization abstracts away the specific conclusions being asked about; XML tagging requires restructuring all past content and does not solve retrieval at this scale. (At single-session scale this same technique would be overkill, so the right choice is scale-dependent.)",
  },

  // ============================================================
  // Secondary gaps: positional context and multi-source provenance
  // ============================================================
  {
    id: "d5-097",
    domain: "context-management",
    question:
      "When aggregating a long set of multi-file findings into one prompt for a final synthesis, how should you order the content given the lost-in-the-middle effect?",
    options: [
      "Place all detailed results first and bury key findings near the middle",
      "Order content strictly chronologically regardless of relative importance",
      "Put key findings up front and action items at the end, details between",
      "Distribute critical findings randomly so none sit consistently mid-prompt",
    ],
    correctIndex: 2,
    explanation:
      "Models process the start and end of long inputs more reliably than the middle. Position-aware input places key findings at the top and action items at the end, leaving verbose detail in the middle where missing a line matters least. Burying critical conclusions mid-prompt is exactly the failure mode to avoid.",
  },
  {
    id: "d5-098",
    domain: "context-management",
    scenario: "multi-agent-research",
    question:
      "Two research subagents return different values for the same statistic from different sources and dates. How should the synthesis preserve correctness?",
    options: [
      "Pick the value from the more recent source and drop the other one",
      "Average the two values into a single number for a clean report",
      "Keep both values with source, date, and methodology; flag the conflict",
      "Omit the disputed statistic entirely to avoid presenting a contradiction",
    ],
    correctIndex: 2,
    explanation:
      "Conflicting values should be preserved with full attribution (source, date, methodology) and an explicit conflict flag so the coordinator or reader can reconcile them. Including dates also prevents temporal differences from being misread as contradictions. Arbitrarily choosing, averaging, or dropping values destroys provenance and can hide a real discrepancy.",
  },
  {
    id: "d5-099",
    domain: "context-management",
    scenario: "multi-agent-research",
    question:
      "In a multi-agent research report, one subtopic's search subagent timed out and returned only partial results. How should the final synthesis present this section?",
    options: [
      "Silently exclude the subtopic so the report looks internally complete",
      "Abort the whole report because one section is missing full coverage",
      "Include partial results and annotate the section as partial coverage",
      "Substitute the model's own general knowledge to fill the missing gap",
    ],
    correctIndex: 2,
    explanation:
      "The synthesis should include the partial results and explicitly annotate coverage (for example, 'PARTIAL COVERAGE: search agent timeout') so readers know where confidence is limited. Silently dropping the section hides the gap; aborting wastes all valid work; backfilling with unsourced model knowledge introduces unattributed, potentially fabricated claims.",
  },

  // ============================================================
  // Moderate-gap fills: recurring exam patterns (case facts,
  // ambiguous matches, policy-gap escalation, prompt-induced
  // tool bias, escalation calibration)
  // ============================================================
  {
    id: "d5-100",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "Customers reference specifics like 'the 15% discount I mentioned,' but the agent replies with wrong values because those details were stated 20+ turns ago and condensed into vague summaries. What fix is most effective?",
    options: [
      "Raise the summarization trigger threshold so it activates later in the session",
      "Rewrite the summarization prompt to preserve every number, date, and amount verbatim",
      "Extract transactional facts into a persistent case-facts block sent in every prompt",
      "Store full history externally and retrieve it when the agent detects back-references",
    ],
    correctIndex: 2,
    explanation:
      "Summarization inherently loses precise details. Extracting transactional facts (amounts, dates, order numbers) into a structured case-facts block kept outside the summarized history guarantees they appear in every prompt regardless of how many turns are compressed. Raising thresholds only delays the loss; relying on the summarization prompt is still probabilistic; external retrieval is heavier and fires only when a reference is detected.",
  },
  {
    id: "d5-101",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "The get_customer tool returns all matches when searching by name. When several match, the agent currently picks the one with the most recent order, choosing the wrong account 15% of the time. How should you address this?",
    options: [
      "Ask the user for an additional identifier (email, phone, or order number) before acting",
      "Add a confidence score that acts autonomously above 85% and asks only below it",
      "Change get_customer to return one best match via an internal ranking algorithm",
      "Add few-shot examples showing correct reasoning for ambiguous name matches",
    ],
    correctIndex: 0,
    explanation:
      "When a tool returns multiple matches, the reliable resolution is to ask the user for a disambiguating identifier, since the user has definitive knowledge of their own identity. One extra turn eliminates a 15% misidentification rate. Confidence heuristics and internal ranking still guess; few-shot examples cannot supply information the agent does not have.",
  },
  {
    id: "d5-102",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "After calling get_customer and lookup_order, the agent has all available system data. Which situation is the most justified trigger for calling escalate_to_human?",
    options: [
      "A customer wants to cancel an order that shipped yesterday and arrives tomorrow",
      "Tracking shows an order delivered and signed for, but the customer denies receipt",
      "A message contains both a billing question and a separate product return request",
      "A customer requests competitor price matching, which policy neither allows nor forbids",
    ],
    correctIndex: 3,
    explanation:
      "A genuine policy gap (rules cover price drops on your own site but say nothing about competitor matching) requires human judgment, because the agent must not invent policy. The other cases are resolvable within the agent's scope: a normal cancellation, presenting tracking evidence, or decomposing a multi-issue message do not require escalation.",
  },
  {
    id: "d2-071",
    domain: "tool-design-mcp",
    scenario: "customer-support",
    question:
      "When customers include the word 'account,' the agent calls get_customer first 78% of the time; without that word it calls lookup_order first 93% of the time. Tool descriptions are clear and unambiguous. What is the most likely root cause?",
    options: [
      "Base model training links 'account' terminology to customer operations, overriding descriptions",
      "Keyword-sensitive instructions in the system prompt steer tool selection on terms like 'account'",
      "The model needs fine-tuning on more messages that mix account and order terminology together",
      "Tool descriptions lack negative examples specifying when each tool should not be used",
    ],
    correctIndex: 1,
    explanation:
      "A systematic keyword-driven split (78% vs 93%) with already-clear tool descriptions points to explicit routing language in the system prompt reacting to the word 'account.' System-prompt wording can create unintended tool associations. The pattern is too consistent to be base-training drift, and fine-tuning or negative examples do not address prompt-level steering.",
  },
  {
    id: "d5-103",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "An agent achieves 55% first-contact resolution against an 80% target. Logs show it escalates simple cases (standard warranty replacements with photo proof) yet handles complex policy exceptions autonomously. What most effectively improves escalation calibration?",
    options: [
      "Add explicit escalation criteria to the system prompt with few-shot escalate-vs-resolve examples",
      "Have the agent self-rate confidence 1 to 10 and auto-escalate below a fixed threshold",
      "Train a separate classifier on historical tickets to predict escalation before processing",
      "Run sentiment analysis and escalate whenever customer frustration passes a threshold",
    ],
    correctIndex: 0,
    explanation:
      "The root cause is unclear decision boundaries between simple and complex cases. Explicit escalation criteria plus few-shot examples that contrast when to escalate versus resolve directly teach those boundaries with no extra infrastructure. Self-rated confidence is poorly calibrated, a separate classifier is overengineering, and sentiment does not correlate with case complexity.",
  },

  // ============================================================
  // Tool-interface engineering cluster (chaining, IDs, enums,
  // pagination, dynamic scoping, annotation trust) plus
  // over-spawning, goal-vs-procedural prompts, context budget
  // ============================================================
  {
    id: "d2-072",
    domain: "tool-design-mcp",
    scenario: "developer-productivity",
    question:
      "An agent uses search_documents to find files, then share_document(document_id, email) and move_document(document_id, folder) to act on them. How should search_documents format its output for reliable chaining?",
    options: [
      "Return clickable human-readable URLs the agent can follow to each file",
      "Return structured results each containing the document_id plus metadata",
      "Return concise prose summaries describing each matching document's content",
      "Return a plain list of document titles for the agent to choose among",
    ],
    correctIndex: 1,
    explanation:
      "Multi-step workflows need explicit input/output contracts. Because the downstream tools require a machine-usable document_id, the search tool must return that exact id in a structured result alongside human-readable metadata. URLs, prose, and titles force the agent to infer or parse an identifier, which is brittle.",
  },
  {
    id: "d2-073",
    domain: "tool-design-mcp",
    question:
      "An update_game_score(date, team_name) tool frequently fails because of ambiguous team nicknames, same-day rematches, and date-format variation. What is the most reliable redesign?",
    options: [
      "Require strict ISO-8601 dates and official full team names in the schema",
      "Add regex validation on the parameters to reject malformed inputs early",
      "Expand the tool description with examples of correctly formatted inputs",
      "Add a search_games lookup returning game_id; the update tool takes only that id",
    ],
    correctIndex: 3,
    explanation:
      "Natural-language attributes are brittle database keys. Separating discovery from action (a lookup tool returns an unambiguous game_id, and the mutating tool accepts only that id) eliminates nickname, rematch, and date-format ambiguity. Stricter formatting, regex, or richer docs do not resolve which underlying game is meant.",
  },
  {
    id: "d2-074",
    domain: "tool-design-mcp",
    question:
      "An agent repeatedly runs get_property_details(property_id) only to extract an address it immediately passes to get_neighborhood_info(address). This chaining adds latency and failure points. How should the tools be improved?",
    options: [
      "Modify get_neighborhood_info to accept property_id and resolve the address internally",
      "Merge both tools into one get_all_property_data tool returning everything at once",
      "Improve the prompt so the agent extracts the address more reliably each time",
      "Add a middle-tier helper tool that manages the address handoff between them",
    ],
    correctIndex: 0,
    explanation:
      "When one tool's output is a purely mechanical input to the next, internalizing that predictable dependency (let get_neighborhood_info take property_id and do the lookup itself) removes an LLM-orchestrated step, cutting latency and a failure point. Merging over-consolidates distinct capabilities; prompt tweaks and helper tools keep the brittle chaining.",
  },
  {
    id: "d2-075",
    domain: "tool-design-mcp",
    question:
      "An agent must query specific internal databases, but users refer to them in natural language ('the research database' rather than 'db_res_01'). How should the tool's input schema handle this?",
    options: [
      "Accept a freeform string and use backend fuzzy matching to pick the database",
      "Accept a freeform string but reject the call at runtime if the name is invalid",
      "Use an enum parameter listing the exact allowed backend database identifiers",
      "Default to querying every database at once whenever the user is ambiguous",
    ],
    correctIndex: 2,
    explanation:
      "An enum of exact backend values lets the model use its semantic understanding to map messy natural language onto a strict programmatic value before execution, deterministically constraining input. Backend fuzzy matching pushes ambiguity downstream, runtime rejection wastes a turn, and querying everything spikes cost and context.",
  },
  {
    id: "d2-076",
    domain: "tool-design-mcp",
    question:
      "A search tool automatically fetches and returns every matching record, causing severe latency and context bloat even though most tasks need only the first few results. What is the best redesign of its output?",
    options: [
      "Silently cap the response to the five most relevant matches it finds",
      "Return the first page plus pagination metadata (total count and a cursor)",
      "Add a separate fetch_next_page tool the agent calls to continue paging",
      "Add a max_pages parameter so the agent decides how many pages to pull",
    ],
    correctIndex: 1,
    explanation:
      "Returning the first page with total_matches and a next cursor gives the agent situational awareness to decide whether it has enough or should request more, while keeping context lean. Silent truncation hides information; a separate paging tool clutters the toolset; an internal max_pages still encourages hidden multi-page fetching and latency.",
  },
  {
    id: "d2-077",
    domain: "tool-design-mcp",
    question:
      "An agent has 50+ API-connector tools and frequently selects the wrong one even when told to search first. What is the most effective architectural fix?",
    options: [
      "Rewrite all 50 connector descriptions to be longer and more detailed",
      "Combine every connector into one monolithic call that routes internally",
      "Improve error handling so the agent recovers after a wrong selection",
      "Add a search_connectors tool that dynamically exposes only matched tools",
    ],
    correctIndex: 3,
    explanation:
      "Exposing 50+ tools at once degrades selection accuracy through decision complexity. Dynamic scoping (the agent first calls search_connectors, and the system injects only the few relevant tools for the next turn) proactively shrinks the decision space. Better descriptions still leave systemic overload, a monolith hides parameters, and error handling is reactive.",
  },
  {
    id: "d2-078",
    domain: "tool-design-mcp",
    question:
      "A third-party MCP server provides tools annotated readOnlyHint=true. You are designing when to skip user confirmation. How should you treat these annotations?",
    options: [
      "Trust them automatically because the MCP server runs on the local machine",
      "Treat them as untrusted self-reported metadata; gate bypass on vendor trust",
      "Infer trust by first exercising the tools in a sandbox and observing effects",
      "Bypass confirmations freely, since readOnlyHint guarantees no destructive action",
    ],
    correctIndex: 1,
    explanation:
      "Annotations like readOnlyHint are self-reported by the server and are not a security boundary. Confirmation-bypass policy should rest on explicit trust of the vendor or server, not its own labels. Local execution does not imply trustworthiness, sandbox behavior does not prove hidden capabilities absent, and the hint is a label, not a guarantee.",
  },
  {
    id: "d1-072",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "Follow-up summarization queries take 40+ seconds. The coordinator spawns a synthesis subagent per follow-up, passing 80,000 tokens of findings it already holds in its own context from the initial research. What is the most effective fix?",
    options: [
      "Compress the findings before passing them to the synthesis subagent",
      "Cache synthesis subagent responses so repeat follow-ups return faster",
      "Handle the summarization directly using the coordinator's existing context",
      "Use fork_session to make spawning the synthesis subagent start faster",
    ],
    correctIndex: 2,
    explanation:
      "Subagents start fresh and do not inherit the coordinator's history, so spawning one and re-passing 80k tokens the coordinator already has is the anti-pattern. When the coordinator already holds the needed context, it should answer the follow-up itself. Compression and caching still pay the spawn-and-transfer cost; fork_session is for divergent exploration, not latency.",
  },
  {
    id: "d1-073",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "A coordinator hands a web-search subagent exact queries, source priorities, and date filters step by step. The subagent reports 'insufficient results' instead of adapting, weakens on emerging topics, and rarely finds unconventional sources. Best fix?",
    options: [
      "Replace the procedural steps with goal-oriented prompts stating intent and quality criteria",
      "Add a fallback rule telling the subagent to report failure under five results",
      "Expand the hard-coded query lists to explicitly cover emerging topics",
      "Give the subagent generic single-word queries to broaden its search base",
    ],
    correctIndex: 0,
    explanation:
      "Over-specified procedural prompts turn a subagent into a rigid executor that dead-ends when prescribed steps fail. Providing the research goal plus quality criteria (minimum distinct claims, source credibility bar) grants authority to form its own queries and adapt. A failure rule reinforces rigidity, hard-coded lists cannot anticipate emerging topics, and single-word queries destroy specificity.",
  },
  {
    id: "d5-104",
    domain: "context-management",
    scenario: "structured-data",
    question:
      "Extraction is 98% accurate for documents under 150k tokens but drops to 71% for 175k-185k-token documents, with the final third consistently missing. The model's window is 200k; the tool schema and system prompt total ~4,000 tokens. Most likely cause?",
    options: [
      "Schemas beyond 8-10 fields inherently raise decision complexity and error rates",
      "Tool and system-prompt tokens shrink usable context; long docs degrade at the end",
      "Very long documents always exceed the model's effective mid-document attention span",
      "The model splits attention proportionally, starving the document's final section",
    ],
    correctIndex: 1,
    explanation:
      "Context limits are absolute: a ~4k-token schema plus system prompt leaves under 196k for the document, so 180k+ inputs push the payload to the boundary where end-of-prompt attention degrades, exactly matching 'final third missing.' Schema field count causes semantic errors not positional omission (98% on short docs proves the schema is fine); lost-in-the-middle affects the middle; proportional attention is fabricated. Fix by trimming the schema or chunking.",
  },

  // ============================================================
  // Final minor-gap fills: batch sampling/resubmission (4.5),
  // crash-recovery manifest (5.4), citation-id provenance (5.6)
  // ============================================================
  {
    id: "d4-085",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "You will process 50,000 legacy documents via the Batch API. A 500-document test shows 18% need 2-3 prompt refinements to extract correctly. What is the most cost-efficient scaling strategy?",
    options: [
      "Batch all 50,000 immediately, identify failures at scale, and resubmit them",
      "Refine the prompt on a representative sample first, then batch all 50,000",
      "Process all 50,000 synchronously so prompts can be refined per document",
      "Submit incremental 5,000-document batches to learn failure modes in production",
    ],
    correctIndex: 1,
    explanation:
      "Iterative resubmissions at full scale erase the Batch API's savings. Fixing failure modes on a representative sample first maximizes first-pass success when the 50,000-document run executes. Learning prompt failures on production-sized batches (options A and D) is expensive; the synchronous API discards the 50% batch discount.",
  },
  {
    id: "d4-086",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "After a 10,000-document batch completes, 300 documents (3%) fail with context_length_exceeded; the result file lists each failure by custom_id. What is the most cost-effective way to process the failures?",
    options: [
      "Resubmit all 10,000 documents using a smaller chunk size for safety",
      "Switch the 300 failed documents to the synchronous API instead",
      "Extract only the 300 failures by custom_id, chunk them, resubmit as a batch",
      "Raise the model's context-window limit and resubmit the failed documents",
    ],
    correctIndex: 2,
    explanation:
      "custom_id maps results to inputs, so isolate only the 300 failures. Because they exceeded context, chunk those specific documents and resubmit them as a new batch. Reprocessing the 9,700 successes wastes ~97% of the cost; the synchronous API costs more with no benefit here; the context limit is a fixed model constraint, not a setting.",
  },
  {
    id: "d5-105",
    domain: "context-management",
    scenario: "multi-agent-research",
    question:
      "A multi-agent research pipeline crashes after processing 12 of 18 documents, with several agents partially done. How should you resume without losing fidelity or repeating completed work?",
    options: [
      "Run --resume directly on the crashed session and let it continue",
      "Use fork_session from the crash point to branch the execution",
      "Resume the session without recording which documents were partial",
      "Write completed work to a structured checkpoint, start fresh, inject it",
    ],
    correctIndex: 3,
    explanation:
      "Tool results in a crashed session are stale and unreliable, so blindly resuming risks corruption or rework. The robust pattern is exporting completed and partial state to a durable structured checkpoint (a manifest), starting a new session, and injecting that checkpoint with explicit done/partial/pending status. fork_session is for divergent exploration, not failure recovery.",
  },
  {
    id: "d5-106",
    domain: "context-management",
    scenario: "multi-agent-research",
    question:
      "A synthesis agent passes a consolidated prose summary to a report generator, which then makes claims it cannot attribute because source metadata was lost in summarization. What most effectively preserves attribution?",
    options: [
      "Assign a citation_id at the source stage; emit an inline-tagged narrative plus a structured citation index",
      "Instruct the synthesis agent to 'preserve all sources' in its prose summary output",
      "Have the report agent infer the original sources from each claim's wording",
      "Ask the synthesis agent to re-include the full source text inside its summary",
    ],
    correctIndex: 0,
    explanation:
      "Prose collapses metadata. Assigning a citation_id at source discovery, then having the synthesis agent write a narrative with inline tags (e.g., [src_001]) while the full metadata travels in a separate structured citation index, keeps content and provenance separable through the pipeline. Prose instructions are probabilistic, inference hallucinates citations, and re-inflating full text triggers lost-in-the-middle.",
  },

  // ============================================================
  // AI-GENERATED from Anthropic Academy course crawl (2026-05-19)
  // Concept-derived; see docs/notes/source-coverage-map.md
  // ============================================================

  // ---- Domain 1: Agentic Architecture (subagents course) ----
  {
    id: "d1-074",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "When the main agent delegates to a subagent, what exactly does the subagent receive to begin its work?",
    options: [
      "A custom system prompt from its config plus a task description the parent writes",
      "The full conversation history of the main thread plus the original user message",
      "Only the raw user request, with no system prompt or parent instructions",
      "A shared context window that both the parent and the subagent keep writing to",
    ],
    correctIndex: 0,
    explanation:
      "A subagent gets two things: the system prompt defined in its config file, and a task description the parent agent writes based on the request. It does not inherit the main thread's history; the subagent runs in an isolated context and returns only a summary.",
  },
  {
    id: "d1-075",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "developer-productivity",
    question:
      "In a subagent config file, which YAML frontmatter field controls when Claude decides to delegate to that subagent?",
    options: [
      "The model field, since it determines which Claude tier handles routing",
      "The color field, which the parent reads to prioritize subagents",
      "The description field, which guides when Claude invokes the subagent",
      "The tools field, since available tools imply the subagent's purpose",
    ],
    correctIndex: 2,
    explanation:
      "The description field controls when Claude decides to use the subagent and is the primary routing signal; it must be a single line and may include example conversations. model picks the tier, color is a UI label, and tools sets access, none of which drive delegation decisions.",
  },
  {
    id: "d1-076",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "code-generation",
    question:
      "You are writing the system prompt for a code-review subagent. Which single change most improves the usefulness of what it returns to the main agent?",
    options: [
      "Adding the phrase 'you are a senior staff engineer with deep expertise'",
      "Specifying an exact output format and how to structure its findings",
      "Granting it every available tool so it never gets blocked mid-task",
      "Telling it to run as many iterations as it needs without limits",
    ],
    correctIndex: 1,
    explanation:
      "Being specific about what to look for and how to structure the report is the difference between a useful subagent and one that misses the point. Expertise claims add nothing Claude lacks, broad tool access violates least privilege, and unbounded iteration does not improve report quality.",
  },
  {
    id: "d1-077",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "code-generation",
    question:
      "A team builds three sequential subagents: one reproduces a bug, one debugs it, one fixes it. Why is this pipeline an anti-pattern?",
    options: [
      "Subagents cannot run shell commands, so reproduction always fails",
      "Pipelines require the parent to merge outputs, which is unsupported",
      "Each step depends on the previous step's discoveries, so handoffs lose information",
      "Three subagents exceed the maximum allowed concurrent Task calls",
    ],
    correctIndex: 2,
    explanation:
      "Sequential subagent pipelines work only when steps are truly independent. Bug fixing depends heavily on what each prior step discovered, and that detail gets lost compressing each subagent's context into a summary. The other options describe limits that do not exist.",
  },
  {
    id: "d1-078",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "developer-productivity",
    question:
      "Which proposed subagent adds genuine value over just asking the main thread directly?",
    options: [
      "A 'Python expert' subagent that claims deep language mastery",
      "A 'Kubernetes specialist' subagent that asserts cluster expertise",
      "A 'test runner' subagent that runs the suite and reports pass or fail",
      "A styling subagent pointed at the design-system files it auto-loads",
    ],
    correctIndex: 3,
    explanation:
      "A styling subagent is better than the main thread because its config loads the design-system files into context, giving it knowledge the main thread lacks. Expert-claim subagents add nothing Claude already knows, and test-runner subagents tend to hide the failure detail you actually need.",
  },
  {
    id: "d1-079",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "code-generation",
    question:
      "You spent many turns building a feature with the main thread and now want a rigorous review. Why is delegating the review to a separate subagent better than asking the same thread?",
    options: [
      "The subagent runs on a faster model, so it finishes reviewing sooner",
      "It sees the changes fresh, without the history of how the code was written",
      "Subagents are the only place git diff can be executed safely",
      "Reviewing in the main thread permanently corrupts the conversation state",
    ],
    correctIndex: 1,
    explanation:
      "Claude reviews more effectively when code appears authored by someone else; a thread that helped write the code struggles to see it with fresh eyes. The subagent reviews in a clean context and can encode team review standards. Model speed and false claims about git or corruption are not the reason.",
  },
  {
    id: "d1-080",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "developer-productivity",
    question:
      "When configuring tool access for a code-review subagent, which choice best reflects least-privilege design?",
    options: [
      "Grant read-only and execution tools but withhold edit tools",
      "Grant all tool categories so it never stalls waiting for access",
      "Grant only edit tools so it can apply the fixes it identifies",
      "Grant no tools at all so it cannot touch the codebase",
    ],
    correctIndex: 0,
    explanation:
      "A reviewer should read and analyze, not change code, so edit tools are withheld; execution tools can stay enabled so it can surface pending changes. Granting all tools breaks least privilege, edit-only stops it from reading code, and no tools leaves it unable to inspect anything.",
  },
  {
    id: "d1-081",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "What is the fundamental tradeoff you accept when you push exploratory work into a subagent instead of the main thread?",
    options: [
      "Subagent results cost more tokens than doing the work inline",
      "You lose visibility into how it reached its conclusion, getting only a summary",
      "The subagent permanently consumes one of a fixed number of slots",
      "The main thread can no longer call any tools until the subagent returns",
    ],
    correctIndex: 1,
    explanation:
      "The subagent keeps the main context clean, but the entire intermediate conversation is discarded and you only see a compressed summary, losing insight into the path it took. Isolation actually reduces main-context cost, and there is no slot limit or tool lockout.",
  },
  {
    id: "d1-082",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "developer-productivity",
    question:
      "A task has steps where each step's next action depends on what the previous step discovered. Where should this work run?",
    options: [
      "In a chain of one subagent per step, handing summaries forward",
      "In the main thread, since each step builds on prior discoveries",
      "In parallel subagents launched all at once for speed",
      "In a single subagent that claims domain expertise in the task",
    ],
    correctIndex: 1,
    explanation:
      "Subagents shine when exploration is separable from execution. When each step depends on the previous step's findings, that work belongs in the main thread; chaining subagents loses information in the handoffs, and parallelizing dependent steps is incorrect.",
  },
  {
    id: "d1-083",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "developer-productivity",
    question:
      "You want a custom subagent available across every project on your machine, not just the current repository. Which scope do you choose when creating it?",
    options: [
      "Project-level scope, then symlink the config into other repos",
      "Global tool scope, which exposes it through MCP automatically",
      "User-level scope, which shares it across all projects on the machine",
      "Inherit scope, which copies it wherever the main session runs",
    ],
    correctIndex: 2,
    explanation:
      "Subagent scope is either project-level (current project only) or user-level (shared across all projects on your machine). There is no global-MCP or inherit scope; inherit is a model option, not a scope.",
  },
  {
    id: "d1-084",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "You want to investigate how authentication works in an unfamiliar codebase without flooding the main context with dozens of file reads. Which built-in subagent fits best?",
    options: [
      "The Explore subagent, for fast searching and codebase navigation",
      "The General purpose subagent, since only it can read files",
      "A custom 'auth expert' subagent that claims security expertise",
      "The Plan subagent, which is the only one allowed outside plan mode",
    ],
    correctIndex: 0,
    explanation:
      "Explore is built for fast searching and navigation of codebases, ideal for read-many-files research that should stay out of the main context. General purpose is for multi-step explore-and-act work, an expertise-claim subagent adds no value, and Plan is used during plan mode.",
  },
  {
    id: "d1-085",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "developer-productivity",
    question:
      "You want a subagent to run on whatever model the main conversation is currently using, rather than pinning it to a fixed tier. Which model setting accomplishes this?",
    options: [
      "Set model to sonnet, the documented default for delegated work",
      "Set model to inherit, so it uses the main conversation's model",
      "Omit the model field, which forces Haiku for cost efficiency",
      "Set model to opus, which then auto-downgrades to match the parent",
    ],
    correctIndex: 1,
    explanation:
      "The model field accepts sonnet, opus, haiku, or inherit; inherit uses whatever model the main conversation is running. Fixed tiers pin the subagent to that model, and omitting the field does not silently force Haiku.",
  },
  {
    id: "d1-086",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "A research subagent searched 30 files but hit a blocker it could not resolve. What should a well-designed subagent system prompt instruct it to do?",
    options: [
      "Silently return its best partial guess so the summary stays short",
      "Keep retrying indefinitely until it forces the task to succeed",
      "Report the obstacle and its findings clearly back to the main agent",
      "Spawn its own child subagents to work around the blocker itself",
    ],
    correctIndex: 2,
    explanation:
      "The subagent's system prompt should specify how it reports findings back to the main agent, including obstacles it could not resolve, so the main thread can decide next steps. Silent guessing hides information, infinite retries waste work, and having it spawn its own child subagents to bypass the blocker is uncontrolled and wasteful.",
  },
  {
    id: "d1-087",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "During testing, combined outputs from the web search agent (85K tokens including page content) and the document analysis agent (70K tokens including reasoning chains) total 155K tokens, but the synthesis agent performs optimally with inputs under 50K tokens. What's the most effective solution?",
    options: [
      "Add an intermediate summarization agent that condenses findings before passing to synthesis.",
      "Store findings in a vector database and give the synthesis agent retrieval tools to query during its work.",
      "Have the synthesis agent process findings in sequential batches, maintaining running state between calls.",
      "Modify upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning.",
    ],
    correctIndex: 3,
    explanation:
      "Modifying upstream agents to return structured data (key facts, citations, relevance scores) addresses the root cause by reducing token volume at the source while preserving essential information. This eliminates verbose page content and reasoning chains that inflate token counts without adding value for the synthesis step. An intermediate summarizer adds another lossy hop, vector retrieval shifts the problem to query design and may miss important context, and batched processing complicates synthesis and risks losing cross-batch connections.",
  },
  {
    id: "d1-088",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "The document analysis subagent frequently encounters failures when processing PDF files: some have corrupted sections causing parsing exceptions, others are password-protected, and occasionally the parsing library times out on large files. Currently, any exception immediately terminates the subagent and returns an error to the coordinator, which must decide whether to retry, skip the document, or fail the entire research task. This is causing excessive coordinator involvement in routine error handling. What's the most effective architectural improvement?",
    options: [
      "Create a dedicated error-handling agent that monitors all subagent failures via a shared queue and makes recovery decisions independently, dispatching retry commands directly to subagents.",
      "Have the subagent implement local recovery for transient failures and only propagate errors it cannot resolve to the coordinator, including what was attempted and any partial results obtained.",
      "Have the coordinator validate all documents before dispatching to the subagent, rejecting documents likely to cause failures to ensure the subagent only receives processable files.",
      "Configure the subagent to always return partial results with success status, embedding error details in metadata. The coordinator treats all responses as successful and filters problematic items during synthesis.",
    ],
    correctIndex: 1,
    explanation:
      "Handling errors at the lowest level capable of resolving them follows sound multi-agent design: the subagent recovers from transient failures locally and only escalates truly unresolvable issues, sharing what it attempted and any partial results so the coordinator can make an informed decision. A separate error-handler agent duplicates context and adds coordination complexity, pre-validation can't anticipate all failure modes, and masking errors as success risks silent data quality issues during synthesis.",
  },
  {
    id: "d1-089",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "The web search and document analysis agents have both completed their tasks and returned findings to the coordinator. What is the appropriate next step for producing an integrated research output?",
    options: [
      "Each agent directly sends its findings to the report generation agent, bypassing the coordinator.",
      "The coordinator concatenates the raw outputs from both agents and returns them as the final result.",
      "The coordinator passes both sets of findings to the synthesis agent for unified integration.",
      "The document analysis agent requests the web search results and merges them internally.",
    ],
    correctIndex: 2,
    explanation:
      "The orchestrator-workers pattern keeps centralized control in the coordinator: it collects results from subagents and routes them to the appropriate next component, in this case the synthesis agent, which is designed to unify and integrate findings into a coherent output. Bypassing the coordinator breaks the orchestration boundary, raw concatenation skips the integration step entirely, and having one specialist subagent merge another's output blurs role responsibilities.",
  },
  {
    id: "d1-090",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "When designing the system, you gave the document analysis agent access to a general-purpose fetch_url tool so it could load documents from URLs. Production logs reveal this agent now frequently fetches search engine result pages to conduct ad-hoc web searches, behavior that should route through the web search agent. This causes inconsistent results. What's the most effective fix?",
    options: [
      "Remove fetch_url from the document analysis agent and route all URL loading through the coordinator to the web search agent.",
      "Implement filtering that blocks fetch_url calls to known search engine domains while allowing other URLs.",
      "Add instructions to the document analysis agent's prompt clarifying it should only use fetch_url for loading document URLs, not searching.",
      "Replace fetch_url with a load_document tool that validates URLs point to document formats.",
    ],
    correctIndex: 3,
    explanation:
      "Replacing the general-purpose tool with a document-specific load_document tool that validates URLs point to document formats constrains capability at the interface level, making the undesired search behavior impossible rather than merely discouraged. This follows the principle of least privilege. Routing all URL loads through the coordinator adds latency and complexity for legitimate document fetches, domain blocklists are brittle and easily evaded, and prompt instructions are suggestions the model can drift from.",
  },
  {
    id: "d1-091",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "Production logs reveal a consistent pattern: requests to 'analyze the quarterly report I uploaded' are routed to the web search agent 45% of the time instead of the document analysis agent. Examining the tool definitions, you find the web search agent has an analyze_content tool described as 'analyzes content and extracts key information,' while the document analysis agent has an analyze_document tool described as 'analyzes documents and extracts key information.' How should you address this misrouting?",
    options: [
      "Add few-shot examples to the coordinator's prompt showing correct routing: 'User uploads quarterly report → document analysis agent' and 'User asks about a webpage → web search agent.'",
      "Add a pre-routing classifier that determines whether the user is referencing uploaded files or web content before the coordinator makes delegation decisions.",
      "Rename the web search tool to extract_web_results and update its description to 'processes and returns information retrieved from web searches and URLs.'",
      "Expand the document analysis tool's description to include example use cases like 'Use for uploaded PDFs, Word documents, and spreadsheets' while leaving the web search tool unchanged.",
    ],
    correctIndex: 2,
    explanation:
      "Renaming the web search tool to extract_web_results and updating its description to clearly reference web searches and URLs eliminates the semantic overlap between the two tools' names and descriptions. Each tool's purpose becomes unambiguous, letting the coordinator correctly distinguish document analysis from web search tasks. Few-shot examples and a pre-routing classifier paper over the underlying tool ambiguity, and expanding only one description still leaves the other tool's wording overlapping.",
  },
  {
    id: "d1-092",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "Production monitoring reveals inconsistent synthesis quality. When aggregated results total ~75K tokens, the synthesis agent reliably cites information from the first 15K tokens (web search headlines and snippets) and the final 10K tokens (document analysis conclusions), but frequently omits critical findings that appear in the middle 50K tokens, even when those findings directly address the research question. How should you restructure the aggregated input?",
    options: [
      "Place a key findings summary at the beginning of the aggregated input and organize detailed results with explicit section headers for easier navigation.",
      "Stream subagent results to the synthesis agent incrementally, processing web search results first to completion before introducing document analysis findings.",
      "Implement rotation that alternates which subagent's results appear first across different research tasks, ensuring both sources receive primacy positioning equally over time.",
      "Summarize all subagent outputs to under 20K tokens total before aggregation, ensuring content stays within the model's reliable processing range.",
    ],
    correctIndex: 0,
    explanation:
      "Placing a key findings summary at the beginning leverages the primacy effect, putting critical information in the most reliably attended position, while explicit section headers help the model navigate and attend to middle-section content. This directly mitigates the 'lost in the middle' phenomenon. Incremental streaming doesn't help once results are aggregated, rotating primacy still leaves middle content under-attended on any given run, and aggressively summarizing to 20K tokens discards detail that may matter for accurate synthesis.",
  },
  {
    id: "d1-093",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "A colleague suggests having the document analysis agent send its output directly to the synthesis agent instead of routing through the coordinator. What is the main advantage of keeping the coordinator as the central hub for all subagent communication?",
    options: [
      "Routing through the coordinator enables automatic retry logic that direct agent-to-agent calls cannot support.",
      "Subagents operate with isolated memory, and direct communication would require complex serialization that only the coordinator can perform.",
      "The coordinator batches multiple subagent requests together, reducing the total number of API calls and overall latency.",
      "The coordinator can observe all interactions, handle errors consistently, and decide what information each subagent should receive.",
    ],
    correctIndex: 3,
    explanation:
      "The hub-and-spoke pattern's primary advantage is that the coordinator has centralized visibility into all interactions, applies consistent error handling across the system, and decides exactly what context each subagent receives. Retry logic and serialization aren't unique to coordinator routing, and batching isn't an inherent property of the coordinator pattern. Direct agent-to-agent communication sacrifices observability and the coordinator's ability to filter or shape context per subagent.",
  },
  {
    id: "d1-094",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "The web search subagent returns results for only 3 of 5 requested source categories (competitor websites and industry reports succeeded, but news archives and social media feeds timed out). The document analysis subagent successfully processed all provided documents. The synthesis subagent must now produce a findings summary from this mixed-quality input. What's the most effective error propagation strategy?",
    options: [
      "Have the synthesis subagent request the coordinator retry the timed-out sources with extended timeouts before proceeding, ensuring complete data coverage before synthesis begins.",
      "Structure the synthesis output with coverage annotations indicating which findings are well-supported versus which topic areas have gaps due to unavailable sources.",
      "Proceed with synthesis using only the successful sources, generating output without indicating which data was unavailable.",
      "Have the synthesis subagent return an error to the coordinator indicating incomplete upstream data, triggering a full retry or task failure.",
    ],
    correctIndex: 1,
    explanation:
      "Coverage annotations embody graceful degradation with transparency: downstream consumers and end users can see which findings are well-supported and which topic areas have gaps due to unavailable sources. This preserves the value of completed work while propagating uncertainty so informed decisions can be made about confidence. Forcing retries before any synthesis blocks useful output, silently dropping the gaps hides quality issues, and failing the whole task wastes successful subagent work.",
  },
  {
    id: "d1-095",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "After running the system on the topic 'impact of AI on creative industries,' you observe that each subagent completes successfully: the web search agent finds relevant articles, the document analysis agent summarizes papers correctly, and the synthesis agent produces coherent output. However, the final reports cover only visual arts, completely missing music, writing, and film production. When you examine the coordinator's logs, you see it decomposed the topic into three subtasks: 'AI in digital art creation,' 'AI in graphic design,' and 'AI in photography.' What is the most likely root cause?",
    options: [
      "The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria.",
      "The web search agent's queries are not comprehensive enough and need to be expanded to cover more creative industry sectors.",
      "The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives from other agents.",
      "The coordinator agent's task decomposition is too narrow, resulting in subagent assignments that don't cover all relevant domains of the topic.",
    ],
    correctIndex: 3,
    explanation:
      "The coordinator's logs directly show it decomposed the broad topic into only three visual arts subtasks (digital art, graphic design, photography), entirely omitting music, writing, and film. Since each subagent executed its assigned task correctly, the narrow decomposition by the coordinator is the root cause of the missing coverage. Downstream agents can only operate on what the coordinator delegates to them.",
  },
  {
    id: "d1-096",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "The document analysis agent discovers that two credible sources contain directly conflicting statistics on a key metric: one government report states 40% growth while an industry analysis states 12% growth. Both sources appear legitimate and the discrepancy could significantly affect the research conclusions. What's the most effective way for the document analysis agent to handle this?",
    options: [
      "Include both figures in the analysis output without flagging them as conflicting, allowing the synthesis agent to determine which to use based on the broader research context.",
      "Halt analysis and escalate to the coordinator immediately, asking it to determine which source is authoritative before the agent continues processing remaining documents.",
      "Apply source credibility heuristics to select the most likely accurate figure, complete the analysis using that value, and include a footnote mentioning the discrepancy.",
      "Complete the document analysis with both figures included, explicitly annotate the conflict with source attribution, and let the coordinator decide how to reconcile before passing to synthesis.",
    ],
    correctIndex: 3,
    explanation:
      "Respecting separation of concerns, the document analysis agent completes its primary task without blocking, preserves both conflicting data points with explicit source attribution, and defers the reconciliation decision to the coordinator, which has the broader context needed to resolve the conflict. Including both figures unflagged hides the discrepancy from downstream agents, halting and escalating mid-task blocks unrelated work, and silently picking one value via heuristics removes the coordinator's ability to make an informed call.",
  },
  {
    id: "d1-097",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "During testing, you observe that the synthesis agent frequently needs to verify specific claims while combining findings. Currently, when verification is needed, the synthesis agent returns control to the coordinator, which invokes the web search agent, then re-invokes synthesis with results. This adds 2-3 round trips per task and increases latency by 40%. Your evaluation shows that 85% of these verifications are simple fact-checks (dates, names, statistics) while 15% require deeper investigation. What's the most effective approach to reduce overhead while maintaining system reliability?",
    options: [
      "Give the synthesis agent a scoped verify_fact tool for simple lookups, while complex verifications continue delegating to the web search agent through the coordinator.",
      "Have the web search agent proactively cache extra context around each source during initial research, anticipating what the synthesis agent might need to verify.",
      "Give the synthesis agent access to all web search tools so it can handle any verification need directly without round-trips through the coordinator.",
      "Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end of its pass, which then sends them all to the web search agent at once.",
    ],
    correctIndex: 0,
    explanation:
      "A scoped verify_fact tool handles the 85% of simple lookups (dates, names, statistics) directly, eliminating most round-trips while preserving the coordinator-mediated delegation path for the 15% of complex investigations. This applies the principle of least privilege, keeping the synthesis agent focused on its primary task while reducing latency significantly. Proactive caching can't anticipate every verification, granting full search tools blurs role responsibilities, and batching verifications creates blocking dependencies when later synthesis steps depend on earlier facts.",
  },
  {
    id: "d1-098",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "The document analysis subagent encounters a corrupted PDF file it cannot parse. When designing the system's error handling, what is the most effective way to handle this failure?",
    options: [
      "Silently skip the corrupted document and continue processing other files to avoid interrupting the workflow.",
      "Automatically retry parsing the document three times with exponential backoff before reporting failure.",
      "Return the error with context to the coordinator agent, letting it decide how to proceed.",
      "Throw an exception that terminates the entire research workflow.",
    ],
    correctIndex: 2,
    explanation:
      "Returning the error with context to the coordinator lets it make an informed decision (skip the file, try an alternative parsing method, notify the user) while keeping visibility into the failure. Silent skipping hides data quality issues, blind retries don't help with truly corrupted files, and terminating the whole workflow throws away successful work and prevents graceful degradation.",
  },
  {
    id: "d1-099",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "During a materials research task, the web search subagent queries three source categories with different outcomes: academic databases returned 15 relevant papers, industry reports returned '0 results found,' and patent databases returned 'Connection timeout.' When designing error propagation to the coordinator, what approach enables the best recovery decisions?",
    options: [
      "Report both the timeout and '0 results' as failures requiring coordinator intervention.",
      "Aggregate outcomes into a single success rate metric (e.g., '67% source coverage') with detailed logs available on request.",
      "Distinguish access failures (timeout) needing retry decisions from valid empty results ('0 results') representing successful queries.",
      "Have the subagent retry transient failures internally and only report persistent errors.",
    ],
    correctIndex: 2,
    explanation:
      "A timeout (access failure) and '0 results' (valid empty result) are semantically distinct outcomes requiring different responses. Distinguishing them lets the coordinator retry the timed-out patent database while accepting the empty industry report results as a valid and informative finding. Treating both as failures triggers unnecessary intervention, aggregating into a single metric obscures the difference, and silent internal retries hide context the coordinator needs for resource and retry decisions.",
  },
  {
    id: "d1-100",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "When researching a broad topic, you observe that the web search agent and document analysis agent are both investigating the same subtopics, resulting in significant overlap in their findings. Token usage has nearly doubled without proportionally increasing the breadth or depth of research coverage. What's the most effective way to address this?",
    options: [
      "Allow both agents to complete their parallel work, then have the coordinator deduplicate overlapping findings before passing to the synthesis agent.",
      "Have the coordinator explicitly partition the research space before delegation, assigning distinct subtopics or source types to each agent.",
      "Implement a shared state mechanism where agents log their current focus area, allowing other agents to dynamically avoid duplicating work in progress.",
      "Convert to sequential execution where document analysis runs only after web search completes, using the web search findings as context to avoid duplication.",
    ],
    correctIndex: 1,
    explanation:
      "Explicit partitioning of the research space by the coordinator before delegation addresses the root cause (unclear task boundaries) before any work begins. This preserves the benefits of parallel execution while preventing duplicated effort and wasted tokens. Post-hoc deduplication still pays the full token cost, shared-state coordination adds complexity and races between agents, and forcing sequential execution sacrifices parallelism without guaranteeing better partitioning.",
  },
  {
    id: "d1-101",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "The web search subagent times out while researching a complex topic. You need to design how this failure information flows back to the coordinator agent. Which error propagation approach best enables intelligent recovery?",
    options: [
      "Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow.",
      "Return structured error context to the coordinator including the failure type, the attempted query, any partial results, and potential alternative approaches.",
      "Implement automatic retry logic with exponential backoff within the subagent, returning a generic 'search unavailable' status only after all retries are exhausted.",
      "Catch the timeout within the subagent and return an empty result set marked as successful.",
    ],
    correctIndex: 1,
    explanation:
      "Structured error context (failure type, attempted query, partial results, alternative approaches) gives the coordinator everything it needs to make an intelligent recovery decision, such as retrying with a modified query or proceeding with what was gathered. Terminating the workflow throws away unrelated successful work, blind retries followed by a generic status strip out useful context, and masking the timeout as a successful empty result hides quality issues from the coordinator.",
  },
  {
    id: "d1-102",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "You're implementing the agentic loop for your support agent. After each API call to Claude, you need to determine whether to continue the loop (execute the requested tools and call Claude again) or stop (present the final response to the customer). What determines this decision?",
    options: [
      "Check whether the response includes any assistant text content; if Claude generated explanatory text, the loop should end.",
      "Parse Claude's response text for phrases like 'I've completed' or 'Is there anything else?'; these natural language signals indicate the task is finished.",
      "Set a maximum iteration count (e.g., 10 calls) and stop when reached, regardless of whether Claude indicates more work is needed.",
      "Check the stop_reason field in Claude's response; continue when it equals 'tool_use' and stop when it equals 'end_turn'.",
    ],
    correctIndex: 3,
    explanation:
      "The stop_reason field is Claude's explicit, structured signal for loop control: 'tool_use' means Claude wants a tool executed and the results returned, while 'end_turn' means the response is complete and the loop should terminate. Checking for assistant text, parsing natural language cues, or capping iterations are anti-patterns: they either miss continuation, drop legitimate work, or end the loop prematurely.",
  },
  {
    id: "d1-103",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "Production logs show that for simple requests like 'refund order #1234', your agent succeeds in 3-4 tool calls with 91% resolution rate. However, for complex requests like 'I've been charged twice, my discount didn't apply, and I want to cancel', the agent averages 12+ tool calls with only 54% resolution, often investigating concerns sequentially and gathering redundant customer data for each one. What's the most effective change to improve complex request handling?",
    options: [
      "Decompose the request into distinct concerns, then investigate each in parallel using shared customer context before synthesizing a resolution.",
      "Reduce the number of available tools by consolidating get_customer, lookup_order, and billing-related lookups into a single investigate_issue tool.",
      "Add explicit verification gates between steps requiring the agent to checkpoint after resolving each concern before moving to the next.",
      "Add few-shot examples demonstrating ideal tool call sequences for various multi-part billing scenarios to your system prompt.",
    ],
    correctIndex: 0,
    explanation:
      "Decomposing the request into distinct concerns and investigating them in parallel with shared customer context addresses both root causes: redundant data fetching disappears once context is reused across concerns, and total tool calls drop because the investigations run concurrently before a unified synthesis. Consolidating tools hides distinct backend behaviors, checkpoint gates add latency without removing redundancy, and few-shot examples don't restructure how investigations are ordered.",
  },
  {
    id: "d1-104",
    source: "exam-guide",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "After calling get_customer and lookup_order, the agent has retrieved all available system data but faces uncertainty. Which situation represents the most appropriate trigger for calling escalate_to_human?",
    options: [
      "The customer claims they never received their order, but tracking shows it was delivered and signed for at their address three days ago. The agent should escalate because presenting contradictory evidence might damage the customer relationship.",
      "The customer's message mentions both a billing question and a product return. The agent should escalate so a human can coordinate handling both issues in a single interaction.",
      "The customer requests a price match against a competitor. Your policies allow adjustments for price drops on your own site within 14 days but are silent on competitor pricing. The agent should escalate for policy interpretation.",
      "The customer wants to cancel an order that shipped yesterday, with delivery scheduled for tomorrow. The agent should escalate because the customer might change their mind once they receive the package.",
    ],
    correctIndex: 2,
    explanation:
      "A genuine policy gap (own-site price drops are covered, competitor matching is silent) is exactly the kind of judgment call the agent cannot make on its own without fabricating policy, so it must escalate for human interpretation. Communicating contradictory delivery evidence is uncomfortable but not a policy gap, multi-part requests are handled by decomposing concerns rather than escalating, and speculating about whether a customer will change their mind isn't a basis for escalation.",
  },
  {
    id: "d1-105",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "Production metrics show that when your agent resolves complex cases involving billing disputes or multi-order returns, customer satisfaction scores are 15% lower than for simple cases, even when the resolution is technically correct. Root cause analysis reveals the agent provides accurate resolutions but inconsistently explains the reasoning: sometimes omitting relevant policy details, other times missing timeline information or next steps. The specific context gaps vary by case. You want to improve resolution quality without adding human review overhead. Which approach is most effective?",
    options: [
      "Add a self-critique step where the agent evaluates its draft response for completeness, ensuring it addresses the customer's concern, includes relevant context, and anticipates follow-up questions.",
      "Implement few-shot examples in the system prompt showing complete resolution explanations for five common complex case types, demonstrating how to include policy context, timelines, and next steps.",
      "Increase the model tier from Haiku to Sonnet for complex cases, routing based on detected case complexity.",
      "Add a confirmation step where the agent asks 'Does this fully address your concern?' before closing, letting customers request additional information if needed.",
    ],
    correctIndex: 0,
    explanation:
      "A self-critique step (the evaluator-optimizer pattern) addresses the root cause directly: the agent evaluates its own draft against specific criteria (policy context, timelines, next steps) before sending it. That catches case-specific gaps that vary across scenarios without adding human review. Few-shot examples help only for the patterns shown, raising the model tier doesn't structurally address explanation completeness, and shifting verification to the customer pushes effort onto them.",
  },
  {
    id: "d1-106",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "Your get_customer tool returns all matches when searching by name. Claude currently picks the customer with the most recent order when multiple results are returned, but production data shows this causes 15% of multi-match cases to proceed with the wrong customer account. How should you address this?",
    options: [
      "Instruct Claude to ask for an additional identifier (email, phone, or order number) when get_customer returns multiple matches, before taking any customer-specific action.",
      "Add few-shot examples showing Claude how to use conversational context (products mentioned, dates referenced) to infer the correct customer without requiring clarification.",
      "Implement a confidence scoring system that proceeds automatically above 85% confidence and prompts for clarification below that threshold.",
      "Modify get_customer to return only the single most likely match based on a ranking algorithm, simplifying Claude's decision by eliminating ambiguous results.",
    ],
    correctIndex: 0,
    explanation:
      "Asking the customer for an additional identifier (email, phone, or order number) is the most reliable way to resolve multi-match ambiguity because the user has definitive knowledge of their own identity. One extra conversational turn is a small cost to eliminate the 15% error rate. Inferring from context is fragile, automated confidence thresholds still proceed on the wrong account when they fire above the cutoff, and ranking down to a single result hides ambiguity Claude needs to see in order to handle it correctly.",
  },
  {
    id: "d1-107",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "Production metrics show your agent averages 4+ API round-trips per resolution. Analysis reveals Claude frequently requests get_customer and lookup_order in separate sequential turns even when both are needed upfront. What's the most effective way to reduce round-trips?",
    options: [
      "Prompt Claude to batch tool requests per turn, and return all tool results together before the next API call.",
      "Increase max_tokens to give Claude more space to plan ahead and naturally batch its tool requests.",
      "Create composite tools like get_customer_with_orders that bundle common lookup combinations into single calls.",
      "Implement speculative execution that automatically calls likely-needed tools alongside any requested tool, returning all results regardless of what was requested.",
    ],
    correctIndex: 0,
    explanation:
      "Prompting Claude to batch related tool requests in a single turn, and returning all results together before the next API call, leverages Claude's native ability to request multiple tools simultaneously. This is the smallest architectural change that directly addresses the sequential calling pattern. Raising max_tokens doesn't change call structure, composite tools add maintenance for every new combination, and speculative execution wastes calls when the guess is wrong.",
  },
  {
    id: "d1-108",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "Your agent handles single-concern requests with 94% accuracy (e.g., 'I need a refund for order #1234'). However, when customers include multiple concerns in one message (e.g., 'I need a refund for order #1234 and also want to update my shipping address for order #5678'), tool selection accuracy drops to 58%. The agent typically addresses only one concern or mixes up parameters between requests. What's the most effective approach to improve reliability for multi-concern requests?",
    options: [
      "Consolidate related tools into fewer, more general-purpose tools.",
      "Add few-shot examples to your prompt demonstrating the correct reasoning and tool sequence for multi-concern requests.",
      "Implement response validation that detects incomplete responses and automatically re-prompts the agent to address any missed concerns.",
      "Implement a preprocessing layer that uses a separate model call to decompose multi-concern messages into individual requests, process each independently, then combine the results.",
    ],
    correctIndex: 1,
    explanation:
      "The agent already handles individual concerns well at 94% accuracy, so it just needs pattern guidance for multi-concern messages. Few-shot examples showing correct reasoning and tool sequencing for these requests is a low-cost, high-leverage fix that directly addresses the failure to decompose and route parameters correctly. Consolidating tools sacrifices clarity, post-hoc validation patches the symptom turn by turn, and a separate preprocessing model adds latency and a new failure surface.",
  },
  {
    id: "d1-109",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to autonomously handle complex situations requiring policy exceptions. What's the most effective way to improve escalation calibration?",
    options: [
      "Add explicit escalation criteria to your system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously.",
      "Have the agent self-report a confidence score (1-10) before each response and automatically route requests to humans when confidence falls below a threshold.",
      "Deploy a separate classifier model trained on historical tickets to predict which requests need escalation before the main agent begins processing.",
      "Implement sentiment analysis to detect customer frustration levels and automatically escalate when negative sentiment exceeds a threshold.",
    ],
    correctIndex: 0,
    explanation:
      "Explicit escalation criteria backed by few-shot examples directly address the root cause: unclear decision boundaries between straightforward and complex cases. This is the most proportionate first intervention, teaching the agent precisely when to escalate vs. resolve autonomously without new infrastructure. Self-reported confidence is poorly calibrated, a separate classifier model adds complexity and a new failure surface, and sentiment-based escalation reacts to tone rather than to whether the case actually requires human judgment.",
  },
  {
    id: "d1-110",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "ci-cd",
    question:
      "Your team uses Claude Code to generate code suggestions, but you notice a pattern: subtle issues (performance optimizations that break edge cases, cleanups that change behavior unexpectedly) only surface when a different team member reviews the PR. Claude's reasoning during generation shows it considered these cases but concluded its approach was correct. Which approach directly addresses the root cause of this self-review limitation?",
    options: [
      "Include comprehensive test files and documentation in the prompt context so Claude better understands expected behavior during generation.",
      "Enable extended thinking mode for the generation pass, allowing more thorough deliberation before producing suggestions.",
      "Have a second, independent Claude Code instance review the changes without seeing the generator's reasoning.",
      "Add explicit self-review instructions to the generation prompt, asking Claude to critique its own suggestions before finalizing output.",
    ],
    correctIndex: 2,
    explanation:
      "A second, independent Claude Code instance reviewing the changes without seeing the generator's reasoning eliminates the confirmation bias that lets the original instance rationalize away the issues it already considered. This fresh-perspective pass mirrors the value of human peer review. More context or extended thinking can help generation quality but don't break the bias loop, and self-critique inside the same session inherits the same prior reasoning.",
  },

  // ---- Domain 2: Tool Design & MCP (MCP intro + advanced) ----
  {
    id: "d2-079",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "developer-productivity",
    question:
      "An MCP video-conversion tool needs a full file path, but users only type 'convert biking.mp4'. How do MCP roots solve this?",
    options: [
      "They cache file contents on the server so paths are never needed again",
      "They let Claude list and search approved directories to resolve the path",
      "They rewrite every tool schema to accept relative paths automatically",
      "They embed the file system index directly into the system prompt text",
    ],
    correctIndex: 1,
    explanation:
      "Roots grant the server access to specific folders; Claude calls list_roots, then reads those directories to locate the file and pass a full path. They also bound access for security. Caching, schema rewriting, and embedding a full file index are not how roots work.",
  },
  {
    id: "d2-080",
    source: "ai-generated",
    domain: "tool-design-mcp",
    question:
      "When using MCP roots, who enforces that a requested path actually falls within an approved root directory?",
    options: [
      "The MCP SDK blocks out-of-root paths automatically at the transport layer",
      "Your tool code, via a helper like is_path_allowed before the operation",
      "The MCP client refuses to forward any CallToolRequest with a bad path",
      "Claude itself validates the path before ever emitting the tool call",
    ],
    correctIndex: 1,
    explanation:
      "The MCP SDK does not auto-enforce root restrictions; you must implement a check (e.g. is_path_allowed) that compares the requested path against the approved roots inside each file-accessing tool. Roots provide the boundary, but enforcement is the server author's responsibility.",
  },
  {
    id: "d2-081",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "multi-agent-research",
    question:
      "A long-running MCP research tool leaves users staring at a frozen screen. Which mechanism gives real-time feedback during execution?",
    options: [
      "Returning partial tool results in multiple separate CallToolResult messages",
      "context.info and context.report_progress calls inside the tool function",
      "Setting json_response=True so the client polls for status updates faster",
      "Splitting the tool into smaller tools the model calls one after another",
    ],
    correctIndex: 1,
    explanation:
      "The Context argument exposes context.info (log messages) and context.report_progress (current/total) so the server streams updates while the tool runs. json_response=True actually disables streaming, and splitting tools or returning multiple results does not provide in-progress feedback.",
  },
  {
    id: "d2-082",
    source: "ai-generated",
    domain: "tool-design-mcp",
    question:
      "In MCP, how do request-result messages differ from notification messages?",
    options: [
      "Notifications are encrypted while request-result pairs are sent in plaintext",
      "Request-result come in paired exchanges; notifications are one-way, no reply",
      "Only the client may send requests; only the server may send notifications",
      "Notifications must complete before any request-result pair can be started",
    ],
    correctIndex: 1,
    explanation:
      "Request-result messages always pair (CallToolRequest to CallToolResult); notifications (progress, logging, tool list changed) are one-way and expect no response. Both clients and servers can send each, so the client-only/server-only split and ordering claims are wrong; encryption is unrelated.",
  },
  {
    id: "d2-083",
    source: "ai-generated",
    domain: "tool-design-mcp",
    question:
      "Why does the StreamableHTTP transport need a Server-Sent Events (SSE) connection?",
    options: [
      "To compress JSON payloads so large tool results transfer more efficiently",
      "To let the server initiate requests and notifications back to the client",
      "To authenticate each client before any tool call is allowed to proceed",
      "To replace the initialize handshake that stdio transport requires first",
    ],
    correctIndex: 1,
    explanation:
      "Plain HTTP only lets clients initiate requests, but sampling, progress, and logging require server-initiated messages. StreamableHTTP opens a long-lived SSE channel so the server can push messages to the client. It is not for compression, auth, or replacing the handshake.",
  },
  {
    id: "d2-084",
    source: "ai-generated",
    domain: "tool-design-mcp",
    question:
      "After the StreamableHTTP initialize handshake, what must the client include on all subsequent requests?",
    options: [
      "The full tool schema list returned by the initial ListToolsResult",
      "The mcp-session-id header returned in the Initialize Result",
      "A fresh SSE connection opened individually for every single request",
      "An updated Initialized Notification re-sent before each tool call",
    ],
    correctIndex: 1,
    explanation:
      "The Initialize Result returns an mcp-session-id header that uniquely identifies the client and must be sent on all later requests. Schemas are not resent per request, the primary SSE connection persists rather than being recreated per request, and the Initialized Notification is sent only once.",
  },
  {
    id: "d2-085",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "ci-cd",
    question:
      "A popular MCP server must scale horizontally behind a load balancer. What is the main trade-off of setting stateless_http=True?",
    options: [
      "Tool inputs are no longer validated against their JSON schemas on the server",
      "Sampling, progress reports, and server-to-client requests stop working",
      "All tool calls become synchronous and can no longer run in parallel batches",
      "Resources can still be read but tools can no longer be listed or called",
    ],
    correctIndex: 1,
    explanation:
      "stateless_http=True drops session IDs and the GET SSE pathway, so sampling, progress reports, and other server-to-client communication are unavailable (the upside is no handshake needed and easy load-balancing). Schema validation, batching, and tool listing are unaffected.",
  },
  {
    id: "d2-086",
    source: "ai-generated",
    domain: "tool-design-mcp",
    question:
      "What does setting json_response=True on a StreamableHTTP MCP server do?",
    options: [
      "Disables streaming so only the final tool result returns, as plain JSON",
      "Forces every tool to return objects instead of plain string content",
      "Removes session IDs so the server can run behind a load balancer",
      "Validates each tool's output against a JSON schema before responding",
    ],
    correctIndex: 0,
    explanation:
      "json_response=True disables streaming for POST responses: no intermediate progress or log messages, just the final result as plain JSON. Dropping session IDs for scaling is what stateless_http does; it does not change content typing or add output schema validation.",
  },
  {
    id: "d2-087",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "code-generation",
    question:
      "When Claude decides to call a tool, how is that signaled and structured in the API response?",
    options: [
      "A plain text block whose content is the JSON arguments for the function",
      "stop_reason is 'tool_use' and content includes a tool_use block with id/name/input",
      "A separate top-level tool_calls field outside the message content array",
      "stop_reason is 'end_turn' and the tool name appears in the response metadata",
    ],
    correctIndex: 1,
    explanation:
      "Tool requests set stop_reason to 'tool_use'; the assistant message content is multi-block, containing optional text plus a tool_use block with id, name, and input. There is no separate tool_calls field, the arguments are not a text block, and end_turn means Claude is done, not calling a tool.",
  },
  {
    id: "d2-088",
    source: "ai-generated",
    domain: "tool-design-mcp",
    question:
      "When sending a tool_result back to Claude in the follow-up request, what is still required even though you expect no further tool call?",
    options: [
      "A new unique tool_use_id different from the original tool_use block id",
      "The original tool schema must still be passed in the tools parameter",
      "The is_error flag must always be explicitly set to True on the result",
      "The entire prior assistant text must be stripped from the message history",
    ],
    correctIndex: 1,
    explanation:
      "The follow-up call must still include the tool schema so Claude can interpret the tool references in history. The tool_use_id must match (not differ from) the original block, is_error is only True on failures, and the full conversation history including assistant blocks must be preserved.",
  },
  {
    id: "d2-089",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "structured-data",
    question:
      "A team enables fine-grained tool calling to stream tool arguments faster. What critical behavior changes?",
    options: [
      "Claude generates tool inputs in a strict alphabetical key order instead",
      "API-side JSON validation is disabled, so your code may receive invalid JSON",
      "Each tool call is automatically retried until valid JSON is produced",
      "Tool results are buffered until the entire arguments object is complete",
    ],
    correctIndex: 1,
    explanation:
      "Fine-grained tool calling disables the API's JSON validation buffering, so chunks arrive immediately but your code must handle potentially invalid JSON. It does not reorder keys, auto-retry, or buffer; buffering is exactly the default behavior it removes.",
  },
  {
    id: "d2-090",
    source: "ai-generated",
    domain: "tool-design-mcp",
    question:
      "An MCP server defines a templated resource docs://documents/{doc_id}. How does the client request a specific document, and how is the parameter handled?",
    options: [
      "It calls a tool named fetch_doc; doc_id is passed as a tool input argument",
      "It sends a ReadResourceRequest with the filled URI; the SDK passes doc_id to the function",
      "It lists all resources, downloads them, and filters by doc_id on the client side",
      "It posts the doc_id in a CallToolRequest body and the server returns the contents",
    ],
    correctIndex: 1,
    explanation:
      "Resources are fetched via ReadResourceRequest with a URI; for templated resources the Python SDK parses URI parameters and passes them as keyword arguments (doc_id) to the resource function. Resources are not tools, so CallToolRequest and tool-input framing are wrong, and clients do not bulk-download then filter.",
  },
  {
    id: "d2-091",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "customer-support",
    question:
      "Production logs show the agent frequently calls get_customer when users ask about orders (e.g., 'check my order #12345'), instead of calling lookup_order. Both tools have minimal descriptions ('Retrieves customer information' / 'Retrieves order details') and accept similar identifier formats. What's the most effective first step to improve tool selection reliability?",
    options: [
      "Add few-shot examples to the system prompt demonstrating correct tool selection patterns, with 5-8 examples showing order-related queries routing to lookup_order.",
      "Expand each tool's description to include input formats it handles, example queries, edge cases, and boundaries explaining when to use it versus similar tools.",
      "Consolidate both tools into a single lookup_entity tool that accepts any identifier and internally determines which backend to query.",
      "Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on detected keywords and identifier patterns.",
    ],
    correctIndex: 1,
    explanation:
      "Expanding tool descriptions to include input formats, example queries, edge cases, and boundaries directly addresses the root cause: minimal descriptions leave the LLM unable to distinguish between similar tools. This is a low-effort, high-leverage first step because tool descriptions are the primary mechanism the model uses for selection. Few-shot examples help but treat the symptom, consolidating tools loses behavioral clarity, and a pre-routing layer adds brittle keyword logic outside the model.",
  },
  {
    id: "d2-092",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "customer-support",
    question:
      "Production logs reveal that the agent misinterprets data from your MCP tools: Unix timestamps from get_customer, ISO 8601 dates from lookup_order, and numeric status codes (1=pending, 2=shipped). Some tools are third-party MCP servers you cannot modify. What's the most maintainable approach to normalize data formats?",
    options: [
      "Create a normalize_data tool that the agent calls after each data retrieval to transform values.",
      "Use a PostToolUse hook to intercept tool results and apply formatting transformations before agent processing.",
      "Add detailed format documentation to your system prompt explaining each tool's data conventions.",
      "Modify tools you control to return human-readable formats; create wrapper tools for third-party tools.",
    ],
    correctIndex: 1,
    explanation:
      "A PostToolUse hook provides a centralized, deterministic point to intercept and normalize every tool result, including those from third-party MCP servers you can't modify, before the agent sees them. Transformations happen uniformly in code rather than depending on the model to call a normalizer, parse prose format docs, or use the right wrapper. That makes it the most maintainable approach as new tools are added.",
  },
  {
    id: "d2-093",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "customer-support",
    question:
      "Production logs show the agent sometimes selects get_customer when lookup_order would be more appropriate, particularly for ambiguous requests like 'I need help with my recent purchase.' You decide to add few-shot examples to your system prompt to improve tool selection. Which approach will most effectively address this issue?",
    options: [
      "Add examples grouped by tool: all get_customer scenarios together, then all lookup_order scenarios.",
      "Add explicit 'use when' and 'do not use when' guidelines in each tool's description covering the ambiguous cases.",
      "Add 10-15 examples of clear, unambiguous requests that demonstrate correct tool selection for each tool's typical use cases.",
      "Add 4-6 examples targeting ambiguous scenarios, each showing reasoning for why one tool was chosen over plausible alternatives.",
    ],
    correctIndex: 3,
    explanation:
      "Targeting few-shot examples at the specific ambiguous scenarios where errors occur, and showing explicit reasoning about why one tool was chosen over another, teaches the model the comparative decision-making it needs for edge cases. Worked examples with reasoning beat declarative rules for nuanced tool selection. Grouping examples by tool removes the comparative signal, in-description guidelines help but lack the demonstration, and many examples on already-clear cases don't address the ambiguous ones.",
  },
  {
    id: "d2-094",
    source: "exam-guide",
    domain: "tool-design-mcp",
    scenario: "customer-support",
    question:
      "Production data shows that in 12% of cases, your agent skips get_customer entirely and calls lookup_order using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?",
    options: [
      "Enhance the system prompt to state that customer verification via get_customer is mandatory before any order operations.",
      "Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type.",
      "Add few-shot examples showing the agent always calling get_customer first, even when customers volunteer order details.",
      "Add a programmatic prerequisite that blocks lookup_order and process_refund calls until get_customer has returned a verified customer ID.",
    ],
    correctIndex: 3,
    explanation:
      "A programmatic prerequisite that blocks lookup_order and process_refund until get_customer has returned a verified customer ID provides a deterministic guarantee that the verification step is followed, regardless of model behavior. Prompt instructions and few-shot examples are suggestions the agent can drift from in 12% of cases, and a routing classifier doesn't enforce an ordered sequence of tool calls inside a session.",
  },
  {
    id: "d2-095",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "customer-support",
    question:
      "In testing, you notice the agent frequently calls get_customer when users ask about order status, even though lookup_order would be more appropriate. What should you examine first to address this issue?",
    options: [
      "Reduce the number of tools available to the agent to simplify selection.",
      "Implement a pre-processing classifier that detects order queries and routes directly to lookup_order.",
      "Add few-shot examples covering every possible order-related query pattern to the system prompt.",
      "Review tool descriptions to ensure they clearly distinguish each tool's purpose.",
    ],
    correctIndex: 3,
    explanation:
      "Tool descriptions are the primary input the model uses to decide which tool to call, so when an agent consistently selects the wrong one, the first diagnostic step is to check whether the descriptions clearly distinguish each tool's purpose and when each should be used. Reducing tools may remove necessary capability, a pre-routing classifier sits outside the model and is brittle, and exhaustive few-shot coverage is a costly fix for what is usually a description problem.",
  },
  {
    id: "d2-096",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "customer-support",
    question:
      "Production logs reveal a consistent pattern: when customers include 'account' in messages (e.g., 'I want to check my account for the order I placed yesterday'), the agent calls get_customer first 78% of the time. When customers phrase similar requests without 'account' (e.g., 'I want to check on the order I placed yesterday'), it calls lookup_order first 93% of the time. The tool descriptions are well-written and unambiguous. What is the most likely root cause of this discrepancy?",
    options: [
      "The system prompt contains keyword-sensitive instructions that steer behavior based on terms like 'account,' creating unintended tool selection patterns.",
      "The model's base training creates associations between 'account' terminology and customer-related operations that override the tool descriptions.",
      "The model requires more training data on multi-concept messages and should be fine-tuned on examples that include both account and order language.",
      "The tool descriptions need additional negative examples specifying when NOT to use each tool to prevent this keyword-triggered confusion.",
    ],
    correctIndex: 0,
    explanation:
      "The systematic keyword-triggered pattern (78% vs 93%) points to explicit routing logic in the system prompt that reacts to the word 'account' and steers the agent toward customer-related tools. Because the tool descriptions are stated to be well-written and unambiguous, the discrepancy is upstream prompt-level steering rather than a description problem, a base-training artifact (which would be less keyword-sharp), or a need for fine-tuning.",
  },

  // ---- Domain 3: Claude Code Config (skills + hooks courses) ----
  {
    id: "d3-042",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "A developer puts a detailed PR-review checklist into a SKILL.md but Claude never seems to apply it when they ask 'look over my changes.' The file passes the skills validator and appears in the available skills list. What is the most likely fix?",
    options: [
      "Move the skill from .claude/skills to ~/.claude/skills so it loads in every project",
      "Add trigger phrases to the description that match how requests are actually worded",
      "Add an allowed-tools field so the skill is permitted to read the diff",
      "Rename the SKILL.md file to skill.md so Claude Code can discover it",
    ],
    correctIndex: 1,
    explanation:
      "Claude matches requests to skills semantically using the description field. When a validated, loaded skill does not trigger, the cause is almost always a description that lacks the keywords the user actually uses, so adding trigger phrases resolves it.",
  },
  {
    id: "d3-043",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "developer-productivity",
    question:
      "At startup, what does Claude Code load from each discovered skill, and when is the rest of the SKILL.md read?",
    options: [
      "The entire SKILL.md is loaded at startup so the instructions are always available",
      "Only the allowed-tools list loads at startup; instructions load on the first tool call",
      "Only the name and description load; the full file loads after a match and your confirmation",
      "Nothing loads until you invoke the skill explicitly with a slash command",
    ],
    correctIndex: 2,
    explanation:
      "Claude Code scans skill locations and loads only the name and description into context at startup. When a request matches a description, Claude asks you to confirm, then reads the complete SKILL.md and follows its instructions.",
  },
  {
    id: "d3-044",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "developer-productivity",
    question:
      "A team wants brand guidelines applied automatically only when relevant, a TypeScript-strict-mode rule applied to every conversation, and a linter to run on every file save. Which mapping fits Claude Code's features?",
    options: [
      "Guidelines as a hook, strict mode as a skill, linter as a subagent",
      "Guidelines as a skill, strict mode in CLAUDE.md, linter as a hook",
      "Guidelines in CLAUDE.md, strict mode as a hook, linter as a skill",
      "Guidelines as a subagent, strict mode as a skill, linter in CLAUDE.md",
    ],
    correctIndex: 1,
    explanation:
      "Skills load on demand for task-specific expertise, CLAUDE.md loads into every conversation for always-on standards, and hooks are event-driven and fire on actions like file saves. That maps guidelines to a skill, strict mode to CLAUDE.md, and the linter to a hook.",
  },
  {
    id: "d3-045",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "developer-productivity",
    question:
      "An organization has an enterprise-managed 'code-review' skill, and a developer also has a personal 'code-review' skill. The personal one is never used. What is happening and what is the simplest fix?",
    options: [
      "Personal skills are disabled by default; enable them in settings.local.json",
      "Project skills always win; move the personal skill into .claude/skills",
      "Plugins override personal skills; uninstall the conflicting plugin first",
      "Enterprise skills have the highest priority for name conflicts; rename the personal skill",
    ],
    correctIndex: 3,
    explanation:
      "The priority order for name conflicts is Enterprise, then Personal, then Project, then Plugins. An enterprise skill with the same name always wins, so renaming the personal skill to something distinct is the simplest resolution.",
  },
  {
    id: "d3-046",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "A skill needs a large reference document and a utility script in addition to its instructions. How should it be structured to keep context efficient?",
    options: [
      "Inline everything into one SKILL.md so Claude always has the full reference available",
      "Keep SKILL.md concise and link supporting files Claude reads or runs only when needed",
      "Split the content across multiple SKILL.md files in the same skill directory",
      "Put the reference in CLAUDE.md and keep only the script next to SKILL.md",
    ],
    correctIndex: 1,
    explanation:
      "Progressive disclosure keeps SKILL.md small (under about 500 lines) and links to supporting references, assets, and scripts that Claude loads only when needed. Scripts run without their contents entering context, so only their output consumes tokens.",
  },
  {
    id: "d3-047",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "developer-productivity",
    question:
      "A skill committed to .claude/skills is not appearing when a teammate asks 'what skills are available' after cloning the repo. Which structural issue should be checked first?",
    options: [
      "SKILL.md must sit in a named subdirectory and be named exactly SKILL.md",
      "The skill must be registered in .claude/settings.json under a skills array",
      "The description must be under 1,024 characters or the loader skips it",
      "The skill needs an allowed-tools field before Claude Code will list it",
    ],
    correctIndex: 0,
    explanation:
      "If a skill does not load, the file must be inside a named directory (not at the skills root) and named exactly SKILL.md (uppercase SKILL, lowercase md). Running claude --debug surfaces loading errors mentioning the skill name.",
  },
  {
    id: "d3-048",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "developer-productivity",
    question:
      "What is the difference between how project skills and plugins distribute skills?",
    options: [
      "Project skills require a marketplace install; plugins are shared automatically via Git",
      "Project skills override enterprise skills; plugins cannot be overridden once installed",
      "Project skills in .claude/skills ship via Git on clone; plugins distribute across repos via marketplaces",
      "Project skills load on demand; plugin skills always load into every conversation",
    ],
    correctIndex: 2,
    explanation:
      "Project skills in .claude/skills are version-controlled and everyone who clones the repo gets them. Plugins package skills for distribution across many repositories through marketplaces, suited to skills useful beyond one team.",
  },
  {
    id: "d3-049",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "multi-agent-research",
    question:
      "A developer adds a skill but a subagent they delegate work to ignores it. What is the correct explanation?",
    options: [
      "Subagents inherit skills only when the skill is a personal skill, not a project skill",
      "Skills only work in plan mode; the subagent ran in direct execution mode",
      "Subagents cache skills at startup; the subagent must be restarted to pick it up",
      "Subagents start with a clean context; custom subagents must list the skill in their skills frontmatter",
    ],
    correctIndex: 3,
    explanation:
      "Subagents do not automatically see skills because they begin with a fresh context. Built-in agents (Explorer, Plan, Verify) cannot use skills at all; only custom subagents defined in .claude/agents can, and only when the skill is listed in the agent's skills frontmatter field.",
  },
  {
    id: "d3-050",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "In a PreToolUse hook that should block Claude from reading a sensitive file, how does the hook signal the block and pass an explanation back to Claude?",
    options: [
      "Return a JSON object with allow:false on stdout and the reason in a message field",
      "Exit with code 2 and write the explanation to standard error",
      "Exit with code 1 and write the explanation to standard output",
      "Throw an exception; Claude Code reads the stack trace as the block reason",
    ],
    correctIndex: 1,
    explanation:
      "A hook command receives the tool call as JSON on stdin. Exit code 0 allows the call; exit code 2 blocks it in a PreToolUse hook, and anything written to stderr is sent to Claude as the explanation for the block.",
  },
  {
    id: "d3-051",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "Why can a PreToolUse hook that checks tool_input.file_path for '.env' still fail to fully protect that file, and what complements it?",
    options: [
      "Hooks only run for the Write tool; add a PostToolUse matcher and a deny rule",
      "PreToolUse hooks cannot block; switch to PostToolUse plus a permissions.allow rule",
      "Each tool sends a different input shape, so Grep or Bash bypass it; add a permissions.deny rule",
      "file_path is unavailable until after execution; read it in a SessionStart hook instead",
    ],
    correctIndex: 2,
    explanation:
      "Read sends file_path, but Grep sends pattern and a search path and Bash sends command, so a file_path check misses a project-wide grep or a cat in Bash. Combining the hook with a permissions.deny rule like Read(**/.env) applies uniformly across tools.",
  },
  {
    id: "d3-052",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "developer-productivity",
    question:
      "Which hook event runs when Claude Code has finished responding, making it suitable for an end-of-turn notification?",
    options: [
      "PreCompact",
      "Stop",
      "UserPromptSubmit",
      "Notification",
    ],
    correctIndex: 1,
    explanation:
      "The Stop hook runs when Claude Code has finished responding. Notification fires when Claude needs permission or after 60 seconds idle, UserPromptSubmit runs before processing a submitted prompt, and PreCompact runs before a compact operation.",
  },
  {
    id: "d3-053",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "developer-productivity",
    question:
      "A developer is unsure of the exact stdin structure their hook will receive because it varies by hook event and matcher. What technique is recommended to discover it?",
    options: [
      "Read the hook schema printed by the /hooks command before writing the script",
      "Run claude --debug, which prints every hook payload to the terminal",
      "Add a temporary hook whose command writes stdin to a file, e.g. jq . > log.json",
      "Set hook_event_name in settings.json so Claude sends a fixed payload shape",
    ],
    correctIndex: 2,
    explanation:
      "Because the stdin payload differs by hook event and, for tool hooks, by the tool that was called, a helper hook with a command like jq . > post-log.json captures the exact input so you can inspect what your real command should parse.",
  },
  {
    id: "d3-054",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "developer-productivity",
    question:
      "Claude Code security guidance recommends absolute paths for hook scripts, which makes a shared settings.json hard to commit. How did the course project resolve this?",
    options: [
      "Store hooks only in ~/.claude/settings.json so paths stay machine-local",
      "Use a settings.example.json with a $PWD placeholder that a setup script rewrites locally",
      "Switch all hook commands to relative paths and document the tradeoff",
      "Commit settings.local.json and let each user hand-edit the absolute paths",
    ],
    correctIndex: 1,
    explanation:
      "Absolute paths mitigate path interception and binary planting but differ per machine. The project ships settings.example.json with a $PWD placeholder; npm run setup runs an init script that substitutes the real project path and writes settings.local.json.",
  },
  {
    id: "d3-055",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "Which package should be installed to run Claude Code's agent loop programmatically from a Node script, and what is the entry point?",
    options: [
      "@anthropic-ai/claude-code, imported as the createAgent function",
      "@anthropic-ai/sdk, using the messages.stream method",
      "@anthropic-ai/claude-agent-sdk, using the query function",
      "claude-code-sdk, using the runSession generator",
    ],
    correctIndex: 2,
    explanation:
      "The Agent SDK package is @anthropic-ai/claude-agent-sdk and you drive it with the query function, which streams the same conversation events as the CLI. The similarly named @anthropic-ai/claude-code is the CLI itself and cannot be imported.",
  },
  {
    id: "d3-056",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "In the Agent SDK, how do you narrow Claude to read-only operations, and what CLI flag is this equivalent to?",
    options: [
      "Pass options.allowedTools with the permitted tools; equivalent to --allowedTools",
      "Set options.readOnly to true; equivalent to the --print flag",
      "Pass options.denyTools listing Write and Edit; equivalent to --no-write",
      "Set permissions.deny in settings.json; equivalent to --output-format json",
    ],
    correctIndex: 0,
    explanation:
      "By default the SDK has the full tool set. Passing options.allowedTools (for example Read and Glob) restricts it, which is the SDK equivalent of the CLI's --allowedTools flag.",
  },
  {
    id: "d3-057",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "A developer wants Claude to focus on a specific authentication file during a chat. Which Claude Code technique directly includes that file's contents in the request?",
    options: [
      "Run /init so Claude re-scans and indexes the auth files",
      "Use an @ mention with the file path, such as 'how does auth work? @auth'",
      "Press Ctrl+V to attach the file to the conversation",
      "Add the file to .claude/rules/ so it is injected automatically",
    ],
    correctIndex: 1,
    explanation:
      "Typing @ followed by a path includes that file's contents in the request; Claude shows matching files to pick from. The same @ syntax inside CLAUDE.md includes a file's contents in every request automatically.",
  },
  {
    id: "d3-058",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "developer-productivity",
    question:
      "After debugging a tangent, a developer wants to drop that distracting back-and-forth but keep Claude's earlier understanding of the codebase. Which control fits best?",
    options: [
      "/clear, which starts fresh while keeping prior context available",
      "/compact, which deletes all prior messages to free the window",
      "Escape pressed twice (or /rewind) to jump back to an earlier message",
      "Ctrl+O, which collapses the reasoning and removes debugging turns",
    ],
    correctIndex: 2,
    explanation:
      "Pressing Escape twice or typing /rewind shows your sent messages so you can jump back to an earlier point, removing distracting history while preserving valuable earlier context. /compact summarizes everything and /clear starts a new conversation.",
  },
  {
    id: "d3-059",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "How do effort level and the ultrathink keyword differ in Claude Code?",
    options: [
      "ultrathink sets a persistent session level; /effort applies extra reasoning to one prompt",
      "/effort sets the session reasoning level; ultrathink signals extra thinking for a single prompt",
      "Both permanently raise reasoning; ultrathink also enables plan mode automatically",
      "/effort only works in plan mode; ultrathink only works in direct execution mode",
    ],
    correctIndex: 1,
    explanation:
      "Running /effort sets the session's reasoning level (low is faster and cheaper, max reasons longest). The ultrathink keyword in a prompt signals extra thinking for that single turn without changing the session's effort level.",
  },
  {
    id: "d3-060",
    source: "exam-guide",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "Your team has created a /migration skill that generates database migration files. The skill accepts a migration name via $ARGUMENTS. In production, you're seeing three issues: (1) developers often invoke the skill without arguments, resulting in poorly-named files, (2) the skill sometimes incorporates database schema details from unrelated earlier conversations, and (3) a developer accidentally triggered destructive test cleanup when the skill had broad tool access. Which configuration approach addresses all three issues?",
    options: [
      "Split into separate /migration-create and /migration-apply skills, add instructions in each SKILL.md to request a migration name if not provided, and use different allowed-tools scopes for each skill.",
      "Add argument-hint frontmatter to prompt for required parameters, use context: fork to isolate execution, and restrict allowed-tools to file write operations.",
      "Use positional parameters $1 and $2 instead of $ARGUMENTS to enforce specific inputs, include explicit schema file references via @ syntax to control context, and add description frontmatter warning about destructive operations.",
      "Include validation instructions in the skill's SKILL.md that direct Claude to verify $ARGUMENTS contains a valid name, add prompts to ignore prior conversation context, and list forbidden operations Claude should avoid.",
    ],
    correctIndex: 1,
    explanation:
      "Three distinct skill configuration features each address one issue: argument-hint frontmatter shows expected parameters during autocomplete (addressing missing arguments), context: fork isolates execution in a subagent context separate from conversation history (preventing context bleeding from earlier conversations), and allowed-tools restricts tool access to only file write operations (preventing destructive actions). Splitting into separate skills doesn't inherently solve context isolation since both would still share conversation history, and SKILL.md instructions are less reliable than frontmatter for enforcing argument requirements.",
  },
  {
    id: "d3-061",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "You need to add Slack as a new notification channel. The existing codebase has clear, consistent patterns for email, SMS, and push channels. However, the Slack API offers fundamentally different integration approaches: incoming webhooks (simple, one-way only), bot tokens (enables delivery confirmation and programmatic control), or Slack Apps (bidirectional events, requires workspace approval). Your ticket says 'add Slack support' without specifying which integration method or whether advanced features like delivery tracking will be needed. How should you approach this task?",
    options: [
      "Enter plan mode to explore the integration options and their architectural implications, then present a recommendation before implementing.",
      "Start direct execution to scaffold the Slack channel class following existing patterns, deferring the integration method decision until later.",
      "Start direct execution using the bot token approach to enable delivery confirmation capabilities.",
      "Start direct execution using incoming webhooks to match the existing one-way notification pattern.",
    ],
    correctIndex: 0,
    explanation:
      "The Slack integration involves multiple valid approaches with significantly different architectural implications, and the requirements are ambiguous. Using plan mode to explore trade-offs between webhooks, bot tokens, and Slack Apps allows for an informed recommendation and team alignment before committing to an implementation path. Direct execution risks scaffolding the wrong abstraction or quietly choosing a method that blocks future features like delivery tracking.",
  },
  {
    id: "d3-062",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "You've been assigned to restructure the team's monolithic application into microservices. This will involve changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?",
    options: [
      "Start with direct execution and make changes incrementally, letting the implementation reveal the natural service boundaries.",
      "Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured.",
      "Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes.",
      "Begin in direct execution mode and only switch to plan mode if you encounter unexpected complexity during implementation.",
    ],
    correctIndex: 2,
    explanation:
      "Plan mode is the right strategy for a complex architectural restructuring like breaking apart a monolith. It allows safe exploration of the codebase, understanding of dependencies, and informed decisions about service boundaries before committing to potentially costly changes across dozens of files. Direct execution risks locking in poor boundaries discovered too late, and switching modes reactively wastes work already done.",
  },
  {
    id: "d3-063",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "You're creating a custom /explore-alternatives skill that your team uses to brainstorm and evaluate different implementation approaches before committing to one. However, developers report that after running this skill, Claude's subsequent responses are influenced by the exploration discussion, sometimes referencing abandoned approaches or maintaining exploratory context that confuses actual implementation work. What's the most effective way to configure this skill?",
    options: [
      "Add context: fork to the skill's frontmatter.",
      "Create the skill in ~/.claude/skills/ instead of .claude/skills/.",
      "Split the skill into two separate skills, /explore-start and /explore-end, to demarcate when exploration context should be discarded.",
      "Use the ! prefix in the skill to execute the exploration logic as a bash subprocess.",
    ],
    correctIndex: 0,
    explanation:
      "The context: fork frontmatter option runs the skill in an isolated sub-agent context, so the exploration discussion does not pollute the main conversation history. This prevents abandoned approaches and exploratory context from influencing subsequent implementation work. Skill location (user vs. project) does not affect context isolation, splitting into two skills still shares conversation history, and the ! prefix only runs shell commands.",
  },
  {
    id: "d3-064",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "Your team has been using Claude Code for several months. Recently, three developers report that Claude correctly follows your 'always include comprehensive error handling' guideline, but a fourth developer who just joined reports Claude isn't following this guideline. All four developers are working in the same repository and have the latest code pulled. What's the most likely cause and appropriate fix?",
    options: [
      "The guideline exists in the original developers' ~/.claude/CLAUDE.md files (user-level) instead of the project's .claude/CLAUDE.md. Move the instruction to the project-level file so all team members receive it.",
      "Claude Code builds per-user preference models over time through repeated interactions. The new developer needs to repeatedly specify the error handling requirement until Claude learns their preferences.",
      "The new developer's ~/.claude/CLAUDE.md contains conflicting instructions that override the project settings. Have them remove the conflicting section from their user-level configuration.",
      "Claude Code caches CLAUDE.md contents after first read. The original developers have cached versions while the new developer loaded after the file was modified. Have all developers clear their Claude Code cache.",
    ],
    correctIndex: 0,
    explanation:
      "If the guideline was added to each original developer's user-level ~/.claude/CLAUDE.md rather than the project's .claude/CLAUDE.md, new team members would not inherit it when joining. Moving the instruction to the project-level file (committed to the repo) ensures every current and future contributor receives it automatically. Claude Code does not build per-user preference models, conflicts in a brand-new developer's user file are unlikely, and CLAUDE.md is read fresh per session rather than cached across sessions.",
  },
  {
    id: "d3-065",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "Your team created an /analyze-codebase skill that performs comprehensive code analysis: dependency scanning, test coverage calculation, and code quality metrics. After running this command, team members report that Claude becomes less responsive in the session and loses track of their original task. What's the most effective way to address this while preserving full analysis capability?",
    options: [
      "Add context: fork to the skill's frontmatter to run the analysis in an isolated sub-agent context.",
      "Add instructions to the skill to compress all outputs into a brief summary before displaying.",
      "Add model: haiku to the frontmatter to use a faster, more efficient model for the analysis.",
      "Split the skill into three smaller skills that each generate less output.",
    ],
    correctIndex: 0,
    explanation:
      "Using context: fork in the skill's frontmatter runs the analysis in an isolated sub-agent context, which prevents the verbose output from polluting the main conversation's context window and causing Claude to lose track of the original task. This preserves full analysis capability while keeping the main session responsive. Compressing output, swapping models, or splitting skills still leaves the analysis output in the main conversation.",
  },
  {
    id: "d3-066",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "You've created a /commit skill in .claude/skills/commit/SKILL.md that your team uses. One developer wants to customize it for their personal workflow (different commit message format, additional checks) without affecting teammates. What should you recommend?",
    options: [
      "Create a personal version in ~/.claude/skills/ with a different name like /my-commit.",
      "Create a personal version at ~/.claude/skills/commit/SKILL.md with the same name.",
      "Set override: true in the personal skill's frontmatter to take precedence over the project version.",
      "Add username-based conditional logic to the project skill's frontmatter.",
    ],
    correctIndex: 0,
    explanation:
      "Project skills in .claude/skills/ take precedence over personal skills in ~/.claude/skills/ when they share the same name, so a personal /commit would be shadowed by the project version and never invoked. The developer must use a distinct name (such as /my-commit) in their personal skills directory to keep their custom version accessible alongside the team's project skill. There is no override flag, and username-based logic isn't a supported frontmatter feature.",
  },
  {
    id: "d3-067",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "Your codebase has distinct areas with different coding conventions: React components use functional style with hooks, API handlers use async/await with specific error handling, and database models follow a repository pattern. Test files are spread throughout the codebase alongside the code they test (e.g., Button.test.tsx next to Button.tsx), and you want all tests to follow the same conventions regardless of location. What's the most maintainable way to ensure Claude automatically applies the correct conventions when generating code?",
    options: [
      "Create skills in .claude/skills/ for each code type that include the relevant conventions in their SKILL.md files.",
      "Create rule files in .claude/rules/ with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths.",
      "Consolidate all conventions in the root CLAUDE.md file under headers for each area, relying on Claude to infer which section applies.",
      "Place a separate CLAUDE.md file in each subdirectory containing that area's specific conventions.",
    ],
    correctIndex: 1,
    explanation:
      "Rule files in .claude/rules/ with YAML frontmatter and glob patterns (e.g., **/*.test.tsx, src/api/**/*.ts) automatically and deterministically apply conventions based on file paths, regardless of where those files live in the directory tree. This is the most maintainable approach for cross-cutting concerns like test files spread throughout the codebase, since it avoids duplication and doesn't rely on Claude inferring the right section. Skills require manual invocation, monolithic CLAUDE.md depends on inference, and subdirectory CLAUDE.md files don't cleanly handle co-located test files.",
  },
  {
    id: "d3-068",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "Your team's CLAUDE.md file has grown to over 500 lines, mixing TypeScript conventions, testing guidelines, API patterns, and deployment procedures. Developers find it difficult to locate and update relevant sections. What approach does Claude Code support for organizing project-level instructions into focused, topic-specific modules?",
    options: [
      "Define a .claude/config.yaml file that maps file patterns to specific sections within CLAUDE.md.",
      "Split instructions into README.md files in relevant subdirectories, which Claude automatically loads as instructions.",
      "Create separate markdown files in .claude/rules/, each covering one topic (e.g., testing.md, api-conventions.md).",
      "Create multiple files named CLAUDE.md at different levels of the directory tree, each one overriding the parent's instructions.",
    ],
    correctIndex: 2,
    explanation:
      "Claude Code supports a .claude/rules/ directory where teams can create separate markdown files for topic-specific guidelines (e.g., testing.md, api-conventions.md), letting large instruction sets be organized into focused, maintainable modules. README.md files are not loaded as instructions, there is no config.yaml mapping to CLAUDE.md sections, and nested CLAUDE.md files supplement rather than override parent instructions, scoping by directory rather than by topic.",
  },
  {
    id: "d3-069",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "Your CLAUDE.md has grown to over 400 lines containing coding standards, testing conventions, a detailed PR review checklist, deployment workflow instructions, and database migration procedures. You want Claude to always follow the coding standards and testing conventions, but only apply PR review, deployment, and migration guidance when you're actually performing those tasks. What's the most effective restructuring approach?",
    options: [
      "Split the CLAUDE.md into files in .claude/rules/ with path-specific glob patterns so each rule loads only for matching file types.",
      "Move all guidance into separate Skills files organized by workflow type, keeping only a brief project description in CLAUDE.md.",
      "Keep all content in CLAUDE.md but use @import syntax to organize it into separately maintained files by category.",
      "Keep universal standards in CLAUDE.md and create Skills for task-specific workflows (PR reviews, deployments, migrations) with trigger keywords.",
    ],
    correctIndex: 3,
    explanation:
      "CLAUDE.md content loads for every conversation, so universal coding standards and testing conventions belong there and are always applied. Skills, by contrast, are invoked on-demand when Claude detects relevant trigger keywords, making them ideal for task-specific workflows like PR reviews, deployments, and migrations. Glob-based rules suit file-type concerns but don't fit workflow-triggered guidance, and pushing everything into skills would lose the always-on coverage of the universal standards.",
  },
  {
    id: "d3-070",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "Your team wants to add a GitHub MCP server to enable PR lookups and CI status checks through Claude Code. Each of the six developers has their own GitHub personal access token. You want consistent tooling across the team without committing credentials to version control. What's the most effective configuration approach?",
    options: [
      "Create an MCP server wrapper that reads tokens from a .env file and proxies requests to the GitHub API, then add this wrapper to your project .mcp.json.",
      "Have each developer configure the server in user scope with claude mcp add --scope user.",
      "Add the server to a project-scoped .mcp.json with environment variable expansion (${GITHUB_TOKEN}) for authentication, and document the required environment variable in your project README.",
      "Configure the server in project scope with a placeholder token value, then instruct developers to override it in their local scope configuration.",
    ],
    correctIndex: 2,
    explanation:
      "A project-scoped .mcp.json with environment variable expansion (such as ${GITHUB_TOKEN}) is the idiomatic approach: it provides a single, version-controlled source of truth for the team's MCP configuration while letting each developer supply their own credentials through environment variables. Documenting the required variable in the README keeps onboarding simple without committing secrets. A custom wrapper adds maintenance burden, user-scope configuration drifts across machines, and placeholder tokens with manual overrides are error-prone.",
  },
  {
    id: "d3-071",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "You've asked Claude Code to implement a function that transforms API responses into a normalized internal format. After two iterations, the output structure still doesn't match expectations: some fields are nested differently and timestamps aren't formatted correctly. You've been describing the requirements in prose, but Claude seems to interpret them differently each time. What's the most effective approach for the next iteration?",
    options: [
      "Provide 2-3 concrete input-output examples showing the expected transformation for representative API responses.",
      "Ask Claude to explain its current interpretation of the requirements so you can identify where understanding diverges.",
      "Write a JSON schema defining the expected output structure and validate Claude's output against it after each iteration.",
      "Rewrite your requirements with greater technical precision, specifying exact field mappings, nesting rules, and timestamp format strings.",
    ],
    correctIndex: 0,
    explanation:
      "Concrete input-output examples eliminate the ambiguity inherent in prose descriptions by showing Claude exactly what the expected transformation looks like. This directly addresses the root cause (misinterpretation of prose requirements) by giving unambiguous targets for field nesting and timestamp formatting. A JSON schema validates structure but doesn't teach the mapping logic, asking Claude to explain its interpretation diagnoses but doesn't correct it, and even more precise prose still leaves room for divergent interpretation.",
  },
  {
    id: "d3-072",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "You're adding error handling wrappers to external API calls across a 120-file codebase. The task has three phases: (1) discovering all API call locations and patterns, (2) designing the error handling approach collaboratively, and (3) implementing wrappers consistently. During Phase 1, Claude generates verbose output listing hundreds of call sites with context. Your context window is filling rapidly before you've finished discovery. What's the most effective approach to complete this while maintaining implementation consistency?",
    options: [
      "Use the Explore subagent for Phase 1 to isolate verbose output and return a summary, then continue Phases 2-3 in the main conversation.",
      "Define your error handling pattern in CLAUDE.md, then process files in batches across multiple sessions, relying on the shared memory file for consistency.",
      "Switch to headless mode with --continue, passing explicit context summaries between batch invocations to maintain continuity.",
      "Continue all phases in the main conversation, using /compact periodically to reduce context usage as you progress through the files.",
    ],
    correctIndex: 0,
    explanation:
      "The Explore subagent runs Phase 1 in an isolated context and returns only a concise summary to the main conversation, preserving the main context window for the collaborative design and consistent implementation phases where retained context is most valuable. Splitting across sessions loses in-context design decisions, headless --continue still discards retained reasoning between invocations, and /compact summarizes lossily and risks dropping the very details needed for consistent implementation.",
  },
  {
    id: "d3-073",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "You want to create a custom /review slash command that runs your team's standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?",
    options: [
      "In a .claude/config.json file with a commands array.",
      "In the CLAUDE.md file at the project root.",
      "In ~/.claude/commands/ in each developer's home directory.",
      "In the .claude/commands/ directory in the project repository.",
    ],
    correctIndex: 3,
    explanation:
      "The .claude/commands/ directory in the project repository is the designated location for project-scoped custom slash commands. Files placed there are version-controlled and automatically available to every developer who clones or pulls the repo. Home-directory commands aren't shared, CLAUDE.md is for project instructions rather than command definitions, and there is no commands array in config.json.",
  },
  {
    id: "d3-074",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "You've found that including 2-3 full exemplar endpoint implementations as context significantly improves consistency when generating new API endpoints. However, this context is only useful for creating new endpoints, not for bug fixes, code reviews, or other API directory work. What's the most efficient configuration approach?",
    options: [
      "Add the exemplar endpoint code with pattern documentation to the project CLAUDE.md file so it's automatically available.",
      "Reference the exemplar endpoints manually in each generation request by copying relevant code into your prompt.",
      "Configure path-specific rules in .claude/rules/api/ that include the exemplar code and activate when working in the API directory.",
      "Create a skill that references the exemplar endpoints and includes pattern-following instructions, invoked on-demand via slash command.",
    ],
    correctIndex: 3,
    explanation:
      "A skill that references the exemplar endpoints with pattern-following instructions is invoked on-demand via a slash command, so the context loads only when generating new endpoints and stays out of unrelated tasks like bug fixes or code reviews. CLAUDE.md would load the exemplars for every conversation, path-based rules in .claude/rules/api/ would activate for all API directory work (including bug fixes), and copying code into each prompt is manual and error-prone.",
  },
  {
    id: "d3-075",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "Your CI pipeline includes two Claude-powered code review modes: a pre-merge-commit hook that blocks PR merging until complete, and 'deep analysis' that runs overnight, polls for batch completion, then posts detailed suggestions to the PR. You want to reduce API costs using the Message Batches API, which offers 50% cost savings but requires polling and may take up to 24 hours to complete. Which mode should use batch processing?",
    options: [
      "Neither mode.",
      "Both modes.",
      "Pre-merge-commit hook only.",
      "Deep analysis only.",
    ],
    correctIndex: 3,
    explanation:
      "Deep analysis already runs overnight, tolerates latency, and uses a polling model to check completion before posting results, which matches the Message Batches API's asynchronous, poll-based design and captures the 50% cost savings. The pre-merge-commit hook is on the developer's critical path: a multi-hour wait would block merges, so its latency budget rules out batch processing.",
  },
  {
    id: "d3-076",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "Your automated review generates test case suggestions for each PR. When reviewing a PR that adds course completion tracking, Claude suggests 10 test cases but developer feedback indicates 6 duplicate scenarios already covered in the existing test suite. What change would most effectively reduce duplicate suggestions?",
    options: [
      "Reduce requested suggestions from 10 to 5, assuming Claude will prioritize the most valuable cases first.",
      "Add instructions directing Claude to focus exclusively on edge cases and error conditions rather than successful paths.",
      "Include the existing test file in the context so Claude can identify what scenarios are already covered.",
      "Implement post-processing that filters suggestions whose descriptions match keywords from existing test names.",
    ],
    correctIndex: 2,
    explanation:
      "Including the existing test file in the context addresses the root cause of duplication: Claude can only avoid suggesting already-covered scenarios if it knows what tests already exist. Reducing the suggestion count doesn't tell Claude which ones are duplicates, restricting to edge cases narrows scope but still risks repeating ones already covered, and keyword filtering is fragile because semantically identical tests can use very different wording.",
  },
  {
    id: "d3-077",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "Your pipeline script runs claude 'Analyze this pull request for security issues' but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What's the correct approach to run Claude Code in an automated pipeline?",
    options: [
      "Set the environment variable CLAUDE_HEADLESS=true before running the command.",
      "Add the --batch flag: claude --batch 'Analyze this pull request for security issues'.",
      "Redirect stdin from /dev/null: claude 'Analyze this pull request for security issues' < /dev/null.",
      "Add the -p flag: claude -p 'Analyze this pull request for security issues'.",
    ],
    correctIndex: 3,
    explanation:
      "The -p (or --print) flag is the documented way to run Claude Code in non-interactive mode. It processes the given prompt, writes the result to stdout, and exits without waiting for user input, which is exactly what a CI/CD pipeline needs. CLAUDE_HEADLESS and --batch are not real flags, and redirecting stdin doesn't change Claude Code's default interactive REPL behavior.",
  },
  {
    id: "d3-078",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "Your CI pipeline runs the Claude Code CLI (with --print mode) using CLAUDE.md to provide project context for code reviews, and developers generally find the reviews insightful. However, they report that integrating findings into your workflow is difficult: Claude produces narrative paragraphs that must be manually copied into PR comments. Your team wants to automatically post each finding as a separate inline PR comment at the relevant code location, which requires structured data with file path, line number, severity, and suggested fix. What's the most effective approach?",
    options: [
      "Keep the narrative review format but add a summarization step that uses Claude to generate a structured JSON summary of the findings.",
      "Add a 'Review Output Format' section to CLAUDE.md with examples showing structured findings, so Claude learns the expected format from project context.",
      "Use CLI flags --output-format json and --json-schema to enforce structured findings, then parse output to post inline comments via the GitHub API.",
      "Include explicit formatting instructions in your review prompt requiring each finding to follow a parseable template like [FILE:path] [LINE:n] [SEVERITY:level] ....",
    ],
    correctIndex: 2,
    explanation:
      "Using --output-format json with --json-schema enforces structured output at the CLI level, guaranteeing well-formed JSON with the required fields (file path, line number, severity, suggested fix) that can be reliably parsed and posted as inline PR comments via the GitHub API. This leverages native CLI capabilities designed for structured-output enforcement. A second summarization pass adds cost and another point of drift, prose templates and CLAUDE.md guidance still depend on the model's compliance and remain harder to parse robustly.",
  },
  {
    id: "d3-079",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "Analysis of your automated code review shows significant variation in false positive rates across finding categories. Security and correctness findings have an 8% false positive rate, performance findings have 18%, style and naming findings have 52%, and documentation findings have 48%. Developer surveys indicate growing distrust: many have started dismissing findings without review because 'half are wrong.' The high false positive categories are undermining confidence in the accurate categories. What approach best restores developer trust while improving the system?",
    options: [
      "Keep all categories enabled while adding few-shot examples to improve each category's accuracy over the coming weeks.",
      "Temporarily disable high false positive categories (style, naming, documentation) and run only high-precision categories while improving prompts.",
      "Keep all categories but display a confidence score with each finding, letting developers decide which to investigate.",
      "Apply a uniform strictness reduction across all categories to bring the overall false positive rate to an acceptable level.",
    ],
    correctIndex: 1,
    explanation:
      "Temporarily disabling the high false positive categories (style, naming, documentation) immediately stops trust erosion by removing the noise that drives developers to dismiss findings wholesale, while preserving the value of the high-precision categories like security and correctness. That buys time to improve prompts for the noisy categories before re-enabling them. Keeping everything on (with examples, confidence scores, or a uniform strictness cut) leaves the noise visible, and lowering strictness everywhere weakens the categories that were already accurate.",
  },
  {
    id: "d3-080",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "The code review component works iteratively: Claude analyzes a changed file, then may request related files (imports, base classes, tests) via tool calling to understand context before providing final feedback. Your application defines a tool that lets Claude request file contents; Claude invokes this tool, receives results, and continues its analysis. You're evaluating batch processing to reduce API costs. What is the primary technical constraint when considering batch processing for this workflow?",
    options: [
      "Batch processing lacks request correlation identifiers for matching outputs to input requests.",
      "The batch API doesn't support tool definitions in request parameters.",
      "Batch processing latency of up to 24 hours is too slow for pull request feedback, though the workflow could otherwise function.",
      "The asynchronous model prevents executing tools mid-request and returning results for Claude to continue analysis.",
    ],
    correctIndex: 3,
    explanation:
      "The batch API's asynchronous, fire-and-forget model has no mechanism to intercept a tool call mid-request, execute the tool, and feed results back so Claude can continue. That fundamentally breaks iterative tool-calling workflows that need multiple rounds of invocation and response inside a single logical interaction. Batches support request IDs and tool definitions, and even if latency were acceptable, the missing mid-request tool execution still blocks this workflow.",
  },
  {
    id: "d3-081",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "A pull request modifies 14 files across the stock tracking module. Your single-pass review analyzing all files together produces inconsistent results: detailed feedback for some files but superficial comments for others, obvious bugs missed, and contradictory feedback (flagging a pattern as problematic in one file while approving identical code elsewhere in the same PR). How should you restructure the review?",
    options: [
      "Split into focused passes: analyze each file individually for local issues, then run a separate integration-focused pass examining cross-file data flow.",
      "Switch to a higher-tier model with a larger context window to give all 14 files adequate attention in one pass.",
      "Require developers to split large PRs into smaller submissions of 3-4 files before the automated review runs.",
      "Run three independent review passes on the full PR and only flag issues that appear in at least two of the three runs.",
    ],
    correctIndex: 0,
    explanation:
      "Per-file passes address the root cause of attention dilution by giving each file consistent depth and reliable local-issue coverage, while a separate integration-focused pass handles cross-file concerns like data flow. Together they cover both dimensions of review quality. A bigger model still spreads attention across 14 files in one go, forcing developers to split PRs offloads the problem, and majority voting across three full-PR runs is expensive and doesn't fix the underlying attention issue.",
  },
  {
    id: "d3-082",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "Your automated code review averages 15 findings per pull request, with developers reporting a 40% false positive rate. The bottleneck is investigation time: developers must click into each finding to read Claude's reasoning before deciding whether to address or dismiss it. Your CLAUDE.md already contains comprehensive rules for acceptable patterns, and stakeholders have rejected any approach that filters findings before developer review. What change would best address the investigation time bottleneck?",
    options: [
      "Require Claude to include its reasoning and confidence assessment inline with each finding.",
      "Categorize findings as 'blocking issues' versus 'suggestions' with tiered review requirements.",
      "Configure Claude to only surface findings it assesses as high confidence, filtering out uncertain flags before developers see them.",
      "Add a post-processor that analyzes finding patterns and automatically suppresses those matching historical false positive signatures.",
    ],
    correctIndex: 0,
    explanation:
      "Inline reasoning and a confidence assessment with each finding directly cut investigation time: developers can triage from the comment list without clicking into each one. This respects the constraint that nothing is filtered before review. Tiering changes labels but doesn't reduce per-finding investigation, and the confidence-based filter and post-processor both suppress findings before developers see them, violating the stated constraint.",
  },
  {
    id: "d3-083",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "After an initial automated review generates 12 findings, a developer pushes new commits to address the issues. When the review runs again, it produces 8 findings, but developers report that 5 duplicate earlier comments on code that was already fixed in the new commits. What's the most effective way to eliminate this redundant feedback while maintaining thorough analysis?",
    options: [
      "Add a post-processing filter that removes findings matching previous file paths and issue descriptions before posting comments.",
      "Include prior review findings in context, instructing Claude to only report new or still-unaddressed issues.",
      "Run reviews only on initial PR creation and final pre-merge state, skipping intermediate commits.",
      "Restrict the review scope to only files modified in the most recent push, excluding files from earlier commits.",
    ],
    correctIndex: 1,
    explanation:
      "Providing the prior review findings as context lets Claude reason about each one and report only what is new or still unaddressed, preserving thorough analysis without redundant comments. A path/description filter is brittle because phrasing varies between runs, skipping intermediate commits hides useful feedback during iteration, and restricting scope to recently changed files misses cross-file regressions introduced by the fixes.",
  },
  {
    id: "d3-084",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "Your CI/CD system performs three types of Claude-powered analysis: (1) quick style checks on each PR that block merging until complete, (2) comprehensive security audits of the entire codebase run weekly, and (3) test case generation triggered nightly for recently-modified modules. The Message Batches API offers 50% cost savings but can take up to 24 hours to process. You want to optimize API costs while maintaining acceptable developer experience. Which combination correctly matches each task to its API approach?",
    options: [
      "Use the Message Batches API for all three tasks to maximize the 50% cost savings, and configure the pipeline to poll for batch completion.",
      "Use synchronous calls for PR style checks and nightly test generation; use Message Batches API only for weekly security audits.",
      "Use synchronous calls for all three tasks for consistent response times, and rely on prompt caching to reduce costs across all workloads.",
      "Use synchronous calls for PR style checks; use the Message Batches API for weekly security audits and nightly test generation.",
    ],
    correctIndex: 3,
    explanation:
      "PR style checks block developers on merge and need synchronous responses, while weekly security audits and nightly test generation are scheduled tasks whose timelines easily absorb the up-to-24-hour batch window, capturing the 50% savings on both. Batching everything would block merges, batching only the audit leaves nightly test generation paying full price unnecessarily, and going fully synchronous gives up batch savings entirely.",
  },
  {
    id: "d3-085",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "Your team wants to reduce API costs for automated analysis. Currently, real-time Claude calls power two workflows: (1) a blocking pre-merge check that must complete before developers can merge, and (2) a technical debt report generated overnight for review the next morning. Your manager proposes switching both to the Message Batches API for its 50% cost savings. How should you evaluate this proposal?",
    options: [
      "Switch both to batch processing with a timeout fallback to real-time if batches take too long.",
      "Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks.",
      "Switch both workflows to batch processing with status polling to check for completion.",
      "Keep real-time calls for both workflows to avoid batch result ordering issues.",
    ],
    correctIndex: 1,
    explanation:
      "The Message Batches API's up-to-24-hour processing window with no guaranteed latency SLA fits overnight technical debt reports but blocks developers if applied to pre-merge checks where they're waiting. Matching each workflow to the right API captures the 50% savings where latency is flexible and preserves responsiveness where it isn't. A timeout fallback adds complexity for the same blocking problem, and keeping everything real-time gives up the easy savings on the report.",
  },

  // ---- Domain 4: Prompt Engineering (Claude API course) ----
  {
    id: "d4-087",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "Your prompt opens with: 'I was wondering if you could maybe tell me about those configuration files for cloud events?' Applying the 'being clear and direct' technique, which rewrite of the first line is strongest?",
    options: [
      "Could you possibly generate an EventBridge configuration file for me?",
      "I need help understanding EventBridge configuration files in JSON.",
      "Generate a valid EventBridge rule as JSON that matches EC2 state changes.",
      "What does a typical EventBridge rule configuration file usually look like?",
    ],
    correctIndex: 2,
    explanation:
      "Being clear and direct means leading with a direct action verb and stating the exact task without hedging. Use instructions, not questions: 'Generate a valid EventBridge rule...' tells Claude the action, the artifact, and the constraint. The other options are phrased as questions or remain vague.",
  },
  {
    id: "d4-088",
    source: "ai-generated",
    domain: "prompt-engineering",
    question:
      "The 'being specific' lesson distinguishes Output Quality Guidelines from Process Steps. According to the guidance on when to use each, which statement is correct?",
    options: [
      "Use Process Steps in almost every prompt; reserve Quality Guidelines for creative tasks only",
      "Quality Guidelines and Process Steps are interchangeable and should never be combined",
      "Quality Guidelines belong only in system prompts; Process Steps belong only in user messages",
      "Include Quality Guidelines in almost every prompt; add Process Steps for complex reasoning or decision tasks",
    ],
    correctIndex: 3,
    explanation:
      "The lesson advises always including output quality guidelines as a safety net for consistent results, and adding step-by-step process guidelines specifically for troubleshooting, decision-making, and critical-thinking tasks where Claude should consider multiple angles before answering.",
  },
  {
    id: "d4-089",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "You are building a prompt-evaluation pipeline and need 200 representative test cases. The course recommends which approach for assembling this dataset efficiently?",
    options: [
      "Generate the dataset programmatically with Claude, using a faster model like Haiku",
      "Hand-author all 200 cases to guarantee maximum diversity and correctness",
      "Reuse production logs only, since synthetic cases never reflect real inputs",
      "Generate cases with the highest-quality model at temperature 0 for accuracy",
    ],
    correctIndex: 0,
    explanation:
      "The course shows datasets can be built by hand or generated automatically by Claude, and that test-data generation is a perfect place to use a faster, cheaper model like Haiku since the task does not require the strongest model. Keeping case counts low during development speeds iteration.",
  },
  {
    id: "d4-091",
    source: "ai-generated",
    domain: "prompt-engineering",
    question:
      "Following the 'typical eval workflow', a baseline prompt scores 7.66 averaged across the dataset. You add a guidance sentence and rerun the entire pipeline, getting 8.7. What does this five-step workflow primarily give you?",
    options: [
      "A guarantee the new prompt never regresses on any unseen production input",
      "An objective, repeatable metric to compare prompt versions before iterating",
      "A way to eliminate the need for any code-based or model-based grader",
      "Proof that higher temperature always raises the average evaluation score",
    ],
    correctIndex: 1,
    explanation:
      "The typical workflow (draft, create dataset, feed through Claude, feed through grader, change prompt and repeat) produces an average score that serves as an objective baseline. Re-running after a change shows whether the modification measurably improved performance, enabling data-driven iteration rather than guessing.",
  },
  {
    id: "d4-092",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "conversational-architecture",
    question:
      "A user asks Claude 'What is quantum computing?', gets a good answer, then sends 'Write another sentence' and receives an unrelated sentence. Why, and what is the fix?",
    options: [
      "Temperature was too high; lower it so Claude recalls the prior topic",
      "The system prompt expired; refresh it before every follow-up message",
      "max_tokens truncated the memory; raise max_tokens to retain prior turns",
      "The API is stateless; resend the full messages list including the prior assistant turn",
    ],
    correctIndex: 3,
    explanation:
      "Each API request is independent with no server-side memory. To maintain context you must manually maintain the messages list and resend the entire history, appending Claude's prior response as an assistant message before adding the next user message.",
  },
  {
    id: "d4-093",
    source: "ai-generated",
    domain: "prompt-engineering",
    question:
      "Which statement about the client.messages.create() parameters, as taught in 'Making a request', is accurate?",
    options: [
      "max_tokens is a target length Claude tries to reach in every response",
      "model, max_tokens, and messages are the three core required parameters",
      "messages may contain a dictionary with role set to 'system' for instructions",
      "system is required on every call and cannot be omitted from the request",
    ],
    correctIndex: 1,
    explanation:
      "The create function's three key parameters are model, max_tokens, and messages. max_tokens is a safety limit, not a target: Claude writes what it deems appropriate and only stops early if it hits the cap. The system prompt is a separate top-level parameter, not a message role.",
  },
  {
    id: "d4-094",
    source: "ai-generated",
    domain: "prompt-engineering",
    question:
      "Your reusable chat() helper accepts an optional system prompt. Why should the code add the system key to the request only when a value is provided, instead of always including it?",
    options: [
      "The API rejects a null system value, so include the key only when set",
      "Passing a null system silently doubles token cost on every request made",
      "system must always be the first element inside the messages list array",
      "The API requires system to be merged into the final user message content",
    ],
    correctIndex: 0,
    explanation:
      "system is an optional top-level parameter, and the API rejects a null value. A flexible chat helper builds its params dict and adds the system key only when a system prompt was actually provided.",
  },
  {
    id: "d4-095",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "After running an eval, you want to strengthen a prompt that handles a tricky JSON-formatting edge case. The 'providing examples' lesson recommends sourcing few-shot examples how?",
    options: [
      "Invent plausible ideal outputs by hand so they cover untested scenarios",
      "Use the lowest-scoring outputs so Claude learns what mistakes to avoid",
      "Take highest-scoring eval input/output pairs and explain why each is ideal",
      "Average several mid-scoring outputs to create one balanced example pair",
    ],
    correctIndex: 2,
    explanation:
      "The lesson recommends mining your highest-scoring eval outputs (e.g., those that scored 10) and reusing those input/output pairs as few-shot examples, wrapped in XML tags, with added context explaining why the output is ideal so Claude learns the reasoning, not just the format.",
  },
  {
    id: "d4-096",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "ci-cd",
    question:
      "Your code grader must score generated output for the 'valid syntax' criterion across Python, JSON, and Regex. How does the course implement these validators?",
    options: [
      "Send the output to a model grader and ask it to estimate syntactic validity",
      "Attempt to parse the output; return 10 if parsing succeeds, 0 if it raises",
      "Count syntax keywords and scale the score linearly from 1 to 10 by count",
      "Compare the output character-by-character against a reference golden answer",
    ],
    correctIndex: 1,
    explanation:
      "Code-based syntax validators try to parse the output (json.loads, ast.parse, re.compile). Successful parsing returns 10; a parse error returns 0. Code graders handle deterministic checks like format and syntax, while a model grader assesses task-following quality, and the scores are combined.",
  },
  {
    id: "d4-097",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "ci-cd",
    question:
      "Your automated code review system shows inconsistent severity ratings: similar issues like null pointer risks receive 'critical' severity in some PRs but only 'medium' in others. Developer trust is declining because teams can't predict which findings require immediate attention. What's the most effective way to improve severity consistency?",
    options: [
      "Request that Claude include its reasoning for each severity assignment, then use that reasoning to manually calibrate and adjust ratings during review.",
      "Add a CLAUDE.md file that lists issue types and their default severities, instructing Claude to reference this mapping when assigning ratings.",
      "Include explicit severity criteria in your prompt with concrete code examples for each severity level.",
      "Modify the prompt to ask Claude to rate severity relative to other issues in the same PR, so the most severe issue is always marked critical and others rated proportionally.",
    ],
    correctIndex: 2,
    explanation:
      "Explicit severity criteria with concrete code examples for each level remove ambiguity about what each severity means and give the model stable reference points for classification, which directly addresses the inconsistency. Manual calibration after the fact doesn't fix the model's behavior, type-to-severity tables miss context (the same defect can be critical in one path and minor in another), and relative ranking forces a 'critical' label even when nothing in the PR actually is.",
  },
  {
    id: "d4-098",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "ci-cd",
    question:
      "Your automated reviews identify valid issues but developers report the feedback isn't actionable. Findings say things like 'complex ticket allocation logic' or 'potential null pointer' without specifying what to change. When you add detailed instructions like 'always include specific fix suggestions,' the model still produces inconsistent output: sometimes detailed, sometimes vague. What prompting technique would most reliably produce consistently actionable feedback?",
    options: [
      "Further refine the instructions with more explicit requirements for each part of the feedback format (location, issue, severity, suggested fix).",
      "Expand the context window to include more of the surrounding codebase so the model has sufficient information to suggest specific fixes.",
      "Add 3-4 few-shot examples showing the exact format you want: issue identified, code location, specific fix suggestion.",
      "Implement a two-pass approach where one prompt identifies issues and a second prompt generates fixes, allowing specialization.",
    ],
    correctIndex: 2,
    explanation:
      "When abstract instructions produce variable results, few-shot examples are the most reliable way to lock in a consistent output format. Three or four examples showing the exact pattern (issue, location, specific fix) give the model a concrete template to mimic. More detailed instructions chase the same indirect lever, broader codebase context doesn't address formatting, and a two-pass pipeline adds cost and complexity to fix a presentation problem.",
  },
  {
    id: "d4-099",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "ci-cd",
    question:
      "Your automated review analyzes comments and docstrings. The current prompt instructs Claude to 'check that comments are accurate and up-to-date.' Findings frequently flag acceptable patterns (TODO markers, straightforward descriptions) while missing comments that describe behavior the code no longer implements. What change addresses the root cause of this inconsistent analysis?",
    options: [
      "Include git blame data so Claude can identify comments that predate recent code modifications.",
      "Specify explicit criteria: flag comments only when their claimed behavior contradicts actual code behavior.",
      "Filter out TODO, FIXME, and descriptive comment patterns before analysis to reduce noise.",
      "Add few-shot examples of misleading comments to help the model recognize similar patterns in the codebase.",
    ],
    correctIndex: 1,
    explanation:
      "Replacing the vague instruction with explicit criteria (flag a comment only when its claimed behavior contradicts the actual code behavior) gives the model a precise definition of the problem to detect, eliminating both the false positives on acceptable patterns and the false negatives on genuinely misleading comments. Git blame data is a weak proxy for accuracy, pattern-based filtering misses the underlying contradiction question, and few-shot examples help with familiar patterns but don't define the criterion.",
  },

  // ---- Domain 5: Context Management (Claude API features) ----
  {
    id: "d5-107",
    source: "ai-generated",
    domain: "context-management",
    scenario: "structured-data",
    question:
      "An app sends scanned invoices to Claude for vision analysis. What are the correct image input constraints to design around?",
    options: [
      "Up to 100 images per request, 5MB max per image, base64 or URL source",
      "Up to 20 images per request, 10MB max per image, base64 source only",
      "Unlimited images per request capped by the overall context-window size",
      "Up to 100 images per request, 5MB max per image, URL source required",
    ],
    correctIndex: 0,
    explanation:
      "Claude vision allows up to 100 images across all messages in a single request, max 5MB per image, supplied either as base64 encoding or a URL. Image tokens are roughly (width px x height px) / 750.",
  },
  {
    id: "d5-108",
    source: "ai-generated",
    domain: "context-management",
    scenario: "structured-data",
    question:
      "A team gets inaccurate counts when asking Claude 'How many items are in this image?'. What is the recommended fix from the image-support lesson?",
    options: [
      "Upscale every image to the 8000px maximum before sending it",
      "Switch the image block source from base64 to a hosted URL",
      "Split the photo into many small tiles and send each separately",
      "Provide a step-by-step methodology and one-shot example in the prompt",
    ],
    correctIndex: 3,
    explanation:
      "Image accuracy improves with the same prompt-engineering techniques used for text: give Claude an explicit analysis methodology, break the task into steps, and include one-shot or multi-shot examples. Resolution or transport changes do not address reasoning errors.",
  },
  {
    id: "d5-109",
    source: "ai-generated",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "You need Claude to summarize a multi-page PDF that contains text, tables, and charts. How do you supply it through the Messages API?",
    options: [
      "Run OCR yourself and paste the extracted plain text into the prompt",
      "Send a document block, source type base64, media_type application/pdf",
      "Send an image block per page using media_type image/png for each one",
      "Upload to a vector store first; PDFs cannot be passed in a message",
    ],
    correctIndex: 1,
    explanation:
      "Claude reads PDFs natively via a document content block with source type base64 and media_type application/pdf. It interprets text, embedded images and charts, tables, and document structure without external OCR or pre-chunking.",
  },
  {
    id: "d5-110",
    source: "ai-generated",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "A compliance team must verify every answer against the source contract. Which document-block configuration enables that traceability?",
    options: [
      "Append 'cite your sources' to the system prompt for each request",
      "Set tool_choice to a retrieval tool that returns page references",
      "Add title and citations enabled true to the document block",
      "Enable extended thinking so Claude shows the reasoning trail",
    ],
    correctIndex: 2,
    explanation:
      "Citations are enabled by adding a title and citations enabled on the document block. Claude then returns structured citations including cited_text, document index or title, and page numbers (PDF) or character positions (plain text).",
  },
  {
    id: "d5-111",
    source: "ai-generated",
    domain: "context-management",
    scenario: "structured-data",
    question:
      "An analyst wants Claude to compute churn drivers from a 200MB CSV and return a chart. Which Anthropic features support this, given the execution sandbox has no network access?",
    options: [
      "Web search tool to fetch the CSV, then inline base64 in the message",
      "Files API to upload the CSV plus the code execution tool to analyze it",
      "Prompt caching to store the CSV so repeated requests can reread it",
      "MCP resource server exposing the CSV rows as individual tool results",
    ],
    correctIndex: 1,
    explanation:
      "Upload the CSV via the Files API to get a file_id, reference it with a container_upload block, and enable the code execution tool. Claude runs Python in an isolated Docker container (no network), so the Files API is how data moves in and generated plots come out.",
  },
  {
    id: "d5-112",
    source: "ai-generated",
    domain: "context-management",
    scenario: "developer-productivity",
    question:
      "An app asks many questions about the same large document and adds a cache breakpoint after it. How does billing for the cached prefix work?",
    options: [
      "The cache write and every cache read are billed at the same base rate",
      "Cached prefixes are free; you only pay for tokens after the breakpoint",
      "Initial request writes the cache; later requests read it more cheaply",
      "Caching is billed as a flat monthly fee independent of request volume",
    ],
    correctIndex: 2,
    explanation:
      "The first request writes the preprocessing work to the cache and follow-up requests read from it, making the cached portion faster and cheaper. The benefit only applies while the prefix stays identical and within the one-hour cache lifetime.",
  },
  {
    id: "d5-113",
    source: "ai-generated",
    domain: "context-management",
    scenario: "multi-agent-research",
    question:
      "A research retriever wraps a vector index and a BM25 index behind one search() call. Why combine both indexes instead of using vector search alone?",
    options: [
      "Vector search cannot scale past a few thousand stored chunks",
      "BM25 removes the need to generate any embeddings for the corpus",
      "It eliminates the chunking step required by semantic retrieval",
      "Lexical search catches exact terms (IDs) semantic search may miss",
    ],
    correctIndex: 3,
    explanation:
      "Semantic search understands meaning but can miss exact tokens like incident IDs; BM25 weights rare exact terms highly. The Retriever forwards the query to both shared-API indexes and merges results with reciprocal rank fusion for the best of both.",
  },
  {
    id: "d5-114",
    source: "ai-generated",
    domain: "context-management",
    scenario: "developer-productivity",
    question:
      "A team building a RAG pipeline asks which embedding model to call from the Anthropic SDK. What is the accurate guidance from the course?",
    options: [
      "Anthropic does not provide embeddings; use a provider such as VoyageAI",
      "Use the Anthropic embeddings endpoint with the claude embedding model",
      "Embeddings are generated automatically whenever citations are enabled",
      "The Files API returns an embedding vector alongside each uploaded file",
    ],
    correctIndex: 0,
    explanation:
      "Anthropic does not currently offer embedding generation. The course recommends a separate provider such as VoyageAI (e.g., voyage-3-large) with its own API key for producing chunk and query embeddings.",
  },
  {
    id: "d5-115",
    source: "ai-generated",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "Your support agent uses progressive summarization: when context reaches 70% capacity, older turns are summarized while recent ones remain verbatim. Production logs reveal a pattern: customers reference specific amounts ('the 15% discount I mentioned'), but the agent responds with incorrect values. Investigation shows these details were stated 20+ turns ago and got condensed into vague summaries like 'discussed promotional pricing.' What's the most effective fix?",
    options: [
      "Extract transactional facts (amounts, dates, order numbers) into a persistent 'case facts' block included in each prompt, outside the summarized history.",
      "Store full conversation history externally and implement retrieval to search it when the agent detects reference phrases like 'as I mentioned.'",
      "Increase the summarization threshold from 70% to 85% capacity so conversations have more room before summarization triggers.",
      "Revise the summarization prompt to explicitly preserve all numerical values, percentages, dates, and customer-stated expectations verbatim.",
    ],
    correctIndex: 0,
    explanation:
      "Summarization is inherently lossy for precise details. Extracting transactional facts (amounts, dates, order numbers) into a persistent 'case facts' block kept outside the summarized history ensures those critical values remain reliably available in every prompt, regardless of how many turns are summarized. External retrieval depends on detecting reference phrases the agent may miss, raising the threshold only delays the same loss, and even a stricter summarization prompt cannot guarantee verbatim preservation across many turns.",
  },
];
