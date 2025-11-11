#!/bin/bash
# Автоматический деплой RestavraciMebel
# Выполнить на сервере: bash <(curl -s http://192.168.0.112:8080/auto-deploy.sh)

set -e

APP_NAME="restavraci"
APP_DIR="/opt/${APP_NAME}"
SERVICE_NAME="${APP_NAME}.service"
ARCHIVE_URL="http://192.168.0.112:8080/restavraci-deploy.tar.gz"

echo "🚀 Автоматический деплой RestavraciMebel"

# Обновление системы
echo "📦 Обновляю систему..."
apt-get update -qq
apt-get install -y -qq curl build-essential wget

# Установка Node.js 20.x
if ! command -v node &> /dev/null; then
    echo "📥 Устанавливаю Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
fi

echo "📊 Node.js: $(node --version)"
echo "📊 npm: $(npm --version)"

# Создание директории
mkdir -p "${APP_DIR}"
cd /tmp

# Скачивание архива
echo "📥 Скачиваю архив проекта..."
wget -q "${ARCHIVE_URL}" -O restavraci-deploy.tar.gz

# Распаковка
echo "📂 Распаковываю файлы..."
cd "${APP_DIR}"
tar -xzf /tmp/restavraci-deploy.tar.gz

# Создание .env
if [ ! -f .env ]; then
    echo "📝 Создаю .env файл..."
    cat > .env << 'EOF'
SANITY_PROJECT_ID=143zykun
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
CONTACT_EMAIL=noreply@example.com
NEXT_PUBLIC_SANITY_PROJECT_ID=143zykun
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
PORT=3000
EOF
fi

# Установка зависимостей
echo "📦 Устанавливаю зависимости..."
npm ci --production=false

# Сборка
echo "🔨 Собираю приложение..."
npm run build

# Systemd service
echo "⚙️  Настраиваю systemd service..."
cat > "/etc/systemd/system/${SERVICE_NAME}" << EOF
[Unit]
Description=RestavraciMebel Next.js Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${APP_DIR}
Environment="NODE_ENV=production"
EnvironmentFile=${APP_DIR}/.env
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Запуск
systemctl daemon-reload
systemctl enable "${SERVICE_NAME}"
systemctl restart "${SERVICE_NAME}"

sleep 2
if systemctl is-active --quiet "${SERVICE_NAME}"; then
    echo "✅ Деплой завершен! Приложение запущено на http://localhost:3000"
    echo "📝 Настройте Telegram: nano ${APP_DIR}/.env"
    systemctl status "${SERVICE_NAME}" --no-pager | head -10
else
    echo "❌ Ошибка запуска. Логи:"
    journalctl -u "${SERVICE_NAME}" -n 20 --no-pager
fi

