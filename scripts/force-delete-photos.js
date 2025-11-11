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

async function forceDeletePhotos() {
  try {
    console.log('🗑️  Принудительно удаляем фотографии...');
    
    // Фотографии для удаления
    const photosToDelete = ['IMG_8933', 'IMG_8932', 'IMG_8899', 'IMG_8893'];
    
    // Получаем все записи portfolioImage
    const portfolioImages = await client.fetch(`
      *[_type == "portfolioImage"] {
        _id,
        image,
        alt,
        order
      }
    `);
    
    console.log(`📸 Найдено ${portfolioImages.length} записей портфолио`);
    
    // Показываем все фотографии
    console.log('\n📷 Все фотографии:');
    portfolioImages.forEach((photo, index) => {
      const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
      const isTarget = photosToDelete.some(target => filename.includes(target));
      const marker = isTarget ? '🎯' : '  ';
      console.log(`${marker} ${index + 1}. ${filename} (ID: ${photo._id})`);
    });
    
    // Находим фотографии для удаления
    const photosToRemove = [];
    
    for (const photoName of photosToDelete) {
      const photo = portfolioImages.find(img => 
        img.alt && img.alt.includes(photoName)
      );
      
      if (photo) {
        photosToRemove.push(photo);
        console.log(`\n📷 Найдена для удаления: ${photoName} (ID: ${photo._id})`);
      } else {
        console.log(`\n⚠️  Не найдена: ${photoName}`);
      }
    }
    
    if (photosToRemove.length === 0) {
      console.log('\n❌ Не найдено фотографий для удаления');
      return;
    }
    
    console.log(`\n🗑️  Удаляем ${photosToRemove.length} фотографий...`);
    
    // Удаляем фотографии с подтверждением
    for (const photo of photosToRemove) {
      try {
        const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
        console.log(`\n🗑️  Удаляем: ${filename}...`);
        
        const result = await client.delete(photo._id);
        console.log(`✅ Успешно удалено: ${filename} (ID: ${photo._id})`);
        
        // Проверяем, что действительно удалено
        await new Promise(resolve => setTimeout(resolve, 1000)); // Пауза 1 секунда
        
        const checkPhoto = await client.fetch(`*[_id == "${photo._id}"]`);
        if (checkPhoto.length === 0) {
          console.log(`✅ Подтверждено: ${filename} удален из базы данных`);
        } else {
          console.log(`❌ ОШИБКА: ${filename} все еще существует в базе данных`);
        }
        
      } catch (error) {
        const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
        console.log(`❌ Ошибка удаления ${filename}: ${error.message}`);
      }
    }
    
    console.log('\n✅ Удаление завершено!');
    
    // Финальная проверка
    console.log('\n🔍 Финальная проверка...');
    const finalImages = await client.fetch(`
      *[_type == "portfolioImage"] {
        _id,
        alt,
        order
      }
    `);
    
    console.log(`📸 Осталось ${finalImages.length} записей портфолио`);
    
    // Проверяем, что удаленные фотографии действительно удалены
    console.log('\n🎯 Проверяем удаление:');
    const deletedPhotos = ['IMG_8933', 'IMG_8932', 'IMG_8899', 'IMG_8893'];
    deletedPhotos.forEach(photoName => {
      const found = finalImages.find(img => 
        img.alt && img.alt.includes(photoName)
      );
      console.log(`   ${photoName}: ${found ? '❌ НЕ удален' : '✅ Удален'}`);
    });
    
    // Показываем оставшиеся фотографии
    console.log('\n📷 Оставшиеся фотографии:');
    finalImages.forEach((photo, index) => {
      const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
      console.log(`   ${index + 1}. ${filename}`);
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

forceDeletePhotos();
