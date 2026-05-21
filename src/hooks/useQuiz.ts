import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { questions } from "../questions";
import type {
  Domain,
  Question,
  Scenario,
  QuizState,
  QuizHistory,
  ShuffledQuestion,
} from "../types";
import { DOMAIN_WEIGHTS } from "../types";

const HISTORY_KEY = "claude-cert-history";
const SESSION_KEY = "claude-cert-session";

interface SerializedSession {
  state: Omit<QuizState, "flagged"> & { flagged: string[] };
  activeQuestions: ShuffledQuestion[];
}

function loadHistory(): QuizHistory[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(history: QuizHistory[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadSession(): { state: QuizState; activeQuestions: ShuffledQuestion[] } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: SerializedSession = JSON.parse(raw);
    if (!parsed.activeQuestions?.length) return null;
    return {
      state: { ...parsed.state, flagged: new Set(parsed.state.flagged) },
      activeQuestions: parsed.activeQuestions,
    };
  } catch {
    return null;
  }
}

function saveSession(state: QuizState, activeQuestions: ShuffledQuestion[]) {
  if (activeQuestions.length === 0) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  const serialized: SerializedSession = {
    state: { ...state, flagged: [...state.flagged] },
    activeQuestions,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(serialized));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const WEIGHTED_DOMAINS: Domain[] = [
  "agentic-architecture",
  "tool-design-mcp",
  "claude-code-config",
  "prompt-engineering",
  "context-management",
];

// 60 questions transcribed from the official Anthropic Developer Certification
// Practice Exam, grouped by its four scenarios (15 per scenario).
const ANTHROPIC_CERT_PRACTICE_IDS: ReadonlySet<string> = new Set([
  // Code Generation with Claude Code
  "d3-060", "d3-061", "d3-062", "d3-063", "d3-064",
  "d3-065", "d3-066", "d3-067", "d3-068", "d3-069",
  "d3-070", "d3-071", "d3-072", "d3-073", "d3-074",
  // Multi-Agent Research System
  "d1-087", "d1-088", "d1-089", "d1-090", "d1-091",
  "d1-092", "d1-093", "d1-094", "d1-095", "d1-096",
  "d1-097", "d1-098", "d1-099", "d1-100", "d1-101",
  // Customer Support Resolution Agent
  "d5-115", "d2-091", "d2-092", "d1-102", "d1-103",
  "d2-093", "d1-104", "d1-105", "d2-094", "d1-106",
  "d2-095", "d1-107", "d1-108", "d2-096", "d1-109",
  // Claude Code for Continuous Integration
  "d3-075", "d3-076", "d3-077", "d1-110", "d3-078",
  "d4-097", "d3-079", "d3-080", "d4-098", "d3-081",
  "d3-082", "d4-099", "d3-083", "d3-084", "d3-085",
]);

/**
 * Draw `total` questions from `pool`, with each domain's share proportional to
 * its official exam weight (DOMAIN_WEIGHTS). Largest-remainder rounding makes
 * the per-domain counts sum exactly to `total`. If a domain has fewer questions
 * than its target, the shortfall is backfilled from the rest of the pool so the
 * exam still has `total` questions. This is what enforces exam-correct
 * weighting; the raw per-domain counts in the pool do not need to match.
 */
function weightedSample(pool: Question[], total: number): Question[] {
  const exact = WEIGHTED_DOMAINS.map((d) => ({
    d,
    value: (total * DOMAIN_WEIGHTS[d]) / 100,
  }));
  const target: Record<Domain, number> = {} as Record<Domain, number>;
  let assigned = 0;
  for (const e of exact) {
    target[e.d] = Math.floor(e.value);
    assigned += target[e.d];
  }
  const byRemainder = [...exact].sort(
    (a, b) => (b.value % 1) - (a.value % 1)
  );
  for (let i = 0; assigned < total; i++, assigned++) {
    target[byRemainder[i % byRemainder.length].d] += 1;
  }
  const picked: Question[] = [];
  const leftovers: Question[] = [];
  for (const d of WEIGHTED_DOMAINS) {
    const inDomain = shuffle(pool.filter((q) => q.domain === d));
    picked.push(...inDomain.slice(0, target[d]));
    leftovers.push(...inDomain.slice(target[d]));
  }
  if (picked.length < total) {
    picked.push(...shuffle(leftovers).slice(0, total - picked.length));
  }
  return shuffle(picked);
}

function shuffleQuestionOptions(q: Question): ShuffledQuestion {
  const indices = [0, 1, 2, 3];
  const shuffled = shuffle(indices);
  return {
    ...q,
    shuffledOptions: shuffled.map((i) => q.options[i]) as [
      string,
      string,
      string,
      string,
    ],
    shuffledCorrectIndex: shuffled.indexOf(q.correctIndex),
    shuffleMap: shuffled,
  };
}

const defaultState: QuizState = {
  currentQuestionIndex: 0,
  answers: {},
  flagged: new Set(),
  mode: "all",
};

export function useQuiz(
  onAnswer?: (questionId: string, correct: boolean, question: Question) => void
) {
  const saved = loadSession();

  const [state, setState] = useState<QuizState>(saved?.state ?? defaultState);
  const [activeQuestions, setActiveQuestions] = useState<ShuffledQuestion[]>(
    saved?.activeQuestions ?? []
  );
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [history, setHistory] = useState<QuizHistory[]>(loadHistory);

  // Persist session on every state/question change
  useEffect(() => {
    saveSession(state, activeQuestions);
  }, [state, activeQuestions]);

  const startQuiz = useCallback(
    (
      mode: QuizState["mode"],
      domain?: Domain,
      scenario?: Scenario,
      customQuestions?: Question[]
    ) => {
      let filtered: Question[];
      if (customQuestions) {
        filtered = customQuestions;
      } else if (mode === "domain" && domain) {
        filtered = questions.filter((q) => q.domain === domain);
      } else if (mode === "scenario" && scenario) {
        filtered = questions.filter((q) => q.scenario === scenario);
      } else if (mode === "exam") {
        // Exam simulator: official exam-guide questions only, drawn in
        // proportion to the real exam's domain weights.
        const official = questions.filter((q) => q.source !== "ai-generated");
        filtered = weightedSample(official, 40);
      } else if (mode === "weighted-practice") {
        // Longer exam-realistic drill from the full pool (official +
        // AI-generated), still domain-weighted.
        filtered = weightedSample(questions, 60);
      } else if (mode === "anthropic-cert-practice") {
        // Fixed 60-question set transcribed from the official Anthropic
        // Developer Certification Practice Exam. Order is preserved from the
        // source (15 per scenario, four scenarios).
        const byId = new Map(questions.map((q) => [q.id, q]));
        filtered = [...ANTHROPIC_CERT_PRACTICE_IDS]
          .map((id) => byId.get(id))
          .filter((q): q is Question => q !== undefined);
      } else if (mode === "review") {
        const missed = loadHistory().flatMap((h) =>
          Object.entries(h.domainScores)
            .filter(([, v]) => v.total > 0 && v.correct / v.total < 0.7)
            .map(([d]) => d as Domain)
        );
        const weakDomains = [...new Set(missed)];
        filtered =
          weakDomains.length > 0
            ? questions.filter((q) => weakDomains.includes(q.domain))
            : questions;
      } else {
        filtered = [...questions];
      }
      // Preserve order for caller-supplied questions and for the fixed
      // Anthropic cert practice set (grouped by scenario); otherwise shuffle.
      const preserveOrder =
        Boolean(customQuestions) || mode === "anthropic-cert-practice";
      const shuffled = (preserveOrder ? filtered : shuffle(filtered)).map(
        shuffleQuestionOptions
      );
      setActiveQuestions(shuffled);
      setState({
        currentQuestionIndex: 0,
        answers: {},
        flagged: new Set(),
        mode,
        selectedDomain: domain,
        selectedScenario: scenario,
        startedAt: Date.now(),
      });
      setShowResult(false);
      setSelectedAnswer(null);
    },
    []
  );

  const currentQuestion = activeQuestions[state.currentQuestionIndex];

  const answerQuestion = useCallback(
    (index: number) => {
      if (!currentQuestion) return;
      setSelectedAnswer(index);
      setShowResult(true);
      setState((s) => ({
        ...s,
        answers: { ...s.answers, [currentQuestion.id]: index },
      }));
      const correct = index === currentQuestion.shuffledCorrectIndex;
      onAnswer?.(currentQuestion.id, correct, currentQuestion);
    },
    [currentQuestion, onAnswer]
  );

  const nextQuestion = useCallback(() => {
    setShowResult(false);
    setSelectedAnswer(null);
    setState((s) => ({
      ...s,
      currentQuestionIndex: s.currentQuestionIndex + 1,
    }));
  }, []);

  const toggleFlag = useCallback(() => {
    if (!currentQuestion) return;
    setState((s) => {
      const f = new Set(s.flagged);
      if (f.has(currentQuestion.id)) f.delete(currentQuestion.id);
      else f.add(currentQuestion.id);
      return { ...s, flagged: f };
    });
  }, [currentQuestion]);

  const isComplete =
    activeQuestions.length > 0 &&
    state.currentQuestionIndex >= activeQuestions.length;

  // Pure computation only. No side effects here: a useMemo must not call
  // setState / write localStorage during render.
  const results = useMemo(() => {
    if (!isComplete) return null;
    let correct = 0;
    const domainScores: Record<Domain, { total: number; correct: number }> = {
      "agentic-architecture": { total: 0, correct: 0 },
      "tool-design-mcp": { total: 0, correct: 0 },
      "claude-code-config": { total: 0, correct: 0 },
      "prompt-engineering": { total: 0, correct: 0 },
      "context-management": { total: 0, correct: 0 },
    };
    for (const q of activeQuestions) {
      domainScores[q.domain].total++;
      if (state.answers[q.id] === q.shuffledCorrectIndex) {
        correct++;
        domainScores[q.domain].correct++;
      }
    }
    return { correct, total: activeQuestions.length, domainScores };
  }, [isComplete, activeQuestions, state.answers]);

  // Record the completed quiz exactly once, after render, as a side effect.
  const recordedRef = useRef(false);
  useEffect(() => {
    if (!isComplete) {
      // Quiz reset / new quiz: re-arm for the next completion.
      recordedRef.current = false;
      return;
    }
    if (!results || recordedRef.current) return;
    recordedRef.current = true;
    const completedAt = Date.now();
    setState((s) =>
      s.completedAt ? s : { ...s, completedAt }
    );
    const entry: QuizHistory = {
      date: completedAt,
      mode: state.mode,
      total: results.total,
      correct: results.correct,
      domainScores: results.domainScores,
    };
    setHistory((h) => {
      const updated = [...h, entry];
      saveHistory(updated);
      return updated;
    });
    clearSession();
  }, [isComplete, results, state.mode]);

  const resetQuiz = useCallback(() => {
    setActiveQuestions([]);
    setState(defaultState);
    setShowResult(false);
    setSelectedAnswer(null);
    clearSession();
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  const hasActiveSession = activeQuestions.length > 0 && !isComplete;

  return {
    state,
    currentQuestion,
    activeQuestions,
    showResult,
    selectedAnswer,
    history,
    results,
    isComplete,
    hasActiveSession,
    startQuiz,
    answerQuestion,
    nextQuestion,
    toggleFlag,
    resetQuiz,
    clearHistory,
  };
}
