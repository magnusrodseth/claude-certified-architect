import type { Question } from "./types";

// Long-form AI-generated practice scenarios. Authored to target the recurring
// failure patterns surfaced in the 2026-05-20 practice exam reflection:
// specific Claude Code feature names, examples-over-schemas, error propagation
// (local recovery vs escalation, access failure vs valid empty), smallest
// viable change, reading premises in the question, and Batch API constraints.

export const longFormQuestions: Question[] = [
  {
    id: "ai-035",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "A literature review subagent processes academic PDFs and occasionally hits three failure modes during a research run: a single PDF whose embedded font table is corrupted, an HTTP 429 from the publisher when fetching the next paper, and a download that exceeds the 50MB size limit configured for this agent. Today every exception is rethrown to the coordinator, which has started spending most of its budget making retry decisions for individual files. What is the most effective architectural change?",
    options: [
      "Add a dedicated retry agent that intercepts every subagent failure from a shared queue and decides whether to retry, skip, or escalate before notifying the coordinator.",
      "Have the subagent attempt local recovery for transient and policy failures (back off on 429, skip the oversized file with a note, mark the corrupted file unparseable) and only escalate failures it cannot resolve, including what it tried.",
      "Configure the subagent to wrap every failure as a success with an error field in the response metadata, letting the coordinator post-filter the results during synthesis.",
      "Have the coordinator validate each PDF (size, host, format header) before dispatch so the subagent never sees files that could cause these failures.",
    ],
    correctIndex: 1,
    explanation:
      "Handle errors at the lowest layer that can resolve them: the subagent knows how to back off a 429, skip an oversized file, or mark a corrupted PDF, and the coordinator only sees what truly needs an architectural decision. A retry agent duplicates context and adds another hop. Wrapping every failure as success hides data-quality issues. Pre-validation cannot anticipate the failure modes that matter (the corrupted font table is invisible until parsing begins).",
  },
  {
    id: "ai-036",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "A web-search subagent runs three queries during a competitive analysis. The first query against the news archive returns six articles. The second query against the patent database returns the response '0 results matched your query.' The third query against an industry-reports vendor returns a TCP timeout after 30 seconds. The coordinator currently treats all three as the same outcome and triggers a full retry whenever any single result looks 'empty.' What is the right way to propagate these outcomes?",
    options: [
      "Treat the timeout and the zero-result response identically: both indicate the subagent lacked data, so both should trigger a retry with a different query.",
      "Treat all three as successes and forward whatever payload arrives, leaving the synthesis agent to decide whether each result represents real data.",
      "Distinguish access failures (timeout) from valid empty results (zero matches): retry or escalate the access failure, but pass the empty result through as a legitimate finding that the patent space did not surface relevant work.",
      "Configure the subagent to suppress empty results entirely so the synthesis agent only ever sees populated payloads, simplifying downstream logic.",
    ],
    correctIndex: 2,
    explanation:
      "A timeout is an access failure: the system never learned what the patent database would have returned, so a retry or escalation is appropriate. A 'zero results' response is a successful query with an informative answer that should flow downstream unchanged, because the absence of patent activity is itself a finding. Collapsing the two categories causes pointless retries and hides legitimate negative results from synthesis.",
  },
  {
    id: "ai-037",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "customer-support",
    question:
      "A benefits assistant handles routine policy questions and escalates sensitive cases (disability, termination, leave fraud) to a human specialist. After a regression, the assistant now escalates almost every question, including a request for the standard PTO accrual rate. The product team likes the apparent safety, but the support queue has tripled in volume and CSAT has dropped because users expected a self-service answer. What change best balances reliability and autonomy?",
    options: [
      "Keep escalating everything because false escalations are safer than answering a sensitive question incorrectly, and accept the queue growth as the cost of safety.",
      "Remove escalation entirely and have the assistant answer every question directly, since the regression shows the current escalation logic is poorly calibrated.",
      "Replace escalation with an apology template that warns the user the answer may be wrong, so the assistant can keep answering without committing to its response.",
      "Use confidence and topic gates: escalate only when the question matches a sensitive topic list or the model's confidence is low, and answer routine policy questions directly.",
    ],
    correctIndex: 3,
    explanation:
      "Good escalation design uses topic sensitivity and confidence as gates so that humans are reserved for cases that genuinely need them. Blanket escalation creates the queue overload the question describes. Removing escalation drops the safety net for the cases that need it. An apology template lets the assistant keep answering without solving the underlying calibration problem.",
  },
  {
    id: "ai-038",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "A coordinator routes user questions about 'the uploaded RFP' to a web-search subagent roughly 30% of the time instead of the document analysis subagent. The two subagents' tool descriptions are clear and unambiguous, and a code review of the coordinator's system prompt shows it gives no guidance on when uploaded files versus web content should be used. What is the smallest change that fixes the routing?",
    options: [
      "Add a pre-routing classifier model in front of the coordinator that labels each question as 'uploaded file' or 'web content' before delegation.",
      "Rebuild the tool surface so the two subagents are merged into a single 'content analysis' subagent that internally decides which source to use.",
      "Update the coordinator's system prompt with a clear rule (questions about uploaded artifacts route to the document analysis subagent; questions about external sources route to web search) plus one example of each.",
      "Lower the temperature of the coordinator so its routing decisions become more deterministic under repeated runs.",
    ],
    correctIndex: 2,
    explanation:
      "The question explicitly states that the tool descriptions are clear, which rules out a tool-surface fix. The missing piece is upstream guidance in the coordinator's system prompt, so a prompt update with a rule and an example is the smallest viable change. A classifier model adds another hop and another failure mode. Merging the subagents discards a working separation of concerns. Temperature affects sampling variance, not the absence of routing instructions.",
  },
  {
    id: "ai-039",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "On the topic 'impact of generative AI on creative industries,' the final report covers only visual arts. Inspecting the trace, you see the coordinator decomposed the topic into three subtasks ('AI in digital painting,' 'AI in graphic design,' 'AI in photography') and that each subagent executed its assigned subtask correctly: the web-search subagent retrieved relevant articles, the document analysis subagent summarized them faithfully, and the synthesis subagent produced a coherent write-up. Where is the root cause?",
    options: [
      "The synthesis subagent lacks instructions to detect topic coverage gaps before writing the final report.",
      "The coordinator's task decomposition is too narrow, restricting the entire downstream pipeline to a visual-arts subset of the requested topic.",
      "The web-search subagent's queries are not exploratory enough and are returning a biased sample of visual-arts sources.",
      "The document analysis subagent is silently filtering out sources that fall outside the visual-arts category it has been seeing most often.",
    ],
    correctIndex: 1,
    explanation:
      "Downstream agents can only operate on what the coordinator hands them. The trace shows each subagent doing its job correctly on the subtasks it received, and those subtasks are entirely about visual arts. The coverage gap is therefore upstream in the decomposition, not in retrieval, filtering, or synthesis. Fixing synthesis or retrieval would leave the same blind spot on the next run.",
  },
  {
    id: "ai-040",
    source: "ai-generated",
    domain: "agentic-architecture",
    scenario: "multi-agent-research",
    question:
      "A synthesis subagent often needs to confirm a small fact while combining findings (a date, a person's title, a percentage). Today, when verification is needed, synthesis returns control to the coordinator, which dispatches the web-search subagent and then re-invokes synthesis with the result. This pattern fires on roughly 85% of synthesis runs for trivial checks and adds 2-3 round trips per task. The remaining 15% are deeper investigations that genuinely need the full search subagent. What is the right intervention?",
    options: [
      "Give the synthesis subagent a scoped verify_fact tool for short factual lookups, and keep the coordinator-mediated path for the 15% of cases that need broader investigation.",
      "Give the synthesis subagent access to every tool the web-search subagent has, so it can decide for itself how to verify any claim without round-tripping.",
      "Have the synthesis subagent collect all verification needs and return them as a batch to the coordinator at the end, which dispatches them together.",
      "Have the web-search subagent prefetch likely follow-up facts during its initial run so the synthesis subagent rarely needs to verify anything.",
    ],
    correctIndex: 0,
    explanation:
      "A narrow verify_fact tool follows the principle of least privilege: it handles the high-volume simple case in one call while leaving the broader search subagent for the rare deeper investigation. Granting full search access erases the separation of concerns the system depends on. Batched verification creates blocking dependencies when one fact informs the next part of the synthesis. Speculative prefetching cannot anticipate which facts will matter to the eventual synthesis.",
  },
  {
    id: "ai-041",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "customer-support",
    question:
      "A support agent has two tools, get_order_status and get_shipment_tracking. The two descriptions are well-written and unambiguous (each names the exact data it returns and the IDs it accepts). Despite this, the model frequently invokes get_shipment_tracking when the user only asks 'where is my order' and the answer is available from get_order_status alone. The system prompt currently says nothing about which tool to prefer. What is the most effective fix?",
    options: [
      "Rewrite both tool descriptions to be more explicit about overlapping cases, even though the team already considers them unambiguous.",
      "Remove get_shipment_tracking from the available tool set so the model has no choice but to use the order-status tool.",
      "Update the system prompt with explicit guidance on tool selection ('prefer get_order_status for status questions; only call get_shipment_tracking when the user asks about carrier-level events'), since the question states the descriptions themselves are not the issue.",
      "Lower temperature so the model becomes more deterministic when choosing between similarly-applicable tools.",
    ],
    correctIndex: 2,
    explanation:
      "The premise rules out a tool-description fix by stating the descriptions are unambiguous, so the upstream cause must be the missing system-prompt guidance on which tool to prefer. Rewriting the descriptions anyway ignores the constraint the question hands you. Removing a tool loses a legitimate capability. Temperature does not address the absence of selection guidance.",
  },
  {
    id: "ai-042",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "code-generation",
    question:
      "A code review assistant inspects pull requests by calling read_file once per changed path, sometimes 25 times in a row, each in its own tool turn. End-to-end latency is now dominated by serial round trips. The descriptions are concise and accurate, and each per-file read is genuinely needed. What is the smallest viable change?",
    options: [
      "Replace read_file with a composite tool that returns a synthesized review of all changed files in a single call, so the model never iterates.",
      "Prompt the model to batch its tool calls in a single turn (parallel tool calls), so the model emits all read_file calls together and the runtime executes them concurrently.",
      "Cache the contents of every file in the repository up front, so read_file always returns instantly and the round trips become cheap.",
      "Lower max_tokens so the model produces shorter intermediate responses between read_file calls.",
    ],
    correctIndex: 1,
    explanation:
      "When a model can determine its full set of tool calls up front, the cheapest fix is to prompt it to batch them into one turn so the runtime can execute them in parallel. A composite tool collapses the model's reasoning step and breaks separation of concerns. Whole-repo caching has a memory and freshness cost out of proportion to the problem. Smaller max_tokens reduces text length but does not change the serial structure of the calls.",
  },
  {
    id: "ai-043",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "developer-productivity",
    question:
      "An MCP server exposes a search_repo tool that takes a path argument. The client advertises a single root pointing at /workspace/projectA. During a session, the model passes path='/workspace/projectB/secret.env' to search_repo. The server returns the file contents normally. What was the correct expectation about how roots should have been enforced here?",
    options: [
      "The MCP SDK automatically rejects any path argument outside an advertised root, so the server code did not need to check; the failure indicates a client misconfiguration.",
      "The MCP protocol enforces roots transport-side via the mcp-session-id header, so the StreamableHTTP layer should have filtered the request before it reached the server.",
      "Roots are an advertisement only; the server itself must validate that any path argument lies within an advertised root (for example with an is_path_allowed check) before honoring the request.",
      "Roots only restrict resource URIs (resources/list), not tool arguments, so this access is outside the scope of roots and requires a separate sandboxing layer.",
    ],
    correctIndex: 2,
    explanation:
      "Roots are an advertisement of intended access scope from the client to the server. The SDK does not auto-enforce them on tool arguments. The server is responsible for checking that paths it acts on lie within an advertised root, typically with an is_path_allowed helper, before responding. Treating roots as automatic enforcement is the mental model that leads to exactly this leak.",
  },
  {
    id: "ai-044",
    source: "ai-generated",
    domain: "tool-design-mcp",
    scenario: "structured-data",
    question:
      "An MCP server needs to expose 'invoice by number' as a resource for thousands of invoices. The current implementation lists every invoice URI in resources/list, which is becoming expensive and now ships a 12MB payload. What is the appropriate way to expose this on MCP?",
    options: [
      "Move invoice lookup from resources to a tool, since resources cannot support per-record retrieval at this scale.",
      "Continue listing every invoice URI but paginate resources/list across multiple responses so each individual payload stays small.",
      "Advertise a templated resource URI (for example invoice://{invoice_number}) and parse the parameter in ReadResourceRequest, so the server does not need to enumerate every invoice in resources/list.",
      "Remove invoice resources entirely and require the client to fetch invoices through the underlying database tool, since resources are intended only for static documents.",
    ],
    correctIndex: 2,
    explanation:
      "MCP supports templated resource URIs precisely for this case: the server advertises invoice://{invoice_number} once and the SDK parses the parameter from ReadResourceRequest when a client requests a specific invoice. This avoids enumerating thousands of URIs in resources/list while keeping the access in the resources interface. Pagination still has to enumerate, moving to a tool loses the resource semantics, and resources are not restricted to static documents.",
  },
  {
    id: "ai-045",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "You are designing a /migration skill that helps users move a service from one framework to another. The skill should accept a path argument (with a help hint for the user), run only on a disposable forked context so its long exploration does not pollute the main session, and be restricted to Read, Grep, and Glob tools so it cannot accidentally mutate files. Which design uses the right Claude Code features?",
    options: [
      "Split the work into three separate skills (one for argument handling, one for context isolation, one for tool restrictions) and chain them from a wrapper command.",
      "Author one SKILL.md whose frontmatter sets argument-hint for the input help text, context: fork for an isolated session, and allowed-tools to restrict the toolset to Read, Grep, and Glob.",
      "Author the skill as a plain command file under .claude/commands/migration.md and rely on the user to manually fork the session and unset the Write tool before running it.",
      "Use a PreToolUse hook on the project to block Write and Edit while the skill is active, and document the argument and forking conventions in the project CLAUDE.md.",
    ],
    correctIndex: 1,
    explanation:
      "Skill frontmatter directly supports the three concerns: argument-hint provides the help text shown for the argument, context: fork runs the skill in an isolated forked session so its noise does not pollute the parent, and allowed-tools restricts the toolset. Splitting into three skills is unnecessary architectural rework. A bare commands/ file does not give you context isolation or tool restriction. A PreToolUse hook works for blocking but does not handle the argument hint or the forked context.",
  },
  {
    id: "ai-046",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "developer-productivity",
    question:
      "Two developers on the same project see different Claude Code behavior. The senior engineer's Claude follows a long set of internal coding conventions that everyone seems to agree on, while a newly onboarded developer's Claude ignores them, even after pulling the latest main and running /init. The conventions live in ~/.claude/CLAUDE.md on the senior engineer's machine. What is the actual cause?",
    options: [
      "There is a merge conflict between the senior engineer's user-level CLAUDE.md and the project-level one, and the new developer is loading only the unresolved project version.",
      "The conventions are in the senior engineer's user-level CLAUDE.md (~/.claude/CLAUDE.md), which is personal and not checked into version control, so the new developer never receives them; move them to .claude/CLAUDE.md to share with the team.",
      "The new developer needs to run /init a second time on the same project to force Claude Code to merge the user-level and project-level CLAUDE.md files.",
      "The new developer's Claude Code installation is missing the @import directive in its global config, which is needed to read the project-level CLAUDE.md.",
    ],
    correctIndex: 1,
    explanation:
      "User-level CLAUDE.md (~/.claude/CLAUDE.md) is personal and never shared via version control, so anything stored there exists only on the original developer's machine. To make conventions team-wide, they must live in the project-level .claude/CLAUDE.md (or root CLAUDE.md). The other options invent mechanisms that do not exist (no merge conflict between user and project scopes, no second /init merge, no @import requirement for the project file).",
  },
  {
    id: "ai-047",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "code-generation",
    question:
      "A developer has a personal /commit slash command in ~/.claude/commands/commit.md that runs their preferred lint-and-commit script. On a new project they joined, /commit now does something completely different: it triggers a structured changelog workflow they did not configure. The project repo contains .claude/commands/commit.md. What is happening?",
    options: [
      "The two files have the same name, so Claude Code refuses to load either and falls back to its internal default /commit behavior.",
      "The personal command is being merged with the project command, producing the combined behavior the developer is observing.",
      "Project-scoped slash commands shadow personal slash commands with the same name, so the project's commit.md is taking precedence on this repo; to keep the personal behavior, the developer must rename one of them.",
      "Personal slash commands always take precedence over project slash commands, but the developer's personal commit.md is in the wrong directory and is silently being ignored.",
    ],
    correctIndex: 2,
    explanation:
      "When a project-scoped command and a personal command share a name, the project version shadows the personal one for that repo. This is intentional so that teams can standardize on a workflow without depending on every contributor's personal config. The other options describe mechanisms that do not exist in Claude Code's precedence model.",
  },
  {
    id: "ai-048",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "developer-productivity",
    question:
      "A project's CLAUDE.md has grown to about 500 lines and now mixes TypeScript style rules, API route conventions, test naming, and frontend component guidelines. The team finds it harder to maintain and Claude sometimes misses topic-specific guidance when working on a single file. Which restructuring uses the intended Claude Code feature?",
    options: [
      "Drop a CLAUDE.md into every subdirectory (src/api, src/components, tests) with the relevant slice of rules, keeping the root CLAUDE.md as a high-level overview only.",
      "Move topic-specific guidance into separate files under .claude/rules/ with glob frontmatter (for example paths: ['src/**/*.ts'] for the TypeScript rules), so each module loads only when the agent is touching matching files.",
      "Split the file into multiple CLAUDE.md siblings (CLAUDE-typescript.md, CLAUDE-api.md, etc.) and rely on Claude Code to auto-discover all of them at session start.",
      "Compress the CLAUDE.md by removing details and instead place the full long-form rules in the project README, since Claude Code now reads README.md as a fallback.",
    ],
    correctIndex: 1,
    explanation:
      ".claude/rules/ is the dedicated location for topic-modular rules with glob frontmatter, so each rule file loads only when the agent is working on matching files. Nested CLAUDE.md files exist but they always load when you are working in that directory, regardless of file type, and they do not solve the per-file targeting problem. CLAUDE-*.md siblings and README fallbacks are not real auto-loaded surfaces.",
  },
  {
    id: "ai-049",
    source: "ai-generated",
    domain: "claude-code-config",
    scenario: "ci-cd",
    question:
      "Your CI pipeline uses a PreToolUse hook configured for the Write matcher that runs a Python script to check whether the target path is on an allowlist. The script writes a message to stderr and exits, but the Write call still goes through. What is the most likely cause?",
    options: [
      "PreToolUse hooks cannot block tool execution; they are observational only, so blocking requires a PostToolUse hook with a rollback step.",
      "The script exits with code 0 (or some non-blocking code) instead of exit code 2; PreToolUse hooks must exit with code 2 to block the tool call.",
      "PreToolUse hooks only fire for Edit operations; Write goes through a separate path that bypasses hooks entirely.",
      "The matcher field is case-sensitive and 'Write' is a reserved name that hooks cannot match; you must use 'write_file' or a glob pattern.",
    ],
    correctIndex: 1,
    explanation:
      "PreToolUse hooks block based on exit code: 0 allows the call to proceed, 2 blocks it. Writing to stderr without returning the right exit code lets the tool through. PreToolUse can block (that is the whole point of the pre variant; PostToolUse is the one that cannot block because the tool already ran). Write is a normal matchable tool name.",
  },
  {
    id: "ai-050",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "You are prompting Claude to transform raw API events into a normalized analytics row. After two iterations of describing the mapping in prose (rename fields, drop nulls, coerce timestamps to ISO, split a composite id), Claude still gets the composite-id split wrong on real inputs. The prose description is accurate; reviewers agree it reads clearly. What is the most effective next change?",
    options: [
      "Move the mapping into a JSON Schema with strict validators, so any malformed output is rejected and Claude must retry until the schema passes.",
      "Add two or three concrete input/output examples that show the exact composite-id split and the surrounding fields, so the mapping is disambiguated by demonstration rather than description.",
      "Set tools=[transform_event] with fine-grained tool calling so the model is forced to emit JSON that matches your schema.",
      "Raise the max_tokens budget so the model has more room to think through edge cases before emitting the row.",
    ],
    correctIndex: 1,
    explanation:
      "When clear prose still produces the wrong mapping, the problem is comprehension, not format validation. A few concrete input-output examples teach the mapping logic in a way that a schema cannot: a schema rejects bad structure but does not show how the composite id should be split. Fine-grained tool calling also targets structure rather than logic, and a larger max_tokens budget does not help the model figure out what you actually want.",
  },
  {
    id: "ai-051",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "code-generation",
    question:
      "A code-comment reviewer agent is currently instructed to ensure comments are 'accurate and up-to-date.' In practice it flags almost nothing because it treats every comment as defensibly accurate. The team wants it to actually catch comments that no longer match the code. Which prompt change does the most?",
    options: [
      "Add a dozen few-shot examples of accurate comments paired with the corresponding code, so the model learns what 'accurate' looks like.",
      "Replace the vague phrase with an explicit criterion: a comment is inaccurate when it states behavior that contradicts what the surrounding code actually does, and the agent must flag any such contradiction.",
      "Run git blame on every changed line and instruct the agent to flag any comment older than 90 days regardless of content.",
      "Lower temperature to 0 so the model becomes stricter when judging whether a comment is acceptable.",
    ],
    correctIndex: 1,
    explanation:
      "'Accurate and up-to-date' is the vague phrasing the question identifies as the failure point. Replacing it with an operational criterion (the comment contradicts the code's actual behavior) gives the model a concrete test it can apply. Few-shot examples of accurate comments do not teach the inaccuracy detection the team wants. Age-based heuristics flag the wrong thing. Temperature affects sampling, not the definition of the task.",
  },
  {
    id: "ai-052",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "structured-data",
    question:
      "You are prompting Claude to extract structured contract metadata from a large set of PDFs. The output fields are stable, but reviewers disagree on what 'high quality' means: some prioritize completeness, others prefer fewer false positives. You can write either Quality Guidelines (what 'good' looks like) or Process Steps (what to do in order). Which fits this task best?",
    options: [
      "Process Steps, because they constrain the model's behavior step by step and remove ambiguity about how each field is produced.",
      "Quality Guidelines, because the disagreement is about the standard the output is judged against, not the sequence of actions, and stating the standard explicitly resolves the ambiguity for both the model and the reviewers.",
      "Neither: switch to a JSON Schema with required fields, which encodes both the structure and an implicit quality bar.",
      "Both at maximum length, since stacking guidance always improves model behavior on extraction tasks.",
    ],
    correctIndex: 1,
    explanation:
      "Quality Guidelines articulate the standard the output is judged against, which is exactly what reviewers are disagreeing about. Process Steps would prescribe the sequence of actions, which is not the source of variance here. A schema does not capture the completeness-vs-precision tradeoff the team is debating. Stacking both at maximum length dilutes signal and is not a real principle.",
  },
  {
    id: "ai-053",
    source: "ai-generated",
    domain: "prompt-engineering",
    scenario: "customer-support",
    question:
      "A customer support agent routes incoming messages to one of three tools (refund_request, shipment_lookup, policy_lookup). It currently uses 14 few-shot examples in the user turn for every request. Latency is dominated by prompt tokens, and the team wants to cut cost. Examples cover routing cases the model rarely gets wrong. What is the better lever?",
    options: [
      "Keep the 14 examples but switch to prompt caching so the example block is only billed once across requests.",
      "Remove the examples for routing cases the model already handles correctly and move the remaining guidance into a short, explicit system prompt rule, since few-shot examples are not always the right lever when the model is already capable.",
      "Replace the examples with a single example chosen at random per request, so the prompt shrinks while still containing demonstration.",
      "Move the examples into an external retrieval store and let the model fetch them via a tool call before answering, eliminating their cost from the main prompt.",
    ],
    correctIndex: 1,
    explanation:
      "Few-shot examples are powerful when the model is uncertain, but they are not free, and removing examples for cases the model already handles is the simplest cost win. A concise system-prompt rule captures the remaining guidance. Caching the unused examples still ships them on the wire and does not address that they are not needed. Random per-request examples are unpredictable. Tool-based retrieval adds a round trip and is overkill for a small routing prompt.",
  },
  {
    id: "ai-054",
    source: "ai-generated",
    domain: "context-management",
    scenario: "ci-cd",
    question:
      "A nightly batch job uses the Anthropic Batch API to score ten thousand log lines for anomaly likelihood. The team wants to add a tool call mid-request so the model can fetch additional context (recent deployments, on-call history) before scoring each line. The lead engineer expects 'a bit more latency' as the main concern. What is the actual blocker?",
    options: [
      "The Batch API has a 24-hour latency ceiling that makes any tool call slower than the model itself, so tool use is not worth adding even though it works.",
      "The Batch API is fire-and-forget: it cannot pause a request to execute a tool call and feed the result back into the same request, so synchronous mid-request tool use is structurally unavailable, not just slow.",
      "The Batch API rejects tool definitions in the request payload and requires an out-of-band registration step that the team has not completed.",
      "Tool use works in the Batch API, but each tool call counts against the same 24-hour SLA, so the team would need to split the run into shorter batches.",
    ],
    correctIndex: 1,
    explanation:
      "Latency is the symptom; the structural constraint is that the Batch API is asynchronous fire-and-forget. There is no way to pause a batch request, execute a tool call, and feed the result back into the same request the way the standard messages API supports. Treating this as a latency problem leads to the wrong fix; the right framing is that synchronous mid-request tool execution is not part of the Batch API's contract.",
  },
  {
    id: "ai-055",
    source: "ai-generated",
    domain: "context-management",
    scenario: "customer-support",
    question:
      "A support bot uses prompt caching on a 30k-token policy preamble. Cache writes cost more than uncached tokens, and cache reads cost less. The bot answers 12 different customer questions in a single session, all sharing the same preamble. Engineering is debating whether caching is actually worth it for this workload. What is the right way to evaluate it?",
    options: [
      "Caching always wins as long as the preamble exceeds the minimum cacheable size; the read discount more than offsets the one-time write premium across the 12 questions.",
      "Caching is only worth it when the same preamble is reused at least 2 times: the write premium is amortized across the reads, so for a 12-question session the savings are substantial; calculate (write_premium) vs (read_discount * reuses) to be sure.",
      "Caching is not worth it for any interactive workload because the 5-minute TTL will expire before the user finishes typing, so every turn pays the write premium again.",
      "Caching should be evaluated by total tokens only; if the preamble plus questions exceeds the model's context window, caching helps, otherwise it has no effect.",
    ],
    correctIndex: 1,
    explanation:
      "Prompt cache economics turn on reuse: the first write costs more than an uncached send, and each subsequent read on the same cached block is significantly cheaper, so caching pays off as soon as a handful of reuses are likely. A 12-question session against the same preamble is exactly the case caching is designed for. The other options either overgeneralize (caching always wins), invent a constraint (TTL nullifies all interactive use), or describe an unrelated property (context window).",
  },
  {
    id: "ai-056",
    source: "ai-generated",
    domain: "context-management",
    scenario: "structured-data",
    question:
      "A research assistant ingests a 90-page report as a PDF document block and produces a summary. Reviewers complain they cannot trace which sentences in the summary came from which page. The team is already using the document content block, so the content is visible to the model. What enables the page-level attribution they want?",
    options: [
      "Add a parallel embedding store of the report and have the model retrieve from it at answer time, so each cited sentence comes back with a chunk id.",
      "Switch from the document block to inline base64 image pages, which makes the model emit page coordinates with every claim.",
      "Pass citations: { enabled: true } on the document content block, which lets the API return cited_text and title fields linking each claim back to the source document so reviewers can verify provenance.",
      "Lower temperature to 0 so the model becomes deterministic about quoting specific sentences from the document.",
    ],
    correctIndex: 2,
    explanation:
      "Citations are an explicit, opt-in feature of the document content block: setting citations: { enabled: true } makes the API return cited_text and title alongside the model's response so callers can render verifiable provenance. A separate embedding store solves a different problem (retrieval at scale) and reintroduces chunking concerns. Switching to base64 pages does not add citation metadata. Temperature changes sampling, not the API's response structure.",
  },
];
