#!/usr/bin/env bash
set -euo pipefail

# Start infrastructure if not running
docker compose -f docker/docker-compose.yml up -d postgres redis

# Start backend & frontend in background
cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd frontend && npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
