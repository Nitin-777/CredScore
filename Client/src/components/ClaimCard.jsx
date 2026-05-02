import { useState } from 'react';

export default function ClaimCard({ item, index }) {
  const { claim, evidence, verification } = item;
  const [expanded, setExpanded] = useState(false);

  const statusConfig = {
    supported: { icon: '✓', label: 'Supported' },
    contradicted: { icon: '✕', label: 'Contradicted' },
    neutral: { icon: '?', label: 'Uncertain' }
  };

  const status = verification.status || 'neutral';
  const config = statusConfig[status];
  const confidence = (verification.confidence * 100).toFixed(1);

  return (
    <div
      className={`claim-card ${status} fade-in`}
      style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
    >
      {/* header */}
      <div className="claim-header">
        <div className="claim-text-wrapper">
          <span className="claim-icon">{config.icon}</span>
          <p className="claim-text">{claim}</p>
        </div>
        <span className={`status-badge ${status}`}>
          {config.label}
        </span>
      </div>

      {/* confidence bar */}
      <div className="confidence-wrapper">
        <div className="confidence-label">
          <span>Confidence</span>
          <span>{confidence}%</span>
        </div>
        <div className="confidence-bar-bg">
          <div
            className={`confidence-bar-fill ${status}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* all scores pills */}
      {verification.allScores && (
        <div className="all-scores" style={{ marginBottom: '0.875rem' }}>
          <span className="score-pill supported">
            ✓ {(verification.allScores.supported * 100).toFixed(0)}%
          </span>
          <span className="score-pill contradicted">
            ✕ {(verification.allScores.contradicted * 100).toFixed(0)}%
          </span>
          <span className="score-pill neutral">
            ? {(verification.allScores.neutral * 100).toFixed(0)}%
          </span>
        </div>
      )}

      {/* evidence */}
      <div className="evidence-box">
        {evidence ? (
          <>
            <p className="evidence-label">📄 Evidence</p>
            <p className="evidence-text">
              {expanded
                ? evidence
                : evidence.substring(0, 180) + '...'
              }
            </p>
            {evidence.length > 180 && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  color: 'var(--teal-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  marginTop: '0.375rem',
                  padding: 0,
                  fontWeight: 600
                }}
              >
                {expanded ? 'Show less ↑' : 'Show more ↓'}
              </button>
            )}
          </>
        ) : (
          <p className="no-evidence-text">
            No evidence found for this claim
          </p>
        )}
      </div>
    </div>
  );
}