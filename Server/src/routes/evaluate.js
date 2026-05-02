const express = require('express');
const router = express.Router();
const { extractClaims } = require('../modules/claimExtraction');
const { retrieveEvidence } = require('../modules/evidenceRetrieval');
const { verifyClaim } = require('../modules/claimVerification');
const { computeCredibilityScore } = require('../modules/scoring');
const Evaluation = require('../models/Evaluation');

router.post('/', async (req, res) => {
  try {
    const { query, llmResponse } = req.body;

    if (!llmResponse || llmResponse.trim().length === 0) {
      return res.status(400).json({ error: 'LLM response is required' });
    }

    console.log('\n--- New Evaluation Started ---');
    console.log(`Query: ${query}`);

    // step 1 - extract claims
    console.log('\nStep 1: Extracting claims...');
    const claims = extractClaims(llmResponse);
    console.log(`Found ${claims.length} claims`);

    // step 2 - for each claim retrieve evidence and verify
    console.log('\nStep 2: Retrieving evidence and verifying claims...');
    const verifiedClaims = [];

    for (const claim of claims) {
      console.log(`\nProcessing: "${claim.substring(0, 60)}..."`);
      
      const evidence = await retrieveEvidence(claim);
      const verification = await verifyClaim(claim, evidence);
      
      verifiedClaims.push({ claim, evidence, verification });
    }

    // step 3 - compute score
    console.log('\nStep 3: Computing credibility score...');
    const result = computeCredibilityScore(verifiedClaims);
    console.log(`Final score: ${result.score} (${result.riskLevel} risk)`);

    // step 4 - save to mongodb
    console.log('\nStep 4: Saving to database...');
    const evaluation = new Evaluation({
      query,
      llmResponse,
      claims: verifiedClaims,
      credibilityScore: result.score,
      riskLevel: result.riskLevel,
      breakdown: result.breakdown
    });
    await evaluation.save();
    console.log('Saved successfully');

    res.json({
      score: result.score,
      riskLevel: result.riskLevel,
      breakdown: result.breakdown,
      claims: verifiedClaims,
      id: evaluation._id
    });

  } catch (err) {
    console.error('Evaluation failed:', err);
    res.status(500).json({ error: 'Evaluation failed', details: err.message });
  }
});

module.exports = router;