const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  checklist: [String],
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
});
module.exports = mongoose.model('Task', taskSchema);
