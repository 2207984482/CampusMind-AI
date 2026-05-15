.PHONY: dev dev-backend dev-frontend build up down test lint migrate migrate-new setup

# ── Development ──
dev:
	docker compose -f docker/docker-compose.yml up -d postgres redis
	@echo "Starting backend & frontend..."
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
	cd frontend && npm run dev

dev-backend:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

setup:
	bash scripts/setup.sh

# ── Docker ──
build:
	docker compose -f docker/docker-compose.yml build

up:
	docker compose -f docker/docker-compose.yml up -d

down:
	docker compose -f docker/docker-compose.yml down

# ── Testing ──
test:
	cd backend && pytest -v

test-cov:
	cd backend && pytest --cov=app --cov-report=term-missing

# ── Linting ──
lint:
	cd backend && ruff check .
	cd frontend && npx eslint src/ || true

lint-fix:
	cd backend && ruff check --fix .
	cd frontend && npx eslint src/ --fix || true

# ── Database ──
migrate:
	cd backend && alembic upgrade head

migrate-new:
	cd backend && alembic revision --autogenerate -m "$(msg)"

migrate-down:
	cd backend && alembic downgrade -1

# ── Cleanup ──
clean:
	find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find backend -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	rm -rf frontend/.next
