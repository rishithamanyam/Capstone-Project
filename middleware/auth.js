const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'sims_secret_key';

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    req.user = jwt.verify(auth.split(' ')[1], SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
