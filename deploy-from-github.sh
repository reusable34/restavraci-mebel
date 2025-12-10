#!/usr/bin/env bash

set -euo pipefail

# Конфиг
SERVICE_NAME="${SERVICE_NAME:-restavraci}"
REPO_DIR="${REPO_DIR:-/opt/restavraci}"
BRANCH="${BRANCH:-main}"
FORCE_RESET="${FORCE_RESET:-0}" # 1 — принудительно git reset --hard origin/BRANCH
APP_PORT="${APP_PORT:-3381}"
SERVER_NAMES="${SERVER_NAMES:-provintagevrn.ru www.provintagevrn.ru}"
NGINX_SITE_AVAILABLE="${NGINX_SITE_AVAILABLE:-/etc/nginx/sites-available/provintagevrn}"
NGINX_SITE_ENABLED="${NGINX_SITE_ENABLED:-/etc/nginx/sites-enabled/provintagevrn}"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

need() {
  command -v "$1" >/dev/null 2>&1 || { log "Не найдено: $1"; exit 1; }
}

need git
need npm
need systemctl
need curl
need nginx
need ss

log "Рабочая директория: ${REPO_DIR}"
cd "${REPO_DIR}"

if [[ "${FORCE_RESET}" != "1" ]]; then
  if ! git diff --quiet || ! git diff --cached --quiet; then
    log "В репозитории есть незакоммиченные изменения. Прерву. Установи FORCE_RESET=1 чтобы выполнить git reset --hard."
    exit 1
  fi
fi

log "Fetch из origin/${BRANCH}"
git fetch origin "${BRANCH}"

if [[ "${FORCE_RESET}" == "1" ]]; then
  log "Принудительный reset до origin/${BRANCH}"
  git reset --hard "origin/${BRANCH}"
else
  log "Pull с rebase origin/${BRANCH}"
  git pull --rebase origin "${BRANCH}"
fi

log "npm ci (установка зависимостей)"
npm ci --no-audit --no-fund

log "npm run build"
npm run build

log "Перезапуск сервиса ${SERVICE_NAME}"
systemctl daemon-reload || true
systemctl restart "${SERVICE_NAME}"

log "Статус сервиса"
systemctl status "${SERVICE_NAME}" --no-pager -l | head -n 20 || true

log "Перезаписываю nginx-конфиг ${NGINX_SITE_AVAILABLE}"
cat > "${NGINX_SITE_AVAILABLE}" <<EOF
server {
    listen 80;
    server_name ${SERVER_NAMES};
    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        client_max_body_size 50m;
    }
}
EOF

log "Активирую конфиг nginx"
ln -sf "${NGINX_SITE_AVAILABLE}" "${NGINX_SITE_ENABLED}"

log "Проверка синтаксиса nginx"
nginx -t

log "Reload nginx/openresty"
systemctl reload nginx || systemctl reload openresty || true

log "Проверка бэкенда на 127.0.0.1:3381 с Host: provintagevrn.ru"
curl -I -H "Host: provintagevrn.ru" http://127.0.0.1:3381 || true

log "Проверяю, что порт ${APP_PORT} слушается"
ss -ltnp | grep ":${APP_PORT}" || log "Порт ${APP_PORT} не слушается"

log "Готово."
