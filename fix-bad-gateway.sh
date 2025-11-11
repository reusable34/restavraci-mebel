#!/bin/bash
# Исправление 502 Bad Gateway

echo "🔍 Проблема: NPM не может подключиться к 85.113.129.96:3381"
echo ""
echo "💡 Решение 1: Использовать nginx на kolas как промежуточный прокси"
echo "   NPM -> kolas:80 -> localhost:3381"
echo ""
echo "💡 Решение 2: Проверить доступность порта 3381 из NPM"
echo "   Выполните на сервере NPM (192.168.0.31):"
echo "   curl -I http://85.113.129.96:3381"
echo ""
echo "📝 Настройка nginx на kolas для работы через NPM:"

cat << 'EOF'
cat > /etc/nginx/sites-available/provintagevrn-proxy << 'NGINXEOF'
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
NGINXEOF
ln -sf /etc/nginx/sites-available/provintagevrn-proxy /etc/nginx/sites-enabled/provintagevrn-proxy
nginx -t && systemctl reload nginx
EOF

echo ""
echo "📝 В NPM настройте:"
echo "   Forward Hostname/IP: 85.113.129.96"
echo "   Forward Port: 80"
echo "   Scheme: http"

