#!/bin/bash
# Полная команда с установкой git
# Выполните на сервере: bash UPDATE_WITH_GIT_INSTALL.sh

set -e

APP_DIR="/opt/restavraci"
REPO_URL="https://github.com/reusable34/restavraci-mebel.git"

echo "🚀 Начинаю обновление..."

# Установка git если не установлен
if ! command -v git &> /dev/null; then
    echo "📦 Устанавливаю git..."
    apt-get update -qq
    apt-get install -y -qq git
fi

cd "$APP_DIR"

# Сохраняем .env если есть
if [ -f .env ]; then
    echo "💾 Сохраняю .env файл..."
    cp .env /tmp/restavraci-env-backup
fi

# Обновляем или клонируем репозиторий
if [ -d .git ]; then
    echo "📥 Обновляю существующий репозиторий..."
    git fetch origin
    git reset --hard origin/main
    git clean -fd
else
    echo "📥 Клонирую репозиторий..."
    git clone "$REPO_URL" /tmp/restavraci-tmp
    cp -r /tmp/restavraci-tmp/. .
    rm -rf /tmp/restavraci-tmp
    git init
    git remote add origin "$REPO_URL"
    git fetch
    git reset --hard origin/main
fi

# Восстанавливаем .env
if [ -f /tmp/restavraci-env-backup ]; then
    echo "💾 Восстанавливаю .env файл..."
    cp /tmp/restavraci-env-backup .env
    rm /tmp/restavraci-env-backup
fi

# Установка зависимостей и сборка
echo "📦 Устанавливаю зависимости..."
npm ci

echo "🔨 Собираю проект..."
npm run build

# Перезапуск сервиса
echo "🔄 Перезапускаю сервис..."
systemctl restart restavraci.service

# Проверка статуса
sleep 2
echo ""
echo "✅ Обновление завершено!"
systemctl status restavraci.service --no-pager -l | head -15

