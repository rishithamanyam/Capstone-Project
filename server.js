require('dotenv').config();
require('./database'); // seed data on startup
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

// Page routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/inventory', (req, res) => res.sendFile(path.join(__dirname, 'public', 'inventory.html')));
app.get('/analytics', (req, res) => res.sendFile(path.join(__dirname, 'public', 'analytics.html')));
app.get('/settings', (req, res) => res.sendFile(path.join(__dirname, 'public', 'settings.html')));

app.listen(PORT, () => {
  console.log(`\n  SIMS running at http://localhost:${PORT}`);
  console.log(`  Admin login: admin@sims.com / admin123`);
  console.log(`  Staff login: staff@sims.com / staff123\n`);
});
