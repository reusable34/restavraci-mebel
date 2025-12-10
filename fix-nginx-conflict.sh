#!/bin/bash
# Команда для исправления конфликта nginx и настройки прокси
# Выполните на сервере kolas

set -e

echo "🔍 Ищу все конфигурации nginx с provintagevrn.ru..."
grep -r "provintagevrn.ru" /etc/nginx/sites-enabled/ /etc/nginx/sites-available/ 2>/dev/null || echo "Не найдено в sites-*"

echo ""
echo "🔍 Ищу все конфигурации nginx с provintagevrn.ru в конфигах..."
grep -r "provintagevrn" /etc/nginx/ 2>/dev/null | grep -v ".swp" | grep -v "Binary" || echo "Не найдено"

echo ""
echo "🧹 Удаляю все конфигурации с provintagevrn..."
rm -f /etc/nginx/sites-enabled/*provintagevrn*
rm -f /etc/nginx/sites-available/*provintagevrn*

echo ""
echo "📋 Список активных конфигураций nginx:"
ls -la /etc/nginx/sites-enabled/

echo ""
echo "🔍 Проверяю доступность NPM..."
echo "Порт 80:"
curl -I --connect-timeout 3 http://192.168.0.31:80 2>&1 | head -3 || echo "❌ Недоступен"
echo ""
echo "Порт 81:"
curl -I --connect-timeout 3 http://192.168.0.31:81 2>&1 | head -3 || echo "❌ Недоступен"

echo ""
echo "📝 Создаю новую конфигурацию..."
cat > /etc/nginx/sites-available/provintagevrn-proxy << 'EOF'
server {
    listen 80;
    server_name provintagevrn.ru www.provintagevrn.ru;
    
    location / {
        proxy_pass http://192.168.0.31:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        client_max_body_size 50m;
    }
}
EOF

ln -sf /etc/nginx/sites-available/provintagevrn-proxy /etc/nginx/sites-enabled/provintagevrn-proxy

echo ""
echo "✅ Проверяю конфигурацию..."
nginx -t

echo ""
echo "🔄 Перезагружаю nginx..."
systemctl reload nginx

echo ""
echo "✅ Готово!"
echo ""
echo "🔍 Проверка работы:"
echo "curl -I -H 'Host: provintagevrn.ru' http://localhost"



