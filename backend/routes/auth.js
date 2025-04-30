const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const TeamLeader = require("../models/TeamLeader");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  let redirectUrl = "/";
  switch (user.role) {
    case "admin":
      redirectUrl = "/admin";
      break;
    case "client":
      redirectUrl = "/client";
      break;
    case "team leader":
      redirectUrl = "/teamleader";
      break;
    case "employee":
      redirectUrl = "/employee";
      break;
    default:
      redirectUrl = "/";
  }

  res.json({
    token,
    userId: user._id,
    role: user.role,
    username: user.username,
    redirectUrl
  });
});

router.post('/signup', async (req, res) => {
  try {
    const { username, password, role, name, email, phone, address, image, department, skills, teamName } = req.body;

    // 1. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });
    const savedUser = await newUser.save();

    // 3. Create corresponding document based on role
    if (role === 'client') {
      const client = new Client({
        user: savedUser._id,
        name: name || "Client Name",                    // default if not provided
        email: email || "client@example.com",           // default email
        phone: phone || "0000000000",                   // placeholder phone number
        address: address || "Unknown",                  // default address
        image: image || "/default-client.png",          // default image
        role: "Client"
      });
      await client.save();
    } else if (role === 'employee') {
      const employee = new Employee({
        user: savedUser._id,
        name: name || "Employee Name",                  // default if not provided
        email: email || "employee@example.com",         // default email
        phone: phone || "0000000000",                   // placeholder phone number
        address: address || "Unknown",                  // default address
        image: image || "/default-profile.png",         // default image
        role: "Employee",
        status: "Idle",                                 // default status
        skills: skills || []                            // empty array for skills
      });
      await employee.save();
    } else if (role === 'admin') {
      const admin = new Admin({
        user: savedUser._id,
        name: name || "Admin Name",                     // default if not provided
        email: email || "admin@example.com",            // default email
        phone: phone || "0000000000",                   // placeholder phone number
        department: department || "General",            // default department
        image: image || "/default-admin.png"            // default image
      });
      await admin.save();
    } else if (role === 'team leader') {
      const teamLeader = new TeamLeader({
        user: savedUser._id,
        name: name || "Team Leader Name",               // default if not provided
        email: email || "teamleader@example.com",       // default email
        phone: phone || "0000000000",                   // placeholder phone number
        teamName: teamName || "Unassigned",             // default team name
        image: image || "/default-leader.png"           // default image
      });
      await teamLeader.save();
    }

    res.status(201).json({ message: 'User and corresponding role created successfully' });

  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
});

module.exports = router;
