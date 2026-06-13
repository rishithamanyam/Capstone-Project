const API = '/api';

function getToken() { return localStorage.getItem('sims_token'); }
function getUser()  { return JSON.parse(localStorage.getItem('sims_user') || '{}'); }

function logout() {
  localStorage.removeItem('sims_token');
  localStorage.removeItem('sims_user');
  location.href = '/';
}

function requireAuth() {
  if (!getToken()) { location.href = '/'; return false; }
  return true;
}

function hdrs() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() };
}

async function get(path) {
  try {
    const r = await fetch(API + path, { headers: hdrs() });
    if (r.status === 401) { logout(); return null; }
    return r.json();
  } catch { showToast('Cannot reach server', 'error'); return null; }
}

async function send(path, method, body) {
  try {
    const r = await fetch(API + path, { method, headers: hdrs(), body: JSON.stringify(body) });
    if (r.status === 401) { logout(); return null; }
    return r.json();
  } catch { showToast('Cannot reach server', 'error'); return null; }
}

function showToast(msg, type = 'success') {
  let rack = document.getElementById('toast-rack');
  if (!rack) {
    rack = document.createElement('div');
    rack.id = 'toast-rack';
    rack.className = 'toast-rack';
    document.body.appendChild(rack);
  }
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = `<span style="font-size:16px">${icons[type]||'ℹ'}</span><span>${msg}</span>`;
  rack.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 3400);
}

function sidebar(active) {
  const u = getUser();
  const ini = (u.name || 'U')[0].toUpperCase();
  const links = [
    { id: 'dashboard', href: '/dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'inventory', href: '/inventory', icon: '📦', label: 'Inventory' },
    { id: 'analytics', href: '/analytics', icon: '📈', label: 'Analytics' },
    { id: 'settings',  href: '/settings',  icon: '⚙️', label: 'Settings' },
  ];
  if (u.role === 'admin') links.push({ id: 'users', href: '/settings#users', icon: '👥', label: 'Users' });

  return `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-mark">📦</div>
        <div>
          <div class="brand-label">SIMS</div>
          <div class="brand-sub">Inventory System</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-label">Navigation</div>
        ${links.map(l => `
          <a href="${l.href}" class="nav-link ${active === l.id ? 'active' : ''}">
            <span class="nav-icon">${l.icon}</span>
            <span>${l.label}</span>
          </a>`).join('')}
      </nav>
      <div class="sidebar-bottom">
        <div class="user-row">
          <div class="uavatar">${ini}</div>
          <div>
            <div class="uname">${u.name || 'User'}</div>
            <div class="urole">${u.role || 'staff'}</div>
          </div>
          <button class="logout-btn" onclick="logout()" title="Logout">⏏</button>
        </div>
      </div>
    </aside>`;
}

function topbar(title, crumb) {
  return `
    <header class="topbar">
      <div>
        <div class="page-title">${title}</div>
        <div class="breadcrumb">${crumb}</div>
      </div>
      <div class="topbar-right">
        <div class="notif-wrap">
          <button class="notif-btn" onclick="toggleNotifs()" title="Notifications">🔔
            <span class="nbadge" id="nbadge" style="display:none">0</span>
          </button>
        </div>
      </div>
    </header>`;
}

async function toggleNotifs() {
  const panel = document.getElementById('notif-panel');
  if (panel) { panel.remove(); return; }

  const data = await get('/analytics/notifications');
  if (!data) return;

  const icons = { warning: '⚠️', info: 'ℹ️', error: '❌', success: '✅' };
  const p = document.createElement('div');
  p.id = 'notif-panel';
  p.style.cssText = 'position:fixed;top:65px;right:18px;width:350px;max-height:440px;background:white;border-radius:14px;box-shadow:0 8px 36px rgba(0,0,0,0.14);z-index:300;overflow:hidden;border:1px solid #e2e8f0';

  const list = data.length
    ? data.map(n => `<div style="padding:13px 16px;border-bottom:1px solid #f1f5f9;display:flex;gap:10px;opacity:${n.read_status?0.45:1}"><span style="font-size:17px;flex-shrink:0">${icons[n.type]||'ℹ️'}</span><div><div style="font-size:13px;font-weight:500">${n.message}</div><div style="font-size:11px;color:#94a3b8;margin-top:3px">${new Date(n.created_at).toLocaleString()}</div></div></div>`).join('')
    : '<div style="padding:40px;text-align:center;color:#94a3b8">No notifications</div>';

  p.innerHTML = `<div style="padding:14px 18px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center"><strong style="font-size:14px">Notifications</strong><span style="font-size:12px;color:#6366f1;cursor:pointer;font-weight:600" onclick="clearNotifs()">Clear read</span></div><div style="overflow-y:auto;max-height:380px">${list}</div>`;

  document.body.appendChild(p);
  setTimeout(() => document.addEventListener('click', function h(e) {
    if (!p.contains(e.target)) { p.remove(); document.removeEventListener('click', h); }
  }), 100);
}

async function clearNotifs() {
  await send('/analytics/notifications/clear', 'DELETE');
  document.getElementById('notif-panel')?.remove();
  loadNbadge();
}

async function loadNbadge() {
  const data = await get('/analytics/notifications');
  if (!data) return;
  const unread = data.filter(n => !n.read_status).length;
  const el = document.getElementById('nbadge');
  if (el) { el.textContent = unread; el.style.display = unread ? 'flex' : 'none'; }
}

function fmt(n) {
  return '$' + parseFloat(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function stockBadge(qty, min) {
  if (qty === 0)       return '<span class="badge b-red">Out of Stock</span>';
  if (qty <= min)      return '<span class="badge b-amber">Low Stock</span>';
  if (qty <= min * 2)  return '<span class="badge b-cyan">Medium</span>';
  return '<span class="badge b-green">Good</span>';
}

function catBadge(cat) {
  const map = { Electronics: 'b-elec', Furniture: 'b-furn', Stationery: 'b-stat', Office: 'b-off', Appliances: 'b-app', Hygiene: 'b-hyg' };
  return `<span class="badge ${map[cat]||'b-gray'}">${cat}</span>`;
}
