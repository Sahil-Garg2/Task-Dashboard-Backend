const express = require('express');
const Category = require('../models/category');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new category (Admin only)
router.post('/create', protect, isAdmin, async (req, res) => {
  let { name, description, parent, selectedItems, dependency } = req.body;

  try {
    // Check if the user is an admin
    if (req.user.role?.name !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to create categories' });
    }
    console.log(selectedItems);
    selectedItems = selectedItems?.map((sitem) => ({ item: sitem.id }));

    const category = new Category({
      name,
      description,
      parent: parent || null,  // No parent if it's a root category
      createdBy: req.user._id,
      checklist: selectedItems,
      dependency: dependency || null
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating category' });
  }
});

// Get all categories with hierarchy (useful for front-end display)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().populate('parent');
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;
