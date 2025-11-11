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

async function fixPhotoOrder() {
  try {
    console.log('🔧 Исправляем порядок фотографий...');
    
    // Получаем все записи portfolioImage
    const portfolioImages = await client.fetch(`
      *[_type == "portfolioImage"] | order(order asc) {
        _id,
        image,
        alt,
        order
      }
    `);
    
    // Находим нужные фотографии
    const photo8886 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_8886'));
    const photo8885 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_8885'));
    
    if (!photo8886 || !photo8885) {
      console.log('❌ Не найдены фотографии IMG_8886 или IMG_8885');
      return;
    }
    
    console.log(`📷 Текущий порядок:`);
    console.log(`   IMG_8886: ${photo8886.order}`);
    console.log(`   IMG_8885: ${photo8885.order}`);
    
    // Меняем местами: 8886 должна быть слева (меньший номер), 8885 справа (больший номер)
    const tempOrder8886 = photo8886.order;
    const tempOrder8885 = photo8885.order;
    
    // Устанавливаем правильный порядок
    const newOrder8886 = Math.min(tempOrder8886, tempOrder8885);
    const newOrder8885 = Math.max(tempOrder8886, tempOrder8885);
    
    console.log(`🔄 Устанавливаем новый порядок:`);
    console.log(`   IMG_8886 -> ${newOrder8886} (слева)`);
    console.log(`   IMG_8885 -> ${newOrder8885} (справа)`);
    
    // Обновляем порядок
    await client
      .patch(photo8886._id)
      .set({ order: newOrder8886 })
      .commit();
    
    await client
      .patch(photo8885._id)
      .set({ order: newOrder8885 })
      .commit();
    
    console.log('✅ Порядок исправлен!');
    console.log(`   IMG_8886 теперь слева (порядок: ${newOrder8886})`);
    console.log(`   IMG_8885 теперь справа (порядок: ${newOrder8885})`);
    
    // Проверяем результат
    console.log('\n🔍 Проверяем результат...');
    const updatedImages = await client.fetch(`
      *[_type == "portfolioImage"] | order(order asc) {
        _id,
        alt,
        order
      }
    `);
    
    const updated8886 = updatedImages.find(img => img.alt && img.alt.includes('IMG_8886'));
    const updated8885 = updatedImages.find(img => img.alt && img.alt.includes('IMG_8885'));
    
    console.log(`📷 Финальный порядок:`);
    console.log(`   IMG_8886: ${updated8886.order}`);
    console.log(`   IMG_8885: ${updated8885.order}`);
    
    if (updated8886.order < updated8885.order) {
      console.log('✅ IMG_8886 слева от IMG_8885 - порядок правильный!');
    } else {
      console.log('❌ Порядок все еще неправильный');
    }
    
  } catch (error) {
    console.error('❌ Ошибка при исправлении порядка:', error);
  }
}

// Проверяем наличие необходимых переменных окружения
if (!process.env.SANITY_PROJECT_ID) {
  console.error('❌ SANITY_PROJECT_ID не найден в переменных окружения');
  process.exit(1);
}

if (!process.env.SANITY_TOKEN) {
  console.log('⚠️  SANITY_TOKEN не найден. Для исправления нужен токен.');
  process.exit(1);
}

fixPhotoOrder();
