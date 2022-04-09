const mongoose = require('mongoose');

// Pagination Configuration
const MAX_ITEMS_PER_PAGE = 50;
const DEFAULT_PAGE_NUMBER = 0;

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

const calculateCurrentPaginationValue = (requestedPageNumber) => (requestedPageNumber === DEFAULT_PAGE_NUMBER ? DEFAULT_PAGE_NUMBER : requestedPageNumber * MAX_ITEMS_PER_PAGE);

projectSchema.post('init', function (doc) {
  return !doc || _.isEmpty(doc) ? [] : doc;
});

projectSchema.statics.findAllProjectComments = async (page, user = null) => {
  const projectFeedback = await Comment.find().limit(MAX_ITEMS_PER_PAGE).skip(calculateCurrentPaginationValue(page));
  return projectFeedback;
};

module.exports = Comment;
