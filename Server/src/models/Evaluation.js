const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  claim: String,
  evidence: String,
  verification: {
    status: String,
    confidence: Number,
    allScores: {
      supported: Number,
      contradicted: Number,
      neutral: Number
    }
  }
});

const EvaluationSchema = new mongoose.Schema({
  query: String,
  llmResponse: String,
  claims: [ClaimSchema],
  credibilityScore: Number,
  riskLevel: String,
  breakdown: {
    supported: Number,
    contradicted: Number,
    neutral: Number,
    total: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);