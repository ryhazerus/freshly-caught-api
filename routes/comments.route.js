const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { check } = require('express-validator');

const Comment = require('../models/comment.model');
const auth = require('../middleware/auth.middleware');

router.get('/:project/:page', auth, async (req, res) => {
    try {

    } catch (error) {
        res.status(500).send({ error: error.message || 'Could not get comments' });
    }
});

router.post('/comment', auth, async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).send({ comment });
    } catch (error) {
        res.status(400).send({ error: 'Could not post comment' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {

    } catch (error) {
        res.status(500).send({ error: error.message || 'Could not get comments' });
    }
});