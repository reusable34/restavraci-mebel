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

    const text = `Новая заявка с сайта Провинтаж\nИмя: ${name || '-'}\nТелефон: ${phone || '-'}\nСообщение: ${message || '-'}`;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const tgRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
      });
      if (!tgRes.ok) {
        const err = await tgRes.text();
        return NextResponse.json({ ok: false, error: 'TELEGRAM_ERROR', detail: err }, { status: 500 });
      }
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





