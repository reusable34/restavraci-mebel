import type { Metadata } from 'next';
import { EB_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const ebGaramond = EB_Garamond({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://provintagevrn.ru'),
  title: {
    default: 'Реставрация мебели в Воронеже — Провинтаж | Реставрация, ремонт, перетяжка',
    template: '%s — Реставрация мебели в Воронеже | Провинтаж'
  },
  description: 'Профессиональная реставрация мебели в Воронеже. Реставрация старинной мебели, ремонт, перетяжка, покраска, редизайн. Мастерская Провинтаж. Работаем с антикварной и винтажной мебелью. Опыт более 10 лет. Бесплатная консультация.',
  keywords: [
    'реставрация мебели воронеж',
    'реставрация мебели воронеже',
    'реставрация старинной мебели воронеж',
    'реставрация антикварной мебели воронеж',
    'ремонт мебели воронеж',
    'перетяжка мебели воронеж',
    'реставрация стульев воронеж',
    'реставрация кресел воронеж',
    'реставрация столов воронеж',
    'реставрация шкафов воронеж',
    'реставрация комодов воронеж',
    'покраска мебели воронеж',
    'реставрация деревянной мебели воронеж',
    'мастерская реставрации мебели воронеж',
    'реставрация винтажной мебели воронеж',
    'реставрация мебели воронеж цена',
    'реставрация мебели воронеж отзывы',
    'реставрация мебели воронеж недорого',
    'реставрация мебели воронеж мастер',
    'реставрация мебели воронеж адрес'
  ],
  openGraph: {
    title: 'Реставрация мебели в Воронеже — Провинтаж | Реставрация, ремонт, перетяжка',
    description: 'Профессиональная реставрация мебели в Воронеже. Реставрация старинной мебели, ремонт, перетяжка, покраска, редизайн. Мастерская Провинтаж. Опыт более 10 лет.',
    url: 'https://provintagevrn.ru',
    siteName: 'Провинтаж — Реставрация мебели в Воронеже',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: 'https://provintagevrn.ru/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Реставрация мебели в Воронеже — Провинтаж'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Реставрация мебели в Воронеже — Провинтаж',
    description: 'Профессиональная реставрация мебели в Воронеже. Реставрация старинной мебели, ремонт, перетяжка, покраска.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://provintagevrn.ru'
  },
  verification: {
    yandex: 'your-yandex-verification-code',
    google: 'your-google-verification-code',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Провинтаж — Реставрация мебели в Воронеже',
    description: 'Профессиональная реставрация мебели в Воронеже. Реставрация старинной мебели, ремонт, перетяжка, покраска, редизайн.',
    url: 'https://provintagevrn.ru',
    telephone: '+79525564020',
    email: 'provintage1404@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Минская 67/1, цокольный этаж',
      addressLocality: 'Воронеж',
      addressRegion: 'Воронежская область',
      addressCountry: 'RU'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.6938490,
      longitude: 39.2805100
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      opens: '09:00',
      closes: '18:00'
    },
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: 'Воронеж'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги реставрации мебели',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Реставрация стула в Воронеже',
            description: 'Полная реставрация стула с восстановлением всех элементов'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Реставрация кресла в Воронеже',
            description: 'Реставрация кресла с сохранением исторической ценности'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Реставрация стола в Воронеже',
            description: 'Восстановление столов с учетом их функциональности и эстетики'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Реставрация шкафа в Воронеже',
            description: 'Комплексная реставрация крупногабаритной мебели'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Перетяжка мебели в Воронеже',
            description: 'Обновление обивки с использованием качественных материалов'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Ремонт деревянной мебели в Воронеже',
            description: 'Восстановление деревянных элементов мебели'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '50'
    }
  };

  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${manrope.variable} ${ebGaramond.variable} min-h-screen antialiased text-[var(--text)] victorian-bg`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

