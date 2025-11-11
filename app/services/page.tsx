import { Container } from '@/components/Container';
import { ServiceCard } from '@/components/ServiceCard';
import { getSanityClient, hasSanityConfig } from '@/lib/sanity.client';
import { servicesQuery } from '@/lib/sanity.queries';
import type { Service } from '@/lib/services';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Услуги реставрации мебели в Воронеже',
  description: 'Услуги реставрации мебели в Воронеже: реставрация стульев, кресел, столов, шкафов, комодов. Перетяжка мебели, ремонт деревянной мебели, покраска, редизайн. Мастерская Провинтаж. Цены от 500₽. Бесплатная консультация.',
  keywords: [
    'услуги реставрации мебели воронеж',
    'реставрация стульев воронеж',
    'реставрация кресел воронеж',
    'реставрация столов воронеж',
    'реставрация шкафов воронеж',
    'перетяжка мебели воронеж',
    'ремонт мебели воронеж',
    'покраска мебели воронеж',
    'реставрация мебели воронеж цены'
  ],
  openGraph: {
    title: 'Услуги реставрации мебели в Воронеже — Провинтаж',
    description: 'Услуги реставрации мебели в Воронеже: реставрация стульев, кресел, столов, шкафов, комодов. Перетяжка мебели, ремонт деревянной мебели.',
    url: 'https://provintagevrn.ru/services',
  },
  alternates: {
    canonical: 'https://provintagevrn.ru/services'
  }
};

export default async function ServicesPage() {
  const client = getSanityClient();
  let services: Service[];
  try {
    services = client ? await client.fetch<Service[]>(servicesQuery) : (await import('@/lib/services')).services;
  } catch {
    services = (await import('@/lib/services')).services;
  }
  return (
    <section className="section">
      <Container>
        <h1 className="section-title">Услуги реставрации мебели в Воронеже</h1>
        <div className="mt-4 mb-8 prose prose-lg max-w-none" style={{ color: 'color-mix(in oklab, var(--text) 90%, black 10%)' }}>
          <p className="text-base md:text-lg leading-relaxed">
            Мастерская <strong>Провинтаж</strong> предлагает полный спектр услуг по <strong>реставрации мебели в Воронеже</strong>. 
            Мы работаем с любыми видами мебели: стульями, креслами, столами, шкафами, комодами, буфетами и другой мебелью. 
            Наши мастера имеют многолетний опыт работы с антикварной и винтажной мебелью.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {services.map((s) => (
            <ServiceCard key={s.slug} title={s.title} description={s.description} priceFrom={s.priceFrom} />
          ))}
        </div>
        <div className="mt-12 prose prose-lg max-w-none" style={{ color: 'color-mix(in oklab, var(--text) 90%, black 10%)' }}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: 'var(--heading)' }}>
            Почему выбирают нашу мастерскую в Воронеже
          </h2>
          <ul className="list-disc list-inside space-y-2 text-base md:text-lg">
            <li>Опыт работы более 10 лет в сфере реставрации мебели в Воронеже</li>
            <li>Использование качественных материалов и проверенных технологий</li>
            <li>Индивидуальный подход к каждому проекту</li>
            <li>Прозрачная смета без скрытых платежей</li>
            <li>Гарантия на все виды работ</li>
            <li>Работаем с антикварной и винтажной мебелью</li>
          </ul>
        </div>
      </Container>
    </section>
  );
}

