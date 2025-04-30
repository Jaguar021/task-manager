const express = require('express');
const router = express.Router();
const Project = require('../models/Project');  // Your Project model
const mongoose = require('mongoose');

// POST - Create a new project
router.post('/projects', async (req, res) => {
  try {
    const { title, description, dueDate, priority, clientName, clientEmail, user } = req.body;

    // Validate the required fields
    if (!title || !description || !dueDate || !priority || !clientName || !clientEmail || !user) {
      return res.status(400).json({ message: 'All fields are required, including user' });
    }

    // Create a new project instance
    const newProject = new Project({
      title,
      description,
      dueDate,
      priority,
      clientName,
      clientEmail,
      status: 'Pending', // default status is pending
      progress: 0,
      user, // Attach the user ID
    });

    // Save the project to the database
    await newProject.save();

    res.status(201).json({
      message: 'Project created successfully!',
      project: newProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/projects/summary', async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Aggregate count of projects status-wise (Pending, Ongoing, Completed)
    const statusSummary = await Project.aggregate([
      { $match: { user: objectUserId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);

    // Aggregate count of projects priority-wise (Low, Medium, High)
    const prioritySummary = await Project.aggregate([
      { $match: { user: objectUserId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $project: { priority: '$_id', count: 1, _id: 0 } }
    ]);

    res.status(200).json({ statusSummary, prioritySummary });

  } catch (error) {
    console.error('Error fetching project summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/projects', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const projects = await Project.find({ user: userId });
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/projects/:id
router.delete('/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id;

    const deleted = await Project.findByIdAndDelete(projectId);

    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
