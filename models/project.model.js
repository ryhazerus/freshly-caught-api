const mongoose = require('mongoose');
const _ = require('lodash');

const resizeImage = require('../utilities/imageProcessing');
const sortType = require('../utilities/sortType');
const Vote = require('./vote.model');

// Pagination Configuration
const MAX_ITEMS_PER_PAGE = 50;
const DEFAULT_PAGE_NUMBER = 0;

const projectSchema = mongoose.Schema({
  image: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 1,
  },
  description: {
    type: String,
    required: true,
    minLength: 5,
  },
  link: {
    type: String,
    required: true,
    minLength: 5,
  },
  tags: {
    type: Array,
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
});

const calculateCurrentPaginationValue = (requestedPageNumber) => (requestedPageNumber === DEFAULT_PAGE_NUMBER ? DEFAULT_PAGE_NUMBER : requestedPageNumber * MAX_ITEMS_PER_PAGE);

const appendUserLikesToProjects = async function (allProjects, user) {
  if (!user) return allProjects;

  const allProjectsToArray = allProjects.map((project) => project.toObject());
  for (const index in allProjectsToArray) {
    const isLiked = await Vote.findOne({ user_id: user, project_id: allProjectsToArray[index]._id });
    if (isLiked && !_.isEmpty(isLiked)) {
      allProjectsToArray[index].is_liked = true;
    }
  }

  return allProjectsToArray;
};

projectSchema.pre('save', async function (next) {
  const resizedProjectImage = await resizeImage(this.image.data);
  this.image.data = resizedProjectImage;
  next();
});

projectSchema.post('init', function (doc) {
  return !doc || _.isEmpty(doc) ? [] : doc;
});

projectSchema.statics.findCreatedProjects = async ({ username }, page) => await Project.find({ author: username }).limit(MAX_ITEMS_PER_PAGE).skip(calculateCurrentPaginationValue(page)).sort({ likes: sortType.DESC });

projectSchema.statics.findAll = async (page, user = null) => {
  const allProjects = await Project.find().limit(MAX_ITEMS_PER_PAGE).skip(calculateCurrentPaginationValue(page));
  return await appendUserLikesToProjects(allProjects, user);
};

projectSchema.statics.findAllTop = async (page, user = null) => {
  const allTopProjects = await Project.find().limit(MAX_ITEMS_PER_PAGE).skip(calculateCurrentPaginationValue(page)).sort({ likes: sortType.DESC });
  return await appendUserLikesToProjects(allTopProjects, user);
};

projectSchema.statics.findAllNewest = async (page, user = null) => {
  const allNewProjects = await Project.find().limit(MAX_ITEMS_PER_PAGE).skip(calculateCurrentPaginationValue(page)).sort({ _id: sortType.DESC });
  return await appendUserLikesToProjects(allNewProjects, user);
};

projectSchema.statics.search = async (query, page, user = null) => {
  const searchResult = await Project.find({ $text: { $search: query } }).limit(MAX_ITEMS_PER_PAGE).skip(calculateCurrentPaginationValue(page));
  return await appendUserLikesToProjects(searchResult, user);
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
