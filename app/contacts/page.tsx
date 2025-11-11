"use client";
import { Container } from '@/components/Container';
import { ContactForm } from '@/components/ContactForm';
import Link from 'next/link';

export default function ContactsPage() {
  return (
    <section className="section">
      <Container>
        <h1 className="section-title">Контакты</h1>
        <p className="mt-2" style={{ color: 'color-mix(in oklab, var(--text) 90%, black 10%)' }}>Мы всегда на связи — пишите и звоните удобным способом</p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="card p-6">
              <div className="font-semibold" style={{ color: 'var(--heading)' }}>Связаться</div>
              <ul className="mt-3 space-y-2" style={{ color: 'color-mix(in oklab, var(--text) 85%, black 15%)' }}>
                <li><a href="tel:+79525564020" className="hover:underline">Телефон: +7 952 556-40-20</a></li>
                <li><a href="tel:+79522289081" className="hover:underline">Телефон: +7 952 228-90-81</a></li>
                <li><a href="https://wa.me/79525564020" className="hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp: перейти в чат</a></li>
                <li><a href="https://t.me/provintagevrn" className="hover:underline" target="_blank" rel="noopener noreferrer">Telegram: @marina_provintage</a></li>
                <li><a href="mailto:provintage1404@gmail.com" className="hover:underline">Email: provintage1404@gmail.com</a></li>
              </ul>
            </div>
            <div className="card overflow-hidden">
              <iframe title="Карта" src="https://yandex.ru/map-widget/v1/?ll=39.2805100%2C51.6938490&z=17&pt=39.2805100%2C51.6938490,pm2rdm" width="100%" height="300" frameBorder="0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <div className="p-4 text-sm" style={{ color: 'color-mix(in oklab, var(--text) 85%, black 15%)' }}>Адрес: Минская 67/1, цокольный этаж</div>
            </div>
          </div>
          <div>
            <div className="card p-6">
              <div className="mb-4 text-lg font-semibold" style={{ color: 'var(--heading)' }}>Оставьте заявку</div>
              <ContactForm />
              <div className="mt-4 text-xs" style={{ color: 'color-mix(in oklab, var(--text) 60%, black 40%)' }}>Нажимая кнопку, вы даете согласие на обработку персональных данных</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

