const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  deadline: {
    type: Date,
    required: true
  },
  priority: {                           // ADD THIS
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  category: {                           // ADD THIS
    type: String,
    enum: ['Personal', 'College', 'Work', 'Shopping', 'Health', 'Other'],
    default: 'Personal'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Todo', todoSchema);