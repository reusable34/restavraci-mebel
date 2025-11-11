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

async function swapThirdPair() {
  try {
    console.log('🔄 Меняем местами IMG_8871 и IMG_8872...');
    
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
    
    if (!photo8871 || !photo8872) {
      console.log('❌ Не найдены фотографии IMG_8871 или IMG_8872');
      return;
    }
    
    console.log('📷 Текущий порядок:');
    console.log(`   IMG_8871: ${photo8871.order} (сейчас "до")`);
    console.log(`   IMG_8872: ${photo8872.order} (сейчас "после")`);
    
    // Меняем местами: IMG_8872 должно быть "до" (слева), IMG_8871 "после" (справа)
    console.log('\n🔄 Меняем местами:');
    console.log('   5. IMG_8872 (третья пара - "до", слева)');
    console.log('   6. IMG_8871 (третья пара - "после", справа)');
    
    // Обновляем порядок
    await client
      .patch(photo8872._id)
      .set({ order: 5 })
      .commit();
    
    await client
      .patch(photo8871._id)
      .set({ order: 6 })
      .commit();
    
    console.log('\n✅ Порядок изменен!');
    console.log('📷 Новый порядок третьей пары:');
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
    console.error('❌ Ошибка при изменении порядка:', error);
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

swapThirdPair();
