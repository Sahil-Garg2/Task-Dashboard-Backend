const express = require('express');
const Task = require('../models/task');
const router = express.Router();

// Create a new task
router.post('/create', async (req, res) => {
  const { title, description, assignedUser, category, checklist } = req.body;
  const newTask = new Task({
    title,
    description,
    assignedUser,
    category,
    checklist,
  });
  try {
    await newTask.save();
    res.status(200).json(newTask);
  } catch (err) {
    res.status(400).json({ message: 'Error creating task', error: err });
  }
});

// Update task status
router.patch('/update/:id', async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: 'Error updating task', error: err });
  }
});

module.exports = router;
