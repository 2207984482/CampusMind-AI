# CampusMind AI — Architecture

## Overview

CampusMind AI is an AI Agent SaaS platform for university students. It provides AI chat, campus knowledge base (RAG), PDF analysis, multi-agent system, study assistant, resume helper, and AI code assistant.

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                    Nginx (:80)                   │
│              Reverse Proxy / LB                  │
├──────────────────┬──────────────────────────────┤
│   Frontend       │        Backend API            │
│   Next.js 15     │        FastAPI                │
│   :3000          │        :8000                  │
├──────────────────┴──────────────────────────────┤
│         Shared Infrastructure                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │PostgreSQL│  │  Redis   │  │ File Storage  │  │
│  │:5432     │  │  :6379   │  │ (uploads/)    │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
└─────────────────────────────────────────────────┘
```

## Backend Architecture (FastAPI)

```
backend/app/
├── api/              # HTTP layer — routers, dependencies
│   ├── deps.py       # Shared dependencies (auth, DB)
│   └── v1/           # API v1 routes
│       ├── router.py   # Route aggregator
│       ├── auth.py     # /api/v1/auth/*
│       ├── users.py    # /api/v1/users/*
│       ├── chat.py     # /api/v1/chat/*
│       ├── knowledge.py # /api/v1/knowledge/*
│       └── agents.py   # /api/v1/agents/*
├── core/             # Foundation — config, DB, security, Redis
│   ├── config.py     # Pydantic Settings
│   ├── database.py   # SQLAlchemy async engine
│   ├── redis.py      # Redis client
│   ├── security.py   # JWT, password hashing
│   └── exceptions.py # AppError hierarchy
├── middleware/        # HTTP middleware
│   └── logging.py    # Request/response logging
├── models/           # SQLAlchemy ORM models
│   ├── base.py       # Base, UUIDMixin, TimestampMixin
│   ├── user.py       # User
│   ├── chat.py       # Conversation, Message
│   ├── knowledge.py  # KnowledgeBase, Document
│   └── agent.py      # Agent
├── schemas/          # Pydantic request/response schemas
├── services/         # Business logic
│   ├── auth_service.py
│   ├── chat_service.py
│   ├── rag_service.py
│   └── agent_service.py
├── tasks/            # Background tasks (Celery/FastAPI BackgroundTasks)
└── main.py           # FastAPI app entry
```

## Frontend Architecture (Next.js 15)

```
frontend/src/
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Login, Register (public)
│   ├── (dashboard)/  # Protected dashboard pages
│   │   ├── chat/       # AI Chat
│   │   ├── agents/     # Agent management
│   │   ├── knowledge/  # Knowledge base
│   │   └── settings/   # User settings
│   └── layout.tsx
├── components/       # Shared UI components
│   ├── ui/           # Atomic components (Button, Input, Card...)
│   └── layout/       # Layout components (Shell, Sidebar, Header)
├── hooks/            # Custom React hooks
│   ├── use-chat.ts
│   ├── use-agents.ts
│   └── use-knowledge.ts
├── lib/              # Frontend libraries
│   ├── api/          # Axios client + interceptors
│   └── utils/        # Utility functions (cn, format)
├── store/            # Zustand state management
│   ├── auth-store.ts
│   ├── chat-store.ts
│   └── app-store.ts
├── providers/        # React context providers
└── types/            # TypeScript type definitions
```

## Data Flow

1. **User request** → Next.js frontend → API rewrite to FastAPI backend
2. **Auth flow**: JWT access/refresh token, stored in localStorage, attached via Axios interceptor
3. **Chat flow**: POST /api/v1/chat → service calls DeepSeek API → streaming response via SSE
4. **RAG flow**: Upload document → parse + chunk → embed → store in pgvector → search via embedding similarity
5. **Agent flow**: Agent config (system prompt + settings) → chat context injection → LLM call

## Key Design Decisions

- **Async everywhere**: FastAPI async routes + SQLAlchemy async + aioredis
- **UUID primary keys**: All tables use UUID v4 for horizontal scaling safety
- **JWT auth**: Access token (15min) + Refresh token (7d) rotation pattern
- **pgvector**: Extension installed on PostgreSQL for vector similarity search
- **No ORM cascade abuse**: Relationship cascades are explicit per relationship
- **Configuration**: Pydantic Settings with .env file, no hardcoded values
