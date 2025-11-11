import { Container } from '@/components/Container';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { BeforeAfter } from '@/components/BeforeAfter';
import { getSanityClient } from '@/lib/sanity.client';
import { portfolioQuery } from '@/lib/sanity.queries';
import { urlFor } from '@/lib/sanity.images';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Портфолио реставрации мебели в Воронеже',
  description: 'Портфолио работ по реставрации мебели в Воронеже. Примеры реставрации стульев, кресел, столов, шкафов, комодов. До и после. Мастерская Провинтаж.',
  keywords: [
    'портфолио реставрации мебели воронеж',
    'примеры реставрации мебели воронеж',
    'работы реставрации мебели воронеж',
    'реставрация мебели воронеж фото',
    'реставрация мебели воронеж до и после'
  ],
  openGraph: {
    title: 'Портфолио реставрации мебели в Воронеже — Провинтаж',
    description: 'Портфолио работ по реставрации мебели в Воронеже. Примеры реставрации стульев, кресел, столов, шкафов, комодов. До и после.',
    url: 'https://provintagevrn.ru/portfolio',
  },
  alternates: {
    canonical: 'https://provintagevrn.ru/portfolio'
  }
};

export default async function PortfolioPage() {
  const client = getSanityClient();
  let images: any[] = [];
  try {
    images = client ? await client.fetch(portfolioQuery) : [];
  } catch {
    images = [];
  }
  
  // Берем первые 6 фотографий для секции "До и после"
  const first = images[0]?.image;
  const second = images[1]?.image;
  const third = images[2]?.image;
  const fourth = images[3]?.image;
  const fifth = images[4]?.image;
  const sixth = images[5]?.image;
  
  return (
    <section className="section">
      <Container>
        <h1 className="section-title">Портфолио</h1>
        <div className="mt-6">
          <PortfolioGrid />
        </div>
        {first && second && third && fourth && fifth && sixth && (
          <div className="mt-10 columns-1 md:columns-2 gap-8 space-y-8">
            <div className="break-inside-avoid">
              <BeforeAfter beforeSrc={urlFor(first).url()} afterSrc={urlFor(second).url()} alt="Реставрация мебели в Воронеже — до и после реставрации стула" />
            </div>
            <div className="break-inside-avoid">
              <BeforeAfter beforeSrc={urlFor(third).url()} afterSrc={urlFor(fourth).url()} alt="Реставрация мебели в Воронеже — до и после реставрации кресла" />
            </div>
            <div className="break-inside-avoid">
              <BeforeAfter beforeSrc={urlFor(fifth).url()} afterSrc={urlFor(sixth).url()} alt="Реставрация мебели в Воронеже — до и после реставрации стола" />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

