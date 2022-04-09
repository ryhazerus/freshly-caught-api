const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const getProvidedUsertoken = (authorization) => {
  if (authorization && authorization.includes('Bearer ')) {
    return authorization.replace('Bearer ', '');
  } else {
    throw new Error('Not authorized to accces this resource, token format is invalid.');
  }
};

const getUserFromDatabase = async function (verifiedUserToken, providedUserToken) {
  let user = await User.findOne({ _id: verifiedUserToken._id, 'tokens.token': providedUserToken });
  return !user ? new Error('Not authorized to accces this resource.') : user;
};

const auth = async (req, res, next) => {
  try {
    const providedUserToken = getProvidedUsertoken(req.header('Authorization'));
    const verifiedUserToken = jwt.verify(providedUserToken, process.env.JWT_KEY);
    const user = await getUserFromDatabase(verifiedUserToken, providedUserToken);

    req.user = user;
    req.token = providedUserToken;
  } catch (error) {
    res.status(401).send({ error: error.message || 'Invalid  or expired token provided' });
  } finally {
    next();
  }
};

module.exports = auth;
