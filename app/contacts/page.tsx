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
              <ul className="mt-3 space-y-3" style={{ color: 'color-mix(in oklab, var(--text) 85%, black 15%)' }}>
                <li className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                  </svg>
                  <a href="tel:+79525564020" className="hover:underline">+7 952 556-40-20</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                  </svg>
                  <a href="tel:+79522289081" className="hover:underline">+7 952 228-90-81</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="#25D366"/>
                  </svg>
                  <a href="https://wa.me/79525564020" className="hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp: перейти в чат</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.193l-1.87 8.788c-.14.625-.5.777-1.015.48l-2.8-2.063-1.35 1.297c-.15.15-.275.275-.565.275l.2-2.82 5.183-4.68c.225-.2-.05-.31-.348-.11l-6.403 4.03-2.76-.86c-.6-.188-.615-.6.125-.895l10.78-4.155c.5-.19.937.112.775.865z" fill="#0088cc"/>
                  </svg>
                  <a href="https://t.me/provintagevrn" className="hover:underline" target="_blank" rel="noopener noreferrer">Telegram: @marina_provintage</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                  </svg>
                  <a href="mailto:provintage1404@gmail.com" className="hover:underline">provintage1404@gmail.com</a>
                </li>
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

