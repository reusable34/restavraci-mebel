#!/bin/bash
# Проверка SEO настроек на сервере

echo "🔍 Проверяю доступность sitemap.xml..."
curl -I https://provintagevrn.ru/sitemap.xml 2>&1 | head -10

echo ""
echo "🔍 Проверяю содержимое sitemap.xml..."
curl -s https://provintagevrn.ru/sitemap.xml | head -20

echo ""
echo "🔍 Проверяю доступность robots.txt..."
curl -I https://provintagevrn.ru/robots.txt 2>&1 | head -10

echo ""
echo "🔍 Проверяю содержимое robots.txt..."
curl -s https://provintagevrn.ru/robots.txt

echo ""
echo "🔍 Проверяю метатеги главной страницы..."
curl -s https://provintagevrn.ru | grep -E "(robots|canonical|description)" | head -5



