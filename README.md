# Провинтаж — сайт студии реставрации

Проект на Next.js 15 (App Router) с TypeScript и TailwindCSS.

## Быстрый старт

1. Установка

```bash
npm i
# или
yarn
# или
pnpm i
```

2. Запуск разработки

```bash
npm run dev
# или
yarn dev
# или
pnpm dev
```

3. Продакшн сборка

```bash
npm run build && npm start
# или
yarn build && yarn start
# или
pnpm build && pnpm start
```

## Настройка окружения

Создайте файл `.env.local` на основе `.env.example` и заполните при необходимости:

```
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
CONTACT_EMAIL=
```

Если заданы TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID, заявки из формы отправляются в Telegram. Иначе API вернет ссылку mailto на CONTACT_EMAIL как запасной вариант.

### Sanity CMS

Добавлена интеграция Sanity для редактирования услуг и портфолио.

Добавьте в `.env.local`:

```
SANITY_PROJECT_ID=xxxxx
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_READ_TOKEN=
SANITY_PREVIEW_SECRET=случайная_строка
```

После деплоя админка доступна по пути `/studio`.

## Деплой на сервер

Подробная инструкция по деплою на LXC контейнер (Proxmox) находится в файле [DEPLOY.md](./DEPLOY.md).

### Быстрый деплой:

1. **Подготовьте Telegram бота:**
   - Создайте бота через [@BotFather](https://t.me/BotFather)
   - Получите токен и Chat ID

2. **Запустите автоматический деплой:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh [путь_к_ssh_ключу]
   ```

3. **Настройте переменные окружения на сервере:**
   ```bash
   ssh root@192.168.0.110
   cd /opt/restavraci
   nano .env  # Заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
   systemctl restart restavraci.service
   ```

Подробнее смотрите в [DEPLOY.md](./DEPLOY.md).

## Медиа

Поместите изображения портфолио в `public/portfolio/` с именами `1.jpg`…`6.jpg`. Временный логотип находится в `public/images/logo.svg`. Замените его на свой файл с тем же путем.

## Lighthouse рекомендации

- Используйте сжатые изображения современного формата
- Настройте кеширование статических ресурсов
- Следите за размером бандла, избегайте лишних зависимостей
- Обновите домен в `app/layout.tsx` в `metadataBase` и `canonical`

## Лицензия

MIT


