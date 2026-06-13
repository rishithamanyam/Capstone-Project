const API = '';

function getToken()  { return sessionStorage.getItem('token'); }
function getUser()   { return JSON.parse(sessionStorage.getItem('user') || 'null'); }
function setSession(data) { sessionStorage.setItem('token', data.token); sessionStorage.setItem('user', JSON.stringify(data)); }

function logout() { sessionStorage.clear(); window.location.href = '/index.html'; }

function requireAuth(allowedRoles) {
  const token = getToken();
  const user  = getUser();
  if (!token || !user) { window.location.href = '/index.html'; return false; }
  if (allowedRoles && !allowedRoles.includes(user.role)) { window.location.href = '/index.html'; return false; }
  return true;
}

async function api(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  if (res.status === 401 || res.status === 403) { logout(); return null; }
  const text = await res.text();
  if (!text) return { success: res.ok };
  try { return JSON.parse(text); }
  catch { return { success: res.ok, message: text }; }
}

function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

function buildAvatar(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function fmtHrs(hrs) {
  if (hrs == null) return '—';
  const h = Math.floor(hrs);
  const m = Math.round((hrs - h) * 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function statusBadge(s) {
  const map = { OPEN: 'b-amber', IN_PROGRESS: 'b-blue', CLOSED: 'b-green' };
  const labels = { OPEN: 'Open', IN_PROGRESS: 'In Progress', CLOSED: 'Closed' };
  return `<span class="badge ${map[s] || 'b-gray'}">${labels[s] || s}</span>`;
}

function roleBadge(r) {
  const map = { ADMIN: 'b-red', MANAGER: 'b-violet', REPRESENTATIVE: 'b-indigo', CUSTOMER: 'b-cyan' };
  return `<span class="badge ${map[r] || 'b-gray'}">${r}</span>`;
}

function wavesvg(opacity = '.15') {
  return `<svg class="wave" viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M0 30 Q100 0 200 30 Q300 60 400 30 L400 60 L0 60 Z" fill="white" opacity="${opacity}"/></svg>`;
}

async function loadNotifCount() {
  const data = await api('/api/notifications/count');
  if (!data) return;
  const badge = document.querySelector('.notif-badge');
  if (badge) {
    badge.textContent = data.count;
    badge.style.display = data.count > 0 ? 'block' : 'none';
  }
}

async function loadNotifPanel() {
  const data = await api('/api/notifications');
  if (!data) return;
  const list  = document.getElementById('notif-list');
  if (!list) return;
  list.innerHTML = data.length === 0
    ? '<div class="empty-state"><p>No notifications</p></div>'
    : data.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markRead(${n.id}, this)">
        <span class="notif-type type-${n.type}"></span>
        <div class="ni-msg">${n.message}</div>
        <div class="ni-time">${fmtDateTime(n.createdAt)}</div>
      </div>`).join('');
}

async function markRead(id, el) {
  await api(`/api/notifications/${id}/read`, 'PUT');
  el.classList.remove('unread');
  await loadNotifCount();
}

async function clearNotifs() {
  await api('/api/notifications/clear', 'DELETE');
  await loadNotifPanel();
  await loadNotifCount();
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  const open = panel.classList.toggle('open');
  if (open) { loadNotifPanel(); }
}

function initTopbar() {
  const user = getUser();
  if (!user) return;
  const ta = document.getElementById('topbar-avatar');
  if (ta) ta.textContent = buildAvatar(user.name);
  const nb = document.querySelector('.notif-badge');
  if (nb) loadNotifCount();
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('notif-panel');
    const btn   = document.getElementById('notif-btn');
    if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
}

function buildSidebar(role, activePage) {
  const user = getUser();
  const el   = document.getElementById('sidebar');
  if (!el) return;

  const navs = {
    ADMIN: [
      { icon: '📊', label: 'Dashboard', page: 'admin' },
      { icon: '👥', label: 'Employees', page: 'admin-emp' },
      { icon: '🎫', label: 'All Tickets', page: 'admin-tickets' },
      { icon: '📋', label: 'Profile', page: 'profile' },
    ],
    MANAGER: [
      { icon: '📊', label: 'Dashboard', page: 'manager' },
      { icon: '🎫', label: 'Team Tickets', page: 'manager-tickets' },
      { icon: '⚡', label: 'Outages', page: 'manager-outage' },
      { icon: '📋', label: 'Profile', page: 'profile' },
    ],
    REPRESENTATIVE: [
      { icon: '📊', label: 'Dashboard', page: 'rep' },
      { icon: '🎫', label: 'My Tickets', page: 'rep-tickets' },
      { icon: '🔍', label: 'Search', page: 'rep-search' },
      { icon: '📋', label: 'Profile', page: 'profile' },
    ],
    CUSTOMER: [
      { icon: '📊', label: 'Dashboard', page: 'customer' },
      { icon: '🎫', label: 'My Tickets', page: 'customer-tickets' },
      { icon: '📞', label: 'Support', page: 'customer-support' },
      { icon: '📋', label: 'Profile', page: 'profile' },
    ],
  };

  const items = navs[role] || [];
  el.innerHTML = `
    <div class="sidebar-logo">
      <div class="logo-icon">🎯</div>
      <div><span>CSD</span><small>Service Dashboard</small></div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">Navigation</div>
      ${items.map(i => `
        <div class="nav-item ${activePage === i.page ? 'active' : ''}" onclick="navTo('${i.page}')">
          <span class="ni">${i.icon}</span>
          <span>${i.label}</span>
        </div>`).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user" onclick="logout()">
        <div class="avatar">${buildAvatar(user?.name)}</div>
        <div class="sidebar-user-info">
          <div class="name">${user?.name || ''}</div>
          <div class="role-badge">${role}</div>
        </div>
      </div>
    </div>
  `;
}

function navTo(page) {
  const pages = {
    admin: '/admin.html',
    'admin-emp': '/admin.html#employees',
    'admin-tickets': '/admin.html#tickets',
    manager: '/manager.html',
    'manager-tickets': '/manager.html#tickets',
    'manager-outage': '/manager.html#outage',
    rep: '/representative.html',
    'rep-tickets': '/representative.html#tickets',
    'rep-search': '/representative.html#search',
    customer: '/customer.html',
    'customer-tickets': '/customer.html#tickets',
    'customer-support': '/customer.html#support',
    profile: '/profile.html',
  };
  const url = pages[page];
  if (url) window.location.href = url;
}

const BOT_RESPONSES = [
  { k: ['hello','hi','hey','greetings'], r: "Hello! Welcome to CSD Support. I'm here to help you with any service-related queries. How can I assist you today?" },
  { k: ['internet','wifi','connection','network','broadband'], r: "For internet issues, please try: 1) Restart your router by unplugging for 30 seconds. 2) Check all cable connections. 3) Try connecting via Ethernet. If the issue persists, I can raise a support ticket for you." },
  { k: ['slow','speed','lag','fast'], r: "Slow speeds can be caused by network congestion or equipment issues. Try running a speed test at fast.com. If you're getting less than your plan speed, please raise a support ticket and our team will investigate." },
  { k: ['tv','channel','cable','signal'], r: "For TV/cable issues: 1) Check all HDMI/coaxial cable connections. 2) Restart your set-top box. 3) Re-scan channels from Settings. If channels are still missing, we'll send a technician." },
  { k: ['billing','payment','invoice','charge','bill'], r: "For billing queries, you can view your invoices in the account section. If you notice an incorrect charge, please raise a ticket under 'Billing' domain and our team will review it within 24 hours." },
  { k: ['plan','upgrade','subscription','package'], r: "We offer three plans: Basic (₹499/mo - 25 Mbps), Standard (₹799/mo - 100 Mbps), and Premium (₹1199/mo - 300 Mbps + TV). Contact us to upgrade your plan anytime!" },
  { k: ['mobile','4g','lte','sim','data'], r: "For mobile data issues: 1) Toggle airplane mode on/off. 2) Check APN settings. 3) Reinsert your SIM card. If still facing issues, raise a ticket under 'Mobile Data'." },
  { k: ['phone','call','landline','voice'], r: "For voice/phone issues: 1) Check if the handset is properly connected. 2) Listen for a dial tone. 3) Try a different phone. If calls are dropping, raise a support ticket." },
  { k: ['outage','down','offline'], r: "There may be an outage in your area. You can check the outage map on your dashboard. Our team is actively working to restore services as quickly as possible." },
  { k: ['password','login','account','forgot'], r: "For login issues, click 'Forgot Password' on the login page. For account-related queries, go to Profile Settings. Need more help? I can raise a support ticket for you." },
  { k: ['ticket','complaint','issue','problem','help'], r: "I can help you raise a support ticket! Go to 'My Tickets' → 'Raise New Ticket', select your domain, and describe the issue. Our team responds within 2 hours." },
  { k: ['thank','thanks','bye','goodbye'], r: "You're welcome! Is there anything else I can help you with? Our support team is available 24/7." },
];

function getBotResponse(input) {
  const lower = input.toLowerCase();
  for (const entry of BOT_RESPONSES) {
    if (entry.k.some(k => lower.includes(k))) return entry.r;
  }
  return "I understand you need help with: \"" + input + "\". Let me connect you to our support team. Please raise a ticket from the 'My Tickets' section and a representative will contact you shortly.";
}

function initChatbot() {
  const fab  = document.getElementById('chat-fab');
  const win  = document.getElementById('chat-window');
  const msgs = document.getElementById('chat-messages');
  const inp  = document.getElementById('chat-input');
  const send = document.getElementById('chat-send');

  if (!fab) return;

  fab.onclick = () => { win.classList.toggle('open'); if (win.classList.contains('open') && msgs.children.length === 0) addBotMsg("Hi! I'm CSD Virtual Assistant 🤖 How can I help you today? Ask me about internet, billing, plans, or any service issue!"); };
  document.getElementById('chat-close').onclick = () => win.classList.remove('open');

  function addBotMsg(text) {
    const d = document.createElement('div');
    d.className = 'msg-bot'; d.textContent = text;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }
  function addUserMsg(text) {
    const d = document.createElement('div');
    d.className = 'msg-user'; d.textContent = text;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }
  function sendMessage() {
    const text = inp.value.trim(); if (!text) return;
    inp.value = '';
    addUserMsg(text);
    setTimeout(() => addBotMsg(getBotResponse(text)), 600);
  }

  send.onclick = sendMessage;
  inp.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
}
