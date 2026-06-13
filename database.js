const bcrypt = require('bcryptjs');
const { users, inventory, notifications } = require('./store');

// Seed admin
if (!users.byEmail('admin@sims.com')) {
  users.create({ name: 'Rishitha Manyam', email: 'admin@sims.com', password: bcrypt.hashSync('admin123', 10), role: 'admin' });
}

// Seed staff
if (!users.byEmail('staff@sims.com')) {
  users.create({ name: 'John Staff', email: 'staff@sims.com', password: bcrypt.hashSync('staff123', 10), role: 'staff' });
}

// Seed inventory
if (inventory.all().length === 0) {
  const items = [
    { name: 'Dell Laptop 15"',   category: 'Electronics', quantity: 25,  price: 899.99, min_stock: 10, supplier: 'TechSupply Co.',  description: 'Core i7, 16GB RAM, 512GB SSD' },
    { name: 'Ergonomic Chair',   category: 'Furniture',   quantity: 8,   price: 249.99, min_stock: 5,  supplier: 'FurniturePlus',   description: 'Lumbar support office chair' },
    { name: 'A4 Paper Ream',     category: 'Stationery',  quantity: 150, price: 4.99,   min_stock: 50, supplier: 'PaperWorld',      description: '500 sheets, 80gsm' },
    { name: 'Wireless Mouse',    category: 'Electronics', quantity: 40,  price: 29.99,  min_stock: 15, supplier: 'TechSupply Co.',  description: 'Bluetooth wireless, 3-year battery' },
    { name: 'Standing Desk',     category: 'Furniture',   quantity: 3,   price: 599.99, min_stock: 5,  supplier: 'FurniturePlus',   description: 'Adjustable height 70-120cm' },
    { name: 'Printer Ink Black', category: 'Stationery',  quantity: 7,   price: 19.99,  min_stock: 20, supplier: 'PrintMart',       description: 'HP compatible black cartridge' },
    { name: 'Monitor 27" FHD',   category: 'Electronics', quantity: 12,  price: 349.99, min_stock: 8,  supplier: 'TechSupply Co.',  description: 'IPS Full HD 75Hz' },
    { name: 'Webcam 1080p',      category: 'Electronics', quantity: 5,   price: 79.99,  min_stock: 10, supplier: 'TechSupply Co.',  description: 'HD webcam with mic' },
    { name: 'Lined Notebook A5', category: 'Stationery',  quantity: 200, price: 2.49,   min_stock: 100, supplier: 'PaperWorld',     description: '200 pages, hardcover' },
    { name: 'USB Hub 4-Port',    category: 'Electronics', quantity: 30,  price: 24.99,  min_stock: 12, supplier: 'TechSupply Co.',  description: 'USB 3.0 powered hub' },
    { name: 'Whiteboard 120x90', category: 'Office',      quantity: 6,   price: 89.99,  min_stock: 4,  supplier: 'OfficeMart',      description: 'Magnetic dry-erase board' },
    { name: 'Coffee Machine',    category: 'Appliances',  quantity: 2,   price: 199.99, min_stock: 3,  supplier: 'BrewCo',          description: 'Filter coffee 12-cup' },
    { name: 'Hand Sanitizer 1L', category: 'Hygiene',     quantity: 45,  price: 8.99,   min_stock: 30, supplier: 'CleanCo',         description: 'Alcohol-based 70%' },
    { name: 'HDMI Cable 2m',     category: 'Electronics', quantity: 60,  price: 9.99,   min_stock: 20, supplier: 'TechSupply Co.',  description: 'High-speed 4K HDMI' },
    { name: 'Stapler Heavy Duty',category: 'Stationery',  quantity: 15,  price: 12.99,  min_stock: 8,  supplier: 'PaperWorld',      description: '20-sheet capacity' },
  ];
  items.forEach(i => inventory.create(i));

  notifications.create({ message: 'Low stock alert: Printer Ink Black has only 7 units (min: 20)', type: 'warning' });
  notifications.create({ message: 'Low stock alert: Standing Desk has only 3 units (min: 5)', type: 'warning' });
  notifications.create({ message: 'Low stock alert: Coffee Machine has only 2 units (min: 3)', type: 'warning' });
  notifications.create({ message: 'System initialized successfully', type: 'info' });
}

console.log('  Database ready (data.json)');
