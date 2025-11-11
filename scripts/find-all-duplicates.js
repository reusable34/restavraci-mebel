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

async function findAllDuplicates() {
  try {
    console.log('🔍 Ищем ВСЕ дублирующие фотографии...');
    
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
    
    // Группируем по имени файла
    const photoGroups = {};
    
    portfolioImages.forEach(photo => {
      if (photo.alt) {
        const filename = photo.alt.replace('Портфолио - ', '');
        if (!photoGroups[filename]) {
          photoGroups[filename] = [];
        }
        photoGroups[filename].push(photo);
      }
    });
    
    console.log('\n📷 Анализ дублирующих записей:');
    
    let totalDuplicates = 0;
    const duplicatesToDelete = [];
    
    for (const [filename, photos] of Object.entries(photoGroups)) {
      if (photos.length > 1) {
        console.log(`\n❌ ${filename}: найдено ${photos.length} записей`);
        
        // Сортируем по порядку
        const sortedPhotos = photos.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        // Оставляем первую запись (с наименьшим порядком)
        const keepPhoto = sortedPhotos[0];
        const deletePhotos = sortedPhotos.slice(1);
        
        console.log(`   ✅ Оставляем: ID ${keepPhoto._id} (порядок ${keepPhoto.order || 'null'})`);
        
        deletePhotos.forEach(photo => {
          console.log(`   🗑️  Удаляем: ID ${photo._id} (порядок ${photo.order || 'null'})`);
          duplicatesToDelete.push(photo._id);
        });
        
        totalDuplicates += deletePhotos.length;
      } else {
        console.log(`✅ ${filename}: 1 запись (уникальная)`);
      }
    }
    
    console.log(`\n📊 Итого дублирующих записей для удаления: ${totalDuplicates}`);
    
    if (totalDuplicates > 0) {
      console.log('\n🗑️  Удаляем дублирующие записи...');
      
      for (const photoId of duplicatesToDelete) {
        try {
          await client.delete(photoId);
          console.log(`   ✅ Удалено: ${photoId}`);
        } catch (error) {
          console.log(`   ❌ Ошибка удаления ${photoId}: ${error.message}`);
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
      
      // Показываем первые 10 записей
      console.log('\n📷 Первые 10 записей:');
      updatedImages.slice(0, 10).forEach((photo, index) => {
        const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
        console.log(`   ${index + 1}. Порядок ${photo.order || 'null'}: ${filename}`);
      });
      
    } else {
      console.log('\n✅ Дублирующих записей не найдено!');
    }
    
  } catch (error) {
    console.error('❌ Ошибка при поиске дублирующих фотографий:', error);
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

findAllDuplicates();
