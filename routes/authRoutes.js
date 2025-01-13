const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// User Signup
router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log(email);
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ username, email, password, role });
    await user.save();
    const token = jwt.sign({ id: user._id }, "secret", {
      expiresIn: '1d',
    });
    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, "secret", {
      expiresIn: '1d',
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get current logged-in user
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
