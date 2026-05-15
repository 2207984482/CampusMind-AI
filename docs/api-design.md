# CampusMind AI — API Design

Base URL: `/api/v1`

## API Conventions

- **Response format**:
```json
{
  "code": 0,          // 0 = success, 4xxxx = client error, 5xxxx = server error
  "message": "ok",
  "data": {}           // null or typed response
}
```
- **Auth**: Bearer token in `Authorization` header
- **Pagination**: `?page=1&page_size=20` query params
- **Error codes**: `40100` unauthorized, `40300` forbidden, `40400` not found, `40900` conflict

## Endpoints

### Auth — `/api/v1/auth`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login, returns access + refresh tokens |
| POST | `/refresh` | Refresh access token |
| GET | `/me` | Get current user profile |

### Users — `/api/v1/users`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profile` | Get own profile |
| PUT | `/profile` | Update profile |

### Chat — `/api/v1/chat`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/chat` | Send message, returns AI response |
| GET | `/conversations` | List user conversations (paginated) |
| DELETE | `/conversations/{id}` | Delete conversation |

### Knowledge — `/api/v1/knowledge`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/bases` | Create knowledge base |
| GET | `/bases` | List knowledge bases |
| POST | `/bases/{id}/documents` | Upload document (PDF/TXT/MD) |
| POST | `/search` | Semantic search across documents |

### Agents — `/api/v1/agents`

| Method | Path | Description |
|--------|------|-------------|
| POST | `` | Create custom agent |
| GET | `` | List agents (own + public, paginated) |
| GET | `/{id}` | Get agent detail |
| PUT | `/{id}` | Update agent |
| DELETE | `/{id}` | Delete agent |
| POST | `/{id}/chat` | Chat with specific agent |

## Authentication Flow

1. `POST /auth/register` → creates user
2. `POST /auth/login` → returns `{ access_token, refresh_token }`
3. Frontend stores tokens in localStorage
4. Axios interceptor attaches `Authorization: Bearer <access_token>` to all requests
5. On 401, interceptor calls `POST /auth/refresh` with refresh_token, retries original request
6. Refresh fails → redirect to `/login`
