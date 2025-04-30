// user.js (Backend)
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import your User model
const Client = require("../models/Client");
const Admin = require("../models/Admin");
const TeamLeader = require("../models/TeamLeader");
const Employee = require("../models/Employee");

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the user info to the request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Get user details
router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    // Return different data based on the user's role
    if (user.role === "client") {
      const client = await Client.findOne({ user: user._id }).select("-password");
      res.json(client); // Return the client data
    } else if (user.role === "admin") {
      const admin = await Admin.findOne({ user: user._id }).select("-password");
      res.json(admin);
    } else if (user.role === "employee") {
      const employee = await Employee.findOne({ user: user._id }).select("-password");
      res.json(employee);
    } else if (user.role === "team leader") {
      const teamLeader = await TeamLeader.findOne({ user: user._id }).select("-password");
      res.json(teamLeader);
    } else {
      res.status(404).json({ message: "User role not recognized" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/user/updateClient", verifyToken, async (req, res) => {
  try {
    const updatedData = req.body;
    const user = await Client.findOneAndUpdate(
      { user: req.user.id },
      updatedData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/user/updateAdmin", verifyToken, async (req, res) => {
  try {
    const updatedData = req.body;
    const admin = await Admin.findOneAndUpdate(
      { user: req.user.id },
      updatedData,
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/user/updateTeamLeader", verifyToken, async (req, res) => {
  try {
    const updatedData = req.body;
    
    // Assuming TeamLeader model exists
    const user = await TeamLeader.findOneAndUpdate(
      { user: req.user.id }, // Assuming 'user' field references the team leader's user
      updatedData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Team Leader not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/user/updateEmployee", verifyToken, async (req, res) => {
  try {
    const updatedData = req.body;

    const employee = await Employee.findOneAndUpdate(
      { user: req.user.id },
      updatedData,
      { new: true } // return the updated document
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/client/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const client = await Client.findOne({ user: userId }); // Notice { user: userId }

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({
      clientName: client.name,
      clientEmail: client.email
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Post project


module.exports = router;
