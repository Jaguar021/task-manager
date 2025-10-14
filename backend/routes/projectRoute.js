const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const TeamLeader = require('../models/TeamLeader');
const mongoose = require('mongoose');

// POST - Create a new project
router.post('/projects', async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      clientName,
      clientEmail,
      user
    } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate || !priority || !clientName || !clientEmail || !user) {
      return res.status(400).json({ message: 'All fields are required, including user' });
    }

    const newProject = new Project({
      title,
      description,
      dueDate,
      priority,
      clientName,
      clientEmail,
      user,
      status: 'Pending',
      progress: 0,
      admin_status: 'pending approval' // set default admin status
    });

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

// GET - Project summary (status and priority-wise)
router.get('/projects/summary', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const statusSummary = await Project.aggregate([
      { $match: { user: objectUserId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);

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

// GET - All projects for a user
router.get('/projects', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const projects = await Project.find({ user: userId });
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE - Delete a project by ID
router.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - All projects for admin view
router.get('/adminProjects', async (req, res) => {
  try {
    const projects = await Project.find().populate('user', 'name email');
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
});

// PATCH - Update project admin_status or teamLeader
router.patch('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { admin_status, teamLeader } = req.body;

  try {
    const updateFields = {};
    if (admin_status) updateFields.admin_status = admin_status;
    if (teamLeader) updateFields.teamLeader = teamLeader;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/teamleaders', async (req, res) => {
  try {
    const leaders = await TeamLeader.find({}, 'name email image');
    res.status(200).json(leaders);
  } catch (error) {
    console.error('Error fetching team leaders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/teamleaderProjects", async (req, res) => {
  try {
    const projects = await Project.find();

    const total = projects.length;

    const pending = projects.filter(p => p.status === "Pending").length;
    const ongoing = projects.filter(p => p.status === "Ongoing").length;
    const completed = projects.filter(p => p.status === "Completed").length;

    const low = projects.filter(p => p.priority === "Low").length;
    const medium = projects.filter(p => p.priority === "Medium").length;
    const high = projects.filter(p => p.priority === "High").length;

    res.status(200).json({
      total,
      statusCounts: {
        pending,
        ongoing,
        completed
      },
      priorityCounts: {
        low,
        medium,
        high
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/projects/team-leader/:id', async (req, res) => {
  try {
    const teamLeaderId = req.params.id;

    const projects = await Project.find({ teamLeader: teamLeaderId })
      .populate('user', 'name email') // Optional: Populate client info
      .populate('teamLeader', 'name email'); // Optional: Populate team leader info

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching team leader projects:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/teamleader/by-user/:userId', async (req, res) => {
  try {
    const leader = await TeamLeader.findOne({ user: req.params.userId });
    if (!leader) return res.status(404).json({ message: "TeamLeader not found" });
    res.status(200).json(leader);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
