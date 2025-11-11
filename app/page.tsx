import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/Container';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { ContactForm } from '@/components/ContactForm';

export default function HomePage() {
  return (
    <>
      <section className="section hero-bg">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--heading)' }}>
                Реставрация мебели в Воронеже — Провинтаж
              </h1>
              <p className="mt-4" style={{ color: 'color-mix(in oklab, var(--text) 90%, black 10%)' }}>
                Профессиональная реставрация мебели в Воронеже. Реставрация старинной и антикварной мебели, редизайн, ремонт, перетяжка, покраска. 
                Работаем с винтажной мебелью в Воронеже и области. Опыт более 10 лет. Более тысячи объектов в{'\u00A0'}
                наличии и на складе. Бесплатная консультация.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Link href="/contacts" className="btn-primary w-full h-12">
                  Бесплатная консультация
                </Link>
                <Link href="/portfolio" className="btn-secondary w-full h-12">Наши работы</Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl group" style={{ 
              border: '2px solid var(--hairline)', 
              backgroundColor: 'var(--bg-secondary)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}>
              <Image
                src="https://cdn.sanity.io/images/143zykun/production/022f895921eb215e5b12ad683e127cbf7ec41d8b-3206x2738.jpg"
                alt="Реставрация мебели в Воронеже — мастерская Провинтаж. Примеры работ по реставрации старинной мебели"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Градиентный оверлей для глубины */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Декоративная рамка */}
              <div className="absolute inset-2 rounded-xl border border-white/20 pointer-events-none"></div>
              
              {/* Подпись в углу */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Мастерская Провинтаж
              </div>
              
              {/* Декоративные элементы */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-6 right-6 w-2 h-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section" style={{ backgroundColor: '#203b1f' }}>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4" style={{ color: '#faf7f2' }}>
              ПОЧЕМУ ВЫБИРАЮТ НАС В ВОРОНЕЖЕ
            </h2>
            <div className="flex items-center justify-center">
              <div className="h-px bg-[#faf7f2] flex-1 max-w-[100px]"></div>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 mt-12 lg:max-w-4xl lg:mx-auto">
            <div className="flex items-center gap-4">
              <span className="font-bold leading-none" style={{ color: '#faf7f2', fontFamily: 'var(--font-heading)', fontSize: '5.75rem' }}>01</span>
              <p className="text-base md:text-lg flex-1" style={{ color: '#faf7f2' }}>Ручная работа и проверенные решения</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold leading-none" style={{ color: '#faf7f2', fontFamily: 'var(--font-heading)', fontSize: '5.75rem' }}>02</span>
              <p className="text-base md:text-lg flex-1" style={{ color: '#faf7f2' }}>Прозрачная смета и варианты под любой бюджет</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold leading-none" style={{ color: '#faf7f2', fontFamily: 'var(--font-heading)', fontSize: '5.75rem' }}>03</span>
              <p className="text-base md:text-lg flex-1" style={{ color: '#faf7f2' }}>Морилки, масла, лаки и ткани от надежных поставщиков</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold leading-none" style={{ color: '#faf7f2', fontFamily: 'var(--font-heading)', fontSize: '5.75rem' }}>04</span>
              <p className="text-base md:text-lg flex-1" style={{ color: '#faf7f2' }}>Обучаем реставрации и редизайну</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-title">Наши работы по реставрации мебели в Воронеже</h2>
            <Link href="/portfolio" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>Смотреть всё</Link>
          </div>
          <div className="mt-6">
            <PortfolioGrid limit={6} />
          </div>
        </Container>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Container>
          <div className="p-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" style={{ color: 'var(--heading)' }}>
              Реставрация мебели в Воронеже — получите бесплатную консультацию и смету
            </h2>
            <div className="mb-8 prose prose-lg max-w-none" style={{ color: 'color-mix(in oklab, var(--text) 90%, black 10%)' }}>
              <p className="text-base md:text-lg leading-relaxed mb-4">
                Мастерская <strong>Провинтаж</strong> специализируется на профессиональной <strong>реставрации мебели в Воронеже</strong>. 
                Мы выполняем реставрацию старинной и антикварной мебели, ремонт деревянной мебели, перетяжку мягкой мебели, 
                покраску и редизайн. Наша мастерская работает в Воронеже и Воронежской области уже более 10 лет.
              </p>
              <p className="text-base md:text-lg leading-relaxed mb-4">
                Мы реставрируем стулья, кресла, столы, шкафы, комоды, буфеты и другую мебель. 
                Каждая работа выполняется вручную с использованием качественных материалов и проверенных технологий. 
                Мы сохраняем историческую ценность антикварной мебели и придаем новую жизнь винтажным предметам интерьера.
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                Если вам нужна <strong>реставрация мебели в Воронеже</strong>, свяжитесь с нами для бесплатной консультации. 
                Мы оценим состояние вашей мебели и предоставим подробную смету работ.
              </p>
            </div>
            <div className="card p-6">
              <ContactForm />
              <div className="mt-4 text-xs" style={{ color: 'color-mix(in oklab, var(--text) 60%, black 40%)' }}>Нажимая кнопку, вы даете согласие на обработку персональных данных</div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

