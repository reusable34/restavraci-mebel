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

async function delete8881() {
  try {
    console.log('🗑️  Удаляем фотографию IMG_8881...');
    
    // Получаем все записи portfolioImage
    const portfolioImages = await client.fetch(`
      *[_type == "portfolioImage"] | order(order asc) {
        _id,
        image,
        alt,
        order
      }
    `);
    
    // Находим фотографию IMG_8881
    const photo8881 = portfolioImages.find(img => img.alt && img.alt.includes('IMG_8881'));
    
    if (!photo8881) {
      console.log('❌ Фотография IMG_8881 не найдена');
      return;
    }
    
    console.log(`📷 Найдена фотография IMG_8881 (ID: ${photo8881._id}, порядок: ${photo8881.order})`);
    
    // Удаляем фотографию
    try {
      await client.delete(photo8881._id);
      console.log('✅ Фотография IMG_8881 успешно удалена!');
    } catch (error) {
      console.log(`❌ Ошибка удаления IMG_8881: ${error.message}`);
      return;
    }
    
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
    
    // Проверяем, что IMG_8881 действительно удалена
    const check8881 = updatedImages.find(img => 
      img.alt && img.alt.includes('IMG_8881')
    );
    
    if (check8881) {
      console.log('❌ IMG_8881 все еще существует в базе данных');
    } else {
      console.log('✅ IMG_8881 успешно удалена из базы данных');
    }
    
    // Показываем оставшиеся фотографии
    console.log('\n📷 Оставшиеся фотографии:');
    updatedImages.forEach((photo, index) => {
      const filename = photo.alt ? photo.alt.replace('Портфолио - ', '') : 'Без названия';
      console.log(`   ${index + 1}. Порядок ${photo.order || 'null'}: ${filename}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при удалении IMG_8881:', error);
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

delete8881();
