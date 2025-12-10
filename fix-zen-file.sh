#!/bin/bash
# Исправление доступа к файлу подтверждения Дзен

echo "🔍 Проверяю файл локально..."
cat /opt/restavraci/public/zen_Cltc1WJKkQISPD0d4FNUtlgs5R9NReqOQYDVEscr7KhkdrTVNykcYLE9kqM316V6.html

echo ""
echo "🔍 Проверяю доступность через localhost..."
curl -I http://localhost:3381/zen_Cltc1WJKkQISPD0d4FNUtlgs5R9NReqOQYDVEscr7KhkdrTVNykcYLE9kqM316V6.html

echo ""
echo "🔄 Перезапускаю приложение..."
systemctl restart restavraci.service

sleep 3

echo ""
echo "🔍 Проверяю снова..."
curl -I http://localhost:3381/zen_Cltc1WJKkQISPD0d4FNUtlgs5R9NReqOQYDVEscr7KhkdrTVNykcYLE9kqM316V6.html



