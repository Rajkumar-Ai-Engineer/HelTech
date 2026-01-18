# Docker Setup Guide for HealthAI

## Prerequisites
- Docker installed
- Docker Compose installed

## Environment Setup

### 1. Create Environment File

Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` and fill in your actual API keys:

```env
# Backend API Keys
GROQ_API_KEY=your_actual_groq_key
HUGGINGFACE_API_KEY=your_actual_huggingface_key
LANGSMITH_API_KEY=your_actual_langsmith_key
LANGSMITH_PROJECT=your_project_name

# Supabase (Backend - Service Role Key)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_actual_service_role_key

# Supabase (Frontend - Anon Key)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key
```

**Important Notes:**
- `SUPABASE_KEY` = Service Role Key (backend only, never exposed)
- `VITE_SUPABASE_ANON_KEY` = Anon/Public Key (frontend, safe to expose)
- Never commit `.env` to version control

## Build & Run

### Using Docker Compose (Recommended)
```bash
docker-compose up --build
```

### Using Docker CLI
```bash
# Build image
docker build -t healthai:latest \
  --build-arg VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
  --build-arg VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
  .

# Run container
docker run -p 8000:8000 -p 5173:5173 \
  --env-file .env \
  healthai:latest
```

## Access

- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **Health Check**: http://localhost:8000/api/health

## Architecture

### Multi-Stage Build
1. **Backend Builder**: Python 3.11 with uv for fast dependency installation
2. **Frontend Builder**: Node 20 Alpine for Vite build
3. **Runtime**: Python 3.11 slim with both services

### Process Management
- Uses **Supervisor** to manage both backend and frontend processes
- Auto-restart on failure
- Proper signal handling
- Unified logging to stdout/stderr

## Services

- **Backend**: FastAPI on port 8000 (managed by supervisor)
- **Frontend**: Static files served by `serve` on port 5173 (managed by supervisor)

## Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f healthai

# View supervisor logs
docker exec healthai-app supervisorctl status
```

## Stop

```bash
docker-compose down
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Check supervisor status
docker exec healthai-app supervisorctl status
```

### Frontend not loading
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env`
- Rebuild with `docker-compose up --build`

### Backend errors
- Check `GROQ_API_KEY` and other backend keys are set
- Verify Supabase `SUPABASE_KEY` (service role) is correct

## Notes

- Uses Python 3.11 slim image for backend
- Uses Node 20 alpine for frontend build
- Multi-stage build for optimized image size (~500MB)
- uv for fast Python dependency management
- Supervisor for reliable process management
- Auto-restart on failure
- Production-ready configuration (no dev volumes)
