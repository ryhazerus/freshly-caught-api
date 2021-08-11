const express = require('express');
const router = express.Router();
const _ = require('lodash');

const auth = require('../middleware/auth.middleware');
const Vote = require('../models/vote.model');
const Project = require('../models/project.model');

router.post('/me', auth, async (req, res) => {
  try {
    const votes = await Vote.findLikes(req.body.ids);
    res.status(201).send({ votes });
  } catch (error) {
    res.status(400).send({ error: 'Could not get votes' });
  }
});

router.post('/vote', auth, async (req, res) => {
  try {
    const find = await Vote.find({ $and: [{ project_id: req.body.project_id }, { user_id: req.body.user_id }] });
    if (find.length) {
      throw new Error('Project already liked');
    }
    const vote = new Vote(req.body);
    await vote.save();
    await Project.updateOne({ _id: req.body.project_id }, { $inc: { likes: 1 } });
    res.status(201).send({ vote });
  } catch (error) {
    res.status(400).send({ error: error.message || 'internal error occurred' });
  }
});

router.post('/unvote', auth, async (req, res) => {
  try {
    const find = await Vote.find({ $and: [{ project_id: req.body.project_id }, { user_id: req.body.user_id }] });
    if (!find.length) {
      throw new Error('Project already unliked');
    }
    const unvote = await Vote.deleteOne({ $and: [{ project_id: { $eq: req.body.project_id } }, { user_id: { $eq: req.body.user_id } }] });
    await Project.updateOne({ _id: req.body.project_id }, { $inc: { likes: -1 } });
    res.status(201).send({ unvote });
  } catch (error) {
    res.status(400).send({ error: error.message || 'internal error occurred' });
  }
});

module.exports = router;
