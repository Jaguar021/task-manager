const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Refers to the User model for authentication
    required: true,
    unique: true
  },
  image: {
    type: String,
    default: '/default-admin.png' // Default image URL
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true }); // Enable timestamps

module.exports = mongoose.model("Admin", adminSchema);
