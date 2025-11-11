#!/bin/bash

# Скрипт для обновления проекта на сервере из GitHub
# Выполните на сервере одной командой:
# bash <(curl -s https://raw.githubusercontent.com/reusable34/restavraci-mebel/main/update-server.sh)

set -e

APP_DIR="/opt/restavraci"
SERVICE_NAME="restavraci.service"
REPO_URL="https://github.com/reusable34/restavraci-mebel.git"

echo "🚀 Начинаю обновление проекта из GitHub..."

# Установка git если не установлен
if ! command -v git &> /dev/null; then
    echo "📦 Устанавливаю git..."
    apt-get update -qq
    apt-get install -y -qq git
fi

# Переход в директорию приложения
cd "$APP_DIR" || {
    echo "❌ Директория $APP_DIR не найдена!"
    exit 1
}

# Проверка наличия git репозитория
if [ -d ".git" ]; then
    echo "📥 Обновляю существующий репозиторий..."
    git fetch origin
    git reset --hard origin/main
    git clean -fd
else
    echo "📥 Клонирую репозиторий..."
    # Сохраняем .env если есть
    if [ -f .env ]; then
        echo "💾 Сохраняю .env файл..."
        cp .env /tmp/restavraci-env-backup
    fi
    
    # Удаляем содержимое директории (кроме node_modules и .next если есть)
    find . -mindepth 1 -maxdepth 1 ! -name 'node_modules' ! -name '.next' ! -name '.env' -exec rm -rf {} +
    
    # Клонируем репозиторий
    git clone "$REPO_URL" .
    
    # Восстанавливаем .env
    if [ -f /tmp/restavraci-env-backup ]; then
        echo "💾 Восстанавливаю .env файл..."
        cp /tmp/restavraci-env-backup .env
        rm /tmp/restavraci-env-backup
    fi
fi

# Установка Node.js если не установлен
if ! command -v node &> /dev/null; then
    echo "📦 Устанавливаю Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
fi

# Установка зависимостей
echo "📦 Устанавливаю зависимости..."
npm ci --production=false

# Сборка проекта
echo "🔨 Собираю Next.js приложение..."
npm run build

# Проверка .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден!"
    if [ -f .env.example ]; then
        echo "📝 Создаю .env из .env.example..."
        cp .env.example .env
        echo "⚠️  Обязательно отредактируйте .env файл перед запуском!"
    fi
fi

# Перезапуск сервиса
echo "🔄 Перезапускаю сервис..."
systemctl daemon-reload
systemctl restart "$SERVICE_NAME"

# Проверка статуса
sleep 3
if systemctl is-active --quiet "$SERVICE_NAME"; then
    echo ""
    echo "✅ Обновление завершено успешно!"
    echo "📊 Статус сервиса:"
    systemctl status "$SERVICE_NAME" --no-pager -l | head -15
    echo ""
    echo "🌐 Приложение доступно на http://localhost:3000"
    echo "📝 Просмотр логов: journalctl -u $SERVICE_NAME -f"
else
    echo ""
    echo "❌ Ошибка при перезапуске сервиса!"
    echo "📋 Последние логи:"
    journalctl -u "$SERVICE_NAME" --no-pager -n 30
    exit 1
fi

