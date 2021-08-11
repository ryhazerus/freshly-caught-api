const express = require('express');

const router = express.Router();
const _ = require('lodash');

const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');

router.post('/register', async (req, res) => {
  try {
    let user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    user = CleanUser(user);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'Error occurred during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findByCredentials(email, password);
    if (!user) { throw Error('Login failed, check credentials'); }
    const token = await user.generateAuthToken();
    user = CleanUser(user);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(500).send({ error: error.message || 'Error occured during login' });
  }
});

router.get('/me/account', auth, async (req, res) => {
  try {
    res.status(200).send(CleanUser(req.user));
  } catch (error) {
    res.status(500).send({ error: 'Could not get current user' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const searchedUser = await User.findOne({ username: req.params.id });
    if (!searchedUser) { throw Error('Could not find user'); }
    res.status(200).send(CleanUser(searchedUser));
  } catch (error) {
    res.status(500).send({ error: 'Error occurred while getting user' });
  }
});

router.post('/me/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token != req.token);
    await req.user.save();
    res.status(200).send({ message: 'User successfully logged out' });
  } catch (error) {
    res.status(500).send({ error: 'Could not perform logout' });
  }
});

router.post('/me/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.status(200).send({ message: 'User successfully logged out' });
  } catch (error) {
    res.status(500).send({ error: 'Could not perform logout on all devices' });
  }
});

router.delete('/me/delete', auth, async (req, res) => {
  try {
    const response = await User.findByIdAndDelete(req.user);
    res.status(200).send({ message: 'User delete successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Internal error occurred' });
  }
});

CleanUser = (user) => _.pick(user, ['username', 'email', 'registration_date', '_id', 'token', 'tokens']);

module.exports = router;
