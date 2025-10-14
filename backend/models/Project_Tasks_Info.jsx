const mongoose = require('mongoose');

const projectTaskInfoSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  checklist: [
    {
      task: {
        type: String,
        required: true,
        trim: true
      },
      completed: {
        type: Boolean,
        default: false
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Project_Task_Info', projectTaskInfoSchema);
