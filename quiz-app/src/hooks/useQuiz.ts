import { useState, useCallback, useMemo } from "react";
import { questions } from "../questions";
import type {
  Domain,
  Question,
  Scenario,
  QuizState,
  QuizHistory,
  ShuffledQuestion,
} from "../types";

const HISTORY_KEY = "claude-cert-history";

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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleQuestionOptions(q: Question): ShuffledQuestion {
  const indices = [0, 1, 2, 3];
  const shuffled = shuffle(indices);
  return {
    ...q,
    shuffledOptions: shuffled.map((i) => q.options[i]) as [string, string, string, string],
    shuffledCorrectIndex: shuffled.indexOf(q.correctIndex),
    shuffleMap: shuffled,
  };
}

export function useQuiz(onAnswer?: (questionId: string, correct: boolean) => void) {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    flagged: new Set(),
    mode: "all",
  });
  const [activeQuestions, setActiveQuestions] = useState<ShuffledQuestion[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [history, setHistory] = useState<QuizHistory[]>(loadHistory);

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
        filtered = shuffle(questions).slice(0, 40);
      } else if (mode === "review") {
        const missed = loadHistory()
          .flatMap((h) =>
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
      const shuffled = (customQuestions ? filtered : shuffle(filtered)).map(shuffleQuestionOptions);
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
      onAnswer?.(currentQuestion.id, correct);
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
    const entry: QuizHistory = {
      date: Date.now(),
      mode: state.mode,
      total: activeQuestions.length,
      correct,
      domainScores,
    };
    const updated = [...history, entry];
    saveHistory(updated);
    setHistory(updated);
    return { correct, total: activeQuestions.length, domainScores };
  }, [isComplete, activeQuestions, state.answers, state.mode, history]);

  const resetQuiz = useCallback(() => {
    setActiveQuestions([]);
    setState({
      currentQuestionIndex: 0,
      answers: {},
      flagged: new Set(),
      mode: "all",
    });
    setShowResult(false);
    setSelectedAnswer(null);
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  return {
    state,
    currentQuestion,
    activeQuestions,
    showResult,
    selectedAnswer,
    history,
    results,
    isComplete,
    startQuiz,
    answerQuestion,
    nextQuestion,
    toggleFlag,
    resetQuiz,
    clearHistory,
  };
}
