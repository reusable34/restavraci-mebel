import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты — Реставрация мебели в Воронеже',
  description: 'Контакты мастерской реставрации мебели Провинтаж в Воронеже. Адрес: Минская 67/1, цокольный этаж. Телефон: +7 952 556-40-20. WhatsApp, Telegram. Работаем в Воронеже и области.',
  keywords: [
    'контакты реставрации мебели воронеж',
    'адрес реставрации мебели воронеж',
    'телефон реставрации мебели воронеж',
    'мастерская реставрации мебели воронеж адрес',
    'реставрация мебели воронеж как добраться'
  ],
  openGraph: {
    title: 'Контакты — Реставрация мебели в Воронеже | Провинтаж',
    description: 'Контакты мастерской реставрации мебели Провинтаж в Воронеже. Адрес: Минская 67/1, цокольный этаж. Телефон: +7 952 556-40-20.',
    url: 'https://provintagevrn.ru/contacts',
  },
  alternates: {
    canonical: 'https://provintagevrn.ru/contacts'
  }
};

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

