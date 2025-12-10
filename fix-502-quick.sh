#!/bin/bash
# Быстрое исправление 502 Bad Gateway

echo "🔍 Проверяю статус сервиса..."
systemctl status restavraci.service --no-pager -l | head -20

echo ""
echo "🔄 Перезапускаю сервис..."
systemctl restart restavraci.service

sleep 3

echo ""
echo "📊 Проверяю статус после перезапуска..."
if systemctl is-active --quiet restavraci.service; then
    echo "✅ Сервис работает!"
    systemctl status restavraci.service --no-pager -l | head -15
else
    echo "❌ Сервис не запустился!"
    echo "📋 Последние логи:"
    journalctl -u restavraci.service -n 30 --no-pager
fi

echo ""
echo "🌐 Проверяю доступность приложения..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000 || echo "Приложение не отвечает"

