"use client";
import { useState } from 'react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setMailtoHref(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message, website })
      });
      const data = await res.json();
      if (data.ok) {
        setStatus('Заявка отправлена. Мы свяжемся с вами.');
        setName('');
        setPhone('');
        setMessage('');
        setWebsite('');
      } else if (data.mailto) {
        setMailtoHref(data.mailto as string);
        setStatus('Отправьте письмо, если мессенджер временно недоступен.');
      } else {
        setStatus('Ошибка отправки. Попробуйте позже.');
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
          <label className="block text-sm" style={{ color: 'color-mix(in oklab, var(--text) 80%, black 20%)' }}>Имя</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ваше имя" className="mt-1 w-full input" />
        </div>
        <div>
          <label className="block text-sm" style={{ color: 'color-mix(in oklab, var(--text) 80%, black 20%)' }}>Телефон</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7" className="mt-1 w-full input" />
        </div>
      </div>
      <div>
        <label className="block text-sm" style={{ color: 'color-mix(in oklab, var(--text) 80%, black 20%)' }}>Сообщение</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Опишите задачу" className="mt-1 w-full input" />
      </div>
      <div className="hidden">
        <label>Website</label>
        <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Отправка…' : 'Отправить заявку'}</button>
        {mailtoHref && (
          <a href={mailtoHref} className="btn-secondary">Отправить письмо</a>
        )}
      </div>
      {status && <div className="text-sm" style={{ color: 'color-mix(in oklab, var(--text) 85%, black 15%)' }}>{status}</div>}
    </form>
  );
}

