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

async function fixCorrectOrder() {
  try {
    console.log('🔧 Исправляем правильный порядок в секции "До и после"...');
    
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
    const photo5642 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_5642'));
    const photo5643 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_5643'));
    
    if (!photo8886 || !photo8885 || !photo5642 || !photo5643) {
      console.log('❌ Не найдены некоторые фотографии');
      return;
    }
    
    console.log('📷 Текущий порядок:');
    console.log(`   IMG_8886: ${photo8886.order}`);
    console.log(`   IMG_8885: ${photo8885.order}`);
    console.log(`   IMG_5642: ${photo5642.order}`);
    console.log(`   IMG_5643: ${photo5643.order}`);
    
    // ПРАВИЛЬНЫЙ порядок как вы говорили:
    // Первая пара: IMG_8886 слева, IMG_8885 справа
    // Вторая пара: IMG_5642 слева, IMG_5643 справа
    console.log('\n🔄 Устанавливаем ПРАВИЛЬНЫЙ порядок:');
    console.log('   1. IMG_8886 (первая пара - слева)');
    console.log('   2. IMG_8885 (первая пара - справа)');
    console.log('   3. IMG_5642 (вторая пара - слева)');
    console.log('   4. IMG_5643 (вторая пара - справа)');
    
    // Обновляем порядок
    await client
      .patch(photo8886._id)
      .set({ order: 1 })
      .commit();
    
    await client
      .patch(photo8885._id)
      .set({ order: 2 })
      .commit();
    
    await client
      .patch(photo5642._id)
      .set({ order: 3 })
      .commit();
    
    await client
      .patch(photo5643._id)
      .set({ order: 4 })
      .commit();
    
    console.log('\n✅ Порядок исправлен!');
    console.log('📷 ПРАВИЛЬНЫЙ порядок секции "До и после":');
    console.log('   1. IMG_8886 (первая пара - слева)');
    console.log('   2. IMG_8885 (первая пара - справа)');
    console.log('   3. IMG_5642 (вторая пара - слева)');
    console.log('   4. IMG_5643 (вторая пара - справа)');
    
    // Проверяем результат
    console.log('\n🔍 Проверяем результат...');
    const updatedImages = await client.fetch(`
      *[_type == "portfolioImage"] | order(order asc) {
        _id,
        alt,
        order
      }
    `);
    
    console.log('📸 Первые 6 фотографий:');
    updatedImages.slice(0, 6).forEach((photo, index) => {
      const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
      console.log(`   ${index + 1}. Порядок ${photo.order}: ${filename}`);
    });
    
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
  console.log('⚠️  SANITY_TOKEN не найден. Для изменения порядка нужен токен.');
  process.exit(1);
}

fixCorrectOrder();
