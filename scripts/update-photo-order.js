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

async function updatePhotoOrder() {
  try {
    console.log('🔍 Ищем фотографии IMG_8886 и IMG_8885...');
    
    // Получаем все записи portfolioImage
    const portfolioImages = await client.fetch(`
      *[_type == "portfolioImage"] | order(order asc) {
        _id,
        image,
        alt,
        order
      }
    `);
    
    console.log(`📸 Найдено ${portfolioImages.length} записей портфолио`);
    
    // Находим нужные фотографии по alt-тексту
    const photo8886 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_8886'));
    const photo8885 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_8885'));
    
    if (!photo8886) {
      console.log('❌ Фотография IMG_8886 не найдена');
      return;
    }
    
    if (!photo8885) {
      console.log('❌ Фотография IMG_8885 не найдена');
      return;
    }
    
    console.log(`📷 Найдена IMG_8886 (ID: ${photo8886._id}, текущий порядок: ${photo8886.order})`);
    console.log(`📷 Найдена IMG_8885 (ID: ${photo8885._id}, текущий порядок: ${photo8885.order})`);
    
    // Меняем порядок: 8886 слева (меньший номер), 8885 справа (больший номер)
    const newOrder8886 = Math.min(photo8886.order, photo8885.order);
    const newOrder8885 = Math.max(photo8886.order, photo8885.order);
    
    console.log(`🔄 Обновляем порядок:`);
    console.log(`   IMG_8886 -> порядок ${newOrder8886} (слева)`);
    console.log(`   IMG_8885 -> порядок ${newOrder8885} (справа)`);
    
    // Обновляем IMG_8886
    await client
      .patch(photo8886._id)
      .set({ order: newOrder8886 })
      .commit();
    
    // Обновляем IMG_8885
    await client
      .patch(photo8885._id)
      .set({ order: newOrder8885 })
      .commit();
    
    console.log('✅ Порядок фотографий успешно обновлен!');
    console.log(`   IMG_8886 теперь слева (порядок: ${newOrder8886})`);
    console.log(`   IMG_8885 теперь справа (порядок: ${newOrder8885})`);
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении порядка:', error);
  }
}

// Проверяем наличие необходимых переменных окружения
if (!process.env.SANITY_PROJECT_ID) {
  console.error('❌ SANITY_PROJECT_ID не найден в переменных окружения');
  process.exit(1);
}

if (!process.env.SANITY_TOKEN) {
  console.log('⚠️  SANITY_TOKEN не найден. Для обновления порядка нужен токен.');
  console.log('Добавьте SANITY_TOKEN в .env.local и запустите скрипт снова.');
  process.exit(1);
}

updatePhotoOrder();
