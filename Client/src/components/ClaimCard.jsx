export default function ClaimCard({ item }) {
  const { claim, evidence, verification } = item;

  const statusConfig = {
    supported: {
      icon: '✅',
      label: 'Supported'
    },
    contradicted: {
      icon: '❌',
      label: 'Contradicted'
    },
    neutral: {
      icon: '⚠️',
      label: 'Uncertain'
    }
  };

  const config = statusConfig[verification.status] || statusConfig.neutral;
  const status = verification.status || 'neutral';

  return (
    <div className={`claim-card ${status}`}>

      {/* header */}
      <div className="claim-header">
        <div className="claim-text-wrapper">
          <span>{config.icon}</span>
          <p className="claim-text">{claim}</p>
        </div>
        <span className={`status-badge ${status}`}>
          {config.label}
        </span>
      </div>

      {/* confidence bar */}
      <div>
        <div className="confidence-label">
          <span>Confidence</span>
          <span>{(verification.confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="confidence-bar-bg">
          <div
            className={`confidence-bar-fill ${status}`}
            style={{ width: `${(verification.confidence * 100).toFixed(1)}%` }}
          />
        </div>
      </div>

      {/* evidence */}
      <div className="evidence-box">
        {evidence ? (
          <>
            <p className="evidence-label">📄 Evidence Found:</p>
            <p className="evidence-text">
              {evidence.substring(0, 200)}...
            </p>
          </>
        ) : (
          <p className="no-evidence-text">
            ⚠️ No evidence found for this claim
          </p>
        )}
      </div>

    </div>
  );
}