#!/bin/bash
# Команда для настройки nginx прокси на сервере kolas (85.113.129.96)
# Выполните на сервере: bash setup-nginx-proxy.sh

set -e

echo "🔧 Настраиваю nginx прокси для provintagevrn.ru..."

# Диагностика: проверяем доступность NPM
echo "🔍 Проверяю доступность Nginx Proxy Manager..."
if curl -s --connect-timeout 2 -I http://192.168.0.31:80 > /dev/null 2>&1; then
    echo "✅ 192.168.0.31:80 доступен"
    NPM_PORT=80
elif curl -s --connect-timeout 2 -I http://192.168.0.31:81 > /dev/null 2>&1; then
    echo "✅ 192.168.0.31:81 доступен"
    NPM_PORT=81
else
    echo "⚠️  Не удалось подключиться к 192.168.0.31:80 или :81"
    echo "   Продолжаю с портом 80..."
    NPM_PORT=80
fi

# Удаляем старые конфликтующие конфигурации
echo "🧹 Удаляю старые конфигурации..."
rm -f /etc/nginx/sites-enabled/provintagevrn-proxy
rm -f /etc/nginx/sites-available/provintagevrn-proxy

# Устанавливаем nginx если не установлен
if ! command -v nginx &> /dev/null; then
    echo "📦 Устанавливаю nginx..."
    apt-get update -qq
    apt-get install -y -qq nginx
fi

# Создаем новую конфигурацию
echo "📝 Создаю конфигурацию nginx для проксирования на приложение..."
cat > /etc/nginx/sites-available/provintagevrn-proxy << 'EOF'
server {
    listen 80;
    server_name provintagevrn.ru www.provintagevrn.ru;
    
    location / {
        proxy_pass http://127.0.0.1:3381;
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

# Активируем конфигурацию
echo "🔗 Активирую конфигурацию..."
ln -sf /etc/nginx/sites-available/provintagevrn-proxy /etc/nginx/sites-enabled/provintagevrn-proxy

# Проверяем конфигурацию
echo "✅ Проверяю конфигурацию nginx..."
nginx -t

# Перезагружаем nginx
echo "🔄 Перезагружаю nginx..."
systemctl reload nginx

echo ""
echo "✅ Настройка завершена!"
echo ""
echo "🔍 Проверка:"
echo "   curl -I -H 'Host: provintagevrn.ru' http://localhost"
echo ""
echo "📝 Убедитесь, что в Nginx Proxy Manager (192.168.0.31:81) настроен:"
echo "   provintagevrn.ru -> 85.113.129.96:3381"
echo ""
echo "📊 Используется порт NPM: ${NPM_PORT}"

