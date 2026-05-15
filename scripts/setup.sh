#!/usr/bin/env bash
set -euo pipefail

echo "=== CampusMind AI — Project Setup ==="

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "python3 required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "node required"; exit 1; }

# Create .env if missing
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example — review and add your API keys"
fi

# Start infrastructure
docker compose -f docker/docker-compose.yml up -d postgres redis
echo "Infrastructure started (postgres, redis)"

# Python backend
cd backend
python3 -m venv .venv 2>/dev/null || true
source .venv/Scripts/activate 2>/dev/null || source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
echo "Backend setup done"

# Node frontend
cd ../frontend
npm install
echo "Frontend setup done"

echo ""
echo "=== Setup complete ==="
echo "Run 'make dev' to start development servers"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000/docs"
