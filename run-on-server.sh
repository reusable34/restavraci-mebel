#!/bin/bash
# Выполните эту команду на сервере (root@kolas:~#):
# bash <(curl -s http://192.168.0.112:8080/run-on-server.sh) || wget -qO- http://192.168.0.112:8080/run-on-server.sh | bash

set -e

APP_NAME="restavraci"
APP_DIR="/opt/${APP_NAME}"
SERVICE_NAME="${APP_NAME}.service"
ARCHIVE_URL="http://192.168.0.112:8080/restavraci-deploy.tar.gz"

echo "🚀 Начинаю деплой RestavraciMebel"

# Обновление системы
echo "📦 Обновляю систему..."
apt-get update -qq
apt-get install -y -qq curl build-essential wget

# Установка Node.js 20.x если не установлен
if ! command -v node &> /dev/null; then
    echo "📥 Устанавливаю Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
fi

echo "📊 Версия Node.js: $(node --version)"
echo "📊 Версия npm: $(npm --version)"

# Создание директории приложения
mkdir -p "${APP_DIR}"
cd "${APP_DIR}"

# Скачивание и распаковка архива
echo "📥 Скачиваю архив проекта..."
cd /tmp
wget -q "${ARCHIVE_URL}" -O restavraci-deploy.tar.gz

echo "📂 Распаковываю файлы..."
cd "${APP_DIR}"
tar -xzf /tmp/restavraci-deploy.tar.gz

# Создание .env.example если не существует
if [ ! -f "${APP_DIR}/.env.example" ]; then
    echo "📝 Создаю .env.example..."
    cat > "${APP_DIR}/.env.example" << 'ENVEOF'
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
ENVEOF
fi

# Установка зависимостей
echo "📦 Устанавливаю зависимости npm..."
npm ci --production=false

# Сборка приложения
echo "🔨 Собираю Next.js приложение..."
npm run build

# Проверка .env файла
if [ ! -f .env ]; then
    echo "📝 Создаю .env из .env.example..."
    cp .env.example .env
    echo "✅ Файл .env создан. Обязательно отредактируйте его!"
    echo "   nano ${APP_DIR}/.env"
    echo "   Заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID"
fi

# Создание systemd service
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

# Перезагрузка systemd
systemctl daemon-reload

# Запуск/перезапуск сервиса
if systemctl is-active --quiet "${SERVICE_NAME}"; then
    echo "🔄 Перезапускаю сервис..."
    systemctl restart "${SERVICE_NAME}"
else
    echo "▶️  Запускаю сервис..."
    systemctl enable "${SERVICE_NAME}"
    systemctl start "${SERVICE_NAME}"
fi

# Проверка статуса
sleep 2
if systemctl is-active --quiet "${SERVICE_NAME}"; then
    echo "✅ Сервис успешно запущен!"
    echo "📊 Статус:"
    systemctl status "${SERVICE_NAME}" --no-pager -l | head -20
    echo ""
    echo "🌐 Приложение доступно на http://localhost:3000"
    echo "📝 Просмотр логов: journalctl -u ${SERVICE_NAME} -f"
else
    echo "❌ Ошибка запуска сервиса!"
    echo "📋 Последние логи:"
    journalctl -u "${SERVICE_NAME}" --no-pager -n 30
fi

# Очистка
rm -f /tmp/restavraci-deploy.tar.gz

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "📝 Следующие шаги:"
echo "   1. Отредактируйте .env: nano ${APP_DIR}/.env"
echo "   2. Получите TELEGRAM_BOT_TOKEN у @BotFather"
echo "   3. Получите TELEGRAM_CHAT_ID"
echo "   4. Перезапустите: systemctl restart ${SERVICE_NAME}"

