const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { check } = require('express-validator');

const Project = require('../models/project.model');
const auth = require('../middleware/auth.middleware');

const { redisCacheProjects, redisCacheNewestProjects, redisCacheTopProjects } = require('../middleware/reddis.middleware');
const cache = require('../cache/redis.connection');

const extractUserToken = (req) => {
  if (req.headers.authorization) {
    return jwt.verify(req.headers.authorization.split('Bearer ')[1], process.env.JWT_KEY);
  }
  return undefined;
};

router.get('/me/:page', auth, async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    if (isNaN(page)) { throw Error('Invalid page numbder'); }
    res.status(200).send({ projects: await Project.findCreatedProjects(req.user, page) });
  } catch (error) {
    res.status(500).send({ error: error.message || 'Could not get my projects' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const searchQuery = req.params.id;
    res.status(200).send({ projects: await Project.findById(searchQuery) });
  } catch (error) {
    res.status(500).send({ error: 'Could not find project' });
  }
});

router.get('/search/:query/:page', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const { page } = req.params;
    const user = extractUserToken(req);
    res.status(200).send({ projects: await Project.search(searchQuery, page, user?._id) });
  } catch (error) {
    res.status(500).send({ error: 'Could not search for projects' });
  }
});

router.get('/page/:page', redisCacheProjects, cache.route(), [check('page').isNumeric().trim().escape()], async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    const user = extractUserToken(req);
    res.status(200).send({ projects: await Project.findAll(page, user?._id) });
  } catch (error) {
    res.status(500).send({ error: 'Could not load projects' });
  }
});

router.get('/newest/:page', redisCacheNewestProjects, cache.route(), [check('page').isNumeric().trim().escape()], async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    const user = extractUserToken(req);
    res.status(200).send({ projects: await Project.findAllNewest(page, user?._id) });
  } catch (error) {
    res.status(500).send({ error: 'Could not get newest projects' });
  }
});

router.get('/top/:page', redisCacheTopProjects, cache.route(), [check('page').isNumeric().trim().escape()], async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    const user = extractUserToken(req);
    res.status(200).send({ projects: await Project.findAllTop(page, user?._id) });
  } catch (error) {
    res.status(500).send({ error: 'Could not get top projects' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).send({ project });
  } catch (error) {
    res.status(400).send({ error: 'Could not create project' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const userProjects = await Project.findById(req.body._id);
    delete req.body._id;
    if (userProjects.author == req.user.username) {
      const result = await Project.findByIdAndUpdate(userProjects._id, {
        $set:
        {
          image: req.body.icon,
          title: req.body.title,
          description: req.body.description,
          link: req.body.link,
          tags: req.body.tags,
        },
      }, { new: true });
      res.status(201).send(result);
    }
  } catch (error) {
    res.status(500).send({ error: 'Could not update project' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const userProjects = await Project.findById(req.params.id);
    if (userProjects.author == req.user.username) {
      await Project.findByIdAndDelete(userProjects._id);
      res.status(201).send({ message: 'Project deleted successfully' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Could not delete project' });
  }
});

module.exports = router;
