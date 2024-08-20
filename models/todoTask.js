// Todo Schema
const mongoose = require('mongoose');

const todoTaskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    default: Date.now,
  },
  memo: String,
  position: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('TodoTask', todoTaskSchema);
