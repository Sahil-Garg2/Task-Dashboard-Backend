const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedRole: { type: mongoose.Schema.Types.ObjectId, ref:'Role', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  checklist: [{
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Checklist' },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    }
  }],
  dependency: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  currentDependencyNo: { type: Number, default: 0 },
  status: {
    type: String,
    ref:'Role'
  },
});
module.exports = mongoose.model('Task', taskSchema);
