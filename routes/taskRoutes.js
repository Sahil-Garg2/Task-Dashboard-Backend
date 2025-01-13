const express = require('express');
const Task = require('../models/task');
const Category = require('../models/category');
const { isUser, protect } = require('../middleware/authMiddleware');
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedUser')
      .populate("assignedRole")
      .populate('category')
      .populate({ path: "checklist.id", model: "Checklist" })
      .populate("dependency").populate("status");
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});
// Create a new task
router.post('/create', async (req, res) => {
  const { title, description, userId, categoryId, role } = req.body;
  const category = await Category.findById(categoryId).populate('checklist').populate('dependency');
  console.log(category);
  const newTask = new Task({
    title,
    description,
    assignedUser: userId,
    assignedRole: role,
    category: categoryId,
    checklist: category.checklist.map((item) => ({
      id: item.item
    })),
    dependency: category.dependency,
    currentDependencyNo: 0,
  });
  try {
    await newTask.save();
    res.status(200).json(newTask);
  } catch (err) {
    res.status(400).json({ message: 'Error creating task', error: err });
  }
});

// Update task status
router.patch('/update/:id', protect, isUser, async (req, res) => {
  const taskId = req.params.id;

  try {
    const currentTask = await Task.findById(taskId);
    console.log(currentTask);
    const categories = req.user.categories.filter((cat) =>
      cat.category._id.equals(currentTask.category));

    console.log(categories);
    if (currentTask.dependency.length < currentTask.currentDependencyNo) { 
      return res.status(400).json({ message: 'Task already completed' });
    }
    const currentCategory = categories.filter((cat)=>
      cat.assignedRole._id.equals(currentTask.dependency[currentTask.currentDependencyNo]));
    //IF current user does not have permission to update the task
    if (currentCategory?.length === 0) { 
      return res.status(403).json({ message: 'You do not have permission to update this task' });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        status: currentTask.dependency[currentTask.currentDependencyNo+1],
        $inc: { currentDependencyNo: 1 }
      },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: 'Error updating task', error: err });
  }
});

// Update task status
router.patch('/subtask/update/:id', async (req, res) => {
  const taskId = req.params.id;
  const { checklist } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { checklist },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: 'Error updating task', error: err });
  }
});



module.exports = router;
