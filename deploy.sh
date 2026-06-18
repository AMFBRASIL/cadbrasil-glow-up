#!/bin/bash
# Atualiza o projeto no servidor: git pull → npm install → build → PM2 restart
# Uso: ./deploy.sh
# Vercel não usa este script (deploy automático no push).

set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
PM2_NAME="${PM2_NAME:-cadbrasil-glow-up}"
PORT="${PORT:-3015}"
GIT_BRANCH="${GIT_BRANCH:-main}"
NODE_BIN="${AAPANEL_NODE_BIN:-/www/server/nodejs/v22.13.1/bin/node}"
RUN_USER="${RUN_USER:-}" # ex.: www — ajusta dono dos arquivos após o deploy

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

die() {
  log "ERRO: $*"
  exit 1
}

cd "$APP_DIR"
log "Diretório: $APP_DIR"

command -v git >/dev/null || die "git não encontrado"
command -v npm >/dev/null || die "npm não encontrado"
command -v pm2 >/dev/null || die "pm2 não encontrado"
[ -x "$NODE_BIN" ] || die "Node não encontrado em $NODE_BIN"

log "Buscando atualizações (branch: $GIT_BRANCH)..."
git fetch origin "$GIT_BRANCH"

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/$GIT_BRANCH")"

if [ "$LOCAL" = "$REMOTE" ]; then
  log "Repositório já está atualizado ($LOCAL)."
else
  log "Atualizando $LOCAL → $REMOTE"
  git pull origin "$GIT_BRANCH"
fi

log "Instalando dependências..."
npm install

log "Gerando build de produção..."
npm run build

[ -f ".next/BUILD_ID" ] || die "Build falhou — .next/BUILD_ID não existe"

mkdir -p logs

if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  log "Reiniciando PM2 ($PM2_NAME)..."
  pm2 restart "$PM2_NAME" --update-env
else
  log "Processo PM2 não existe — iniciando ($PM2_NAME)..."
  pm2 start "$NODE_BIN" \
    --name "$PM2_NAME" \
    --cwd "$APP_DIR" \
    --node-args="" \
    -- node_modules/next/dist/bin/next start -p "$PORT"
fi

pm2 save

if [ -n "$RUN_USER" ]; then
  log "Ajustando permissões para $RUN_USER..."
  chown -R "$RUN_USER:$RUN_USER" "$APP_DIR"
fi

log "Deploy concluído."
pm2 status "$PM2_NAME"
