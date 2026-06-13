const express = require('express');
const { inventory, notifications } = require('../store');
const auth   = require('../middleware/auth');
const router = express.Router();

// GET /api/inventory
router.get('/', auth, (req, res) => {
  const { search, category } = req.query;
  let items = inventory.all();

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) || (i.supplier||'').toLowerCase().includes(q)
    );
  }
  if (category && category !== 'all') {
    items = items.filter(i => i.category === category);
  }

  items.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  res.json(items);
});

// GET /api/inventory/categories
router.get('/categories', auth, (req, res) => {
  res.json(inventory.cats());
});

// GET /api/inventory/:id
router.get('/:id', auth, (req, res) => {
  const item = inventory.byId(parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST /api/inventory
router.post('/', auth, (req, res) => {
  const { name, category, quantity, price, min_stock, supplier, description } = req.body;
  if (!name || !category || quantity === undefined || price === undefined) {
    return res.status(400).json({ error: 'Name, category, quantity and price are required' });
  }
  if (quantity < 0) return res.status(400).json({ error: 'Quantity cannot be negative' });
  if (price < 0)    return res.status(400).json({ error: 'Price cannot be negative' });

  const item = inventory.create({
    name, category,
    quantity: parseInt(quantity),
    price: parseFloat(price),
    min_stock: parseInt(min_stock) || 10,
    supplier: supplier || '',
    description: description || ''
  });

  if (item.quantity <= item.min_stock) {
    notifications.create({
      message: `Low stock alert: "${name}" has only ${quantity} units (min: ${item.min_stock})`,
      type: 'warning'
    });
  }

  res.status(201).json({ success: true, id: item.id, message: 'Item added successfully' });
});

// PUT /api/inventory/:id
router.put('/:id', auth, (req, res) => {
  const id  = parseInt(req.params.id);
  const existing = inventory.byId(id);
  if (!existing) return res.status(404).json({ error: 'Item not found' });

  const updates = {};
  const fields = ['name','category','quantity','price','min_stock','supplier','description'];
  fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  if (updates.quantity !== undefined) updates.quantity = parseInt(updates.quantity);
  if (updates.price    !== undefined) updates.price    = parseFloat(updates.price);
  if (updates.min_stock!== undefined) updates.min_stock= parseInt(updates.min_stock);

  inventory.update(id, updates);

  const updated = inventory.byId(id);
  if (updated.quantity <= updated.min_stock) {
    notifications.create({
      message: `Low stock alert: "${updated.name}" has only ${updated.quantity} units (min: ${updated.min_stock})`,
      type: 'warning'
    });
  }

  res.json({ success: true, message: 'Item updated successfully' });
});

// DELETE /api/inventory/:id
router.delete('/:id', auth, (req, res) => {
  const id   = parseInt(req.params.id);
  const item = inventory.byId(id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  inventory.delete(id);
  res.json({ success: true, message: `"${item.name}" deleted successfully` });
});

module.exports = router;
