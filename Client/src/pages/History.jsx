import { useState, useEffect } from 'react';
import axios from 'axios';

export default function History({ onSelectEvaluation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

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

  const scoreColor = (score) => {
    if (score >= 70) return '#4ade80';
    if (score >= 40) return '#facc15';
    return '#f87171';
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
      <div className="loading-overlay">
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
        <p className="empty-history">
          No evaluations yet. Go evaluate some LLM responses!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Evaluation History</h2>
      <p className="page-subtitle">
        Your last {history.length} evaluations
      </p>

      <div className="history-list">
        {history.map((item) => (
          <div
            key={item._id}
            className="history-card"
            onClick={() => onSelectEvaluation(item)}
          >
            {/* left side */}
            <div>
              <p className="history-query">
                {item.query || 'No query provided'}
              </p>
              <p className="history-date">
                🕒 {formatDate(item.createdAt)}
              </p>
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '0.5rem'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#4ade80'
                }}>
                  ✅ {item.breakdown.supported} supported
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#f87171'
                }}>
                  ❌ {item.breakdown.contradicted} contradicted
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#facc15'
                }}>
                  ⚠️ {item.breakdown.neutral} uncertain
                </span>
              </div>
            </div>

            {/* right side - score */}
            <div style={{ textAlign: 'center' }}>
              <p className="history-score"
                style={{ color: scoreColor(item.credibilityScore) }}>
                {item.credibilityScore}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {item.riskLevel} Risk
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}