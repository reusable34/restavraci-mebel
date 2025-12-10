/**
 * Схемы валидации для формы обратной связи
 */

// Валидация имени: только кириллица, пробел, дефис (2-30 символов)
export const validateName = (name: string): boolean => {
  const regex = /^[а-яА-ЯёЁ\s\-]{2,30}$/;
  return regex.test(name.trim());
};

// Валидация контактов: email ИЛИ телефон
export const validateContacts = (contacts: string): boolean => {
  const trimmed = contacts.trim();
  
  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Телефон regex: +7XXXXXXXXXX или 8XXXXXXXXXX (10-11 цифр после +7 или 8)
  const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
  
  return emailRegex.test(trimmed) || phoneRegex.test(trimmed);
};

// Валидация Telegram: @username или ссылка t.me/username
export const validateTelegram = (telegram: string): boolean => {
  if (!telegram || telegram.trim().length === 0) {
    return true; // Поле опциональное
  }
  
  const trimmed = telegram.trim();
  
  // Формат @username (5-32 символа после @)
  const usernameRegex = /^@[a-zA-Z0-9_]{5,32}$/;
  
  // Формат ссылки t.me/username
  const linkRegex = /^https?:\/\/(www\.)?t\.me\/[a-zA-Z0-9_]{5,32}$/i;
  
  return usernameRegex.test(trimmed) || linkRegex.test(trimmed);
};

// Валидация сообщения: опционально, макс. 1000 символов
export const validateMessage = (message: string): boolean => {
  if (!message || message.trim().length === 0) {
    return true; // Поле опциональное
  }
  return message.trim().length <= 1000;
};

// Полная валидация всех полей формы
export interface FormData {
  name: string;
  contacts: string;
  telegram?: string;
  message?: string;
  website?: string; // Honeypot поле
  recaptchaToken?: string; // reCAPTCHA токен
}

export const validateFormData = (data: FormData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Валидация имени
  if (!data.name || !validateName(data.name)) {
    errors.push('Имя должно содержать только кириллицу, пробелы и дефисы (2-30 символов)');
  }
  
  // Валидация контактов
  if (!data.contacts || !validateContacts(data.contacts)) {
    errors.push('Укажите корректный email или телефон');
  }
  
  // Валидация Telegram (опционально)
  if (data.telegram && !validateTelegram(data.telegram)) {
    errors.push('Telegram должен быть в формате @username или ссылка t.me/username');
  }
  
  // Валидация сообщения (опционально)
  if (data.message && !validateMessage(data.message)) {
    errors.push('Сообщение не должно превышать 1000 символов');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};



