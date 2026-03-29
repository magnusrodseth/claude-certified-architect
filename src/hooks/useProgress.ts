import { useState, useCallback, useMemo } from "react";
import { questions } from "../questions";
import type { Domain, UserProgress, QuestionRecord } from "../types";
import { DOMAIN_LABELS } from "../types";

const PROGRESS_KEY = "claude-cert-progress";

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { questionRecords: {}, studyDays: [] };
    return JSON.parse(raw);
  } catch {
    return { questionRecords: {}, studyDays: [] };
  }
}

function saveProgress(p: UserProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  const recordAnswer = useCallback(
    (questionId: string, correct: boolean) => {
      setProgress((prev) => {
        const records = { ...prev.questionRecords };
        const existing: QuestionRecord = records[questionId] ?? {
          attempts: [],
          streak: 0,
        };
        const newAttempts = [
          ...existing.attempts,
          { correct, date: Date.now() },
        ];
        const newStreak = correct ? existing.streak + 1 : 0;
        records[questionId] = {
          attempts: newAttempts,
          streak: newStreak,
        };

        const today = todayISO();
        const days = prev.studyDays.includes(today)
          ? prev.studyDays
          : [...prev.studyDays, today];

        const next: UserProgress = {
          questionRecords: records,
          studyDays: days,
        };
        saveProgress(next);
        return next;
      });
    },
    []
  );

  const stats = useMemo(() => {
    const records = progress.questionRecords;
    const totalQuestions = questions.length;

    let seen = 0;
    let mastered = 0;
    let weak = 0;

    const domainStats: Record<
      Domain,
      { total: number; seen: number; mastered: number; weak: number }
    > = {
      "agentic-architecture": { total: 0, seen: 0, mastered: 0, weak: 0 },
      "tool-design-mcp": { total: 0, seen: 0, mastered: 0, weak: 0 },
      "claude-code-config": { total: 0, seen: 0, mastered: 0, weak: 0 },
      "prompt-engineering": { total: 0, seen: 0, mastered: 0, weak: 0 },
      "context-management": { total: 0, seen: 0, mastered: 0, weak: 0 },
    };

    for (const q of questions) {
      domainStats[q.domain].total++;
      const rec = records[q.id];
      if (rec && rec.attempts.length > 0) {
        seen++;
        domainStats[q.domain].seen++;
        if (rec.streak >= 2) {
          mastered++;
          domainStats[q.domain].mastered++;
        }
        const lastAttempt = rec.attempts[rec.attempts.length - 1];
        if (!lastAttempt.correct) {
          weak++;
          domainStats[q.domain].weak++;
        }
      }
    }

    // Study streak (consecutive days)
    const sortedDays = [...progress.studyDays].sort().reverse();
    let streakDays = 0;
    const today = todayISO();
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    if (sortedDays[0] === today || sortedDays[0] === yesterday) {
      streakDays = 1;
      for (let i = 1; i < sortedDays.length; i++) {
        const prev = new Date(sortedDays[i - 1]);
        const curr = new Date(sortedDays[i]);
        const diff = prev.getTime() - curr.getTime();
        if (diff <= 86400000 * 1.5) {
          streakDays++;
        } else {
          break;
        }
      }
    }

    return {
      totalQuestions,
      seen,
      unseen: totalQuestions - seen,
      mastered,
      weak,
      streakDays,
      totalStudyDays: progress.studyDays.length,
      domainStats,
    };
  }, [progress]);

  // Smart review: prioritize unseen, then weak, then least recently seen
  const getSmartReviewQuestions = useCallback(() => {
    const records = progress.questionRecords;
    type Scored = { question: (typeof questions)[number]; priority: number };

    const scored: Scored[] = questions.map((q) => {
      const rec = records[q.id];
      if (!rec || rec.attempts.length === 0) {
        return { question: q, priority: 100 }; // never seen
      }
      const lastAttempt = rec.attempts[rec.attempts.length - 1];
      if (!lastAttempt.correct) {
        return { question: q, priority: 80 }; // got wrong last time
      }
      if (rec.streak < 2) {
        return { question: q, priority: 60 }; // not yet mastered
      }
      // Mastered: lower priority, but older = higher priority (spaced repetition)
      const daysSince =
        (Date.now() - lastAttempt.date) / (1000 * 60 * 60 * 24);
      return { question: q, priority: Math.min(daysSince * 2, 50) };
    });

    scored.sort((a, b) => b.priority - a.priority);
    return scored.map((s) => s.question);
  }, [progress]);

  const clearProgress = useCallback(() => {
    localStorage.removeItem(PROGRESS_KEY);
    setProgress({ questionRecords: {}, studyDays: [] });
  }, []);

  return {
    progress,
    stats,
    recordAnswer,
    getSmartReviewQuestions,
    clearProgress,
    domainLabels: DOMAIN_LABELS,
  };
}
