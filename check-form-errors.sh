#!/bin/bash
# Проверка ошибок формы

echo "🔍 Проверяю логи сервиса на ошибки..."
journalctl -u restavraci.service --no-pager -n 50 | grep -E "(ERROR|error|Error|FAILED|Failed)" || journalctl -u restavraci.service --no-pager -n 50

echo ""
echo "🔍 Проверяю последние логи..."
journalctl -u restavraci.service --no-pager -n 20



