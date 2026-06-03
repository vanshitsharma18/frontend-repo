# 🚨 IncidentHub — Frontend Dashboard

> A production-grade, cloud-native React + TypeScript dashboard for operational incident management.
> Designed to look and feel like **PagerDuty / Datadog / Grafana** with a modern dark SRE aesthetic.

---

## ✨ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 5 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3 |
| State / Data | TanStack React Query v5 |
| Routing | React Router v6 |
| HTTP | Axios (with interceptors) |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Containerization | Docker + Nginx |
| Deployment | Google Cloud Run |

---

## 📁 Project Structure

```
frontend-repo/
├── src/
│   ├── App.tsx                        ← RouterProvider
│   ├── main.tsx                       ← QueryClient + Toaster + mount
│   ├── index.css                      ← Tailwind + design system
│   ├── types/index.ts                 ← All TypeScript types
│   ├── services/api.ts                ← Axios service (reads VITE_API_URL)
│   ├── hooks/
│   │   ├── useIncidents.ts            ← CRUD React Query hooks
│   │   └── useAnalysis.ts             ← Analysis mutation hook
│   ├── routes/index.tsx               ← React Router config
│   ├── layouts/AppLayout.tsx          ← Sidebar + Navbar shell
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── MetricCard.tsx
│   │   ├── IncidentTable.tsx
│   │   ├── SeverityBadge.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── Charts/
│   │       ├── SeverityChart.tsx      ← Recharts PieChart
│   │       ├── StatusChart.tsx        ← Recharts BarChart
│   │       └── TrendChart.tsx         ← Recharts AreaChart
│   └── pages/
│       ├── Dashboard.tsx              ← / (overview)
│       ├── Incidents.tsx              ← /incidents (list + filter)
│       ├── IncidentDetails.tsx        ← /incidents/:id
│       ├── CreateIncident.tsx         ← /incidents/create
│       ├── Analysis.tsx               ← /analysis (AI)
│       └── Monitoring.tsx             ← /monitoring
├── Dockerfile                         ← Multi-stage node + nginx
├── nginx.conf                         ← SPA fallback + gzip + caching
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── .env.example
└── package.json
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend-repo
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local — set VITE_API_URL to your backend URL
```

### 3. Run Dev Server

```bash
npm run dev
# → http://localhost:5173
```

### 4. Build for Production

```bash
npm run build
# → dist/ directory ready to serve
```

---

## 🌐 Pages

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | 5 KPI cards + charts + recent incidents |
| `/incidents` | Incidents | Full list with search + filter + pagination |
| `/incidents/create` | Create | Form with visual severity selector |
| `/incidents/:id` | Details | Full detail + inline status edit + delete |
| `/analysis` | AI Analysis | Chat-style interface, rule-based engine |
| `/monitoring` | Monitoring | MTTR + trend charts + 14-day area chart |

---

## 🔌 API Integration

All API calls use the `VITE_API_URL` environment variable set in `.env.local`:

```env
# Local backend
VITE_API_URL=http://localhost:8080

# Cloud Run
VITE_API_URL=https://incident-api-xxxxx.a.run.app
```

The Axios instance in [api.ts](src/services/api.ts) automatically applies this base URL to all requests.

---

## 🐳 Docker

```bash
# Build (inject API URL at build time)
docker build \
  --build-arg VITE_API_URL=https://incident-api-xxxxx.a.run.app \
  -t incident-frontend:latest .

# Run locally
docker run -p 8080:8080 incident-frontend:latest

# Open: http://localhost:8080
```

---

## ☁️ Cloud Run Deployment

```bash
# Push to Artifact Registry
docker build \
  --build-arg VITE_API_URL=https://your-backend.a.run.app \
  -t REGION-docker.pkg.dev/PROJECT_ID/REPO/incident-frontend:latest .

docker push REGION-docker.pkg.dev/PROJECT_ID/REPO/incident-frontend:latest

# Deploy
gcloud run deploy incident-frontend \
  --image REGION-docker.pkg.dev/PROJECT_ID/REPO/incident-frontend:latest \
  --region REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

---

## 🔮 Future Enhancements

| Phase | Feature |
|---|---|
| ✅ Phase 1 | Full dashboard, CRUD, rule-based AI analysis |
| 🔄 Phase 2 | Google IAP authentication + login page |
| 📊 Phase 3 | Real-time WebSocket updates |
| 🔔 Phase 4 | Push notifications |
| 📱 Phase 5 | Mobile PWA |
