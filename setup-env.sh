#!/bin/bash

# Скрипт для настройки .env файла на сервере
# Использование на сервере: ./setup-env.sh

set -e

APP_DIR="/opt/restavraci"
ENV_FILE="${APP_DIR}/.env"

echo "⚙️  Настройка переменных окружения для RestavraciMebel"
echo ""

# Проверка существования директории
if [ ! -d "$APP_DIR" ]; then
    echo "❌ Директория приложения не найдена: $APP_DIR"
    echo "💡 Сначала выполните деплой приложения"
    exit 1
fi

cd "$APP_DIR"

# Проверка существования .env.example
if [ ! -f ".env.example" ]; then
    echo "⚠️  Файл .env.example не найден, создаю базовый..."
    cat > .env.example << 'EOF'
# Sanity CMS конфигурация
SANITY_PROJECT_ID=143zykun
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01

# Telegram Bot для уведомлений о заявках
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here

# Email для fallback (опционально)
CONTACT_EMAIL=noreply@example.com

# Next.js публичные переменные
NEXT_PUBLIC_SANITY_PROJECT_ID=143zykun
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01

# Порт для Next.js приложения
PORT=3000
EOF
fi

# Создание .env если не существует
if [ ! -f ".env" ]; then
    echo "📝 Создаю .env файл из .env.example..."
    cp .env.example .env
else
    echo "✅ Файл .env уже существует"
    read -p "Перезаписать? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Отменено"
        exit 0
    fi
    cp .env.example .env
fi

echo ""
echo "📝 Теперь отредактируйте файл .env:"
echo "   nano ${ENV_FILE}"
echo ""
echo "⚠️  Обязательно заполните:"
echo "   - TELEGRAM_BOT_TOKEN (получите у @BotFather)"
echo "   - TELEGRAM_CHAT_ID (узнайте через getUpdates API)"
echo ""
read -p "Открыть редактор сейчас? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    nano "${ENV_FILE}"
fi

echo ""
echo "✅ Настройка завершена!"
echo ""
echo "📋 Проверьте содержимое файла:"
echo "   cat ${ENV_FILE}"
echo ""
echo "🔄 После настройки перезапустите сервис:"
echo "   systemctl restart restavraci.service"
