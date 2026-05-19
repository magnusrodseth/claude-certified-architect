# Source Coverage Map: Anthropic Academy Courses vs. Quiz

Built by crawling the Anthropic Academy course platform (anthropic.skilljar.com) and
mapping lesson concepts against the existing quiz questions. Concepts only; no
verbatim course content is reproduced. New questions derived from the gaps are
tagged `source: "ai-generated"` in `src/questions.ts`.

Crawl date: 2026-05-19. 97 lessons captured across 6 priority courses.

## Priority courses crawled (D1/D3-weighted, plus full sweep for completeness)

### Introduction to subagents (D1)
What are subagents? / Creating a subagent / Designing effective subagents / Using subagents effectively

### Introduction to agent skills (D3)
What are skills? / Creating your first skill / Configuration and multi-file skills / Skills vs. other Claude Code features / Sharing skills / Troubleshooting skills

### Claude Code in Action (D3)
What is a coding assistant? / Claude Code in action / Claude Code setup / Project setup / Adding context / Making changes / Controlling context / Custom commands / MCP servers with Claude Code / Github integration / Introducing hooks / Defining hooks / Implementing a hook / Gotchas around hooks / Useful hooks / Another useful hook / The Claude Code SDK / Summary and next steps

### Introduction to Model Context Protocol (D2)
Introducing MCP / MCP clients / Defining tools with MCP / The server inspector / Implementing a client / Defining resources / Accessing resources / Defining prompts / Prompts in the client / MCP review

### Model Context Protocol: Advanced Topics (D2)
Sampling / Sampling walkthrough / Log and progress notifications / Notifications walkthrough / Roots / Roots walkthrough / JSON message types / The STDIO transport / The StreamableHTTP transport / StreamableHTTP in depth / State and the StreamableHTTP transport

### Building with the Claude API (D1/D2/D4/D5)
Models overview / Making a request / Multi-turn / System prompts / Temperature / Response streaming / Structured data / Prompt evaluation (workflow, datasets, running, model/code grading) / Prompt engineering (clear & direct, being specific, XML tags, examples) / Tool use (functions, schemas, message blocks, results, multi-turn, multiple tools, fine-grained, text edit, web search) / RAG (chunking, embeddings, full flow, BM25, multi-index) / Extended thinking / Image support / PDF support / Citations / Prompt caching / Code execution & Files API / MCP (clients, tools, resources, prompts, enhancements) / Agents and workflows (parallelization, chaining, routing, env inspection, workflows vs agents)

## New questions added per domain

| Domain | New Qs | ID range | Driver |
|---|---|---|---|
| D1 Agentic Architecture | 13 | d1-074 .. d1-086 | Under-weighted (27% exam, was 20% of quiz); subagents course |
| D2 Tool Design & MCP | 12 | d2-079 .. d2-090 | MCP roots/notifications/transports depth from MCP Advanced |
| D3 Claude Code Config | 18 | d3-042 .. d3-059 | Thinnest domain (20% exam, was 14%); skills + hooks courses |
| D4 Prompt Engineering | 10 | d4-087 .. d4-096 | Eval harness + API-request fundamentals (was absent) |
| D5 Context Management | 8 | d5-107 .. d5-114 | Image/PDF/Files API/citations enablement (was absent) |
| **Total** | **61** | | quiz 153 -> 214 |

## Concept Coverage Map

(Per-domain tables: concept | source lesson | prior quiz status. ABSENT/THIN
concepts are the ones the 61 new questions target.)

### D1 Agentic Architecture
Targeted ABSENT/THIN concepts grounded in the subagents course: the two inputs a
subagent receives (config system prompt + parent-written task description);
AgentDefinition `description` as the delegation/routing signal; `model: inherit`;
defining an output format as the single biggest subagent improvement; the
report-obstacles-back pattern; least-privilege tool access for a reviewer
subagent; when NOT to use a subagent (expertise-claim subagents, dependent
sequential pipelines, test runners); the isolation tradeoff (lost reasoning
visibility, summary compression); project- vs user-level subagent scope;
built-in subagents (General purpose / Explore / Plan); fresh-eyes code review.

### D2 Tool Design & MCP
Targeted ABSENT/THIN: MCP roots (list_roots, server-side `is_path_allowed`
enforcement, SDK does not auto-enforce); log/progress notifications via the
Context argument; JSON-RPC request-result vs one-way notifications,
bidirectionality; StreamableHTTP `mcp-session-id` header, SSE for
server-initiated messages; `json_response=True` vs `stateless_http=True`;
`stop_reason=tool_use` multi-block content structure; tool schema must be resent
on the tool_result follow-up; fine-grained tool calling disables API-side JSON
validation; templated resource URIs (ReadResourceRequest, SDK param parsing).

### D4 Prompt Engineering
Targeted ABSENT/THIN: clear-and-direct golden rule (instructions not questions,
lead with action verb); being-specific Quality Guidelines vs Process Steps
when-to-use; synthetic eval-dataset generation with a faster model (Haiku);
run_prompt / run_test_case / run_eval harness decomposition; the 5-stage eval
workflow + average-score metric; stateless multi-turn reconstruction (resend
full messages list); core create() params (max_tokens is a safety limit not a
target); `system` optional top-level param (API rejects system=None); mining
highest-scoring eval outputs as few-shot examples; parse-or-fail code graders.

### D5 Context Management & Reliability
Targeted ABSENT/THIN (in-scope only; deep RAG/embeddings kept awareness-level
per exam scope): image input limits (100 imgs / 5MB / base64 or URL); image
prompting methodology; native PDF ingestion via document block
(application/pdf); citations enablement (`citations:{enabled:true}`, title,
cited_text) vs the output format already covered; Files API + code execution
sandbox (file_id, isolated Docker, no network); cache write-vs-read cost
mechanics; multi-index Retriever architecture rationale (lexical catches exact
IDs semantic misses); embedding provider choice (Anthropic has no embeddings;
VoyageAI) as a single awareness question.

## Recommended note additions (gaps in docs/notes/, not just the quiz)

These concepts are exam-relevant but missing from BOTH the quiz and the study
notes; consider adding short subsections:

- `01-agentic-architecture.md`: two-input subagent model + discarded-context
  tradeoff; built-in subagents (General purpose / Explore / Plan); project vs
  user subagent scope.
- `02-tool-design-mcp.md`: MCP roots; log/progress notifications; JSON-RPC
  message categories; `json_response` vs `stateless_http`.
- `03-claude-code-config.md`: skill auto-discovery + priority hierarchy; the
  skills-vs-CLAUDE.md-vs-subagents-vs-hooks-vs-MCP decision boundary; agent SDK
  package identity (`@anthropic-ai/claude-agent-sdk`, not the CLI package).
- `04-prompt-engineering.md`: eval harness mechanics; core API request params.

## Residual imbalance note

After +61, approximate domain shares (of 214): D1 ~20.6%, D2 ~21%, D3 ~18.7%,
D4 ~22.4%, D5 ~17.3%. D1 (27% exam weight) remains under-represented; a future
pass should add more D1 questions specifically (the subagents and agents-vs-
workflows material supports more). D3 is now close to its 20% target.
