"use client";
import { useState, useEffect } from 'react';
import { validateName, validateContacts, validateTelegram, validateMessage } from '@/lib/validation';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function ContactForm() {
  const [name, setName] = useState('');
  const [contacts, setContacts] = useState('');
  const [telegram, setTelegram] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot поле
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Загрузка reCAPTCHA v3
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Валидация на клиенте
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name || !validateName(name)) {
      newErrors.name = 'Имя должно содержать только кириллицу, пробелы и дефисы (2-30 символов)';
    }

    if (!contacts || !validateContacts(contacts)) {
      newErrors.contacts = 'Укажите корректный email или телефон';
    }

    if (telegram && !validateTelegram(telegram)) {
      newErrors.telegram = 'Telegram должен быть в формате @username или ссылка t.me/username';
    }

    if (message && !validateMessage(message)) {
      newErrors.message = 'Сообщение не должно превышать 1000 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setErrors({});

    // Валидация на клиенте
    if (!validate()) {
      setStatus('Пожалуйста, исправьте ошибки в форме.');
      return;
    }

    setLoading(true);

    try {
      // Получаем reCAPTCHA токен
      let recaptchaToken = '';
      if (recaptchaLoaded && window.grecaptcha) {
        try {
          recaptchaToken = await window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
            { action: 'submit' }
          );
        } catch (err) {
          console.error('reCAPTCHA error:', err);
          // Продолжаем без токена, сервер проверит
        }
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contacts: contacts.trim(),
          telegram: telegram.trim() || undefined,
          message: message.trim() || undefined,
          website: website, // Honeypot
          recaptchaToken: recaptchaToken || undefined
        })
      });

      const data = await res.json();

      if (data.ok) {
        setStatus('Заявка отправлена. Мы свяжемся с вами.');
        setName('');
        setContacts('');
        setTelegram('');
        setMessage('');
        setWebsite('');
      } else {
        // Показываем общее сообщение об ошибке
        setStatus(data.message || 'Ошибка отправки. Попробуйте позже.');
      }
    } catch (e) {
      setStatus('Ошибка сети. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm" style={{ color: 'color-mix(in oklab, var(--text) 80%, black 20%)' }}>
            Имя <span className="text-red-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            required
            placeholder="Ваше имя"
            className={`mt-1 w-full input ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm" style={{ color: 'color-mix(in oklab, var(--text) 80%, black 20%)' }}>
            Контакты (email или телефон) <span className="text-red-500">*</span>
          </label>
          <input
            value={contacts}
            onChange={(e) => {
              setContacts(e.target.value);
              if (errors.contacts) setErrors({ ...errors, contacts: '' });
            }}
            required
            placeholder="email@example.com или +7XXXXXXXXXX"
            className={`mt-1 w-full input ${errors.contacts ? 'border-red-500' : ''}`}
          />
          {errors.contacts && (
            <p className="mt-1 text-sm text-red-500">{errors.contacts}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm" style={{ color: 'color-mix(in oklab, var(--text) 80%, black 20%)' }}>
          Telegram (необязательно)
        </label>
        <input
          value={telegram}
          onChange={(e) => {
            setTelegram(e.target.value);
            if (errors.telegram) setErrors({ ...errors, telegram: '' });
          }}
          placeholder="@username или ссылка t.me/username"
          className={`mt-1 w-full input ${errors.telegram ? 'border-red-500' : ''}`}
        />
        {errors.telegram && (
          <p className="mt-1 text-sm text-red-500">{errors.telegram}</p>
        )}
      </div>

      <div>
        <label className="block text-sm" style={{ color: 'color-mix(in oklab, var(--text) 80%, black 20%)' }}>
          Сообщение (необязательно)
        </label>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors({ ...errors, message: '' });
          }}
          rows={4}
          placeholder="Опишите задачу"
          maxLength={1000}
          className={`mt-1 w-full input ${errors.message ? 'border-red-500' : ''}`}
        />
        <div className="mt-1 text-xs text-gray-500 text-right">
          {message.length}/1000
        </div>
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>

      {/* Honeypot поле - скрытое для пользователей, но видимое для ботов */}
      <div className="hidden" aria-hidden="true">
        <label>Website</label>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Отправка…' : 'Отправить заявку'}
        </button>
      </div>

      {status && (
        <div
          className={`text-sm ${
            status.includes('отправлена') ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {status}
        </div>
      )}
    </form>
  );
}
