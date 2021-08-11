const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  project_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
