const express = require('express');
const Category = require('../models/category');
const router = express.Router();

// Create a new category
router.post('/create', async (req, res) => {
  const { name, parentCategory } = req.body;
  const newCategory = new Category({ name, parentCategory });
  try {
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: 'Error creating category', error: err });
  }
});

module.exports = router;
