# CampusMind AI — Development Guide

## Prerequisites

- Python 3.12+
- Node.js 22+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis 7 (or use Docker)

## Quick Start

```bash
# 1. Clone & configure
cp .env.example .env
# Edit .env with your API keys

# 2. Start infrastructure
docker compose -f docker/docker-compose.yml up -d postgres redis

# 3. Install dependencies
cd backend && pip install -r requirements.txt
cd frontend && npm install

# 4. Run migrations
cd backend && alembic upgrade head

# 5. Start dev servers
# Terminal 1:
cd backend && uvicorn app.main:app --reload --port 8000
# Terminal 2:
cd frontend && npm run dev

# Open http://localhost:3000
# API docs: http://localhost:8000/docs
```

Or use Makefile shortcuts:

```bash
make dev          # Start DB + both servers
make dev-backend  # Backend only
make dev-frontend # Frontend only
make build        # Build Docker images
make up           # Start all services via Docker
make test         # Run backend tests
make lint         # Lint both projects
```

## Environment Variables

See `.env.example` for full list. Critical ones:

| Variable | Description |
|----------|-------------|
| `DEEPSEEK_API_KEY` | DeepSeek API key (required for AI features) |
| `JWT_SECRET_KEY` | Random 64-char secret for JWT signing |
| `POSTGRES_PASSWORD` | Database password |
| `DATABASE_URL` | Async PostgreSQL connection string |

## Database Migrations

```bash
# Create new migration
make migrate-new msg="add-foo-table"

# Apply migrations
make migrate

# Check migration status
cd backend && alembic current
```

## Project Conventions

- **Python**: Follows `pyproject.toml` (Ruff for linting, 100 char lines)
- **TypeScript**: Strict mode, no implicit `any`
- **Commits**: Conventional Commits — `feat(scope): description`, `fix(scope): description`
- **Branching**: `main` (stable), `dev` (development), `feature/*`, `fix/*`
- **Code style**: 2-space indent, no trailing whitespace, final newline

## Testing

```bash
# Backend
cd backend && pytest -v

# Frontend (coming soon)
cd frontend && npm test
```

## Docker Deployment

```bash
# Build and start all services
docker compose -f docker/docker-compose.yml up -d --build

# Services:
#   frontend  → :3000 (Next.js)
#   backend   → :8000 (FastAPI)
#   postgres  → :5432
#   redis     → :6379
#   nginx     → :80 (reverse proxy)
```
