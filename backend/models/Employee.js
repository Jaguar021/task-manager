const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: '/default-profile.png', // fallback for frontend
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Idle', 'Working'],
    default: 'Idle',
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  skills: {
    type: [String], // array of strings, can vary per person
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
