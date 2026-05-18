const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide employee name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide employee email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  department: {
    type: String,
    required: [true, 'Please provide a department'],
  },
  skills: {
    type: [String],
    default: [],
  },
  performanceScore: {
    type: Number,
    required: [true, 'Please provide a performance score'],
    min: 0,
    max: 100,
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
