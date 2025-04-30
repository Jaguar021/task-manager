const express = require("express");
const { updateClient } = require("../controllers/clientController");
const router = express.Router();

// Route to update client details
router.put("/update/:userId", updateClient); // Assuming you pass the userId in the URL

module.exports = router;
