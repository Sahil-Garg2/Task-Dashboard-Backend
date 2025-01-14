// routes/taskRoutes.js
const express = require('express');
const Role = require('../models/role');

const {protect, isAdmin} = require('../middleware/authMiddleware');
const router = express.Router();

// Admin-only route to create a task and assign it to users based on categories
router.post('/create', protect,isAdmin, async (req, res) => {
    const { name, description } = req.body;

    try {
        

        // Validate if the user exists and is assigned to the category with the correct role
        const role = await Role.find({ name: name });
        if (role?.length>0) { 
            return res.status(400).json({ message: 'Role already exists' });
        }


        // Create the task
        const task = new Role({
            name,description
        });
        
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
});

// Fetch all tasks
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

module.exports = router;
