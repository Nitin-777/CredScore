import { useState, useEffect } from 'react';
import ClaimCard from './ClaimCard';

export default function ResultPanel({ result }) {
  const { score, riskLevel, breakdown, claims } = result;
  const [animatedScore, setAnimatedScore] = useState(0);

  // animated score counter
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = score / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const scoreColor = score >= 70 ? 'var(--green)'
    : score >= 40 ? 'var(--yellow)'
    : 'var(--red)';

  const riskColor = riskLevel === 'Low' ? 'var(--green)'
    : riskLevel === 'Medium' ? 'var(--yellow)'
    : 'var(--red)';

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="result-container">

      {/* score card */}
      <div className="score-card fade-in">
        <p className="score-title">Credibility Report</p>

        {/* circle */}
        <div className="score-circle-wrapper">
          <div style={{ position: 'relative', width: '160px', height: '160px' }}>
            <svg
              width="160" height="160"
              viewBox="0 0 100 100"
              style={{ transform: 'rotate(-90deg)' }}
            >
              {/* background track */}
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="6"
              />
              {/* glow effect */}
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke={scoreColor}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                opacity="0.2"
                filter="blur(4px)"
                style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
              {/* main arc */}
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke={scoreColor}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            </svg>

            {/* score text */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: scoreColor,
                lineHeight: 1,
                textShadow: `0 0 20px ${scoreColor}40`
              }}>
                {animatedScore}
              </span>
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginTop: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                out of 100
              </span>
            </div>
          </div>
        </div>

        {/* risk level */}
        <p className="risk-text">
          Hallucination Risk:{' '}
          <span style={{ fontWeight: 700, color: riskColor }}>
            {riskLevel}
          </span>
        </p>

        {/* breakdown */}
        <div className="breakdown-grid">
          <div className="breakdown-card supported fade-in fade-in-delay-1">
            <p className="breakdown-number supported">{breakdown.supported}</p>
            <p className="breakdown-label">Supported</p>
          </div>
          <div className="breakdown-card contradicted fade-in fade-in-delay-2">
            <p className="breakdown-number contradicted">{breakdown.contradicted}</p>
            <p className="breakdown-label">Contradicted</p>
          </div>
          <div className="breakdown-card uncertain fade-in fade-in-delay-3">
            <p className="breakdown-number uncertain">{breakdown.neutral}</p>
            <p className="breakdown-label">Uncertain</p>
          </div>
        </div>
      </div>

      {/* claims */}
      <div className="fade-in fade-in-delay-2" style={{ opacity: 0 }}>
        <h3 className="claims-title">
          <span style={{ color: 'var(--teal-primary)' }}>✦</span>
          Claim Analysis
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
            background: 'var(--bg-card)',
            padding: '0.2rem 0.5rem',
            borderRadius: '9999px',
            border: '1px solid var(--border-default)'
          }}>
            {breakdown.total} claims
          </span>
        </h3>
        <div className="claims-list">
          {claims.map((item, i) => (
            <ClaimCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>

    </div>
  );
}