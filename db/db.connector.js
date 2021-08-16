const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
}
