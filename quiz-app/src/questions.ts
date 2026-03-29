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
      "The CLAUDE.md file is corrupted and must be regenerated from scratch",
      "User-level CLAUDE.md applies only to that user, not shared via VCS",
      "The file needs to be named claude.md in all lowercase letters to work",
      "Claude Code only reads CLAUDE.md on first launch, not in later sessions",
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
      "Importing npm packages into the Claude Code runtime environment",
      "Referencing external files to keep CLAUDE.md modular and organized",
      "Importing environment variables from .env files into the session",
      "Importing custom tool definitions from a separate configuration file",
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
      "Rules files load faster due to their optimized parsing and caching",
      "Rules with globs apply by file type across all directories at once",
      "Rules files support more formatting options like tables and diagrams",
      "There is no real advantage; rules and CLAUDE.md are fully equivalent",
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
      "There is no difference; both scopes function identically in practice",
      "Project-scoped are shared via version control; user-scoped are personal",
      "User-scoped commands always have higher execution priority than project",
      "Project-scoped commands run faster due to local caching optimizations",
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
      "Runs the skill in an isolated sub-agent to keep main context clean",
      "Splits the skill into multiple parallel execution paths at runtime",
      "Forks the current terminal session into a new background shell tab",
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
      "It speeds up tool execution by pre-loading only the needed tool schemas",
      "It restricts which tools the skill can use, preventing destructive ops",
      "It defines brand new custom tools that become available to the skill",
      "It grants the skill access to all tools without any permission prompts",
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
      "On every Claude Code session start, regardless of which files are open",
      "Only when editing files matching the terraform/**/* glob pattern",
      "When the user types the /terraform slash command in the chat prompt",
      "When the Terraform CLI binary is detected on the system search path",
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
      "For every task without exception, because it is always the safest option",
      "For complex tasks with architectural implications or multi-file changes",
      "Only when fixing bugs that require careful step-by-step root cause work",
      "Never; direct execution is always better and more efficient than plans",
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
      "Exploring the internet for relevant documentation and external examples",
      "Isolating verbose discovery output and returning concise summaries back",
      "Exploring different model configurations to find the optimal parameters",
      "Running exploratory tests against the codebase to detect regressions",
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
      "Write much more detailed and longer prose descriptions of the format",
      "Provide 2-3 concrete input/output examples showing expected results",
      "Increase the temperature parameter to generate more varied attempts",
      "Switch to a larger model that better understands natural language nuance",
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
      "Having Claude interview job candidates by generating technical questions",
      "Having Claude ask questions to surface unanticipated design concerns",
      "A pattern for generating structured interview questions from job posts",
      "A workflow designed to onboard new team members to the existing project",
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
      "The --no-input flag that disables standard input handling completely",
      "The -p (or --print) flag for non-interactive pipeline execution mode",
      "The --ci-mode flag designed specifically for continuous integration use",
      "The --batch flag that enables automated batch processing of all inputs",
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
      "Parse the standard text output with a regex to extract all key fields",
      "Use --output-format json with --json-schema for structured output",
      "Use --format=xml to produce structured XML output for CI pipelines",
      "Redirect stdout to a JSON file and manually parse its raw contents",
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
      "The generating session runs slower due to accumulated conversation state",
      "The generating session retains reasoning context, biasing self-review",
      "The generating session has already used up its total token allocation",
      "There is no measurable benefit to using a different session for review",
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
      "Initializes a new Git repository with default branch and remote",
      "Analyzes the codebase and creates a CLAUDE.md with project summary",
      "Creates a brand new project scaffolding from a predefined template",
      "Initializes the Claude API client with authentication credentials",
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
      "Dev level, Staging level, and Production level for each environment",
      "Project (shared via VCS), Local (personal), and User (global machine)",
      "Public level, Private level, and Protected level for access control",
      "Root level, Package level, and Module level following directory depth",
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
      "They are the same feature with different names in the documentation",
      "Plan handles breadth with more files; Thinking handles deep reasoning",
      "Plan Mode is for project planning; Thinking is for abstract questions",
      "Plan Mode creates documents and specs; Thinking Mode generates code",
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
      "Exit the program, force quit the process, and clear the entire screen",
      "Escape stops response; Double Escape rewinds; Compact summarizes all",
      "Cancel current operation, undo last change, and redo the last change",
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
      "Full read and write by default with no additional setup required",
      "Default is read-only; write needs allowTools config like 'edit'",
      "No default permissions at all; everything must be configured first",
      "Write-only by default; read permissions must be explicitly enabled",
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
      "It monitors repository webhooks manually via a custom webhook server",
      "It installs a GitHub app adding mention support and auto PR review",
      "It requires building a fully custom CI/CD pipeline from the ground up",
      "It only works with GitLab repositories, not with GitHub repositories",
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
      "Just run multiple terminal windows pointing to the same directory",
      "Use Git worktrees for isolated workspaces per instance, then merge",
      "Use Docker containers to isolate each Claude Code instance runtime",
      "It is not possible to parallelize Claude Code across instances today",
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
      "No special permissions are needed if running inside GitHub Actions",
      "Permissions are automatically inherited from the GitHub repo settings",
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
      "Use the @parameters decorator in the command file's YAML frontmatter",
      "Define parameters in the settings.json global configuration section",
      "Add command line flags when executing the command from the terminal",
      "Include the $ARGUMENTS placeholder in the markdown command file text",
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
];
