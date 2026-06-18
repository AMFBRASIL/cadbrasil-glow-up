#!/bin/bash
# aaPanel / PM2 — inicia Next.js em produção (Vercel não usa este arquivo)
set -e
cd "$(dirname "$0")"

NODE_BIN="${AAPANEL_NODE_BIN:-/www/server/nodejs/v22.13.1/bin/node}"
PORT="${PORT:-3015}"

export NODE_ENV=production
export PORT

if [ ! -f "node_modules/next/dist/bin/next" ]; then
  echo "ERRO: rode npm install antes de iniciar."
  exit 1
fi

if [ ! -f ".next/BUILD_ID" ]; then
  echo "ERRO: rode npm run build antes de iniciar."
  exit 1
fi

exec "$NODE_BIN" node_modules/next/dist/bin/next start -p "$PORT"
