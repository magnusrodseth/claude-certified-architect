import "./App.css";
import { useQuiz } from "./hooks/useQuiz";
import { DOMAIN_LABELS, DOMAIN_WEIGHTS, SCENARIO_LABELS } from "./types";
import type { Domain, Scenario } from "./types";

function App() {
  const {
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
    state,
  } = useQuiz();

  const inQuiz = activeQuestions.length > 0 && !isComplete;
  const domains = Object.keys(DOMAIN_LABELS) as Domain[];
  const scenarios = Object.keys(SCENARIO_LABELS) as Scenario[];

  if (isComplete && results) {
    const pct = Math.round((results.correct / results.total) * 100);
    const passed = pct >= 72;
    return (
      <div className="app">
        <header>
          <div className="logo">ANTHROPIC</div>
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

  if (inQuiz && currentQuestion) {
    const progress = state.currentQuestionIndex + 1;
    const total = activeQuestions.length;
    const isFlagged = state.flagged.has(currentQuestion.id);
    return (
      <div className="app">
        <header>
          <div className="logo">ANTHROPIC</div>
          <div className="quiz-meta">
            <span className="progress">
              {progress} / {total}
            </span>
            <span className="domain-tag">{DOMAIN_LABELS[currentQuestion.domain]}</span>
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
                if (i === currentQuestion.shuffledCorrectIndex) cls += " correct";
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

  return (
    <div className="app">
      <header className="home-header">
        <div className="logo">ANTHROPIC</div>
        <h1>Claude Certified Architect</h1>
        <p className="subtitle">Foundations Exam Prep</p>
      </header>
      <main className="home">
        <section className="mode-section">
          <h2>Study Modes</h2>
          <div className="mode-grid">
            <button className="mode-card" onClick={() => startQuiz("all")}>
              <div className="mode-title">All Questions</div>
              <div className="mode-desc">
                Full question bank, randomized
              </div>
            </button>
            <button className="mode-card" onClick={() => startQuiz("exam")}>
              <div className="mode-title">Practice Exam</div>
              <div className="mode-desc">
                40 questions, simulating exam conditions
              </div>
            </button>
            <button className="mode-card" onClick={() => startQuiz("review")}>
              <div className="mode-title">Weak Areas Review</div>
              <div className="mode-desc">
                Focus on domains where you scored {"<"}70%
              </div>
            </button>
          </div>
        </section>

        <section className="mode-section">
          <h2>By Domain</h2>
          <div className="mode-grid">
            {domains.map((d) => (
              <button
                key={d}
                className="mode-card domain-card"
                onClick={() => startQuiz("domain", d)}
              >
                <div className="mode-title">{DOMAIN_LABELS[d]}</div>
                <div className="mode-desc">{DOMAIN_WEIGHTS[d]}% of exam</div>
              </button>
            ))}
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
              History
              <button className="btn-link" onClick={clearHistory}>
                Clear
              </button>
            </h2>
            <div className="history-list">
              {[...history].reverse().map((h, i) => {
                const pct = Math.round((h.correct / h.total) * 100);
                return (
                  <div key={i} className="history-item">
                    <span className="history-date">
                      {new Date(h.date).toLocaleDateString()}
                    </span>
                    <span className="history-mode">{h.mode}</span>
                    <span className={`history-score ${pct >= 72 ? "pass" : "fail"}`}>
                      {pct}% ({h.correct}/{h.total})
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="exam-info">
          <h2>Exam Details</h2>
          <ul>
            <li>All questions are multiple choice (1 correct, 3 distractors)</li>
            <li>Scaled score 100-1,000; passing score is 720</li>
            <li>No penalty for guessing</li>
            <li>4 scenarios selected from 6 possible</li>
            <li>Scenario-based questions grounded in realistic production contexts</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
