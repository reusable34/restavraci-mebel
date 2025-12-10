#!/bin/bash
# Диагностика 502 ошибки

echo "🔍 Проверяю приложение на порту 3381..."
curl -I http://localhost:3381 2>&1 | head -5

echo ""
echo "🔍 Проверяю логи nginx/openresty..."
if [ -f /var/log/nginx/error.log ]; then
    echo "Последние ошибки nginx:"
    tail -20 /var/log/nginx/error.log | grep -E "(502|upstream|connect|3381|3000)" || tail -10 /var/log/nginx/error.log
fi

if [ -f /var/log/openresty/error.log ]; then
    echo "Последние ошибки openresty:"
    tail -20 /var/log/openresty/error.log | grep -E "(502|upstream|connect|3381|3000)" || tail -10 /var/log/openresty/error.log
fi

echo ""
echo "🔍 Проверяю конфигурацию nginx/openresty..."
if systemctl is-active --quiet nginx; then
    echo "Найден nginx, проверяю конфигурацию:"
    grep -r "proxy_pass" /etc/nginx/sites-enabled/ 2>/dev/null | grep -v "#"
    grep -r "provintagevrn" /etc/nginx/sites-enabled/ 2>/dev/null | head -5
elif systemctl is-active --quiet openresty; then
    echo "Найден openresty, проверяю конфигурацию:"
    grep -r "proxy_pass" /etc/openresty/nginx/conf.d/ 2>/dev/null | grep -v "#"
    grep -r "provintagevrn" /etc/openresty/nginx/conf.d/ 2>/dev/null | head -5
fi

echo ""
echo "💡 Если proxy_pass указывает на 3000, нужно изменить на 3381"

