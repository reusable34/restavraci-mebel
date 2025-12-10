/**
 * Простой rate limiting по IP адресу
 * Хранит данные в памяти (для продакшена лучше использовать Redis)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Хранилище в памяти (в продакшене использовать Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Очистка старых записей каждые 5 минут
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * Проверка rate limit для IP адреса
 * @param ip - IP адрес клиента
 * @param maxRequests - Максимальное количество запросов
 * @param windowMs - Окно времени в миллисекундах
 * @returns true если лимит не превышен, false если превышен
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number = 3,
  windowMs: number = 60 * 1000 // 1 минута
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  // Если записи нет или время истекло - создаём новую
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    };
  }
  
  // Если лимит превышен
  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }
  
  // Увеличиваем счётчик
  entry.count++;
  rateLimitStore.set(ip, entry);
  
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime
  };
}

/**
 * Получение IP адреса из запроса
 */
export function getClientIP(req: Request): string {
  // Пробуем получить IP из заголовков (если за прокси)
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback (в реальности это не сработает, но для типизации)
  return 'unknown';
}



