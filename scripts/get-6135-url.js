const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Создаем клиент Sanity
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

async function get6135Url() {
  try {
    console.log('🔍 Ищем фотографию IMG_6135...');
    
    // Получаем фотографию IMG_6135
    const photo = await client.fetch(`
      *[_type == "portfolioImage" && alt match "*IMG_6135*"] {
        _id,
        image,
        alt,
        order
      }
    `);
    
    if (photo.length === 0) {
      console.log('❌ Фотография IMG_6135 не найдена');
      return;
    }
    
    const photoData = photo[0];
    console.log(`📷 Найдена фотография: ${photoData.alt} (ID: ${photoData._id})`);
    
    // Получаем URL изображения
    const imageUrl = photoData.image.asset._ref;
    console.log(`🔗 URL изображения: ${imageUrl}`);
    
    // Формируем полный URL для использования в коде
    const fullUrl = `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/production/${imageUrl.replace('image-', '').replace('-jpg', '.jpg')}`;
    console.log(`📸 Полный URL: ${fullUrl}`);
    
  } catch (error) {
    console.error('❌ Ошибка при получении URL:', error);
  }
}

// Проверяем наличие необходимых переменных окружения
if (!process.env.SANITY_PROJECT_ID) {
  console.error('❌ SANITY_PROJECT_ID не найден в переменных окружения');
  process.exit(1);
}

get6135Url();
