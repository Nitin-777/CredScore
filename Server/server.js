const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/evaluate', require('./src/routes/evaluate'));
app.use('/api/history', require('./src/routes/history'));

// test route
app.get('/', (req, res) => {
  res.json({ message: 'CredScore API running!' });
});

// connect to mongodb and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });