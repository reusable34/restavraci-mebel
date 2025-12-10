/**
 * Утилита для отправки сообщений в Telegram
 */

export interface TelegramMessage {
  name: string;
  contacts: string;
  telegram?: string;
  message?: string;
}

/**
 * Форматирование сообщения для Telegram
 */
export function formatTelegramMessage(data: TelegramMessage): string {
  const lines = [
    '🎨 Новая заявка с сайта',
    '',
    `👤 Имя: ${data.name}`,
    `📞 Контакты: ${data.contacts}`,
    `📱 Telegram: ${data.telegram || 'не указано'}`,
    `💬 Сообщение: ${data.message || 'нет'}`
  ];
  
  return lines.join('\n');
}

/**
 * Отправка сообщения в Telegram
 */
export async function sendTelegramMessage(
  botToken: string,
  chatIds: string | string[],
  message: string
): Promise<{ success: boolean; errors?: string[] }> {
  const chatIdArray = Array.isArray(chatIds) 
    ? chatIds 
    : chatIds.split(',').map(id => id.trim()).filter(Boolean);
  
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const errors: string[] = [];
  
  // Отправляем сообщение во все указанные чаты
  const sendPromises = chatIdArray.map(async (chatId) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          disable_web_page_preview: true
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        errors.push(`Chat ${chatId}: ${errorText}`);
        return { success: false, chatId };
      }
      
      return { success: true, chatId };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Chat ${chatId}: ${errorMsg}`);
      return { success: false, chatId };
    }
  });
  
  const results = await Promise.all(sendPromises);
  const allFailed = results.every(r => !r.success);
  
  return {
    success: !allFailed,
    errors: errors.length > 0 ? errors : undefined
  };
}



