import { Container } from './Container';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 border-t" style={{ borderColor: 'var(--hairline)', backgroundColor: '#203b1f' }}>
      <Container>
        <div className="grid gap-6 py-10 text-sm md:grid-cols-3" style={{ color: '#faf7f2' }}>
          <div>
            <div className="font-semibold" style={{ color: '#faf7f2' }}>Провинтаж — Реставрация мебели в Воронеже</div>
            <p className="mt-2 max-w-sm" style={{ color: '#faf7f2' }}>Профессиональная реставрация мебели в Воронеже. Реставрация старинной и антикварной мебели, редизайн, ремонт, перетяжка, покраска. Работаем в Воронеже и области.</p>
          </div>
          <div>
            <div className="font-semibold" style={{ color: '#faf7f2' }}>Навигация</div>
            <ul className="mt-2 space-y-1">
              <li><Link href="/services" className="hover:opacity-80 transition-opacity" style={{ color: '#faf7f2' }}>Услуги</Link></li>
              <li><Link href="/portfolio" className="hover:opacity-80 transition-opacity" style={{ color: '#faf7f2' }}>Портфолио</Link></li>
              <li><Link href="/contacts" className="hover:opacity-80 transition-opacity" style={{ color: '#faf7f2' }}>Контакты</Link></li>
            </ul>
          </div>
          <div>
            <ul className="mt-2 space-y-1">
              <li><a href="tel:+79525564020" className="hover:opacity-80 transition-opacity text-2xl" style={{ color: '#faf7f2' }}>+7 952 556-40-20</a></li>
              <li><a href="mailto:nparinov03@gmail.com" className="hover:opacity-80 transition-opacity text-2xl" style={{ color: '#faf7f2' }}>nparinov03@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-between border-t py-4 text-xs" style={{ borderColor: 'rgba(250, 247, 242, 0.2)', color: '#faf7f2' }}>
          <span>© {new Date().getFullYear()} Провинтаж</span>
        </div>
      </Container>
    </footer>
  );
}

