# Discovery Hub

Discovery Hub is a full-stack content discovery platform that aggregates:
- videos
- products
- research papers

It includes personalized recommendations, AI-style categorization/tagging, community collections, and search/filter support.

## Stack

- **Frontend:** Next.js + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **Infra:** Docker Compose

## Quick Start (Docker)

1. In project root:
   ```bash
   docker compose up --build
   ```
2. Open:
   - Frontend: `http://localhost:3000`
   - Backend health: `http://localhost:5000/health` (Docker; container port 5000)

## Local Start (without Docker)

### 1) Database
Create the DB and apply schema:
```bash
createdb content_discovery
psql content_discovery -f db-schema.sql
```

### 2) Backend
Uses port **5001** by default (macOS AirPlay blocks port 5000 with 403 errors).

```bash
cd backend
cp .env.example .env
npm install
npm run build
npm run dev
```

Health check: `http://localhost:5001/health`

### 3) Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`

## API Highlights

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/content/discover?q=ai&source=all&limit=12`
- `POST /api/content/sync` (auth required)
- `POST /api/content/categorize` (auth required)
- `GET /api/recommendations/feed` (auth required)
- `GET /api/users/me` (auth required)
- `PATCH /api/users/me` (auth required)
- `GET /api/collections/public`
- `POST /api/collections` (auth required)
# content-discovery
