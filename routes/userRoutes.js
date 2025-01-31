const express = require('express');
const User = require('../models/user');
const Role = require('../models/role');
const Category = require('../models/category');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();


router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().populate('role').populate('categories.category');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Create new user (Admin only)
router.post('/create', protect, isAdmin, async (req, res) => {
  const { username, email, password, role, categories } = req.body;

  try {
    // Check if the role exists
    const assignedRole = await Role.findById(role);
    if (assignedRole?.length === 0) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if categories exist
    const categoryIds = categories.map((cat) => cat.category);
    const categoriesFromDb = await Category.find({ _id: { $in: categoryIds } });
    if (categoriesFromDb.length !== categories.length) {
      return res.status(400).json({ message: 'Invalid categories provided' });
    }


    const user = new User({
      username, email, password, role, categories: categories.map((cat) => ({
        category: cat.category,
        assignedRole: cat.assignedRole,
      })) });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: 'Error creating user', error: error.message });
  }
});

// Edit an existing user (Admin only)
router.patch('/edit/:id', protect, isAdmin, async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password) {
      user.password = password; // Will hash automatically before saving
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error editing user', error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/delete/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router;
