#!/bin/bash
# Скрипт для ручного деплоя на сервере
# Скопируйте этот скрипт и архив на сервер и выполните на сервере

set -e

APP_NAME="restavraci"
APP_DIR="/opt/${APP_NAME}"
SERVICE_NAME="${APP_NAME}.service"
ARCHIVE_PATH="/tmp/restavraci-deploy.tar.gz"

echo "🚀 Начинаю деплой RestavraciMebel"

# Обновление системы
echo "📦 Обновляю систему..."
apt-get update -qq
apt-get install -y -qq curl build-essential

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

# Проверка наличия архива
if [ ! -f "${ARCHIVE_PATH}" ]; then
    echo "❌ Архив не найден: ${ARCHIVE_PATH}"
    echo "💡 Скопируйте архив на сервер одним из способов:"
    echo "   1. scp /tmp/restavraci-deploy.tar.gz root@192.168.0.110:/tmp/"
    echo "   2. Или загрузите через веб-интерфейс Proxmox"
    exit 1
fi

# Распаковка архива
echo "📂 Распаковываю файлы..."
tar -xzf "${ARCHIVE_PATH}" -C "${APP_DIR}"

# Создание .env.example если не существует
if [ ! -f "${APP_DIR}/.env.example" ]; then
    echo "📝 Создаю .env.example..."
    cat > "${APP_DIR}/.env.example" << 'ENVEOF'
# Sanity CMS конфигурация
SANITY_PROJECT_ID=143zykun
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01

# Telegram Bot для уведомлений о заявках
# Получите токен у @BotFather в Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
# Chat ID можно узнать через @userinfobot или отправкой сообщения боту и проверкой через getUpdates
TELEGRAM_CHAT_ID=your_telegram_chat_id_here

# Email для fallback (опционально)
CONTACT_EMAIL=noreply@example.com

# Next.js публичные переменные (можно переопределить)
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
    echo "⚠️  Файл .env не найден!"
    echo "📝 Создаю .env из .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Файл .env создан. Обязательно отредактируйте его!"
        echo "   nano ${APP_DIR}/.env"
        echo "   Заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID"
    else
        echo "❌ Файл .env.example не найден!"
    fi
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
    systemctl status "${SERVICE_NAME}" --no-pager -l
    echo ""
    echo "🌐 Приложение доступно на http://localhost:3000"
    echo "📝 Просмотр логов: journalctl -u ${SERVICE_NAME} -f"
else
    echo "❌ Ошибка запуска сервиса!"
    echo "📋 Последние логи:"
    journalctl -u "${SERVICE_NAME}" --no-pager -n 50
    exit 1
fi

# Очистка
rm -f "${ARCHIVE_PATH}"

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "📝 Следующие шаги:"
echo "   1. Отредактируйте .env файл: nano ${APP_DIR}/.env"
echo "   2. Получите TELEGRAM_BOT_TOKEN у @BotFather"
echo "   3. Получите TELEGRAM_CHAT_ID (отправьте /start боту, затем проверьте через getUpdates)"
echo "   4. Перезапустите сервис: systemctl restart ${SERVICE_NAME}"

