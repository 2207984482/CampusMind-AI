.PHONY: dev dev-backend dev-frontend build up down test lint

dev:
	docker compose up -d postgres redis
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
	cd frontend && npm run dev

dev-backend:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

test:
	cd backend && pytest -v

lint:
	cd backend && ruff check .
	cd frontend && npx eslint src/

migrate:
	cd backend && alembic upgrade head

migrate-new:
	cd backend && alembic revision --autogenerate -m "$(msg)"
