const express = require('express');
const { inventory, notifications } = require('../store');
const auth   = require('../middleware/auth');
const router = express.Router();

// GET /api/analytics/summary
router.get('/summary', auth, (req, res) => {
  const items = inventory.all();
  const totalItems  = items.length;
  const totalValue  = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const lowStock    = items.filter(i => i.quantity > 0 && i.quantity <= i.min_stock).length;
  const outOfStock  = items.filter(i => i.quantity === 0).length;
  const categories  = new Set(items.map(i => i.category)).size;
  const totalUnits  = items.reduce((s, i) => s + i.quantity, 0);
  res.json({ totalItems, totalValue: totalValue.toFixed(2), lowStock, outOfStock, categories, totalUnits });
});

// GET /api/analytics/low-stock
router.get('/low-stock', auth, (req, res) => {
  const items = inventory.all(i => i.quantity <= i.min_stock);
  items.sort((a, b) => a.quantity - b.quantity);
  res.json(items);
});

// GET /api/analytics/by-category
router.get('/by-category', auth, (req, res) => {
  const items = inventory.all();
  const map   = {};
  items.forEach(i => {
    if (!map[i.category]) map[i.category] = { category: i.category, item_count: 0, total_qty: 0, total_value: 0 };
    map[i.category].item_count++;
    map[i.category].total_qty   += i.quantity;
    map[i.category].total_value += i.quantity * i.price;
  });
  res.json(Object.values(map).sort((a, b) => b.total_value - a.total_value));
});

// GET /api/analytics/stock-status
router.get('/stock-status', auth, (req, res) => {
  const items = inventory.all();
  const result = { out_of_stock: 0, low: 0, medium: 0, good: 0 };
  items.forEach(i => {
    if (i.quantity === 0)                      result.out_of_stock++;
    else if (i.quantity <= i.min_stock)        result.low++;
    else if (i.quantity <= i.min_stock * 2)    result.medium++;
    else                                       result.good++;
  });
  res.json(result);
});

// GET /api/analytics/report
router.get('/report', auth, (req, res) => {
  const items = inventory.all().map(i => ({
    ...i,
    total_value: i.quantity * i.price,
    stock_status: i.quantity === 0 ? 'Out of Stock'
                : i.quantity <= i.min_stock ? 'Low'
                : i.quantity <= i.min_stock * 2 ? 'Medium'
                : 'Good'
  }));
  items.sort((a, b) => a.quantity - b.quantity);
  res.json(items);
});

// GET /api/analytics/notifications
router.get('/notifications', auth, (req, res) => {
  res.json(notifications.all());
});

// PUT /api/analytics/notifications/:id/read
router.put('/notifications/:id/read', auth, (req, res) => {
  notifications.markRead(parseInt(req.params.id));
  res.json({ success: true });
});

// DELETE /api/analytics/notifications/clear
router.delete('/notifications/clear', auth, (req, res) => {
  notifications.clearRead();
  res.json({ success: true });
});

module.exports = router;
