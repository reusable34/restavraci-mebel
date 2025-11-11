// Скрипт для получения Project ID из Sanity Studio
const { createClient } = require('@sanity/client');

// Попробуем получить Project ID из переменных окружения
const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (projectId) {
  console.log('✅ Project ID найден:', projectId);
} else {
  console.log('❌ Project ID не найден в переменных окружения');
  console.log('');
  console.log('Для получения Project ID:');
  console.log('1. Откройте Sanity Studio: http://localhost:3333');
  console.log('2. В консоли браузера выполните:');
  console.log('   console.log(window.__sanityConfig?.projectId)');
  console.log('3. Скопируйте полученный ID');
  console.log('4. Добавьте его в .env.local как SANITY_PROJECT_ID=your_project_id');
}

