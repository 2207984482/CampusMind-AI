# CampusMind AI

AI-powered campus assistant platform — chat, RAG knowledge base, multi-agent system, PDF analysis, study assistant, resume helper, AI code assistant.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TailwindCSS, TypeScript, Zustand |
| Backend | FastAPI (Python 3.12+), SQLAlchemy 2.0 (async), Alembic |
| Database | PostgreSQL 16 + pgvector |
| Cache | Redis 7 |
| AI | OpenAI SDK, LangChain, LangGraph (DeepSeek primary) |
| Infra | Docker, Docker Compose, Nginx, GitHub Actions |

## Quick Start

```bash
# 1. Configure
cp .env.example .env
# Edit .env — add your DEEPSEEK_API_KEY and set JWT_SECRET_KEY

# 2. Install & setup
make setup

# 3. Start dev servers
make dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Project Structure

```
campusmind-ai/
├── .github/workflows/   # CI/CD (GitHub Actions)
├── backend/             # FastAPI application
│   ├── alembic/         # Database migrations
│   ├── app/
│   │   ├── api/v1/      # REST API routes
│   │   ├── core/        # Config, DB, Redis, Security
│   │   ├── middleware/   # HTTP middleware
│   │   ├── models/      # SQLAlchemy ORM models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── services/    # Business logic
│   └── tests/           # Backend tests
├── docker/              # Docker configs
├── docs/                # Architecture, API, development docs
│   ├── architecture.md
│   ├── api-design.md
│   └── development.md
├── frontend/            # Next.js 15 App Router
│   └── src/
│       ├── app/         # Pages & layouts
│       ├── components/  # Shared UI components
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # API client, utils
│       ├── store/       # Zustand state management
│       └── types/       # TypeScript types
├── scripts/             # Dev & setup scripts
├── .env.example         # Environment variables template
├── Makefile             # Task shortcuts
└── README.md
```

## API Overview

Base URL: `/api/v1`

| Module | Endpoints | Description |
|--------|-----------|-------------|
| Auth | `/auth/register`, `/auth/login`, `/auth/refresh` | JWT-based authentication |
| Chat | `/chat`, `/conversations` | AI chat with DeepSeek |
| Knowledge | `/knowledge/bases`, `/knowledge/search` | RAG knowledge base + semantic search |
| Agents | `/agents`, `/agents/{id}/chat` | Multi-agent system |

See [docs/api-design.md](docs/api-design.md) for full API specification.

## Core Features

- **AI Chat** — Conversational AI with DeepSeek, conversation history, auto-titling
- **Knowledge Base (RAG)** — Document upload (PDF/TXT/MD), chunking, embedding, semantic search
- **PDF Analysis** — PDF text extraction, summarization, Q&A over documents
- **Multi-Agent System** — Configurable agents (study assistant, resume helper, code assistant, custom)
- **Study Assistant** — Course Q&A, note summarization, exam prep
- **Resume Helper** — Resume analysis, improvement suggestions, ATS optimization
- **AI Code Assistant** — Code explanation, debugging, algorithm tutoring

## Development

```bash
make test       # Run backend tests
make lint       # Lint both projects
make migrate    # Run DB migrations
make build      # Build Docker images
make up         # Start all services via Docker
```

See [docs/development.md](docs/development.md) for detailed development guide.

## License

MIT
