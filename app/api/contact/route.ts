import { NextRequest, NextResponse } from 'next/server';

type Body = {
  name?: string;
  phone?: string;
  message?: string;
  website?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { name, phone, message, website }: Body = await req.json();
    if (website && website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'provintage1404@gmail.com';

    const text = `🎨 Новая заявка с сайта Провинтаж\n\n👤 Имя: ${name || '-'}\n📞 Телефон: ${phone || '-'}\n💬 Сообщение: ${message || '-'}\n\n🌐 Сайт: https://provintagevrn.ru`;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      // Поддержка нескольких chat_id (через запятую)
      const chatIds = TELEGRAM_CHAT_ID.split(',').map(id => id.trim()).filter(Boolean);
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      // Отправляем сообщение во все указанные чаты
      const sendPromises = chatIds.map(async (chatId) => {
        const tgRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chat_id: chatId, 
            text,
            parse_mode: 'HTML' // Для форматирования (опционально)
          })
        });
        if (!tgRes.ok) {
          const err = await tgRes.text();
          console.error(`Failed to send to chat ${chatId}:`, err);
          return { success: false, chatId, error: err };
        }
        return { success: true, chatId };
      });

      const results = await Promise.all(sendPromises);
      const allFailed = results.every(r => !r.success);
      
      if (allFailed) {
        return NextResponse.json({ 
          ok: false, 
          error: 'TELEGRAM_ERROR', 
          detail: results.map(r => r.error).join('; ') 
        }, { status: 500 });
      }
      
      // Если хотя бы одно сообщение отправилось - считаем успехом
      return NextResponse.json({ ok: true });
    }

    const subject = encodeURIComponent('Заявка на реставрацию — Провинтаж');
    const body = encodeURIComponent(`Имя: ${name || '-'}\nТелефон: ${phone || '-'}\nСообщение: ${message || '-'}`);
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    return NextResponse.json({ ok: false, mailto });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}





