const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Add this line to include a date property
});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;