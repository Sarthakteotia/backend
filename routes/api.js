// routes/api.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Key = require('../models/key');

// Generate a random username
router.get('/generate-username', async (req, res) => {
  try {
    const randomUsername = 'User_' + Math.floor(Math.random() * 1000);
    const newUser = new User({ username: randomUsername });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate a random key with expiry time frame
router.get('/generate-key', async (req, res) => {
  try {
    const randomKey = Math.random().toString(36).substring(7);
    const expiryTimeFrame = req.query.expiryTimeFrame || '1 hour';
    const newKey = new Key({ key: randomKey, expiryTimeFrame });
    await newKey.save();
    res.json(newKey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
