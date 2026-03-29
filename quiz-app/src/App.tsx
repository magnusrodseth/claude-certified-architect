import { useState } from "react";
import "./App.css";
import { useQuiz } from "./hooks/useQuiz";
import { useProgress } from "./hooks/useProgress";
import { ScoreChart } from "./components/ScoreChart";
import { DomainRadar } from "./components/DomainRadar";
import { DOMAIN_LABELS, DOMAIN_WEIGHTS, SCENARIO_LABELS } from "./types";
import type { Domain, Scenario } from "./types";

function App() {
  const [view, setView] = useState<"home" | "quiz">("home");
  const { stats, recordAnswer, getSmartReviewQuestions, clearProgress } =
    useProgress();

  const {
    currentQuestion,
    activeQuestions,
    showResult,
    selectedAnswer,
    history,
    results,
    isComplete,
    startQuiz: rawStartQuiz,
    answerQuestion,
    nextQuestion,
    toggleFlag,
    resetQuiz: rawResetQuiz,
    clearHistory,
    hasActiveSession,
    state,
  } = useQuiz(recordAnswer);

  const startQuiz = (...args: Parameters<typeof rawStartQuiz>) => {
    rawStartQuiz(...args);
    setView("quiz");
  };

  const resetQuiz = () => {
    rawResetQuiz();
    setView("home");
  };

  const inQuiz = view === "quiz" && activeQuestions.length > 0 && !isComplete;
  const domains = Object.keys(DOMAIN_LABELS) as Domain[];
  const scenarios = Object.keys(SCENARIO_LABELS) as Scenario[];

  // Results screen
  if (isComplete && results) {
    const pct = Math.round((results.correct / results.total) * 100);
    const passed = pct >= 72;
    return (
      <div className="app">
        <header>
          <button className="logo" onClick={() => setView("home")}>ANTHROPIC</button>
          <h1>Quiz Complete</h1>
        </header>
        <main className="results">
          <div className={`score-card ${passed ? "pass" : "fail"}`}>
            <div className="score-big">{pct}%</div>
            <div className="score-detail">
              {results.correct} / {results.total} correct
            </div>
            <div className="score-verdict">
              {passed ? "PASSING" : "BELOW PASSING"} (72% required)
            </div>
          </div>
          <h2>Domain Breakdown</h2>
          <div className="domain-grid">
            {domains.map((d) => {
              const s = results.domainScores[d];
              if (s.total === 0) return null;
              const dp = Math.round((s.correct / s.total) * 100);
              return (
                <div
                  key={d}
                  className={`domain-score ${dp >= 72 ? "pass" : "fail"}`}
                >
                  <div className="domain-name">{DOMAIN_LABELS[d]}</div>
                  <div className="domain-bar-container">
                    <div
                      className="domain-bar"
                      style={{ width: `${dp}%` }}
                    />
                  </div>
                  <div className="domain-pct">
                    {dp}% ({s.correct}/{s.total})
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn primary" onClick={resetQuiz}>
            Back to Home
          </button>
        </main>
      </div>
    );
  }

  // Active quiz screen
  if (inQuiz && currentQuestion) {
    const progress = state.currentQuestionIndex + 1;
    const total = activeQuestions.length;
    const isFlagged = state.flagged.has(currentQuestion.id);
    return (
      <div className="app">
        <header>
          <button className="logo" onClick={() => setView("home")}>ANTHROPIC</button>
          <div className="quiz-meta">
            <span className="progress">
              {progress} / {total}
            </span>
            <span className="domain-tag">
              {DOMAIN_LABELS[currentQuestion.domain]}
            </span>
          </div>
        </header>
        <main className="quiz">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
          {currentQuestion.scenario && (
            <div className="scenario-badge">
              Scenario: {SCENARIO_LABELS[currentQuestion.scenario]}
            </div>
          )}
          <h2 className="question-text">{currentQuestion.question}</h2>
          <div className="options">
            {currentQuestion.shuffledOptions.map((opt, i) => {
              let cls = "option";
              if (showResult) {
                if (i === currentQuestion.shuffledCorrectIndex)
                  cls += " correct";
                else if (i === selectedAnswer) cls += " wrong";
              } else if (i === selectedAnswer) {
                cls += " selected";
              }
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => !showResult && answerQuestion(i)}
                  disabled={showResult}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="option-text">{opt}</span>
                </button>
              );
            })}
          </div>
          {showResult && (
            <div className="explanation">
              <div className="explanation-header">
                {selectedAnswer === currentQuestion.shuffledCorrectIndex
                  ? "Correct!"
                  : "Incorrect"}
              </div>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
          <div className="quiz-actions">
            <button
              className={`btn flag ${isFlagged ? "flagged" : ""}`}
              onClick={toggleFlag}
            >
              {isFlagged ? "Unflag" : "Flag for Review"}
            </button>
            {showResult && (
              <button className="btn primary" onClick={nextQuestion}>
                {progress === total ? "See Results" : "Next Question"}
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Home screen
  return (
    <div className="app">
      <header className="home-header">
        <div className="social-links">
          <a href="https://github.com/magnusrodseth" target="_blank" rel="noopener noreferrer" title="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/magnus-rodseth/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>
        <button className="logo" onClick={() => setView("home")}>ANTHROPIC</button>
        <h1>Claude Certified Architect</h1>
        <p className="subtitle">Foundations Exam Prep</p>
      </header>
      <main className="home">
        {/* Progress Dashboard */}
        <section className="dashboard">
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.streakDays}</div>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.seen}</div>
              <div className="stat-label">Seen</div>
            </div>
            <div className="stat-card">
              <div className="stat-value accent">{stats.mastered}</div>
              <div className="stat-label">Mastered</div>
            </div>
            <div className="stat-card">
              <div className="stat-value warn">{stats.weak}</div>
              <div className="stat-label">Weak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.unseen}</div>
              <div className="stat-label">Unseen</div>
            </div>
          </div>

          <div className="domain-mastery">
            <h3>Domain Mastery</h3>
            {domains.map((d) => {
              const ds = stats.domainStats[d];
              const masteryPct =
                ds.total > 0 ? Math.round((ds.mastered / ds.total) * 100) : 0;
              const seenPct =
                ds.total > 0 ? Math.round((ds.seen / ds.total) * 100) : 0;
              return (
                <div key={d} className="mastery-row">
                  <div className="mastery-label">
                    {DOMAIN_LABELS[d].replace(/^Domain \d: /, "")}
                  </div>
                  <div className="mastery-bar-container">
                    <div
                      className="mastery-bar seen"
                      style={{ width: `${seenPct}%` }}
                    />
                    <div
                      className="mastery-bar mastered"
                      style={{ width: `${masteryPct}%` }}
                    />
                  </div>
                  <div className="mastery-nums">
                    {ds.mastered}/{ds.total}
                  </div>
                </div>
              );
            })}
            {/* Charts */}
            <div className="charts-row">
              <DomainRadar domainStats={stats.domainStats} />
              <ScoreChart history={history} />
            </div>

            <div className="mastery-legend">
              <span className="legend-item">
                <span className="legend-dot mastered" /> Mastered (2+ correct streak)
              </span>
              <span className="legend-item">
                <span className="legend-dot seen" /> Seen
              </span>
            </div>
          </div>
        </section>

        {/* Resume Banner */}
        {hasActiveSession && view === "home" && (
          <section className="resume-banner">
            <div className="resume-content">
              <div className="resume-title">Quiz in Progress</div>
              <div className="resume-detail">
                {state.mode} / Question {state.currentQuestionIndex + 1} of {activeQuestions.length}
                {" "}({Object.keys(state.answers).length} answered)
              </div>
            </div>
            <div className="resume-actions">
              <button className="btn primary" onClick={() => setView("quiz")}>
                Resume
              </button>
              <button className="btn" onClick={resetQuiz}>
                Abandon
              </button>
            </div>
          </section>
        )}

        {/* Study Modes */}
        <section className="mode-section">
          <h2>Study Modes</h2>
          <div className="mode-grid">
            <button
              className="mode-card smart"
              onClick={() => {
                const ordered = getSmartReviewQuestions().slice(0, 30);
                startQuiz("review", undefined, undefined, ordered);
              }}
            >
              <div className="mode-title">Smart Review</div>
              <div className="mode-desc">
                Prioritizes unseen, weak, and stale questions
              </div>
            </button>
            <button className="mode-card" onClick={() => startQuiz("all")}>
              <div className="mode-title">All Questions</div>
              <div className="mode-desc">Full question bank, randomized</div>
            </button>
            <button className="mode-card" onClick={() => startQuiz("exam")}>
              <div className="mode-title">Practice Exam</div>
              <div className="mode-desc">
                40 questions, simulating exam conditions
              </div>
            </button>
            <button className="mode-card" onClick={() => startQuiz("review")}>
              <div className="mode-title">Weak Domains</div>
              <div className="mode-desc">
                Domains where you scored {"<"}70%
              </div>
            </button>
          </div>
        </section>

        <section className="mode-section">
          <h2>By Domain</h2>
          <div className="mode-grid">
            {domains.map((d) => {
              const ds = stats.domainStats[d];
              return (
                <button
                  key={d}
                  className="mode-card domain-card"
                  onClick={() => startQuiz("domain", d)}
                >
                  <div className="mode-title">{DOMAIN_LABELS[d]}</div>
                  <div className="mode-desc">
                    {DOMAIN_WEIGHTS[d]}% of exam
                    {ds.seen > 0 && (
                      <span className="mode-progress">
                        {" "}
                        / {ds.mastered}/{ds.total} mastered
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mode-section">
          <h2>By Scenario</h2>
          <div className="mode-grid">
            {scenarios.map((s) => (
              <button
                key={s}
                className="mode-card scenario-card"
                onClick={() => startQuiz("scenario", undefined, s)}
              >
                <div className="mode-title">{SCENARIO_LABELS[s]}</div>
              </button>
            ))}
          </div>
        </section>

        {history.length > 0 && (
          <section className="mode-section">
            <h2>
              Session History
              <button className="btn-link" onClick={clearHistory}>
                Clear
              </button>
            </h2>
            <div className="history-list">
              {[...history].reverse().slice(0, 10).map((h, i) => {
                const pct = Math.round((h.correct / h.total) * 100);
                return (
                  <div key={i} className="history-item">
                    <span className="history-date">
                      {new Date(h.date).toLocaleDateString()}
                    </span>
                    <span className="history-mode">{h.mode}</span>
                    <span
                      className={`history-score ${pct >= 72 ? "pass" : "fail"}`}
                    >
                      {pct}% ({h.correct}/{h.total})
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="home-footer">
          <button
            className="btn-link danger"
            onClick={() => {
              clearHistory();
              clearProgress();
            }}
          >
            Reset All Progress
          </button>
        </div>

        <section className="exam-info">
          <h2>Exam Details</h2>
          <ul>
            <li>
              All questions are multiple choice (1 correct, 3 distractors)
            </li>
            <li>Scaled score 100-1,000; passing score is 720</li>
            <li>No penalty for guessing</li>
            <li>4 scenarios selected from 6 possible</li>
            <li>
              Scenario-based questions grounded in realistic production contexts
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
