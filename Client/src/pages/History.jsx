import { useState, useEffect } from 'react';
import axios from 'axios';

export default function History({ onSelectEvaluation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

 

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/history`
      );
      setHistory(res.data);
    } catch (err) {
      setError('Failed to load history');
    }
    setLoading(false);
  };

   useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/history/${id}`
      );
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Delete failed',err);
    }
    setDeletingId(null);
  };

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  const scoreColor = (score) => {
    if (score >= 70) return 'var(--green)';
    if (score >= 40) return 'var(--yellow)';
    return 'var(--red)';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner" />
        <p className="loading-text">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-overlay">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="page-enter">
        <h2 className="page-title">Evaluation History</h2>
        <div className="loading-overlay" style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</p>
          <p className="empty-history">
            No evaluations yet. Go evaluate some LLM responses!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <h2 className="page-title">Evaluation History</h2>
      <p className="page-subtitle">
        Your last {history.length} evaluations:
      </p>

      <div className="history-list">
        {history.map((item) => (
          <div key={item._id}>

            {/* main card */}
            <div
              className="history-card"
              onClick={() => onSelectEvaluation(item)}
            >
              {/* left */}
              <div style={{ flex: 1 }}>
                <p className="history-query">
                  {item.query || 'No query provided'}
                </p>
                <p className="history-date">
                  🕒 {formatDate(item.createdAt)}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '0.875rem',
                  marginTop: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--green)' }}>
                    ✓ {item.breakdown.supported} supported
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--red)' }}>
                    ✕ {item.breakdown.contradicted} contradicted
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--yellow)' }}>
                    ? {item.breakdown.neutral} uncertain
                  </span>
                </div>
              </div>

              {/* right - score + actions */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.5rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p className="history-score"
                    style={{ color: scoreColor(item.credibilityScore) }}>
                    {item.credibilityScore}
                  </p>
                  <p style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {item.riskLevel} Risk
                  </p>
                </div>

                {/* action buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {/* expand response */}
                  <button
                    onClick={(e) => toggleExpand(e, item._id)}
                    style={{
                      background: 'var(--teal-glow)',
                      border: '1px solid rgba(6,182,212,0.2)',
                      color: 'var(--teal-primary)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {expandedId === item._id ? '▲ Hide' : '▼ View'}
                  </button>

                  {/* delete */}
                  <button
                    onClick={(e) => handleDelete(e, item._id)}
                    disabled={deletingId === item._id}
                    style={{
                      background: 'rgba(244,63,94,0.1)',
                      border: '1px solid rgba(244,63,94,0.2)',
                      color: 'var(--red)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      transition: 'var(--transition-fast)',
                      opacity: deletingId === item._id ? 0.5 : 1
                    }}
                  >
                    {deletingId === item._id ? '...' : '🗑 Delete'}
                  </button>
                </div>
              </div>
            </div>

            {/* expanded response */}
            {expandedId === item._id && (
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
                borderTop: 'none',
                borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                padding: '1rem 1.25rem',
                animation: 'fadeIn 0.3s ease'
              }}>
                <p style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.5rem',
                  fontWeight: 600
                }}>
                  Full LLM Response
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7
                }}>
                  {item.llmResponse}
                </p>

                <button
                  onClick={() => onSelectEvaluation(item)}
                  style={{
                    marginTop: '0.875rem',
                    background: 'var(--teal-glow)',
                    border: '1px solid rgba(6,182,212,0.3)',
                    color: 'var(--teal-primary)',
                    padding: '0.4rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  View Full Report →
                </button>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}