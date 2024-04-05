const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

// Generate a random username, key, and expiry
router.post('/generate', async (req, res) => {
  try {
    const { key, username, expiry } = req.body;

    // Check if all parameters are provided
    if (!key || !username || !expiry) {
      return res.status(400).json({ message: "Please provide key, username, and expiry." });
    }

    // Create new user
    const newUser = new User({ username, key, expiry });
    await newUser.save();

    res.json({ username: newUser.username, key: newUser.key, expiry: newUser.expiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login API endpoint
router.post('/login', async (req, res) => {
  try {
    const { key, username } = req.body;

    // Check if username and key are provided
    if (!key || !username) {
      return res.status(400).json({ message: "Please provide username and key for login." });
    }

    // Find the user in the database
    const user = await User.findOne({ username, key });

    // Check if user exists
    if (user) {
      // User is valid

      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET_KEY , { expiresIn: "7D" });
      return res.status(200).json({ message: "User is valid and generated by us.", token });
    } else {
      // User is invalid
      return res.status(400).json({ message: "Invalid username or key." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve all users endpoint
router.get('/user', async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find({}, 'username key');

    // Extract username and key from each user
    const userData = users.map(user => ({
      username: user.username,
      key: user.key
    }));

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user endpoint
router.delete('/user/:username', async (req, res) => {
  try {
    const username = req.params.username;

    // Find the user by username and delete it
    const deletedUser = await User.findOneAndDelete({ username });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User deleted successfully.", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
