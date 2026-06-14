# SIMS — Customer Service Dashboard

Monolithic Spring Boot backend with an Angular 17 frontend.

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+ and npm

## Run locally

### Backend (port 8080)

```bash
cd SIMS
mvn spring-boot:run
```

API base: `http://localhost:8080`

### Frontend (port 4200)

```bash
cd SIMS/frontend
npm install
npm start
```

The Angular dev server proxies API calls to the backend via `proxy.conf.json`.

Open `http://localhost:4200` in your browser.

## Project layout

```
SIMS/
├── src/main/java/com/wipro/csd/   ← controllers, services, models
├── src/main/resources/            ← application.properties
├── frontend/src/app/              ← Angular pages & services
├── data/                          ← H2 database files (gitignored)
├── Dockerfile
└── render.yaml                    ← deployment config
```

## Roles

| Role | Dashboard |
|------|-----------|
| Customer | Raise tickets, view status, chatbot |
| Representative | Assigned tickets, update status |
| Manager | Team metrics, outage map |
| Admin | Manage employees, analytics |
