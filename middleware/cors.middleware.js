const allowedOrigins = async (req, res, next) => {
  const domains = ['http://localhost:3000', 'https://freshlycaught.io'];
  const { origin } = req.headers;
  if (domains.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
};

module.exports = allowedOrigins;
