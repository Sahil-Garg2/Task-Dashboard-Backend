const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name of the category
  description: { type: String },           // Optional description for the category
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // Parent category for hierarchy
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Admin who created it
  createdAt: { type: Date, default: Date.now },
  checklist: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Checklist', required: true }
  }],
  dependency: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }]
});
module.exports = mongoose.model('Category', categorySchema);
