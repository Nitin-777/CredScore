import { useState } from 'react';
import Home from './pages/Home';
import History from './pages/History';
import ResultPanel from './components/ResultPanel';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const handleSelectEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setPage('detail');
  };

  const navigate = (newPage) => {
    setPage(newPage);
    setSelectedEvaluation(null);
  };

  return (
    <div className="app-wrapper">

      {/* navbar */}
      <nav className="navbar">
        <span className="navbar-brand">
          ⚡ CREDSCORE
        </span>
        <button
          className={`navbar-link ${page === 'home' ? 'active' : ''}`}
          onClick={() => navigate('home')}
        >
          Evaluate
        </button>
        <button
          className={`navbar-link ${page === 'history' ? 'active' : ''}`}
          onClick={() => navigate('history')}
        >
          History
        </button>

        {/* right side tag */}
        <div style={{ marginLeft: 'auto' }}>
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--teal-primary)',
            background: 'var(--teal-glow)',
            border: '1px solid rgba(6,182,212,0.2)',
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}>
            AI Powered
          </span>
        </div>
      </nav>

      {/* content */}
      <main className="main-content">
        {page === 'home' && <Home />}

        {page === 'history' && (
          <div className="page-enter">
            <History onSelectEvaluation={handleSelectEvaluation} />
          </div>
        )}

        {page === 'detail' && selectedEvaluation && (
          <div className="page-enter">
            <button
              onClick={() => setPage('history')}
              style={{
                color: 'var(--teal-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: 0,
                fontWeight: 500,
                transition: 'var(--transition-fast)'
              }}
            >
              ← Back to History
            </button>
            <ResultPanel result={{
              score: selectedEvaluation.credibilityScore,
              riskLevel: selectedEvaluation.riskLevel,
              breakdown: selectedEvaluation.breakdown,
              claims: selectedEvaluation.claims || []
            }} />
          </div>
        )}
      </main>

    </div>
  );
}