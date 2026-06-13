const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { users } = require('../store');
const authMw   = require('../middleware/auth');
const router   = express.Router();
const SECRET   = process.env.JWT_SECRET || 'sims_secret_key';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = users.byEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid email or password' });
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    SECRET, { expiresIn: '24h' }
  );
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (users.byEmail(email)) return res.status(400).json({ error: 'Email already registered' });
  const user = users.create({ name, email, password: bcrypt.hashSync(password, 10), role: 'staff' });
  res.json({ success: true, id: user.id, message: 'Account created successfully' });
});

router.get('/me', authMw, (req, res) => {
  const user = users.byId(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...safe } = user;
  res.json(safe);
});

router.put('/change-password', authMw, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
  const user = users.byId(req.user.id);
  if (!bcrypt.compareSync(currentPassword, user.password))
    return res.status(400).json({ error: 'Current password is incorrect' });
  users.update(req.user.id, { password: bcrypt.hashSync(newPassword, 10) });
  res.json({ success: true, message: 'Password changed successfully' });
});

module.exports = router;
