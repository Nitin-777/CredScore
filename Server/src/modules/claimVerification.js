const axios = require('axios');
require('dotenv').config();

async function verifyClaim(claim, evidence) {
  if (!evidence || evidence.length < 20) {
    console.log('No evidence available - marking as neutral');
    return { 
      status: 'neutral', 
      confidence: 0,
      allScores: { supported: 0, contradicted: 0, neutral: 1 }
    };
  }

  try {
    console.log(`Verifying claim: "${claim.substring(0, 50)}..."`);

    const response = await axios.post(
      'https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli',
      {
        inputs: evidence.substring(0, 500),
        parameters: {
          candidate_labels: ['supported', 'contradicted', 'neutral']
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    // response is an array like:
    // [{ label: 'supported', score: 0.94 }, { label: 'contradicted', score: 0.03 }]
    const data = response.data;

    // find each label's score from the array
    const findScore = (label) => {
      const found = data.find(item => item.label === label);
      return found ? found.score : 0;
    };

    const supportedScore = findScore('supported');
    const contradictedScore = findScore('contradicted');
    const neutralScore = findScore('neutral');

    // top label is first item in array
    const topLabel = data[0].label;
    const topScore = data[0].score;

    const result = {
      status: topLabel,
      confidence: topScore,
      allScores: {
        supported: supportedScore,
        contradicted: contradictedScore,
        neutral: neutralScore
      }
    };

    console.log(`Result: ${result.status} (${(result.confidence * 100).toFixed(1)}%)`);
    return result;

  } catch (err) {
    if (err.response?.status === 503) {
      console.log('HuggingFace model is loading, waiting 20s...');
      await new Promise(resolve => setTimeout(resolve, 20000));
      return verifyClaim(claim, evidence);
    }
    console.log('Verification error:', err.message);
    return { 
      status: 'neutral', 
      confidence: 0,
      allScores: { supported: 0, contradicted: 0, neutral: 1 }
    };
  }
}

module.exports = { verifyClaim };

