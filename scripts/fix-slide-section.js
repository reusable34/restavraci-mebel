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

async function fixSlideSection() {
  try {
    console.log('🔧 Исправляем секцию "Сдвигайте"...');
    
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
    const photo8871 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_8871'));
    const photo5608 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_5608'));
    
    if (!photo8886 || !photo8885 || !photo5642 || !photo5643 || !photo8871 || !photo5608) {
      console.log('❌ Не найдены некоторые фотографии');
      return;
    }
    
    console.log('📷 Текущий порядок:');
    console.log(`   IMG_8886: ${photo8886.order}`);
    console.log(`   IMG_8885: ${photo8885.order}`);
    console.log(`   IMG_5642: ${photo5642.order}`);
    console.log(`   IMG_5643: ${photo5643.order}`);
    console.log(`   IMG_8871: ${photo8871.order}`);
    console.log(`   IMG_5608: ${photo5608.order}`);
    
    // Определяем новые порядки для секции "Сдвигайте"
    // Секция должна содержать: 8886 слева, 8885 справа, 5642 слева, 5643 справа
    const slideSectionStart = 1; // Начинаем с позиции 1
    
    console.log('\n🔄 Устанавливаем новый порядок для секции "Сдвигайте":');
    console.log(`   Позиция ${slideSectionStart}: IMG_8886 (слева)`);
    console.log(`   Позиция ${slideSectionStart + 1}: IMG_8885 (справа)`);
    console.log(`   Позиция ${slideSectionStart + 2}: IMG_5642 (слева)`);
    console.log(`   Позиция ${slideSectionStart + 3}: IMG_5643 (справа)`);
    
    // Обновляем порядок
    await client
      .patch(photo8886._id)
      .set({ order: slideSectionStart })
      .commit();
    
    await client
      .patch(photo8885._id)
      .set({ order: slideSectionStart + 1 })
      .commit();
    
    await client
      .patch(photo5642._id)
      .set({ order: slideSectionStart + 2 })
      .commit();
    
    await client
      .patch(photo5643._id)
      .set({ order: slideSectionStart + 3 })
      .commit();
    
    // Перемещаем старые фотографии из секции "Сдвигайте" в конец
    const oldSlidePhotos = [photo8871, photo5608];
    let newOrder = slideSectionStart + 4;
    
    for (const photo of oldSlidePhotos) {
      await client
        .patch(photo._id)
        .set({ order: newOrder })
        .commit();
      newOrder++;
    }
    
    console.log('\n✅ Секция "Сдвигайте" исправлена!');
    console.log('📷 Новый порядок:');
    console.log('   1. IMG_8886 (слева)');
    console.log('   2. IMG_8885 (справа)');
    console.log('   3. IMG_5642 (слева)');
    console.log('   4. IMG_5643 (справа)');
    
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
    console.error('❌ Ошибка при исправлении секции:', error);
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

fixSlideSection();
