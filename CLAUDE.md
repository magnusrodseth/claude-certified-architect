# CLAUDE.md

## Overview

Interactive quiz app for the Claude Certified Architect: Foundations exam prep. Built with Vite + React + TypeScript.

## Key Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server (http://localhost:5173)
npm run build  # Production build to dist/
npx tsc --noEmit  # Type check
```

## Architecture

- `src/questions.ts`: All quiz questions (153+), each with id, domain, scenario, options, correctIndex, explanation
- `src/hooks/useQuiz.ts`: Quiz state management, option shuffling, session persistence
- `src/hooks/useProgress.ts`: Per-question mastery tracking, study streaks, smart review algorithm
- `src/components/ScoreChart.tsx`: SVG line chart for score trends
- `src/components/DomainRadar.tsx`: SVG radar chart for domain mastery
- `src/App.tsx`: Main app with home dashboard, quiz flow, and results screen
- `src/types.ts`: All TypeScript types and domain/scenario constants
- `docs/notes/`: Comprehensive markdown study notes per domain
- `docs/`: Source PDFs (exam guide, playbook, vocabulary sheet)

## Conventions

- All options for each question should be roughly the same length (within 20% of each other)
- The correct answer must not always be the longest option
- Options are shuffled at runtime; correctIndex refers to the original array position
- Never use em dashes. Use commas, colons, semicolons, or separate sentences.
- localStorage keys: `claude-cert-history`, `claude-cert-session`, `claude-cert-progress`
