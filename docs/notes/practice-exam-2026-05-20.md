# Practice Exam Reflection — 2026-05-20

**Final score:** 45 / 60 (744 on 100–1000 scale). Pass threshold 720.

## Scenario breakdown

| Scenario | Score | % |
|---|---|---|
| Code Generation with Claude Code | 10/15 | 67% |
| Multi-Agent Research System | 12/15 | 80% |
| Customer Support Resolution Agent | 12/15 | 80% |
| Claude Code for Continuous Integration | 11/15 | 73% |

## Weakest area: Code Generation with Claude Code (5 missed)

This is the area to focus on. The misses cluster around two patterns:

### Pattern 1: Not recognizing specific Claude Code feature names

| Question | I picked | Correct | The feature I missed |
|---|---|---|---|
| `/migration` skill design | A (split skills) | B | `argument-hint` frontmatter + `context: fork` + `allowed-tools` |
| CLAUDE.md not loading for new dev | C (conflicts) | A | User-level `~/.claude/CLAUDE.md` vs project-level `.claude/CLAUDE.md` |
| Personal `/commit` override | B (same name) | A | Project skills shadow personal skills with the same name |
| 500-line CLAUDE.md organization | D (nested CLAUDE.md) | C | `.claude/rules/` directory holds topic-specific modules |

**Why I failed:** I kept inventing plausible-sounding solutions (overrides, nested files, splitting skills) when the answer was a specific Claude Code feature I either didn't know or didn't reach for. The fix isn't more reasoning, it's memorizing the actual configuration surface: skill frontmatter keys (`argument-hint`, `context: fork`, `allowed-tools`, `model`), the precedence rules between project and user scope, and the existence of `.claude/rules/` as a sibling to `.claude/skills/`.

### Pattern 2: Reaching for schemas/validation when examples are enough

| Question | I picked | Correct | The lesson |
|---|---|---|---|
| API transform output wrong after 2 iterations | C (JSON schema + validation) | A | Just provide 2–3 input/output examples |

**Why I failed:** I treated this as a verification problem when it was a comprehension problem. A schema validates structure but doesn't teach the mapping logic. Concrete examples disambiguate prose; I should default to that lever before introducing tooling.

## Other recurring failure modes across scenarios

### Confusing failure categories (Multi-Agent + CI/CD)

- Treated a timeout and a valid "0 results" response as the same kind of failure (d1-099). They aren't: one is an access failure that needs a retry decision, the other is a successful query with an informative empty result.
- Wanted the document analysis subagent to escalate every PDF parsing error to the coordinator (d1-088). Better: handle transient/local failures in the subagent, only propagate what it actually can't resolve.

**Why I failed:** I kept defaulting to "escalate everything to the orchestrator." That's safe but creates exactly the coordinator-overload pattern the questions are testing against. Handle errors at the lowest layer that can resolve them.

### Picking the wrong lever for tool/round-trip problems (Customer Support + Multi-Agent)

- Multi-match disambiguation (d1-106): I picked tool-side ranking when the answer was asking the customer.
- Round-trips (d1-107): I picked composite tools when the answer was prompting Claude to batch tool calls in one turn.
- Synthesis verification (d1-097): I picked broad tool access when the answer was a scoped `verify_fact` tool.

**Why I failed:** I kept reshaping the tool surface when the cheaper fix was a prompt change or one extra conversational turn. Principle of least privilege + smallest viable change beats architectural rework.

### Missing root-cause signals in the prompt (Customer Support + CI/CD)

- Keyword-triggered tool selection (d2-096): the question said "descriptions are well-written and unambiguous", so the cause had to be upstream system-prompt instructions, not the tool descriptions. I picked a tool-description fix anyway.
- Comment accuracy review (d4-099): the existing instruction was the vague "accurate and up-to-date". The fix was an explicit criterion (contradiction with code behavior), not few-shot examples or git blame.

**Why I failed:** I skipped the constraint the question handed me. If a stated premise rules out a category of answers, I need to actually use that premise instead of grabbing the most familiar-looking option.

### Batch API tool calling (d3-080)

Picked the 24-hour latency answer. The real blocker is structural: the batch API is fire-and-forget, so there's no way to execute a tool mid-request and feed results back. Latency is a symptom, not the constraint. Worth re-reading the Batches API section to internalize what it can and can't do alongside tool use.

## What to study before the real exam

1. **Claude Code configuration surface.** Memorize: skill frontmatter (`argument-hint`, `context: fork`, `allowed-tools`, `model`), project vs user precedence, `.claude/rules/` vs `.claude/skills/` vs `.claude/commands/` vs `CLAUDE.md`, slash-command file locations.
2. **Default to examples over schemas** when the model's interpretation diverges from yours.
3. **Error propagation defaults**: local recovery first, escalate only what can't be resolved, distinguish access failures from valid-but-empty results.
4. **Smallest-viable-change reflex** for tool/round-trip problems: prompt changes and scoped helper tools before tool-surface rewrites.
5. **Read the premise.** If the question says "the descriptions are unambiguous," the answer is not "fix the descriptions."
6. **Batch API**: synchronous mid-request tool execution is the hard constraint, not latency.
