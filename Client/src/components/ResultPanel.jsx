import ClaimCard from './ClaimCard';

export default function ResultPanel({ result }) {
  const { score, riskLevel, breakdown, claims } = result;

  const scoreColor = score >= 70 ? '#4ade80'
    : score >= 40 ? '#facc15'
    : '#f87171';

  const riskColor = riskLevel === 'Low' ? '#4ade80'
    : riskLevel === 'Medium' ? '#facc15'
    : '#f87171';

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="result-container">

      {/* score card */}
      <div className="score-card">
        <h3 className="score-title">Credibility Report</h3>

        {/* circle */}
        <div className="score-circle-wrapper">
          <div style={{ position: 'relative', width: '144px', height: '144px' }}>
            <svg
              width="144" height="144"
              viewBox="0 0 100 100"
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="#374151"
                strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: scoreColor
              }}>
                {score}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                out of 100
              </span>
            </div>
          </div>
        </div>

        {/* risk level */}
        <p className="risk-text">
          Risk Level:{' '}
          <span style={{ fontWeight: 700, color: riskColor }}>
            {riskLevel}
          </span>
        </p>

        {/* breakdown */}
        <div className="breakdown-grid">
          <div className="breakdown-card supported">
            <p className="breakdown-number supported">{breakdown.supported}</p>
            <p className="breakdown-label">Supported</p>
          </div>
          <div className="breakdown-card contradicted">
            <p className="breakdown-number contradicted">{breakdown.contradicted}</p>
            <p className="breakdown-label">Contradicted</p>
          </div>
          <div className="breakdown-card uncertain">
            <p className="breakdown-number uncertain">{breakdown.neutral}</p>
            <p className="breakdown-label">Uncertain</p>
          </div>
        </div>
      </div>

      {/* claims */}
      <div>
        <h3 className="claims-title">
          Claim Analysis ({breakdown.total} claims)
        </h3>
        <div className="claims-list">
          {claims.map((item, i) => (
            <ClaimCard key={i} item={item} />
          ))}
        </div>
      </div>

    </div>
  );
}