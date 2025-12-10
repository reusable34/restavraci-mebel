#!/bin/bash
# Проверка конфигурации Telegram бота

echo "🔍 Проверяю настройки Telegram бота..."
echo ""
echo "TELEGRAM_CHAT_ID:"
grep TELEGRAM_CHAT_ID /opt/restavraci/.env
echo ""
echo "TELEGRAM_BOT_TOKEN:"
grep TELEGRAM_BOT_TOKEN /opt/restavraci/.env | sed 's/=.*/=***СКРЫТО***/'
echo ""
echo "📋 Статус сервиса:"
systemctl is-active restavraci.service && echo "✅ Сервис работает" || echo "❌ Сервис не работает"
echo ""
echo "💡 Для проверки работы бота:"
echo "   1. Заказчик должен отправить /start боту в Telegram"
echo "   2. Затем отправить тестовую заявку через форму на сайте"
echo "   3. Проверить, пришло ли сообщение в Telegram"



