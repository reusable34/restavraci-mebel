const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Создаем клиент Sanity
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // Нужен для записи
});

// Путь к папке с фотографиями
const photosDir = path.join(__dirname, '..', 'photo');

// Получаем список всех файлов изображений
function getImageFiles() {
  try {
    const files = fs.readdirSync(photosDir);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
  } catch (error) {
    console.error('❌ Ошибка при чтении папки с фотографиями:', error.message);
    return [];
  }
}

// Загружаем изображение в Sanity
async function uploadImageToSanity(imagePath, filename) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Создаем asset в Sanity
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
      title: `Портфолио - ${filename}`,
    });
    
    return asset;
  } catch (error) {
    console.error(`❌ Ошибка при загрузке ${filename}:`, error.message);
    return null;
  }
}

// Создаем запись portfolioImage
async function createPortfolioImage(asset, filename, order) {
  try {
    const portfolioImage = {
      _type: 'portfolioImage',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      },
      alt: `Портфолио - ${filename}`,
      order: order
    };
    
    const result = await client.create(portfolioImage);
    return result;
  } catch (error) {
    console.error(`❌ Ошибка при создании записи для ${filename}:`, error.message);
    return null;
  }
}

async function uploadPhotos() {
  try {
    console.log('🚀 Начинаем загрузку фотографий в Sanity...');
    
    const imageFiles = getImageFiles();
    
    if (imageFiles.length === 0) {
      console.log('❌ Фотографии не найдены в папке photo/');
      return;
    }
    
    console.log(`📸 Найдено ${imageFiles.length} изображений для загрузки`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      const imagePath = path.join(photosDir, filename);
      
      console.log(`📤 Загружаем ${i + 1}/${imageFiles.length}: ${filename}`);
      
      try {
        // Загружаем изображение
        const asset = await uploadImageToSanity(imagePath, filename);
        
        if (asset) {
          // Создаем запись portfolioImage
          const portfolioImage = await createPortfolioImage(asset, filename, i + 1);
          
          if (portfolioImage) {
            console.log(`✅ Успешно загружено: ${filename} (ID: ${portfolioImage._id})`);
            successCount++;
          } else {
            console.log(`❌ Ошибка создания записи для: ${filename}`);
            errorCount++;
          }
        } else {
          console.log(`❌ Ошибка загрузки файла: ${filename}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Общая ошибка для ${filename}:`, error.message);
        errorCount++;
      }
      
      // Небольшая пауза между загрузками
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n🎉 Загрузка завершена!');
    console.log(`✅ Успешно загружено: ${successCount}`);
    console.log(`❌ Ошибок: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Общая ошибка:', error);
  }
}

// Проверяем наличие необходимых переменных окружения
if (!process.env.SANITY_PROJECT_ID) {
  console.error('❌ SANITY_PROJECT_ID не найден в переменных окружения');
  console.log('Создайте файл .env.local с переменными SANITY_PROJECT_ID и SANITY_DATASET');
  process.exit(1);
}

if (!process.env.SANITY_TOKEN) {
  console.log('⚠️  SANITY_TOKEN не найден. Выберите способ загрузки фотографий:');
  console.log('');
  console.log('ВАРИАНТ 1: Автоматическая загрузка (требует токен)');
  console.log('   1. Перейдите в https://sanity.io/manage');
  console.log('   2. Выберите ваш проект');
  console.log('   3. Перейдите в API > Tokens');
  console.log('   4. Создайте новый токен с правами Editor');
  console.log('   5. Добавьте его в .env.local как SANITY_TOKEN=your_token_here');
  console.log('   6. Запустите скрипт снова');
  console.log('');
  console.log('ВАРИАНТ 2: Ручная загрузка через Studio');
  console.log('   1. Запустите: npm run studio');
  console.log('   2. Откройте http://localhost:3333');
  console.log('   3. Перейдите в раздел "Фото портфолио"');
  console.log('   4. Добавьте каждое изображение из папки photo/');
  console.log('');
  console.log(`📸 Найдено ${getImageFiles().length} изображений для загрузки:`);
  getImageFiles().forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  process.exit(0);
}

uploadPhotos();
