const express = require('express');
const { users } = require('../store');
const auth   = require('../middleware/auth');
const router = express.Router();

// GET /api/users  (admin only)
router.get('/', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const all = users.all().map(({ password, ...u }) => u);
  all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(all);
});

// PUT /api/users/:id
router.put('/:id', auth, (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const user = users.byId(id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const updates = {};
  if (req.body.name)  updates.name  = req.body.name;
  if (req.body.email) updates.email = req.body.email;
  if (req.body.role && req.user.role === 'admin') updates.role = req.body.role;

  users.update(id, updates);
  res.json({ success: true, message: 'User updated successfully' });
});

// DELETE /api/users/:id  (admin only)
router.delete('/:id', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const id = parseInt(req.params.id);
  if (req.user.id === id) return res.status(400).json({ error: 'Cannot delete your own account' });

  const user = users.byId(id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  users.delete(id);
  res.json({ success: true, message: `User "${user.name}" deleted` });
});

module.exports = router;
