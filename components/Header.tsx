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
          <nav className="flex items-center gap-4 md:gap-8 lg:gap-10 text-sm md:text-base lg:text-lg text-[var(--text)]">
            <Link href="/services" className="hover:text-[var(--accent)]">Услуги</Link>
            <Link href="/portfolio" className="hover:text-[var(--accent)]">Портфолио</Link>
            <Link href="/contacts" className="hover:text-[var(--accent)]">Контакты</Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}

