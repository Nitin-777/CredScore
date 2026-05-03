import { useState } from 'react';
import  logo  from "./assets/logo.png"
import axios from 'axios';
import Home from './pages/Home';
import History from './pages/History';
import ResultPanel from './components/ResultPanel';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleSelectEvaluation = async (item) => {
    setLoadingDetail(true);
    setPage('detail');
    try {
      // fetch full evaluation with claims
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/history/${item._id}`
      );
      setSelectedEvaluation(res.data);
    } catch (err) {
      console.error('Failed to fetch evaluation details');
    }
    setLoadingDetail(false);
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
             <img src={ logo } alt=""   alt="CredScore Logo"
             className="w-16 h-15"/> CREDSCORE
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

        {page === 'detail' && (
          <div className="page-enter">
            {/* back button */}
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
                fontWeight: 500
              }}
            >
              ← Back to History
            </button>

            {/* loading */}
            {loadingDetail && (
              <div className="loading-overlay">
                <div className="loading-spinner" />
                <p className="loading-text">Loading report...</p>
              </div>
            )}

            {/* full report */}
            {selectedEvaluation && !loadingDetail && (
              <div>
                {/* query + response box */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '1.25rem'
                }}>
                  {/* query */}
                  {selectedEvaluation.query && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                        marginBottom: '0.375rem'
                      }}>
                        Query
                      </p>
                      <p style={{
                        color: 'var(--teal-primary)',
                        fontSize: '0.95rem',
                        fontWeight: 500
                      }}>
                        {selectedEvaluation.query}
                      </p>
                    </div>
                  )}

                  {/* divider */}
                  {selectedEvaluation.query && (
                    <div style={{
                      height: '1px',
                      background: 'var(--border-default)',
                      marginBottom: '1rem'
                    }} />
                  )}

                  {/* full llm response */}
                  <div>
                    <p style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                      marginBottom: '0.375rem'
                    }}>
                      LLM Response
                    </p>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      lineHeight: 1.7
                    }}>
                      {selectedEvaluation.llmResponse}
                    </p>
                  </div>
                </div>

                {/* result panel */}
                <ResultPanel result={{
                  score: selectedEvaluation.credibilityScore,
                  riskLevel: selectedEvaluation.riskLevel,
                  breakdown: selectedEvaluation.breakdown,
                  claims: selectedEvaluation.claims || []
                }} />
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
}