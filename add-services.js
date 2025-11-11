// Скрипт для добавления услуг в Sanity Studio
// Запустите в консоли браузера на странице http://localhost:3000/studio

const services = [
  {
    slug: "restavratsiya-stula",
    title: "Реставрация стула", 
    description: "Полная реставрация стула с восстановлением конструкции и обновлением обивки",
    priceFrom: "5 000 ₽"
  },
  {
    slug: "restavratsiya-kresla",
    title: "Реставрация кресла",
    description: "Реставрация кресла с заменой обивки и восстановлением каркаса", 
    priceFrom: "15 000 ₽"
  },
  {
    slug: "restavratsiya-stola",
    title: "Реставрация стола",
    description: "Реставрация обеденного или письменного стола с восстановлением столешницы",
    priceFrom: "12 000 ₽"
  },
  {
    slug: "restavratsiya-zhurnalnogo-stolika", 
    title: "Реставрация журнального столика",
    description: "Реставрация журнального столика с обновлением покрытия",
    priceFrom: "8 000 ₽"
  },
  {
    slug: "restavratsiya-shkafa",
    title: "Реставрация шкафа", 
    description: "Комплексная реставрация шкафа, комода или буфета с восстановлением фурнитуры",
    priceFrom: "70 000 ₽"
  },
  {
    slug: "restavratsiya-tumbochki",
    title: "Реставрация тумбочки",
    description: "Реставрация тумбочки с обновлением покрытия и фурнитуры", 
    priceFrom: "9 000 ₽"
  },
  {
    slug: "redizayn",
    title: "Ре-дизайн",
    description: "Современный ре-дизайн мебели с сохранением функциональности",
    priceFrom: "2 000 ₽"
  },
  {
    slug: "peretyazhka-mebeli",
    title: "Перетяжка мебели", 
    description: "Перетяжка мягкой мебели с заменой обивки и наполнителя",
    priceFrom: "1 000 ₽"
  },
  {
    slug: "remont-derevyannoy-mebeli",
    title: "Ремонт деревянной мебели",
    description: "Ремонт деревянной мебели с восстановлением повреждений",
    priceFrom: "500 ₽"
  }
];

console.log('Список услуг для добавления:');
services.forEach((service, index) => {
  console.log(`${index + 1}. ${service.title} - ${service.priceFrom}`);
  console.log(`   Описание: ${service.description}`);
  console.log(`   Слаг: ${service.slug}`);
  console.log('');
});

console.log('Инструкция:');
console.log('1. Перейдите в раздел "Услуга" в Studio');
console.log('2. Нажмите "+" для создания новой услуги');
console.log('3. Заполните поля согласно списку выше');
console.log('4. Нажмите "Publish" для каждой услуги');

