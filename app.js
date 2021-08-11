require('dotenv').config();
require('./db/db.connector');

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const usersRouter = require('./routes/users.route');
const projectRouter = require('./routes/projects.route');
const votesRouter = require('./routes/votes.route');
const allowedOrigins = require('./middleware/cors.middleware');

const app = express();

app.use(cors());
app.use(allowedOrigins);
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/votes', votesRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

module.exports = app;
