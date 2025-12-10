import { NextRequest, NextResponse } from 'next/server';
import { validateFormData, FormData } from '@/lib/validation';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { formatTelegramMessage, sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let clientIP = 'unknown';
  
  try {
    // Получаем IP адрес клиента
    clientIP = getClientIP(req);
    
    // Проверка rate limiting
    const rateLimit = checkRateLimit(clientIP, 3, 60 * 1000); // 3 запроса в минуту
    if (!rateLimit.allowed) {
      console.warn(`[RATE_LIMIT] IP: ${clientIP}, Reset at: ${new Date(rateLimit.resetTime).toISOString()}`);
      return NextResponse.json(
        { ok: false, message: 'Слишком много запросов. Попробуйте позже.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      );
    }

    // Парсинг тела запроса
    let body: FormData;
    try {
      body = await req.json();
    } catch (e) {
      console.error('[PARSE_ERROR]', e);
      return NextResponse.json(
        { ok: false, message: 'Неверный формат данных.' },
        { status: 400 }
      );
    }

    // Проверка honeypot поля
    if (body.website && body.website.trim().length > 0) {
      console.warn(`[HONEYPOT_TRIGGERED] IP: ${clientIP}, Website: ${body.website}`);
      // Возвращаем успех, чтобы не показывать боту, что его обнаружили
      return NextResponse.json({ ok: true });
    }

    // Валидация данных
    const validation = validateFormData(body);
    if (!validation.valid) {
      console.warn(`[VALIDATION_ERROR] IP: ${clientIP}, Errors: ${validation.errors.join(', ')}`);
      return NextResponse.json(
        { ok: false, message: validation.errors[0] || 'Ошибка валидации данных.' },
        { status: 400 }
      );
    }

    // Проверка reCAPTCHA (если токен предоставлен)
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (body.recaptchaToken && recaptchaSecret) {
      const recaptchaResult = await verifyRecaptcha(body.recaptchaToken, recaptchaSecret);
      if (!recaptchaResult.success) {
        console.warn(`[RECAPTCHA_FAILED] IP: ${clientIP}, Score: ${recaptchaResult.score}, Error: ${recaptchaResult.error}`);
        return NextResponse.json(
          { ok: false, message: 'Ошибка проверки безопасности. Попробуйте позже.' },
          { status: 400 }
        );
      }
    } else if (!body.recaptchaToken && recaptchaSecret) {
      // Если reCAPTCHA настроена, но токен не предоставлен - это подозрительно
      console.warn(`[RECAPTCHA_MISSING] IP: ${clientIP}`);
      // Можно либо блокировать, либо разрешать (зависит от требований)
      // Для начала разрешаем, но логируем
    }

    // Получение конфигурации Telegram
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('[TELEGRAM_CONFIG_MISSING]');
      return NextResponse.json(
        { ok: false, message: 'Сервис временно недоступен. Попробуйте позже.' },
        { status: 500 }
      );
    }

    // Форматирование и отправка сообщения в Telegram
    const telegramMessage = formatTelegramMessage({
      name: body.name,
      contacts: body.contacts,
      telegram: body.telegram,
      message: body.message
    });

    const telegramResult = await sendTelegramMessage(
      TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID,
      telegramMessage
    );

    if (!telegramResult.success) {
      console.error(`[TELEGRAM_ERROR] IP: ${clientIP}, Errors: ${telegramResult.errors?.join('; ')}`);
      return NextResponse.json(
        { ok: false, message: 'Ошибка отправки сообщения. Попробуйте позже.' },
        { status: 500 }
      );
    }

    // Логирование успешной отправки
    const duration = Date.now() - startTime;
    console.log(`[SUCCESS] IP: ${clientIP}, Duration: ${duration}ms`);

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString()
        }
      }
    );

  } catch (e: any) {
    console.error(`[SERVER_ERROR] IP: ${clientIP}`, e);
    return NextResponse.json(
      { ok: false, message: 'Внутренняя ошибка сервера. Попробуйте позже.' },
      { status: 500 }
    );
  }
}

// Настройка CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


