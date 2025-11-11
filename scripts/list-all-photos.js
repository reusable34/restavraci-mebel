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

async function listAllPhotos() {
  try {
    console.log('📸 Получаем все фотографии портфолио...');
    
    // Получаем все записи portfolioImage с сортировкой по порядку
    const portfolioImages = await client.fetch(`
      *[_type == "portfolioImage"] | order(order asc) {
        _id,
        image,
        alt,
        order
      }
    `);
    
    console.log(`📷 Найдено ${portfolioImages.length} фотографий:\n`);
    
    // Выводим все фотографии с их порядком
    portfolioImages.forEach((photo, index) => {
      const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
      const is8886 = filename.includes('IMG_8886');
      const is8885 = filename.includes('IMG_8885');
      const marker = is8886 ? '👈 IMG_8886' : is8885 ? '👉 IMG_8885' : '  ';
      
      console.log(`${marker} ${index + 1}. Порядок ${photo.order}: ${filename}`);
    });
    
    console.log('\n🔍 Поиск фотографий в секции "Сдвигайте"...');
    console.log('Нужно определить, какие именно фотографии находятся в секции "Сдвигайте"');
    console.log('Возможно, это не IMG_8886 и IMG_8885, а другие фотографии');
    
    // Ищем фотографии, которые могут быть в секции "Сдвигайте"
    const possiblePhotos = portfolioImages.filter(photo => {
      const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : '';
      // Ищем фотографии, которые могут быть в секции "Сдвигайте"
      return filename.includes('IMG_') && (
        filename.includes('888') || 
        filename.includes('889') || 
        filename.includes('893')
      );
    });
    
    console.log('\n🎯 Возможные кандидаты для секции "Сдвигайте":');
    possiblePhotos.forEach((photo, index) => {
      const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
      console.log(`   ${index + 1}. Порядок ${photo.order}: ${filename}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при получении фотографий:', error);
  }
}

// Проверяем наличие необходимых переменных окружения
if (!process.env.SANITY_PROJECT_ID) {
  console.error('❌ SANITY_PROJECT_ID не найден в переменных окружения');
  process.exit(1);
}

if (!process.env.SANITY_TOKEN) {
  console.log('⚠️  SANITY_TOKEN не найден. Для получения списка нужен токен.');
  process.exit(1);
}

listAllPhotos();
