function computeCredibilityScore(verifiedClaims) {
  const total = verifiedClaims.length;
  if (total === 0) return { score: 0, breakdown: {}, riskLevel: 'High' };

  const supported = verifiedClaims
    .filter(c => c.verification.status === 'supported').length;
  const contradicted = verifiedClaims
    .filter(c => c.verification.status === 'contradicted').length;
  const neutral = verifiedClaims
    .filter(c => c.verification.status === 'neutral').length;

  const score = 100 * (
    (0.6 * supported / total) -
    (0.3 * contradicted / total) -
    (0.1 * neutral / total)
  );

  const finalScore = Math.max(0, Math.round(score));

  const riskLevel = finalScore >= 70 ? 'Low' 
    : finalScore >= 40 ? 'Medium' 
    : 'High';

  return {
    score: finalScore,
    breakdown: { supported, contradicted, neutral, total },
    riskLevel
  };
}

module.exports = { computeCredibilityScore };

