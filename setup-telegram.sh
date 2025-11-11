#!/bin/bash

# Скрипт для настройки Telegram бота на сервере
# Использование: выполните на сервере

TELEGRAM_BOT_TOKEN="8267035597:AAGENY86nycB9ZPE12yPH7SXGj9EXZ1voRg"
TELEGRAM_CHAT_ID="545720061"
CONTACT_EMAIL="provintage1404@gmail.com"
APP_DIR="/opt/restavraci"

echo "🤖 Настраиваю Telegram бота..."

cd "$APP_DIR" || exit 1

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "📝 Создаю .env файл..."
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        touch .env
    fi
fi

# Обновляем или добавляем переменные
echo "📝 Обновляю переменные окружения..."

# Удаляем старые значения если есть
sed -i '/^TELEGRAM_BOT_TOKEN=/d' .env
sed -i '/^TELEGRAM_CHAT_ID=/d' .env
sed -i '/^CONTACT_EMAIL=/d' .env

# Добавляем новые значения
echo "TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN" >> .env
echo "TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID" >> .env
echo "CONTACT_EMAIL=$CONTACT_EMAIL" >> .env

# Добавляем другие необходимые переменные если их нет
if ! grep -q "^SANITY_PROJECT_ID=" .env; then
    echo "SANITY_PROJECT_ID=143zykun" >> .env
fi
if ! grep -q "^SANITY_DATASET=" .env; then
    echo "SANITY_DATASET=production" >> .env
fi
if ! grep -q "^SANITY_API_VERSION=" .env; then
    echo "SANITY_API_VERSION=2025-01-01" >> .env
fi
if ! grep -q "^NEXT_PUBLIC_SANITY_PROJECT_ID=" .env; then
    echo "NEXT_PUBLIC_SANITY_PROJECT_ID=143zykun" >> .env
fi
if ! grep -q "^NEXT_PUBLIC_SANITY_DATASET=" .env; then
    echo "NEXT_PUBLIC_SANITY_DATASET=production" >> .env
fi
if ! grep -q "^NEXT_PUBLIC_SANITY_API_VERSION=" .env; then
    echo "NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01" >> .env
fi
if ! grep -q "^PORT=" .env; then
    echo "PORT=3000" >> .env
fi

echo "✅ Настройка завершена!"
echo ""
echo "📋 Текущие настройки:"
grep -E "^(TELEGRAM_|CONTACT_EMAIL)" .env
echo ""
echo "🔄 Перезапускаю сервис..."
systemctl restart restavraci.service

sleep 2
if systemctl is-active --quiet restavraci.service; then
    echo "✅ Сервис успешно перезапущен!"
    echo ""
    echo "🧪 Теперь протестируйте форму на сайте:"
    echo "   https://provintagevrn.ru"
    echo ""
    echo "📱 Сообщение должно прийти в ваш Telegram (Chat ID: $TELEGRAM_CHAT_ID)"
    echo ""
    echo "💡 Чтобы потом поменять Chat ID на заказчика, выполните:"
    echo "   nano /opt/restavraci/.env"
    echo "   Измените TELEGRAM_CHAT_ID на Chat ID заказчика"
    echo "   systemctl restart restavraci.service"
else
    echo "❌ Ошибка при перезапуске сервиса!"
    echo "📋 Логи:"
    journalctl -u restavraci.service -n 20
fi

