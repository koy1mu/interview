# Task Manager

A simple task management API built with Express, TypeScript, MongoDB, and Inversify.

## Context

This is a small codebase for a task management service. It has a backend API, a frontend UI, and a test suite.

We'd like you to familiarize yourself with the project — get it running, explore the functionality, and take a look at the code. When we meet, we'll pair on a few things together.

## Architecture

```
Controllers → Services → Repositories → MongoDB
                       → Facades → External APIs
```

### Layers

| Layer | Purpose |
|-------|---------|
| **Controllers** | Handle HTTP requests, map to service calls, format responses |
| **Services** | Business logic, orchestrate repositories and facades |
| **Repositories** | Database access (MongoDB CRUD operations) |
| **Facades** | External API integrations (Quote API) |
| **Models** | Domain types, error definitions |

### Key Patterns

- **Dependency Injection** via [Inversify](https://inversify.io/)
- **Functional error handling** via [neverthrow](https://github.com/supermacro/neverthrow) (`Result<T, E>`)
- **Schema validation** via [Zod](https://zod.dev/)
- **In-memory MongoDB** for testing (no external DB needed)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get a task by ID |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| POST | `/api/tasks/quote` | Create a task from a random quote |
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create a category |
| DELETE | `/api/categories/:id` | Delete a category |
| GET | `/health` | Health check |

## Getting Started

```bash
npm install
npm run dev
```

This uses an in-memory DB.

```bash
npm run start:local
```

Starts the actual docker MongoDB.

```bash
# In a separate terminal, start the frontend
cd frontend
npm install
npm run dev
```

- **Frontend**: [http://localhost:3001](http://localhost:3001)
- **API docs (Swagger UI)**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Backend**: [http://localhost:3000](http://localhost:3000)

## Testing

```bash
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:db       # Database tests only
npm run test:integration  # Integration tests only
```