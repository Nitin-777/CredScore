const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');

router.get('/', async (req, res) => {
  try {
    const evaluations = await Evaluation
      .find()
      .sort({ createdAt: -1 })
      .limit(20);
      // no .select() - return everything including claims
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

router.delete('/:id', async (req, res) => {
  try {
    await Evaluation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;