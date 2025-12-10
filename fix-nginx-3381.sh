#!/bin/bash
# Исправление nginx для порта 3381

echo "🔍 Проверяю конфигурацию nginx/openresty..."
echo ""

# Проверяем какой веб-сервер используется
if systemctl is-active --quiet nginx; then
    WEB_SERVER="nginx"
    CONFIG_DIR="/etc/nginx"
elif systemctl is-active --quiet openresty; then
    WEB_SERVER="openresty"
    CONFIG_DIR="/etc/openresty"
else
    echo "❌ Не найден nginx или openresty"
    exit 1
fi

echo "✅ Найден: $WEB_SERVER"
echo ""

# Ищем конфигурацию для provintagevrn.ru
echo "🔍 Ищу конфигурацию для provintagevrn.ru..."
grep -r "provintagevrn" $CONFIG_DIR 2>/dev/null | grep -v "#" | head -10

echo ""
echo "🔍 Проверяю proxy_pass настройки..."
grep -r "proxy_pass" $CONFIG_DIR 2>/dev/null | grep -v "#" | head -5

echo ""
echo "🔧 Исправляю конфигурацию..."

# Создаем правильную конфигурацию
cat > /tmp/provintagevrn.conf << 'EOF'
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

# Копируем в нужное место
if [ "$WEB_SERVER" = "nginx" ]; then
    cp /tmp/provintagevrn.conf $CONFIG_DIR/sites-available/provintagevrn
    ln -sf $CONFIG_DIR/sites-available/provintagevrn $CONFIG_DIR/sites-enabled/provintagevrn
elif [ "$WEB_SERVER" = "openresty" ]; then
    cp /tmp/provintagevrn.conf $CONFIG_DIR/nginx/conf.d/provintagevrn.conf
fi

# Проверяем конфигурацию
echo "✅ Проверяю конфигурацию..."
$WEB_SERVER -t

if [ $? -eq 0 ]; then
    echo "✅ Конфигурация правильная, перезагружаю $WEB_SERVER..."
    systemctl reload $WEB_SERVER
    echo ""
    echo "✅ Готово! Проверьте сайт."
else
    echo "❌ Ошибка в конфигурации!"
    exit 1
fi

