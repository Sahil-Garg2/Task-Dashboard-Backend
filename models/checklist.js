// models/checklistModel.js
const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
});

module.exports = mongoose.model('Checklist', checklistSchema);
