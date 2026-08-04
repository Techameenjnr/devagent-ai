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

  const loadDemo = () => {
    const demo = demoCases[language];

    setCode(demo.code);
    setProblem(demo.problem);
    setAnalyzed(false);
  };

  const analyzeCode = () => {
    if (!code.trim() || !problem.trim()) return;

    setAnalyzing(true);
    setAnalyzed(false);

    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1800);
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
          onClick={() => document.getElementById('analyze')?.scrollIntoView()}
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
                  disabled={analyzing || !code.trim() || !problem.trim()}
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
                    {analyzing ? 'Agent is working...' : 'Awaiting analysis'}
                  </span>
                </div>

                <div className="status-dot">
                  <span />
                  {analyzing ? 'ACTIVE' : 'READY'}
                </div>
              </div>

              {!analyzing && !analyzed && (
                <div className="empty-state">
                  <div className="agent-orb">✦</div>
                  <h3>Ready to investigate.</h3>
                  <p>
                    Give the agent some code and a problem. It will break the
                    issue down step by step.
                  </p>
                </div>
              )}

              {analyzing && (
                <div className="agent-progress">
                  <AgentStep text="Understanding the task" active />
                  <AgentStep text="Inspecting the code" active />
                  <AgentStep text="Identifying root cause" />
                  <AgentStep text="Designing a fix" />
                  <AgentStep text="Generating tests" />
                </div>
              )}

              {analyzed && !analyzing && (
                <div className="analysis-results">
                  <ResultBlock
                    icon="⌁"
                    title="Problem"
                    text="The code contains a logic or runtime issue that prevents the expected operation from completing safely."
                  />

                  <ResultBlock
                    icon="◎"
                    title="Root Cause"
                    text="The input is not being validated correctly before the operation is performed."
                  />

                  <ResultBlock
                    icon="✦"
                    title="Recommended Fix"
                    text="Validate the input and handle the failure case before continuing with the operation."
                  />

                  <div className="result-block">
                    <div className="result-title">
                      <span>▣</span>
                      <strong>Corrected Code</strong>
                      <button
                        onClick={() => navigator.clipboard?.writeText(code)}
                      >
                        Copy
                      </button>
                    </div>

                    <pre>
                      <code>{code}</code>
                    </pre>
                  </div>

                  <ResultBlock
                    icon="✓"
                    title="Tests"
                    text="Test valid input, invalid input, empty input, and the expected failure state."
                  />

                  <ResultBlock
                    icon="?"
                    title="What You Learned"
                    text="Good debugging starts by understanding the data flow and identifying where assumptions about the input can fail."
                  />
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

function ResultBlock({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="result-block">
      <div className="result-title">
        <span>{icon}</span>
        <strong>{title}</strong>
      </div>
      <p>{text}</p>
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
