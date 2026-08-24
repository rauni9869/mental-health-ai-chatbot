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
# Recommended on a laptop: hosted Llama. Do not run llama3.1 locally.
GROQ_API_KEY=
GROQ_CHAT_MODEL=openai/gpt-oss-20b
GROQ_REASONING_MODEL=openai/gpt-oss-20b
GROQ_SMALL_MODEL=openai/gpt-oss-20b
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
echo "  1. Get a free Groq key: https://console.groq.com/keys"
echo "     Paste it as GROQ_API_KEY in .env.local (do not run llama3.1 on a laptop)"
echo "  2. pnpm dev"
echo "  3. Open http://localhost:3000 then http://localhost:3000/app"
echo "  4. Quit the Ollama app so it is not using RAM"
echo
echo "Do not commit .env.local. Do not put OpenAI keys in this project."
