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

async function addThirdPair() {
  try {
    console.log('🔧 Добавляем третью пару "До и после"...');
    
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
    console.log(`   IMG_8871: ${photo8871.order}`);
    console.log(`   IMG_8872: ${photo8872.order}`);
    
    // Устанавливаем их на позиции 5 и 6
    console.log('\n🔄 Устанавливаем порядок для третьей пары:');
    console.log('   5. IMG_8871 (третья пара - слева)');
    console.log('   6. IMG_8872 (третья пара - справа)');
    
    // Обновляем порядок
    await client
      .patch(photo8871._id)
      .set({ order: 5 })
      .commit();
    
    await client
      .patch(photo8872._id)
      .set({ order: 6 })
      .commit();
    
    console.log('\n✅ Третья пара добавлена!');
    console.log('📷 Новый порядок секции "До и после":');
    console.log('   1-2. Первая пара: IMG_8886, IMG_8885');
    console.log('   3-4. Вторая пара: IMG_5642, IMG_5643');
    console.log('   5-6. Третья пара: IMG_8871, IMG_8872');
    
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
    console.error('❌ Ошибка при добавлении третьей пары:', error);
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

addThirdPair();
