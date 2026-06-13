# Smart Inventory Management System (SIMS)

**Developer:** Rishitha Manyam  
**Organization:** Wipro Capstone Project

---

## What is SIMS?

A full-stack web application to manage inventory in real time. Track stock levels, get low-stock alerts, view analytics charts, and manage users — all from a clean, colorful dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Database | JSON file store (no setup needed) |
| Auth | JWT + bcrypt (RBAC) |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Charts | Chart.js |

---

## Setup & Run

### 1. Install Node.js
Download from: https://nodejs.org (version 18 or higher)

### 2. Clone the repository
```bash
git clone https://github.com/rishithamanyam/Capstone-Project.git
cd Capstone-Project
```

### 3. Install dependencies
```bash
npm install
```

### 4. Create the .env file
Create a file called `.env` in the project root and add:
```
PORT=3000
JWT_SECRET=sims_rishitha_manyam_2024_secure_key
```

### 5. Start the server
```bash
npm start
```

### 6. Open in browser
Go to: **http://localhost:3000**

---

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sims.com | admin123 |
| Staff | staff@sims.com | staff123 |

---

## Pages & Features

| Page | URL | What it does |
|------|-----|-------------|
| Login | `/` | Login / Register |
| Dashboard | `/dashboard` | Stats, charts, low-stock alerts |
| Inventory | `/inventory` | Add, edit, delete, search, filter items |
| Analytics | `/analytics` | 4 charts + full stock report + print |
| Settings | `/settings` | Profile, password change, user management |

---

## API Endpoints

### Auth
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register new staff
- `GET /api/auth/me` — Get current user
- `PUT /api/auth/change-password` — Change password

### Inventory
- `GET /api/inventory` — Get all items (supports `?search=` and `?category=`)
- `GET /api/inventory/:id` — Get single item
- `POST /api/inventory` — Add item
- `PUT /api/inventory/:id` — Update item
- `DELETE /api/inventory/:id` — Delete item
- `GET /api/inventory/categories` — Get all categories

### Analytics
- `GET /api/analytics/summary` — Stats summary
- `GET /api/analytics/low-stock` — Items below minimum
- `GET /api/analytics/by-category` — Group by category
- `GET /api/analytics/stock-status` — Health breakdown
- `GET /api/analytics/report` — Full report

### Users (Admin only)
- `GET /api/users` — List all users
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user

---

## Project Structure

```
SIMS/
├── server.js          — Entry point
├── database.js        — Seed data on startup
├── store.js           — JSON file database
├── middleware/
│   └── auth.js        — JWT middleware
├── routes/
│   ├── auth.js
│   ├── inventory.js
│   ├── analytics.js
│   └── users.js
└── public/
    ├── index.html     — Login page
    ├── dashboard.html
    ├── inventory.html
    ├── analytics.html
    ├── settings.html
    ├── css/style.css
    └── js/app.js
```
