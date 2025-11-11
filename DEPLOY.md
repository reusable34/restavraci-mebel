# Инструкция по деплою RestavraciMebel

## Быстрый старт

### 1. Подготовка Telegram бота

1. Создайте бота через [@BotFather](https://t.me/BotFather) в Telegram:
   ```
   /newbot
   ```
   Следуйте инструкциям и сохраните полученный токен.

2. Узнайте свой Chat ID:
   - Отправьте любое сообщение вашему боту
   - Перейдите по ссылке: `https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates`
   - Найдите `"chat":{"id":123456789}` - это ваш Chat ID

### 2. Автоматический деплой (рекомендуется)

```bash
# Сделайте скрипт исполняемым
chmod +x deploy.sh

# Запустите деплой (укажите путь к SSH ключу если нужно)
./deploy.sh

# Или с указанием ключа
./deploy.sh ~/.ssh/my_key
```

### 3. Ручной деплой

#### Шаг 1: Подключение к серверу

```bash
ssh root@192.168.0.110
```

#### Шаг 2: Установка зависимостей

```bash
# Обновление системы
apt-get update
apt-get install -y curl build-essential

# Установка Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Проверка версии
node --version  # Должно быть v20.x.x
npm --version
```

#### Шаг 3: Копирование проекта

На локальной машине:
```bash
# Создайте архив (исключая node_modules и .next)
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='temp' \
    --exclude='photo' \
    -czf app.tar.gz .

# Копируйте на сервер
scp app.tar.gz root@192.168.0.110:/tmp/
```

На сервере:
```bash
# Создайте директорию приложения
mkdir -p /opt/restavraci
cd /opt/restavraci

# Распакуйте архив
tar -xzf /tmp/app.tar.gz -C /opt/restavraci
```

#### Шаг 4: Установка зависимостей и сборка

```bash
cd /opt/restavraci

# Установка зависимостей
npm ci

# Сборка приложения
npm run build
```

#### Шаг 5: Настройка переменных окружения

```bash
# Создайте файл .env
cp .env.example .env
nano .env
```

Заполните следующие переменные:
```env
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
TELEGRAM_CHAT_ID=ваш_chat_id
SANITY_PROJECT_ID=143zykun
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
```

#### Шаг 6: Настройка systemd service

```bash
# Скопируйте файл сервиса
cp restavraci.service /etc/systemd/system/

# Или создайте вручную:
cat > /etc/systemd/system/restavraci.service << 'EOF'
[Unit]
Description=RestavraciMebel Next.js Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/restavraci
Environment="NODE_ENV=production"
EnvironmentFile=/opt/restavraci/.env
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Перезагрузите systemd
systemctl daemon-reload

# Запустите и включите автозапуск
systemctl enable restavraci.service
systemctl start restavraci.service
```

#### Шаг 7: Проверка

```bash
# Проверьте статус
systemctl status restavraci.service

# Проверьте логи
journalctl -u restavraci.service -f

# Проверьте что приложение работает
curl http://localhost:3000
```

## Настройка Nginx (опционально, для внешнего доступа)

Если нужно сделать сайт доступным извне:

```bash
# Установите Nginx
apt-get install -y nginx

# Создайте конфигурацию
cat > /etc/nginx/sites-available/restavraci << 'EOF'
server {
    listen 80;
    server_name your-domain.com;  # или IP адрес

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Активируйте конфигурацию
ln -s /etc/nginx/sites-available/restavraci /etc/nginx/sites-enabled/

# Проверьте конфигурацию
nginx -t

# Перезапустите Nginx
systemctl restart nginx
```

## Управление сервисом

```bash
# Запуск
systemctl start restavraci.service

# Остановка
systemctl stop restavraci.service

# Перезапуск
systemctl restart restavraci.service

# Статус
systemctl status restavraci.service

# Просмотр логов
journalctl -u restavraci.service -f

# Последние 100 строк логов
journalctl -u restavraci.service -n 100
```

## Обновление приложения

### Автоматически:
```bash
./deploy.sh
```

### Вручную:
```bash
ssh root@192.168.0.110
cd /opt/restavraci
git pull  # если используете git
# или распакуйте новый архив
npm ci
npm run build
systemctl restart restavraci.service
```

## Решение проблем

### Приложение не запускается

1. Проверьте логи:
   ```bash
   journalctl -u restavraci.service -n 50
   ```

2. Проверьте переменные окружения:
   ```bash
   cat /opt/restavraci/.env
   ```

3. Проверьте что порт 3000 свободен:
   ```bash
   netstat -tulpn | grep 3000
   ```

### Telegram бот не отправляет сообщения

1. Проверьте токен и Chat ID в `.env`
2. Проверьте что бот запущен (отправьте `/start` боту)
3. Проверьте логи API:
   ```bash
   journalctl -u restavraci.service | grep TELEGRAM
   ```

### Ошибки сборки

1. Убедитесь что Node.js версии 20.x:
   ```bash
   node --version
   ```

2. Очистите кеш и переустановите зависимости:
   ```bash
   rm -rf node_modules .next
   npm ci
   npm run build
   ```

## Безопасность

⚠️ **Важно**: После настройки ограничьте доступ к серверу:
- Настройте firewall (UFW)
- Используйте SSH ключи вместо паролей
- Не храните `.env` файл в системе контроля версий
- Регулярно обновляйте систему

## Мониторинг

Для мониторинга использования ресурсов:
```bash
# CPU и память
htop

# Использование диска
df -h

# Логи приложения в реальном времени
journalctl -u restavraci.service -f
```
