// routes/taskRoutes.js
const express = require('express');
const Checklist = require('../models/checklist');

const { protect, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin-only route to create a task and assign it to users based on categories
router.post('/create', protect, isAdmin, async (req, res) => {
    const { title, description } = req.body;

    try {


        // Validate if the user exists and is assigned to the category with the correct role
        const role = await Checklist.findOne({ title: title });
        if (role?.length > 0) {
            return res.status(400).json({ message: 'Checklist already exists' });
        }


        // Create the task
        const checklist = new Checklist({
            title, description
        });

        await checklist.save();
        res.status(201).json(checklist);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
});

// Fetch all tasks
router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const checklist = await Checklist.find();
        res.status(200).json(checklist);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

module.exports = router;
