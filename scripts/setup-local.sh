#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "Install pnpm first: npm install -g pnpm" >&2
  exit 1
fi

if [ ! -f .env.local ]; then
  secret="$(openssl rand -base64 32 | tr -d '\n')"
  cat > .env.local <<EOF
AUTH_SECRET=${secret}
POSTGRES_URL=postgres://steady:steady@127.0.0.1:5432/steady
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_CHAT_MODEL=llama3.1:latest
OLLAMA_REASONING_MODEL=llama3.1:latest
OLLAMA_SMALL_MODEL=llama3.1:latest
OLLAMA_API_KEY=ollama
EOF
  echo "Wrote .env.local (gitignored). AUTH_SECRET was generated. No OpenAI key."
else
  echo ".env.local already exists; leaving it as-is."
fi

if command -v docker >/dev/null 2>&1; then
  docker compose up -d postgres
  echo "Waiting for Postgres..."
  for _ in $(seq 1 30); do
    if docker compose exec -T postgres pg_isready -U steady -d steady >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
else
  echo "Docker not found. Start Postgres yourself and keep POSTGRES_URL in .env.local."
fi

pnpm install
pnpm db:migrate

echo
echo "Next:"
echo "  1. Install Ollama from https://ollama.com and run:  ollama pull llama3.1"
echo "     Or start the compose Ollama service:  docker compose up -d ollama"
echo "     then:  docker compose exec ollama ollama pull llama3.1"
echo "  2. pnpm dev"
echo "  3. Open http://localhost:3000 then http://localhost:3000/app"
echo
echo "Do not commit .env.local. Do not put OpenAI keys in this project."
