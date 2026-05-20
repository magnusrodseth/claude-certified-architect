import type { UserProgress, QuizHistory, QuestionRecord } from "../types";

const PROGRESS_KEY = "claude-cert-progress";
const HISTORY_KEY = "claude-cert-history";
const SCHEMA = "claude-cert-architect-progress";
const VERSION = 1;

export interface ExportBundle {
  $schema: typeof SCHEMA;
  version: number;
  exportedAt: number;
  progress: UserProgress;
  history: QuizHistory[];
}

export type ImportMode = "merge" | "replace";

function readProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through
  }
  return { questionRecords: {}, studyDays: [] };
}

function readHistory(): QuizHistory[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through
  }
  return [];
}

export function buildExportBundle(): ExportBundle {
  return {
    $schema: SCHEMA,
    version: VERSION,
    exportedAt: Date.now(),
    progress: readProgress(),
    history: readHistory(),
  };
}

export function exportToFile(): void {
  const bundle = buildExportBundle();
  const json = JSON.stringify(bundle, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date(bundle.exportedAt).toISOString().slice(0, 10);
  a.href = url;
  a.download = `claude-cert-progress-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseBundle(text: string): ExportBundle {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("File is not valid JSON.");
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("File contents are not an object.");
  }
  const obj = parsed as Record<string, unknown>;
  if (obj.$schema !== SCHEMA) {
    throw new Error("This file is not a Claude Certified Architect export.");
  }
  if (typeof obj.version !== "number" || obj.version > VERSION) {
    throw new Error(`Unsupported export version: ${String(obj.version)}.`);
  }
  if (!obj.progress || typeof obj.progress !== "object") {
    throw new Error("File is missing the progress section.");
  }
  if (!Array.isArray(obj.history)) {
    throw new Error("File is missing the history section.");
  }
  return obj as unknown as ExportBundle;
}

function mergeProgress(a: UserProgress, b: UserProgress): UserProgress {
  const records: Record<string, QuestionRecord> = { ...a.questionRecords };
  for (const [id, incoming] of Object.entries(b.questionRecords)) {
    const existing = records[id];
    if (!existing) {
      records[id] = incoming;
      continue;
    }
    const byDate = new Map<number, { correct: boolean; date: number }>();
    for (const att of existing.attempts) byDate.set(att.date, att);
    for (const att of incoming.attempts) byDate.set(att.date, att);
    const merged = Array.from(byDate.values()).sort((x, y) => x.date - y.date);
    let streak = 0;
    for (let i = merged.length - 1; i >= 0; i--) {
      if (merged[i].correct) streak++;
      else break;
    }
    records[id] = { attempts: merged, streak };
  }
  const days = Array.from(new Set([...a.studyDays, ...b.studyDays])).sort();
  return { questionRecords: records, studyDays: days };
}

function mergeHistory(a: QuizHistory[], b: QuizHistory[]): QuizHistory[] {
  const seen = new Set<string>();
  const out: QuizHistory[] = [];
  for (const entry of [...a, ...b]) {
    const key = `${entry.date}|${entry.mode}|${entry.total}|${entry.correct}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
  }
  return out.sort((x, y) => x.date - y.date);
}

export interface ImportSummary {
  mode: ImportMode;
  totalQuestionsTracked: number;
  totalHistoryEntries: number;
  totalStudyDays: number;
}

export function applyImport(
  bundle: ExportBundle,
  mode: ImportMode,
): ImportSummary {
  let nextProgress: UserProgress;
  let nextHistory: QuizHistory[];

  if (mode === "replace") {
    nextProgress = bundle.progress;
    nextHistory = bundle.history;
  } else {
    nextProgress = mergeProgress(readProgress(), bundle.progress);
    nextHistory = mergeHistory(readHistory(), bundle.history);
  }

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(nextProgress));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));

  return {
    mode,
    totalQuestionsTracked: Object.keys(nextProgress.questionRecords).length,
    totalHistoryEntries: nextHistory.length,
    totalStudyDays: nextProgress.studyDays.length,
  };
}

export async function readFileText(file: File): Promise<string> {
  return await file.text();
}
