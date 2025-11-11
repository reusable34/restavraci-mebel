#!/bin/bash

# Скрипт для тестирования Telegram бота
# Использование: ./test-telegram.sh [TELEGRAM_BOT_TOKEN] [TELEGRAM_CHAT_ID]

TOKEN="${1:-$TELEGRAM_BOT_TOKEN}"
CHAT_ID="${2:-$TELEGRAM_CHAT_ID}"

if [ -z "$TOKEN" ] || [ -z "$CHAT_ID" ]; then
    echo "❌ Ошибка: Необходимо указать TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID"
    echo ""
    echo "Использование:"
    echo "  ./test-telegram.sh <TOKEN> <CHAT_ID>"
    echo ""
    echo "Или установите переменные окружения:"
    echo "  export TELEGRAM_BOT_TOKEN='ваш_токен'"
    echo "  export TELEGRAM_CHAT_ID='ваш_chat_id'"
    exit 1
fi

echo "🤖 Тестирую Telegram бота..."
echo "Токен: ${TOKEN:0:10}..."
echo "Chat ID: $CHAT_ID"
echo ""

# Отправка тестового сообщения
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${TOKEN}/sendMessage" \
    -H "Content-Type: application/json" \
    -d "{
        \"chat_id\": ${CHAT_ID},
        \"text\": \"✅ Тестовое сообщение от RestavraciMebel\\n\\nЕсли вы видите это сообщение, бот настроен правильно!\"
    }")

# Проверка ответа
if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo "✅ Сообщение успешно отправлено!"
    echo "📱 Проверьте ваш Telegram"
else
    echo "❌ Ошибка отправки сообщения:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi
