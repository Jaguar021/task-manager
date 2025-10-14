const mongoose = require('mongoose');

const projectEmployeeInfoSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null // can be empty initially
  }
}, { timestamps: true });

module.exports = mongoose.model('Project_Employee_Info', projectEmployeeInfoSchema);
