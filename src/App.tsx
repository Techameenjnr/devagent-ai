import { useState } from 'react';
import './App.css';

type Language = 'JavaScript' | 'TypeScript' | 'Python';

const demoCases = {
  JavaScript: {
    code: `function getUser(id) {
  const user = users.find(user => user.id = id);
  return user.name;
}`,
    problem: 'The function crashes when I try to find a user.',
  },
  TypeScript: {
    code: `interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Ahmad",
  age: "16"
};`,
    problem: 'TypeScript says there is a type error in my user object.',
  },
  Python: {
    code: `def calculate_average(numbers):
    total = sum(numbers)
    return total / len(numbers)

print(calculate_average([]))`,
    problem:
      'My program crashes when I calculate the average of an empty list.',
  },
};

function App() {
  const [language, setLanguage] = useState<Language>('JavaScript');
  const [code, setCode] = useState('');
  const [problem, setProblem] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  // NEW: stores the real Gemini response
  const [aiAnalysis, setAiAnalysis] = useState('');

  // NEW: stores API errors
  const [error, setError] = useState('');

  const loadDemo = () => {
    const demo = demoCases[language];

    setCode(demo.code);
    setProblem(demo.problem);
    setAnalyzed(false);
    setAiAnalysis('');
    setError('');
  };

  const analyzeCode = async () => {
    if (!code.trim() || !problem.trim()) return;

    setAnalyzing(true);
    setAnalyzed(false);
    setAiAnalysis('');
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          problem,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      if (!data.analysis) {
        throw new Error('Gemini returned an empty analysis.');
      }

      console.log('REAL GEMINI ANALYSIS:', data.analysis);

      // Store Gemini's actual response
      setAiAnalysis(data.analysis);
      setAnalyzed(true);
    } catch (error) {
      console.error('DevAgent analysis failed:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while analyzing the code.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <span>DevAgent</span>
        </div>

        <div className="nav-links">
          <a href="#analyze">Analyze</a>
          <a href="#how-it-works">How it works</a>
        </div>

        <button
          className="nav-button"
          onClick={() =>
            document.getElementById('analyze')?.scrollIntoView()
          }
        >
          Try DevAgent
        </button>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-badge">
            <span className="pulse" />
            AI SOFTWARE ENGINEERING AGENT
          </div>

          <h1>
            Debug smarter.
            <br />
            <span>Understand your code.</span>
          </h1>

          <p>
            DevAgent analyzes your code, finds likely root causes, generates
            fixes, and explains what went wrong.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() =>
                document.getElementById('analyze')?.scrollIntoView()
              }
            >
              Analyze Code <span>→</span>
            </button>

            <button className="secondary-button" onClick={loadDemo}>
              Load Demo
            </button>
          </div>

          <div className="hero-grid">
            <span>01 / UNDERSTAND</span>
            <span>02 / ANALYZE</span>
            <span>03 / FIX</span>
            <span>04 / VERIFY</span>
          </div>
        </section>

        <section className="workspace" id="analyze">
          <div className="section-heading">
            <div>
              <div className="eyebrow">THE AGENT WORKSPACE</div>
              <h2>Give DevAgent a problem.</h2>
            </div>

            <p>Paste your code and describe what's going wrong.</p>
          </div>

          <div className="workspace-grid">
            <div className="panel code-panel">
              <div className="panel-header">
                <div>
                  <span className="panel-label">YOUR CODE</span>
                  <span className="panel-subtitle">Source input</span>
                </div>

                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value as Language);
                    setAnalyzed(false);
                    setAiAnalysis('');
                    setError('');
                  }}
                >
                  <option>JavaScript</option>
                  <option>TypeScript</option>
                  <option>Python</option>
                </select>
              </div>

              <textarea
                className="code-editor"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setAnalyzed(false);
                  setAiAnalysis('');
                  setError('');
                }}
                placeholder="// Paste your code here..."
                spellCheck={false}
              />

              <div className="problem-area">
                <label>WHAT'S WRONG?</label>

                <textarea
                  value={problem}
                  onChange={(e) => {
                    setProblem(e.target.value);
                    setAnalyzed(false);
                    setAiAnalysis('');
                    setError('');
                  }}
                  placeholder="Describe the error or behavior you're experiencing..."
                />
              </div>

              <div className="button-row">
                <button className="demo-button" onClick={loadDemo}>
                  Load Demo
                </button>

                <button
                  className="analyze-button"
                  onClick={analyzeCode}
                  disabled={
                    analyzing || !code.trim() || !problem.trim()
                  }
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Code →'}
                </button>
              </div>
            </div>

            <div className="panel analysis-panel">
              <div className="panel-header">
                <div>
                  <span className="panel-label">AGENT ANALYSIS</span>

                  <span className="panel-subtitle">
                    {analyzing
                      ? 'Gemini agent is working...'
                      : analyzed
                        ? 'Analysis complete'
                        : 'Awaiting analysis'}
                  </span>
                </div>

                <div className="status-dot">
                  <span />
                  {analyzing
                    ? 'ACTIVE'
                    : analyzed
                      ? 'DONE'
                      : 'READY'}
                </div>
              </div>

              {/* EMPTY STATE */}
              {!analyzing && !analyzed && !error && (
                <div className="empty-state">
                  <div className="agent-orb">✦</div>

                  <h3>Ready to investigate.</h3>

                  <p>
                    Give the agent some code and a problem. It will break the
                    issue down step by step.
                  </p>
                </div>
              )}

              {/* LOADING STATE */}
              {analyzing && (
                <div className="agent-progress">
                  <AgentStep text="Understanding the task" active />
                  <AgentStep text="Inspecting the code" active />
                  <AgentStep text="Identifying root cause" active />
                  <AgentStep text="Designing a fix" active />
                  <AgentStep text="Generating tests" active />
                </div>
              )}

              {/* ERROR STATE */}
              {!analyzing && error && (
                <div className="analysis-results">
                  <div className="result-block">
                    <div className="result-title">
                      <span>⚠</span>
                      <strong>Analysis Error</strong>
                    </div>

                    <p>{error}</p>

                    <p>
                      Check that the Gemini API is configured correctly and
                      try again.
                    </p>
                  </div>
                </div>
              )}

              {/* REAL GEMINI RESULT */}
              {analyzed && !analyzing && aiAnalysis && (
                <div className="analysis-results">
                  <div className="result-block">
                    <div className="result-title">
                      <span>✦</span>
                      <strong>Gemini AI Analysis</strong>

                      <button
                        onClick={() =>
                          navigator.clipboard?.writeText(aiAnalysis)
                        }
                      >
                        Copy
                      </button>
                    </div>

                    <div
                      style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.7',
                        marginTop: '14px',
                      }}
                    >
                      {aiAnalysis}
                    </div>
                  </div>

                  <div className="result-block">
                    <div className="result-title">
                      <span>✓</span>
                      <strong>Analysis Complete</strong>
                    </div>

                    <p>
                      DevAgent analyzed your {language} code using Gemini
                      and generated the debugging report above.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="eyebrow">HOW IT WORKS</div>

          <h2>From bug to understanding.</h2>

          <div className="steps">
            <Step
              number="01"
              title="Describe"
              text="Paste your code and explain the problem."
            />

            <Step
              number="02"
              title="Investigate"
              text="The agent breaks down the problem and inspects the code."
            />

            <Step
              number="03"
              title="Resolve"
              text="Get a proposed fix, tests, and a clear explanation."
            />
          </div>
        </section>
      </main>

      <footer>
        <div className="brand">
          <div className="brand-icon">✦</div>
          <span>DevAgent</span>
        </div>

        <span>AI-assisted software engineering.</span>
        <span>Built for the hackathon.</span>
      </footer>
    </div>
  );
}

function AgentStep({
  text,
  active = false,
}: {
  text: string;
  active?: boolean;
}) {
  return (
    <div className={`agent-step ${active ? 'active' : ''}`}>
      <div className="step-indicator">{active ? '✓' : '○'}</div>
      <span>{text}</span>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="step-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default App;