// routes/teamLeaders.js
const express = require("express");
const router = express.Router();
const TeamLeader = require("../models/TeamLeader");
const Employee = require("../models/Employee");

// GET /api/teamleaders - fetch all team leaders with their employees populated
router.get("/team-leaders", async (req, res) => {
  try {
    const teamLeaders = await TeamLeader.find()
      .populate("employees") // populates employee details
      .exec();

    res.status(200).json(teamLeaders);
  } catch (error) {
    console.error("Error fetching team leaders:", error);
    res.status(500).json({ message: "Server error while fetching team leaders." });
  }
});

router.put("/:leaderId/assign/:employeeId", async (req, res) => {
  try {
    const { leaderId, employeeId } = req.params;

    // Update Employee's teamLeader field
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { teamLeader: leaderId },
      { new: true }
    );

    // Add employee to TeamLeader's employees array
    await TeamLeader.findByIdAndUpdate(
      leaderId,
      { $addToSet: { employees: employeeId } } // avoid duplicates
    );

    res.status(200).json({ message: "Employee assigned successfully", updatedEmployee });
  } catch (error) {
    console.error("Assignment error:", error);
    res.status(500).json({ error: "Failed to assign employee" });
  }
});

router.get("/unassigned", async (req, res) => {
  try {
    const employees = await Employee.find({ teamLeader: null });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unassigned employees" });
  }
});


router.delete("/:leaderId/remove/:employeeId", async (req, res) => {
  const { leaderId, employeeId } = req.params;

  try {
    // Remove employee from leader
    const updatedLeader = await TeamLeader.findByIdAndUpdate(
      leaderId,
      { $pull: { employees: employeeId } },
      { new: true }
    );

    // Set employee's teamLeader to null
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { teamLeader: null },
      { new: true }
    );

    res.status(200).json({
      message: "Employee removed from team leader",
      updatedLeader,
      updatedEmployee
    });
  } catch (err) {
    console.error("Error removing employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/:id/TeamLeaderemployees', async (req, res) => {
  try {
    const teamLeader = await TeamLeader.findById(req.params.id)
      .populate('employees', 'name'); // populate only the name of each employee

    if (!teamLeader) {
      return res.status(404).json({ message: 'Team Leader not found' });
    }

    const employeeNames = teamLeader.employees.map(emp => emp.name);
    res.json({ teamLeader: teamLeader.name, employees: employeeNames });

  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
