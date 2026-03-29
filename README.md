# Claude Certified Architect - Exam Prep

Interactive quiz app for the **Claude Certified Architect: Foundations** certification by Anthropic.

**[Live Demo](https://claude-certified-architect.magnusrodseth.com/)**

## Features

- **153+ scenario-based questions** across all 5 exam domains
- **Randomized option order** to prevent pattern memorization
- **Smart Review mode** with spaced-repetition-lite prioritization
- **Progress tracking** with per-question mastery (localStorage)
- **Domain mastery radar chart** and score trend visualization
- **Session persistence**: resume interrupted quizzes
- **Practice Exam mode**: 40 questions simulating exam conditions
- **Study by domain or scenario**

## Exam Domains

| Domain | Weight |
|--------|--------|
| Agentic Architecture & Orchestration | 27% |
| Tool Design & MCP Integration | 18% |
| Claude Code Configuration & Workflows | 20% |
| Prompt Engineering & Structured Output | 20% |
| Context Management & Reliability | 15% |

## Getting Started

```bash
npm install
npm run dev
```

## Study Notes

Comprehensive markdown study notes are in `docs/notes/`:

- `01-agentic-architecture.md`
- `02-tool-design-mcp.md`
- `03-claude-code-config.md`
- `04-prompt-engineering.md`
- `05-context-management.md`

A compiled PDF study guide is at `docs/claude-certified-architect-study-guide.pdf`.

## Tech Stack

- Vite + React + TypeScript
- Pure CSS (no framework)
- SVG charts (no chart library)
- localStorage for all persistence

## Author

**Magnus Rodseth** - [GitHub](https://github.com/magnusrodseth) / [LinkedIn](https://www.linkedin.com/in/magnus-rodseth/)
