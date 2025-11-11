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

async function removeDuplicatePhotos() {
  try {
    console.log('🔍 Ищем дублирующие фотографии...');
    
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
    
    // Фотографии, которые должны быть только в секции "Сдвигайте"
    const slideSectionPhotos = ['IMG_8886', 'IMG_8885', 'IMG_5642', 'IMG_5643'];
    
    // Находим все записи для каждой фотографии
    const photoGroups = {};
    
    slideSectionPhotos.forEach(photoName => {
      const photos = portfolioImages.filter(img => 
        img.alt && img.alt.includes(photoName)
      );
      photoGroups[photoName] = photos;
      console.log(`📷 ${photoName}: найдено ${photos.length} записей`);
    });
    
    console.log('\n🗑️  Удаляем дублирующие записи...');
    
    for (const [photoName, photos] of Object.entries(photoGroups)) {
      if (photos.length > 1) {
        // Оставляем только первую запись (с наименьшим порядком)
        const keepPhoto = photos.sort((a, b) => a.order - b.order)[0];
        const deletePhotos = photos.slice(1);
        
        console.log(`\n📷 ${photoName}:`);
        console.log(`   ✅ Оставляем: ID ${keepPhoto._id} (порядок ${keepPhoto.order})`);
        
        for (const photo of deletePhotos) {
          try {
            await client.delete(photo._id);
            console.log(`   🗑️  Удаляем: ID ${photo._id} (порядок ${photo.order})`);
          } catch (error) {
            console.log(`   ❌ Ошибка удаления ID ${photo._id}: ${error.message}`);
          }
        }
      } else if (photos.length === 1) {
        console.log(`\n📷 ${photoName}: только одна запись - оставляем`);
      } else {
        console.log(`\n📷 ${photoName}: не найдено записей`);
      }
    }
    
    console.log('\n✅ Очистка завершена!');
    
    // Проверяем результат
    console.log('\n🔍 Проверяем результат...');
    const updatedImages = await client.fetch(`
      *[_type == "portfolioImage"] | order(order asc) {
        _id,
        alt,
        order
      }
    `);
    
    console.log(`📸 Осталось ${updatedImages.length} записей портфолио`);
    
    // Показываем первые 10 записей
    console.log('\n📷 Первые 10 записей:');
    updatedImages.slice(0, 10).forEach((photo, index) => {
      const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
      console.log(`   ${index + 1}. Порядок ${photo.order}: ${filename}`);
    });
    
    // Проверяем, что каждая фотография из секции "Сдвигайте" встречается только один раз
    console.log('\n🎯 Проверяем уникальность фотографий секции "Сдвигайте":');
    slideSectionPhotos.forEach(photoName => {
      const count = updatedImages.filter(img => 
        img.alt && img.alt.includes(photoName)
      ).length;
      console.log(`   ${photoName}: ${count} записей ${count === 1 ? '✅' : '❌'}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при удалении дублирующих фотографий:', error);
  }
}

// Проверяем наличие необходимых переменных окружения
if (!process.env.SANITY_PROJECT_ID) {
  console.error('❌ SANITY_PROJECT_ID не найден в переменных окружения');
  process.exit(1);
}

if (!process.env.SANITY_TOKEN) {
  console.log('⚠️  SANITY_TOKEN не найден. Для удаления нужен токен.');
  process.exit(1);
}

removeDuplicatePhotos();
