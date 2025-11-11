import Image from 'next/image';
import Link from 'next/link';
import { getSanityClient } from '@/lib/sanity.client';
import { portfolioQuery } from '@/lib/sanity.queries';
import { urlFor } from '@/lib/sanity.images';

type Props = {
  limit?: number;
};

type PortfolioImage = { _id: string; image: any; alt?: string };

export async function PortfolioGrid({ limit }: Props) {
  const client = getSanityClient();
  let images: PortfolioImage[] = [];
  try {
    images = client ? await client.fetch(portfolioQuery) : [];
  } catch {
    images = [];
  }
  // Пропускаем первые 6 фотографий (они используются в секции "До и после")
  const filteredImages = images.slice(6);
  const list = typeof limit === 'number' ? filteredImages.slice(0, limit) : filteredImages;
  return (
    <div className="columns-1 md:columns-2 gap-6 space-y-6">
      {list.map((item) => (
        <Link key={item._id} href="/portfolio" className="group relative block overflow-hidden rounded-lg mb-6 break-inside-avoid" style={{ border: '1px solid var(--hairline)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="relative">
            <Image 
              src={urlFor(item.image).url()} 
              alt={item.alt || 'Реставрация мебели в Воронеже — работа мастерской Провинтаж'} 
              width={600}
              height={400}
              className="w-full h-auto transition duration-300 group-hover:scale-105" 
              sizes="(max-width: 768px) 100vw, 50vw" 
              loading="lazy"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

