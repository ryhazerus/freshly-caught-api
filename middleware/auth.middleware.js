const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) {
      throw new Error('Request needs to have an Authorization token.');
    }

    const providedUserToken = req.header('Authorization').replace('Bearer ', '');
    const verfiedToken = jwt.verify(providedUserToken, process.env.JWT_KEY);
    const user = await User.findOne({ _id: verfiedToken._id, 'tokens.token': providedUserToken });

    if (!user) {
      throw new Error('Not authorized to accces this resource.');
    }

    req.user = user;
    req.token = providedUserToken;
  } catch (error) {
    res.status(401).send({ error: error.message || 'Invalid token provided' });
  } finally {
    next();
  }
};

module.exports = auth;
