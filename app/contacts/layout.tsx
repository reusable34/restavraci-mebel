import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты — Реставрация мебели в Воронеже',
  description: 'Контакты мастерской реставрации мебели Провинтаж в Воронеже. Адрес: Минская 67/1, цокольный этаж. Телефоны: +7 952 556-40-20, +7 952 228-90-81. WhatsApp, Telegram: @marina_provintage. Email: provintage1404@gmail.com. Работаем в Воронеже и области.',
  keywords: [
    'контакты реставрации мебели воронеж',
    'адрес реставрации мебели воронеж',
    'телефон реставрации мебели воронеж',
    'мастерская реставрации мебели воронеж адрес',
    'реставрация мебели воронеж как добраться'
  ],
  openGraph: {
    title: 'Контакты — Реставрация мебели в Воронеже | Провинтаж',
    description: 'Контакты мастерской реставрации мебели Провинтаж в Воронеже. Адрес: Минская 67/1, цокольный этаж. Телефоны: +7 952 556-40-20, +7 952 228-90-81. Telegram: @marina_provintage.',
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

