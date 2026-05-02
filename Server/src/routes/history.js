const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');

router.get('/', async (req, res) => {
  try {
    const evaluations = await Evaluation
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('query credibilityScore riskLevel breakdown createdAt');
    
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    res.json(evaluation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch evaluation' });
  }
});

module.exports = router;