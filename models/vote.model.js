const mongoose = require('mongoose');
const _ = require('lodash');

const voteSchema = mongoose.Schema({
  project_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
});

voteSchema.post('init', async (next) => {
  const votes = this;
  if (!votes || _.isEmpty(votes)) return [];
  next();
});

voteSchema.statics.findLikes = async (currentProjectsIds) => await Vote.find({ project_id: { $in: currentProjectsIds } });

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
