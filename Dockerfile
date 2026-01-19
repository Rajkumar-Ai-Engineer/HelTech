# Multi-stage build for HealthAI project

# Stage 1: Backend
FROM python:3.11-slim as backend-builder

WORKDIR /app/backend

# Install uv
RUN pip install uv

# Copy backend files
COPY Backend/requirements.txt .
COPY Backend/pyproject.toml .
COPY Backend/uv.lock .

# Create virtual environment with uv
RUN uv venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies
RUN uv pip install -r requirements.txt

# Copy backend code
COPY Backend/HealthCare ./HealthCare
COPY Backend/googlevisionAPI ./googlevisionAPI
COPY Backend/main.py .

# Stage 2: Frontend
FROM node:20-alpine as frontend-builder

WORKDIR /app/frontend

# Build arguments for frontend environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set environment variables for build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Copy frontend files
COPY Frontend/package*.json ./
RUN npm ci

# Copy frontend source
COPY Frontend/src ./src
COPY Frontend/public ./public
COPY Frontend/index.html .
COPY Frontend/vite.config.js .
COPY Frontend/tsconfig.json .

# Build frontend
RUN npm run build

# Stage 3: Runtime
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from backend builder
COPY --from=backend-builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy backend
COPY --from=backend-builder /app/backend /app/backend

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist
COPY --from=frontend-builder /app/frontend/package.json /app/frontend/

# Install serve for frontend
RUN npm install -g serve

# Copy supervisor config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 8000 5173

# Use supervisor to manage both services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
