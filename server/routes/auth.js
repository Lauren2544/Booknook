const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sanitize = require("mongo-sanitize");

function validateAuthInput(email, password) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPassword = password.length >= 8;
  return emailRegex.test(email) && strongPassword;
}

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = sanitize(req.body);

    if (!validateAuthInput(email, password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const existing = await User.findOne({ email });
    if (existing){
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Set token as HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
      sameSite: 'None',
      maxAge: 2 * 60 * 60 * 1000,
    });  

    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ message: "Error signing up", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = sanitize(req.body);

    if (!validateAuthInput(email, password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Set token as HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
      sameSite: 'None',
      maxAge: 2 * 60 * 60 * 1000,
    });  

    // res.status(200).json({ id: user._id, token });
    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// Logout 
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prod',
    sameSite: 'None',
  });
  res.json({ message: 'Logged out successfully' });
});


// Check login status 
router.get('/check', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not logged in' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    res.json({ message: 'Logged in' });
  });
});

module.exports = router;
