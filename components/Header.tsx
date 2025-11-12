"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Container } from './Container';

export function Header() {
  const [copied, setCopied] = useState(false);

  const handlePhoneClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const phoneNumber = '+7 952 556-40-20';
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b header-bg backdrop-blur" style={{ borderColor: 'var(--hairline)' }}>
      <Container>
        <div className="flex h-16 md:h-20 lg:h-24 items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="Провинтаж — Реставрация мебели в Воронеже"
                width={64}
                height={64}
                className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16"
                priority
              />
            </Link>
            <button
              onClick={handlePhoneClick}
              className="text-sm md:text-base lg:text-lg hover:text-[var(--accent)] transition-colors cursor-pointer"
              style={{ color: 'var(--text)' }}
              title={copied ? 'Скопировано!' : 'Кликните, чтобы скопировать номер'}
            >
              {copied ? 'Скопировано!' : '+7 952 556-40-20'}
            </button>
          </div>
          <nav className="flex items-center gap-4 md:gap-6 lg:gap-8 text-sm md:text-base lg:text-lg text-[var(--text)]">
            <Link href="/services" className="hover:text-[var(--accent)]">Услуги</Link>
            <Link href="/portfolio" className="hover:text-[var(--accent)]">Портфолио</Link>
            <Link href="/contacts" className="hover:text-[var(--accent)]">Контакты</Link>
            <div className="flex items-center gap-3 ml-2">
              <a 
                href="https://wa.me/79525564020" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                title="Написать в WhatsApp"
                aria-label="WhatsApp"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="#25D366"/>
                </svg>
              </a>
              <a 
                href="https://t.me/provintagevrn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                title="Написать в Telegram"
                aria-label="Telegram"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.193l-1.87 8.788c-.14.625-.5.777-1.015.48l-2.8-2.063-1.35 1.297c-.15.15-.275.275-.565.275l.2-2.82 5.183-4.68c.225-.2-.05-.31-.348-.11l-6.403 4.03-2.76-.86c-.6-.188-.615-.6.125-.895l10.78-4.155c.5-.19.937.112.775.865z" fill="#0088cc"/>
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </Container>
    </header>
  );
}

