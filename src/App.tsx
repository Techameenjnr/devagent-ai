import { useState, type ReactNode } from 'react';
import './App.css';

type Language = 'JavaScript' | 'TypeScript' | 'Python';

const demoCases: Record<
  Language,
  {
    code: string;
    problem: string;
  }
> = {
  JavaScript: {
    code: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

function getUser(id) {
  const user = users.find(user => user.id = id);
  return user.name;
}`,
    problem:
      'The function crashes when I try to find a user that does not exist.',
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
    problem:
      'TypeScript says there is a type error in my user object.',
  },

  Python: {
    code: `def calculate_average(numbers):
    total = sum(numbers)
    return total / len(numbers)

scores = []
average = calculate_average(scores)
print(average)`,
    problem:
      'My program crashes when I calculate the average of an empty list.',
  },
};

function App() {
  const [language, setLanguage] =
    useState<Language>('JavaScript');

  const [code, setCode] = useState('');
  const [problem, setProblem] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState('');
  const [error, setError] = useState('');

  const [copied, setCopied] = useState(false);

  const loadDemo = () => {
    const demo = demoCases[language];

    setCode(demo.code);
    setProblem(demo.problem);

    setAnalyzed(false);
    setAiAnalysis('');
    setError('');
    setCopied(false);
  };

  const resetAnalysis = () => {
    setAnalyzed(false);
    setAiAnalysis('');
    setError('');
    setCopied(false);
  };

  const analyzeCode = async () => {
    if (!code.trim() || !problem.trim()) {
      return;
    }

    setAnalyzing(true);
    setAnalyzed(false);
    setAiAnalysis('');
    setError('');
    setCopied(false);

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

      const rawResponse = await response.text();

      let data: {
        analysis?: string;
        error?: string;
      };

      try {
        data = JSON.parse(rawResponse);
      } catch {
        throw new Error(
          'The server returned an invalid response. Check the API route and Gemini configuration.'
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || 'Analysis failed.'
        );
      }

      if (!data.analysis) {
        throw new Error(
          'Gemini returned an empty analysis.'
        );
      }

      console.log(
        'REAL GEMINI ANALYSIS:',
        data.analysis
      );

      setAiAnalysis(data.analysis);
      setAnalyzed(true);
    } catch (err) {
      console.error(
        'DevAgent analysis failed:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while analyzing the code.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const copyAnalysis = async () => {
    if (!aiAnalysis) {
      return;
    }

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          aiAnalysis
        );
      } else {
        const textArea =
          document.createElement('textarea');

        textArea.value = aiAnalysis;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        document.execCommand('copy');

        document.body.removeChild(textArea);
      }

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);

      setError(
        'Unable to copy the analysis. Please select and copy it manually.'
      );
    }
  };

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">
        <div className="brand">

          <div className="brand-icon">
            <span>⌁</span>
          </div>

          <div className="brand-text">
            <strong>DevAgent</strong>

            <small>
              AI DEBUGGING SYSTEM
            </small>
          </div>

        </div>

        <div className="nav-links">
          <a href="#analyze">
            Analyze
          </a>

          <a href="#how-it-works">
            How it works
          </a>
        </div>

        <button
          className="nav-button"
          onClick={() =>
            document
              .getElementById('analyze')
              ?.scrollIntoView({
                behavior: 'smooth',
              })
          }
        >
          Launch Agent
        </button>
      </nav>

      <main>

        {/* HERO */}

        <section className="hero">

          <div className="hero-grid-bg" />

          <div className="hero-badge">
            <span className="pulse" />

            DEVAGENT ONLINE // AI SOFTWARE SECURITY
          </div>

          <div className="terminal-label">
            <span>
              &gt; SYSTEM STATUS:
            </span>

            <strong>
              OPERATIONAL
            </strong>
          </div>

          <h1>
            Debug smarter.
            <br />

            <span>
              Think like the machine.
            </span>
          </h1>

          <p>
            DevAgent investigates your code,
            identifies root causes, proposes fixes,
            generates tests, and explains the problem
            in beginner-friendly language.
          </p>

          <div className="hero-actions">

            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById('analyze')
                  ?.scrollIntoView({
                    behavior: 'smooth',
                  })
              }
            >
              Start Analysis

              <span>
                →
              </span>
            </button>

            <button
              className="secondary-button"
              onClick={loadDemo}
            >
              Load Demo
            </button>

          </div>

          <div className="hero-grid">
            <span>[01] INPUT</span>
            <span>[02] SCAN</span>
            <span>[03] DIAGNOSE</span>
            <span>[04] RESOLVE</span>
          </div>

        </section>

        {/* WORKSPACE */}

        <section
          className="workspace"
          id="analyze"
        >

          <div className="section-heading">

            <div>

              <div className="eyebrow">
                // AGENT WORKSPACE
              </div>

              <h2>
                Give DevAgent a problem.
              </h2>

            </div>

            <p>
              Paste your code and describe
              what's going wrong.
            </p>

          </div>

          <div className="workspace-grid">

            {/* CODE INPUT */}

            <div className="panel code-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-label">
                    SOURCE_INPUT
                  </span>

                  <span className="panel-subtitle">
                    Developer code
                  </span>

                </div>

                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(
                      e.target.value as Language
                    );

                    resetAnalysis();
                  }}
                >
                  <option value="JavaScript">
                    JavaScript
                  </option>

                  <option value="TypeScript">
                    TypeScript
                  </option>

                  <option value="Python">
                    Python
                  </option>
                </select>

              </div>

              <div className="editor-toolbar">

                <span className="editor-dots">
                  <i />
                  <i />
                  <i />
                </span>

                <span>
                  {language.toLowerCase()}://input
                </span>

                <span>
                  READ / WRITE
                </span>

              </div>

              <div className="code-wrapper">

                <div className="line-numbers">

                  {code
                    ? code
                        .split('\n')
                        .map((_, index) => (
                          <span key={index}>
                            {String(
                              index + 1
                            ).padStart(2, '0')}
                          </span>
                        ))
                    : Array.from({
                        length: 8,
                      }).map((_, index) => (
                        <span key={index}>
                          {String(
                            index + 1
                          ).padStart(2, '0')}
                        </span>
                      ))}

                </div>

                <textarea
                  className="code-editor"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    resetAnalysis();
                  }}
                  placeholder="// Paste your code here..."
                  spellCheck={false}
                />

              </div>

              <div className="problem-area">

                <label>
                  &gt; DESCRIBE_THE_PROBLEM
                </label>

                <textarea
                  value={problem}
                  onChange={(e) => {
                    setProblem(e.target.value);
                    resetAnalysis();
                  }}
                  placeholder="Describe the error or behavior you're experiencing..."
                />

              </div>

              <div className="button-row">

                <button
                  className="demo-button"
                  onClick={loadDemo}
                >
                  LOAD DEMO
                </button>

                <button
                  className="analyze-button"
                  onClick={analyzeCode}
                  disabled={
                    analyzing ||
                    !code.trim() ||
                    !problem.trim()
                  }
                >
                  {analyzing
                    ? 'SCANNING SYSTEM...'
                    : 'RUN ANALYSIS →'}
                </button>

              </div>

            </div>

            {/* ANALYSIS */}

            <div className="panel analysis-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-label">
                    AGENT_ANALYSIS
                  </span>

                  <span className="panel-subtitle">
                    {analyzing
                      ? 'Gemini agent is investigating...'
                      : analyzed
                        ? 'Investigation complete'
                        : 'Awaiting input'}
                  </span>

                </div>

                <div className="status-dot">

                  <span />

                  {analyzing
                    ? 'SCANNING'
                    : analyzed
                      ? 'COMPLETE'
                      : 'READY'}

                </div>

              </div>

              {/* EMPTY STATE */}

              {!analyzing &&
                !analyzed &&
                !error && (

                  <div className="empty-state">

                    <div className="terminal-orb">
                      <span>⌁</span>
                    </div>

                    <div className="scan-line">
                      SYSTEM READY
                    </div>

                    <h3>
                      Awaiting investigation target.
                    </h3>

                    <p>
                      Provide source code and a
                      problem. DevAgent will investigate
                      the issue and explain the solution
                      step by step.
                    </p>

                    <div className="empty-command">
                      <span>&gt;</span>{' '}
                      agent.await_input()

                      <span className="cursor">
                        _
                      </span>
                    </div>

                  </div>

                )}

              {/* LOADING */}

              {analyzing && (

                <div className="agent-progress">

                  <div className="scan-header">

                    <span>
                      LIVE ANALYSIS
                    </span>

                    <span className="blink">
                      ●
                    </span>

                  </div>

                  <AgentStep
                    text="Understanding the developer's problem"
                    active
                  />

                  <AgentStep
                    text="Inspecting source code"
                    active
                  />

                  <AgentStep
                    text="Identifying root cause"
                    active
                  />

                  <AgentStep
                    text="Designing recommended fix"
                    active
                  />

                  <AgentStep
                    text="Generating verification tests"
                    active
                  />

                </div>

              )}

              {/* ERROR */}

              {!analyzing && error && (

                <div className="analysis-results">

                  <div className="security-alert">

                    <div className="alert-header">

                      <span>
                        ⚠
                      </span>

                      ANALYSIS_FAILURE

                    </div>

                    <p>
                      {error}
                    </p>

                    <div className="alert-help">
                      Check your Gemini API configuration,
                      environment variables, and
                      deployment logs.
                    </div>

                  </div>

                </div>

              )}

              {/* GEMINI RESULT */}

              {analyzed &&
                !analyzing &&
                aiAnalysis && (

                  <div className="analysis-results">

                    <div className="analysis-terminal-header">

                      <div className="terminal-window-dots">

                        <span className="terminal-dot red" />
                        <span className="terminal-dot yellow" />
                        <span className="terminal-dot green" />

                      </div>

                      <span>
                        DEVAGENT // GEMINI_ANALYSIS
                      </span>

                      <button
                        className={`copy-button ${
                          copied
                            ? 'copied'
                            : ''
                        }`}
                        onClick={copyAnalysis}
                      >
                        {copied
                          ? '✓ COPIED'
                          : 'COPY REPORT'}
                      </button>

                    </div>

                    <div className="analysis-meta">

                      <span>
                        TARGET:{' '}
                        {language.toUpperCase()}
                      </span>

                      <span>
                        ENGINE: GEMINI
                      </span>

                      <span>
                        STATUS: COMPLETE
                      </span>

                    </div>

                    <div className="ai-response">
                      {formatAnalysis(
                        aiAnalysis
                      )}
                    </div>

                    <div className="analysis-footer">

                      <span>
                        ✓ ANALYSIS COMPLETE
                      </span>

                      <span>
                        DEVAGENT / AI ENGINE
                      </span>

                    </div>

                  </div>

                )}

            </div>

          </div>

        </section>

        {/* HOW IT WORKS */}

        <section
          className="how-section"
          id="how-it-works"
        >

          <div className="eyebrow">
            // SYSTEM PIPELINE
          </div>

          <h2>
            From bug to understanding.
          </h2>

          <div className="steps">

            <Step
              number="01"
              title="Describe"
              text="Paste your code and explain the problem."
            />

            <Step
              number="02"
              title="Investigate"
              text="The AI agent inspects the code and identifies the likely root cause."
            />

            <Step
              number="03"
              title="Resolve"
              text="Get a beginner-friendly fix, tests, and an explanation of what you learned."
            />

          </div>

        </section>

      </main>

      <footer>

        <div className="brand">

          <div className="brand-icon">
            <span>⌁</span>
          </div>

          <div className="brand-text">

            <strong>
              DevAgent
            </strong>

            <small>
              AI DEBUGGING SYSTEM
            </small>

          </div>

        </div>

        <span>
          AI-assisted software engineering.
        </span>

        <span>
          Built for the hackathon.
        </span>

      </footer>

    </div>
  );
}


/* =========================================
   AGENT STEP
   ========================================= */

function AgentStep({
  text,
  active = false,
}: {
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`agent-step ${
        active ? 'active' : ''
      }`}
    >

      <div className="step-indicator">
        {active ? '✓' : '○'}
      </div>

      <span>
        {text}
      </span>

      {active && (
        <span className="step-status">
          OK
        </span>
      )}

    </div>
  );
}


/* =========================================
   HOW IT WORKS CARD
   ========================================= */

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

      <span className="step-number">
        [{number}]
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

      <div className="step-command">
        &gt; execute()
      </div>

    </div>
  );
}


/* =========================================
   GEMINI RESPONSE FORMATTER
   ========================================= */

function formatAnalysis(text: string) {
  const lines = text.split('\n');

  const elements: ReactNode[] = [];

  let codeBuffer: string[] = [];
  let insideCode = false;
  let codeLanguage = '';

  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    /* CODE BLOCK */

    if (trimmed.startsWith('```')) {

      if (insideCode) {

        elements.push(
          <div
            className="terminal-code-block"
            key={key++}
          >

            <div className="code-block-header">

              <span className="terminal-window-dots">

                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />

              </span>

              <span className="code-language">
                {codeLanguage || 'CODE'}
              </span>

              <span className="code-status">
                CODE_BLOCK
              </span>

            </div>

            <pre>
              <code>
                {codeBuffer.join('\n')}
              </code>
            </pre>

          </div>
        );

        codeBuffer = [];
        codeLanguage = '';
        insideCode = false;

      } else {

        insideCode = true;

        codeLanguage = trimmed
          .replace(/^```/, '')
          .trim()
          .toUpperCase();

      }

      continue;
    }

    if (insideCode) {
      codeBuffer.push(line);
      continue;
    }

    /* EMPTY LINE */

    if (!trimmed) {

      elements.push(
        <div
          className="ai-spacer"
          key={key++}
        />
      );

      continue;
    }

    /* HEADINGS */

    const headingMatch =
      trimmed.match(
        /^(?:#{1,6}\s*|\d+\.\s+)(.+)$/
      );

    if (
      headingMatch &&
      !trimmed.startsWith('- ') &&
      !trimmed.startsWith('* ')
    ) {

      const title =
        headingMatch[1]
          .replace(/\*\*/g, '')
          .replace(/`/g, '');

      elements.push(
        <div
          className="ai-section"
          key={key++}
        >

          <div className="ai-section-title">

            <span className="section-marker">
              //
            </span>

            <h3>
              {title}
            </h3>

            <span className="section-line" />

          </div>

        </div>
      );

      continue;
    }

    /* BULLETS */

    if (
      trimmed.startsWith('- ') ||
      trimmed.startsWith('* ')
    ) {

      elements.push(
        <div
          className="ai-bullet"
          key={key++}
        >

          <span className="bullet-marker">
            &gt;
          </span>

          <span>
            {cleanMarkdown(
              trimmed.substring(2)
            )}
          </span>

        </div>
      );

      continue;
    }

    /* NORMAL TEXT */

    elements.push(
      <p
        className="ai-paragraph"
        key={key++}
      >
        {cleanMarkdown(trimmed)}
      </p>
    );
  }

  return elements;
}


/* =========================================
   SIMPLE MARKDOWN CLEANER
   ========================================= */

function cleanMarkdown(text: string) {
  return text
    .replace(
      /\*\*(.*?)\*\*/g,
      '$1'
    )
    .replace(
      /__(.*?)__/g,
      '$1'
    )
    .replace(
      /`(.*?)`/g,
      '$1'
    );
}


export default App;