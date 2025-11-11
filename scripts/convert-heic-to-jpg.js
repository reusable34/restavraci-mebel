const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
require('dotenv').config({ path: '.env.local' });

const execAsync = promisify(exec);

// Создаем клиент Sanity
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

// Путь к папке с фотографиями
const photosDir = path.join(__dirname, '..', 'photo');
const tempDir = path.join(__dirname, '..', 'temp');

// Создаем временную папку если её нет
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

async function convertHeicToJpg() {
  try {
    console.log('🔄 Конвертируем HEIC фотографии в JPG...');
    
    // Получаем список HEIC файлов
    const heicFiles = fs.readdirSync(photosDir).filter(file => 
      file.toLowerCase().endsWith('.heic')
    );
    
    console.log(`📸 Найдено ${heicFiles.length} HEIC файлов`);
    
    if (heicFiles.length === 0) {
      console.log('❌ HEIC файлы не найдены');
      return;
    }
    
    // Берем первые 4 HEIC файла
    const filesToConvert = heicFiles.slice(0, 4);
    console.log(`🔄 Конвертируем ${filesToConvert.length} файлов:`);
    filesToConvert.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    
    const convertedFiles = [];
    
    // Конвертируем каждый файл
    for (let i = 0; i < filesToConvert.length; i++) {
      const heicFile = filesToConvert[i];
      const jpgFile = heicFile.replace('.HEIC', '.JPG').replace('.heic', '.jpg');
      const heicPath = path.join(photosDir, heicFile);
      const jpgPath = path.join(tempDir, jpgFile);
      
      console.log(`\n📷 Конвертируем ${i + 1}/${filesToConvert.length}: ${heicFile}`);
      
      try {
        // Используем ImageMagick для конвертации
        await execAsync(`magick "${heicPath}" "${jpgPath}"`);
        console.log(`✅ Конвертировано: ${jpgFile}`);
        convertedFiles.push({ original: heicFile, converted: jpgFile, path: jpgPath });
      } catch (error) {
        console.log(`❌ Ошибка конвертации ${heicFile}: ${error.message}`);
        
        // Попробуем альтернативный способ через sips (macOS)
        try {
          await execAsync(`sips -s format jpeg "${heicPath}" --out "${jpgPath}"`);
          console.log(`✅ Конвертировано через sips: ${jpgFile}`);
          convertedFiles.push({ original: heicFile, converted: jpgFile, path: jpgPath });
        } catch (sipsError) {
          console.log(`❌ Ошибка конвертации через sips: ${sipsError.message}`);
        }
      }
    }
    
    if (convertedFiles.length === 0) {
      console.log('❌ Не удалось конвертировать ни одного файла');
      return;
    }
    
    console.log(`\n📸 Успешно конвертировано ${convertedFiles.length} файлов`);
    
    // Загружаем конвертированные файлы в Sanity
    console.log('\n📤 Загружаем в Sanity...');
    
    const currentImages = await client.fetch(`
      *[_type == "portfolioImage"] | order(order desc) {
        order
      }
    `);
    
    const maxOrder = currentImages.length > 0 ? Math.max(...currentImages.map(img => img.order || 0)) : 0;
    let nextOrder = maxOrder + 1;
    
    for (let i = 0; i < convertedFiles.length; i++) {
      const file = convertedFiles[i];
      console.log(`📤 Загружаем ${i + 1}/${convertedFiles.length}: ${file.converted}`);
      
      try {
        // Читаем файл
        const imageBuffer = fs.readFileSync(file.path);
        
        // Загружаем в Sanity
        const asset = await client.assets.upload('image', imageBuffer, {
          filename: file.converted,
          title: `Портфолио - ${file.converted}`,
        });
        
        // Создаем запись portfolioImage
        const portfolioImage = {
          _type: 'portfolioImage',
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id
            }
          },
          alt: `Портфолио - ${file.converted}`,
          order: nextOrder
        };
        
        const result = await client.create(portfolioImage);
        console.log(`✅ Загружено: ${file.converted} (ID: ${result._id}, порядок: ${nextOrder})`);
        nextOrder++;
        
      } catch (error) {
        console.log(`❌ Ошибка загрузки ${file.converted}: ${error.message}`);
      }
    }
    
    // Очищаем временные файлы
    console.log('\n🧹 Очищаем временные файлы...');
    convertedFiles.forEach(file => {
      try {
        fs.unlinkSync(file.path);
        console.log(`🗑️  Удален: ${file.converted}`);
      } catch (error) {
        console.log(`⚠️  Не удалось удалить ${file.converted}: ${error.message}`);
      }
    });
    
    console.log('\n✅ Конвертация и загрузка завершены!');
    
  } catch (error) {
    console.error('❌ Общая ошибка:', error);
  }
}

// Проверяем наличие необходимых переменных окружения
if (!process.env.SANITY_PROJECT_ID) {
  console.error('❌ SANITY_PROJECT_ID не найден в переменных окружения');
  process.exit(1);
}

if (!process.env.SANITY_TOKEN) {
  console.log('⚠️  SANITY_TOKEN не найден. Для загрузки нужен токен.');
  process.exit(1);
}

convertHeicToJpg();
