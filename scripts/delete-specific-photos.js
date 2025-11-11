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

async function deleteSpecificPhotos() {
  try {
    console.log('🗑️  Удаляем указанные фотографии...');
    
    // Фотографии для удаления
    const photosToDelete = ['IMG_8933', 'IMG_8932', 'IMG_8899', 'IMG_8893'];
    
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
    
    // Находим фотографии для удаления
    const photosToRemove = [];
    
    for (const photoName of photosToDelete) {
      const photo = portfolioImages.find(img => 
        img.alt && img.alt.includes(photoName)
      );
      
      if (photo) {
        photosToRemove.push(photo);
        console.log(`📷 Найдена для удаления: ${photoName} (ID: ${photo._id})`);
      } else {
        console.log(`⚠️  Не найдена: ${photoName}`);
      }
    }
    
    if (photosToRemove.length === 0) {
      console.log('❌ Не найдено фотографий для удаления');
      return;
    }
    
    console.log(`\n🗑️  Удаляем ${photosToRemove.length} фотографий...`);
    
    // Удаляем фотографии
    for (const photo of photosToRemove) {
      try {
        await client.delete(photo._id);
        const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
        console.log(`✅ Удалено: ${filename} (ID: ${photo._id})`);
      } catch (error) {
        const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
        console.log(`❌ Ошибка удаления ${filename}: ${error.message}`);
      }
    }
    
    console.log('\n✅ Удаление завершено!');
    
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
    
    // Показываем все оставшиеся фотографии
    console.log('\n📷 Оставшиеся фотографии:');
    updatedImages.forEach((photo, index) => {
      const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
      console.log(`   ${index + 1}. Порядок ${photo.order || 'null'}: ${filename}`);
    });
    
    // Проверяем, что удаленные фотографии действительно удалены
    console.log('\n🎯 Проверяем удаление:');
    const deletedPhotos = ['IMG_8933', 'IMG_8932', 'IMG_8899', 'IMG_8893'];
    deletedPhotos.forEach(photoName => {
      const found = updatedImages.find(img => 
        img.alt && img.alt.includes(photoName)
      );
      console.log(`   ${photoName}: ${found ? '❌ НЕ удален' : '✅ Удален'}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при удалении фотографий:', error);
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

deleteSpecificPhotos();
