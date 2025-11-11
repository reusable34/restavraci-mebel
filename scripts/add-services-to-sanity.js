const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Создаем клиент Sanity
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // Нужен для записи
});

const services = [
  {
    _type: 'service',
    slug: {
      _type: 'slug',
      current: 'restavratsiya-stula'
    },
    title: 'Реставрация стула',
    description: 'Полная реставрация стула с восстановлением всех элементов',
    priceFrom: '5 000 ₽'
  },
  {
    _type: 'service',
    slug: {
      _type: 'slug',
      current: 'restavratsiya-kresla'
    },
    title: 'Реставрация кресла',
    description: 'Реставрация кресла с сохранением исторической ценности',
    priceFrom: '15 000 ₽'
  },
  {
    _type: 'service',
    slug: {
      _type: 'slug',
      current: 'restavratsiya-stola'
    },
    title: 'Реставрация обеденного стола, письменного стола',
    description: 'Восстановление столов с учетом их функциональности и эстетики',
    priceFrom: '12 000 ₽'
  },
  {
    _type: 'service',
    slug: {
      _type: 'slug',
      current: 'restavratsiya-zhurnalnogo-stolika'
    },
    title: 'Реставрация журнального столика',
    description: 'Реставрация журнальных столиков с сохранением стиля',
    priceFrom: '8 000 ₽'
  },
  {
    _type: 'service',
    slug: {
      _type: 'slug',
      current: 'restavratsiya-shkafa'
    },
    title: 'Реставрация шкафа, комода, буфета',
    description: 'Комплексная реставрация крупногабаритной мебели',
    priceFrom: '70 000 ₽'
  },
  {
    _type: 'service',
    slug: {
      _type: 'slug',
      current: 'restavratsiya-tumbochki'
    },
    title: 'Реставрация тумбочки',
    description: 'Восстановление тумбочек с учетом их практического назначения',
    priceFrom: '9 000 ₽'
  },
  {
    _type: 'service',
    slug: {
      _type: 'slug',
      current: 'redizayn'
    },
    title: 'Ре-дизайн',
    description: 'Создание нового образа мебели с уважением к эпохе',
    priceFrom: '2 000 ₽'
  },
  {
    _type: 'service',
    slug: {
      _type: 'slug',
      current: 'peretyazhka-mebeli'
    },
    title: 'Перетяжка мебели',
    description: 'Обновление обивки с использованием качественных материалов',
    priceFrom: '1 000 ₽'
  },
  {
    _type: 'service',
    slug: {
      _type: 'slug',
      current: 'remont-derevyannoy-mebeli'
    },
    title: 'Ремонт деревянной мебели',
    description: 'Восстановление деревянных элементов мебели',
    priceFrom: '500 ₽'
  }
];

async function addServices() {
  try {
    console.log('🚀 Начинаем добавление услуг в Sanity...');
    
    for (const service of services) {
      try {
        const result = await client.create(service);
        console.log(`✅ Добавлена услуга: ${service.title} (ID: ${result._id})`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Услуга "${service.title}" уже существует, пропускаем...`);
        } else {
          console.error(`❌ Ошибка при добавлении "${service.title}":`, error.message);
        }
      }
    }
    
    console.log('🎉 Все услуги успешно добавлены!');
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
  console.log('⚠️  SANITY_TOKEN не найден. Выберите способ добавления услуг:');
  console.log('');
  console.log('ВАРИАНТ 1: Автоматическое добавление (требует токен)');
  console.log('   1. Перейдите в https://sanity.io/manage');
  console.log('   2. Выберите ваш проект');
  console.log('   3. Перейдите в API > Tokens');
  console.log('   4. Создайте новый токен с правами Editor');
  console.log('   5. Добавьте его в .env.local как SANITY_TOKEN=your_token_here');
  console.log('   6. Запустите скрипт снова');
  console.log('');
  console.log('ВАРИАНТ 2: Ручное добавление через Studio');
  console.log('   1. Запустите: npm run studio');
  console.log('   2. Откройте http://localhost:3333');
  console.log('   3. Перейдите в раздел "Услуга"');
  console.log('   4. Добавьте услуги согласно списку ниже:');
  console.log('');
  services.forEach((service, index) => {
    console.log(`   ${index + 1}. ${service.title} - ${service.priceFrom}`);
    console.log(`      Описание: ${service.description}`);
    console.log(`      Слаг: ${service.slug.current}`);
    console.log('');
  });
  process.exit(0);
}

addServices();
