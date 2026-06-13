const fs   = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'data.json');

function read() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
  catch { return { users: [], inventory: [], notifications: [] }; }
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function nextId(arr) {
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}

const now = () => new Date().toISOString();

// ── USERS ──
const users = {
  all:          ()      => read().users,
  byEmail:      (email) => read().users.find(u => u.email === email) || null,
  byId:         (id)    => read().users.find(u => u.id === id) || null,
  create(data) {
    const db = read();
    const rec = { id: nextId(db.users), ...data, created_at: now() };
    db.users.push(rec); write(db); return rec;
  },
  update(id, data) {
    const db = read();
    db.users = db.users.map(u => u.id === id ? { ...u, ...data } : u);
    write(db);
  },
  delete(id) {
    const db = read();
    db.users = db.users.filter(u => u.id !== id);
    write(db);
  }
};

// ── INVENTORY ──
const inventory = {
  all:    (fn) => fn ? read().inventory.filter(fn) : read().inventory,
  byId:   (id) => read().inventory.find(i => i.id === id) || null,
  cats:   ()   => [...new Set(read().inventory.map(i => i.category))].sort(),
  create(data) {
    const db = read();
    const rec = { id: nextId(db.inventory), ...data, created_at: now(), updated_at: now() };
    db.inventory.push(rec); write(db); return rec;
  },
  update(id, data) {
    const db = read();
    db.inventory = db.inventory.map(i => i.id === id ? { ...i, ...data, updated_at: now() } : i);
    write(db);
  },
  delete(id) {
    const db = read();
    const item = db.inventory.find(i => i.id === id);
    db.inventory = db.inventory.filter(i => i.id !== id);
    write(db); return item;
  }
};

// ── NOTIFICATIONS ──
const notifications = {
  all() { return [...read().notifications].sort((a,b) => b.id - a.id).slice(0, 30); },
  create(data) {
    const db = read();
    const rec = { id: nextId(db.notifications), ...data, read_status: 0, created_at: now() };
    db.notifications.push(rec); write(db); return rec;
  },
  markRead(id) {
    const db = read();
    db.notifications = db.notifications.map(n => n.id === id ? { ...n, read_status: 1 } : n);
    write(db);
  },
  clearRead() {
    const db = read();
    db.notifications = db.notifications.filter(n => !n.read_status);
    write(db);
  }
};

module.exports = { users, inventory, notifications };
