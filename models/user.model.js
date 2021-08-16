const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (userEmail) => {
      if (!validator.isEmail(userEmail)) {
        throw new Error({ error: 'Invalid e-mail address' });
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  registration_date: {
    type: Date,
    default: new Date(),
  },
  google_id: {
    type: String,
    required: false,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRATION });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User credentials not found');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid credentials provided');
  }
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
