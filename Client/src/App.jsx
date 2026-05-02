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

  return (
    <div className="app-wrapper">

      {/* navbar */}
      <nav className="navbar">
        <span className="navbar-brand">⚡ CREDSCORE</span>
        <button
          className={`navbar-link ${page === 'home' ? 'active' : ''}`}
          onClick={() => {
            setPage('home');
            setSelectedEvaluation(null);
          }}
        >
          Evaluate
        </button>
        <button
          className={`navbar-link ${page === 'history' ? 'active' : ''}`}
          onClick={() => {
            setPage('history');
            setSelectedEvaluation(null);
          }}
        >
          History
        </button>
      </nav>

      {/* main content */}
      <main className="main-content">
        {page === 'home' && <Home />}

        {page === 'history' && (
          <History onSelectEvaluation={handleSelectEvaluation} />
        )}

        {page === 'detail' && selectedEvaluation && (
          <div>
            <button
              onClick={() => setPage('history')}
              style={{
                color: '#60a5fa',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '1rem',
                fontSize: '0.875rem'
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