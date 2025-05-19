const express = require('express');
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');

const router = express.Router();

// Middleware to check token and get user
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET books for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
});

// POST add new book
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, author, rating, quotes, notes, colour, image, year } = req.body;
    const book = new Book({
      title,
      author,
      rating,
      quotes,
      notes,
      colour,
      image,
      year,
      userId: req.user.id
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: 'Error adding book', error: err.message });
  }
});

// DELETE book
router.delete('/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

module.exports = router;
