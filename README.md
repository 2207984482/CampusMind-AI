# CampusMind AI

AI-powered campus assistant platform with chat, knowledge base (RAG), and customizable AI agents.

## Tech Stack

- **Frontend**: Next.js 15 + Tailwind CSS
- **Backend**: FastAPI (Python 3.12+)
- **Database**: PostgreSQL 16 + pgvector
- **Cache**: Redis 7
- **AI**: Deepseek v4pro + LangChain
- **Deployment**: Docker + Nginx

## Quick Start

```bash
# Clone and configure
cp .env.example .env
# Edit .env with your API keys

# Start all services
docker compose up -d

# Run migrations
make migrate

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Development

```bash
# Install dependencies
cd backend && pip install -r requirements.txt
cd frontend && npm install

# Start dev servers
make dev
```

## Project Structure

```
campusmind-ai/
├── frontend/          # Next.js 15 App Router
├── backend/           # FastAPI application
├── docker/            # Docker configs
└── .github/           # CI/CD workflows
```
