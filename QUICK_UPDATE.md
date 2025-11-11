# ⚡ Быстрое обновление на сервере - ОДНА КОМАНДА

## 🚀 Выполните эту команду на сервере:

```bash
cd /opt/restavraci && (git pull origin main 2>/dev/null || (git clone https://github.com/reusable34/restavraci-mebel.git /tmp/restavraci-tmp && cp -r /tmp/restavraci-tmp/. /opt/restavraci/ && rm -rf /tmp/restavraci-tmp && cd /opt/restavraci && git init && git remote add origin https://github.com/reusable34/restavraci-mebel.git && git fetch && git reset --hard origin/main)) && npm ci && npm run build && systemctl restart restavraci.service && systemctl status restavraci.service
```

---

## 📋 Или выполните по шагам (если одна команда не работает):

### Вариант 1: Если git репозиторий уже есть

```bash
cd /opt/restavraci
git pull origin main
npm ci
npm run build
systemctl restart restavraci.service
systemctl status restavraci.service
```

### Вариант 2: Если git репозитория нет

```bash
cd /opt/restavraci

# Сохраните .env если есть
[ -f .env ] && cp .env /tmp/restavraci-env-backup

# Клонируйте репозиторий
git clone https://github.com/reusable34/restavraci-mebel.git /tmp/restavraci-tmp
cp -r /tmp/restavraci-tmp/. .
rm -rf /tmp/restavraci-tmp

# Восстановите .env
[ -f /tmp/restavraci-env-backup ] && cp /tmp/restavraci-env-backup .env && rm /tmp/restavraci-env-backup

# Инициализируйте git
git init
git remote add origin https://github.com/reusable34/restavraci-mebel.git
git fetch
git reset --hard origin/main

# Установите зависимости и соберите
npm ci
npm run build

# Перезапустите сервис
systemctl restart restavraci.service
systemctl status restavraci.service
```

---

## ✅ Что делает команда:

1. ✅ Обновляет код из GitHub
2. ✅ Устанавливает зависимости (npm ci)
3. ✅ Собирает Next.js приложение (npm run build)
4. ✅ Перезапускает сервис
5. ✅ Показывает статус

---

## 🔍 Проверка после обновления:

```bash
# Проверьте логи
journalctl -u restavraci.service -n 50

# Проверьте доступность
curl http://localhost:3000
```

---

## 🆘 Если что-то пошло не так:

```bash
# Посмотрите логи
journalctl -u restavraci.service -f

# Проверьте статус
systemctl status restavraci.service

# Перезапустите вручную
systemctl restart restavraci.service
```

