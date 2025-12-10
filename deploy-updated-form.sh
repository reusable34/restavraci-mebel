#!/bin/bash
# Команда для деплоя обновленной формы с защитой
# Выполните на сервере: bash deploy-updated-form.sh

set -e

APP_DIR="/opt/restavraci"
SERVICE_NAME="restavraci.service"

echo "🚀 Деплой обновленной формы обратной связи..."

# Переходим в директорию приложения
cd "$APP_DIR"

# Обновляем зависимости (если нужно)
echo "📦 Проверяю зависимости..."
npm ci --production=false

# Собираем приложение
echo "🔨 Собираю приложение..."
npm run build

# Проверяем .env файл
echo "🔍 Проверяю переменные окружения..."
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден!"
    exit 1
fi

# Проверяем наличие необходимых переменных
REQUIRED_VARS=("TELEGRAM_BOT_TOKEN" "TELEGRAM_CHAT_ID")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env || grep -q "^${var}=$" .env || grep -q "^${var}=your_" .env; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "⚠️  Не заполнены переменные: ${MISSING_VARS[*]}"
    echo "   Отредактируйте файл: nano $APP_DIR/.env"
fi

# Опциональные переменные для reCAPTCHA
if ! grep -q "^RECAPTCHA_SECRET_KEY=" .env; then
    echo "💡 reCAPTCHA не настроена (опционально)"
    echo "   Для включения добавьте в .env:"
    echo "   RECAPTCHA_SECRET_KEY=your_secret_key"
    echo "   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key"
fi

# Перезапускаем сервис
echo "🔄 Перезапускаю сервис..."
systemctl restart "$SERVICE_NAME"

# Проверяем статус
sleep 3
if systemctl is-active --quiet "$SERVICE_NAME"; then
    echo "✅ Сервис успешно перезапущен!"
    echo ""
    echo "📋 Статус:"
    systemctl status "$SERVICE_NAME" --no-pager -l | head -10
    echo ""
    echo "✅ Деплой завершен!"
    echo ""
    echo "📝 Проверьте работу формы на сайте"
else
    echo "❌ Ошибка запуска сервиса!"
    echo "📋 Логи:"
    journalctl -u "$SERVICE_NAME" --no-pager -n 50
    exit 1
fi



