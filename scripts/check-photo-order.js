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

async function checkPhotoOrder() {
  try {
    console.log('🔍 Проверяем текущий порядок фотографий...');
    
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
    
    // Находим нужные фотографии
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
    
    console.log(`\n📷 Текущий порядок:`);
    console.log(`   IMG_8886: порядок ${photo8886.order} (ID: ${photo8886._id})`);
    console.log(`   IMG_8885: порядок ${photo8885.order} (ID: ${photo8885._id})`);
    
    if (photo8886.order < photo8885.order) {
      console.log('✅ IMG_8886 уже слева от IMG_8885');
    } else {
      console.log('❌ IMG_8886 справа от IMG_8885 - нужно поменять местами');
    }
    
    // Показываем соседние фотографии для контекста
    const allPhotos = portfolioImages.sort((a, b) => a.order - b.order);
    const index8886 = allPhotos.findIndex(img => img._id === photo8886._id);
    const index8885 = allPhotos.findIndex(img => img._id === photo8885._id);
    
    console.log(`\n📋 Контекст (соседние фотографии):`);
    for (let i = Math.max(0, Math.min(index8886, index8885) - 2); 
         i <= Math.min(allPhotos.length - 1, Math.max(index8886, index8885) + 2); 
         i++) {
      const photo = allPhotos[i];
      const marker = photo._id === photo8886._id ? '👈 IMG_8886' : 
                    photo._id === photo8885._id ? '👉 IMG_8885' : '  ';
      console.log(`   ${marker} Порядок ${photo.order}: ${photo.alt}`);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при проверке порядка:', error);
  }
}

// Проверяем наличие необходимых переменных окружения
if (!process.env.SANITY_PROJECT_ID) {
  console.error('❌ SANITY_PROJECT_ID не найден в переменных окружения');
  process.exit(1);
}

if (!process.env.SANITY_TOKEN) {
  console.log('⚠️  SANITY_TOKEN не найден. Для проверки нужен токен.');
  process.exit(1);
}

checkPhotoOrder();
