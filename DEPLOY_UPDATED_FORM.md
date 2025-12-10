# Деплой обновленной формы обратной связи

## Команда для выполнения на сервере

```bash
cd /opt/restavraci && \
npm ci --production=false && \
npm run build && \
systemctl restart restavraci.service && \
sleep 3 && \
systemctl status restavraci.service --no-pager | head -10
```

## Опционально: настройка reCAPTCHA

Если хотите включить защиту reCAPTCHA v3, добавьте в `/opt/restavraci/.env`:

```bash
# reCAPTCHA v3 (опционально)
RECAPTCHA_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
```

Получить ключи можно на: https://www.google.com/recaptcha/admin/create

## Проверка работы

После деплоя проверьте:
1. Форма отображается корректно
2. Валидация работает на клиенте
3. Отправка заявок работает
4. Сообщения приходят в Telegram



