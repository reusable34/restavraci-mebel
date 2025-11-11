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

async function fixLastPair() {
  try {
    console.log('🔧 Исправляем последнюю пару "До и после"...');
    
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
    const photo8871 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_8871'));
    const photo8872 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_8872'));
    const photo8881 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_8881'));
    
    if (!photo8871 || !photo8872 || !photo8881) {
      console.log('❌ Не найдены нужные фотографии');
      return;
    }
    
    console.log('📷 Текущий порядок:');
    console.log(`   IMG_8872: ${photo8872.order} (позиция 5)`);
    console.log(`   IMG_8881: ${photo8881.order} (позиция 6 - НЕПРАВИЛЬНО)`);
    console.log(`   IMG_8871: ${photo8871.order} (позиция 8 - нужно переместить)`);
    
    // Исправляем: IMG_8872 (позиция 5), IMG_8871 (позиция 6)
    // IMG_8881 перемещаем на позицию 8
    console.log('\n🔄 Исправляем порядок:');
    console.log('   5. IMG_8872 (остается)');
    console.log('   6. IMG_8871 (перемещаем с позиции 8)');
    console.log('   8. IMG_8881 (перемещаем с позиции 6)');
    
    // Обновляем порядок
    await client
      .patch(photo8871._id)
      .set({ order: 6 })
      .commit();
    
    await client
      .patch(photo8881._id)
      .set({ order: 8 })
      .commit();
    
    console.log('\n✅ Порядок исправлен!');
    console.log('📷 Правильная последняя пара:');
    console.log('   IMG_8872 → IMG_8871 (до → после)');
    
    // Проверяем результат
    console.log('\n🔍 Проверяем результат...');
    const updatedImages = await client.fetch(`
      *[_type == "portfolioImage"] | order(order asc) {
        _id,
        alt,
        order
      }
    `);
    
    console.log('📸 Первые 8 фотографий:');
    updatedImages.slice(0, 8).forEach((photo, index) => {
      const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
      console.log(`   ${index + 1}. Порядок ${photo.order}: ${filename}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при исправлении последней пары:', error);
  }
}

// Проверяем наличие необходимых переменных окружения
if (!process.env.SANITY_PROJECT_ID) {
  console.error('❌ SANITY_PROJECT_ID не найден в переменных окружения');
  process.exit(1);
}

if (!process.env.SANITY_TOKEN) {
  console.log('⚠️  SANITY_TOKEN не найден. Для изменения порядка нужен токен.');
  process.exit(1);
}

fixLastPair();
