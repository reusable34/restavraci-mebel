export type Service = {
  slug: string;
  title: string;
  description: string;
  priceFrom: string;
};

export const services: Service[] = [
  {
    slug: 'restavratsiya-stula',
    title: 'Реставрация стула',
    description: 'Полная реставрация стула с восстановлением всех элементов',
    priceFrom: '5 000 ₽'
  },
  {
    slug: 'restavratsiya-kresla',
    title: 'Реставрация кресла',
    description: 'Реставрация кресла с сохранением исторической ценности',
    priceFrom: '15 000 ₽'
  },
  {
    slug: 'restavratsiya-stola',
    title: 'Реставрация обеденного стола, письменного стола',
    description: 'Восстановление столов с учетом их функциональности и эстетики',
    priceFrom: '12 000 ₽'
  },
  {
    slug: 'restavratsiya-zhurnalnogo-stolika',
    title: 'Реставрация журнального столика',
    description: 'Реставрация журнальных столиков с сохранением стиля',
    priceFrom: '8 000 ₽'
  },
  {
    slug: 'restavratsiya-shkafa',
    title: 'Реставрация шкафа, комода, буфета',
    description: 'Комплексная реставрация крупногабаритной мебели',
    priceFrom: '70 000 ₽'
  },
  {
    slug: 'restavratsiya-tumbochki',
    title: 'Реставрация тумбочки',
    description: 'Восстановление тумбочек с учетом их практического назначения',
    priceFrom: '9 000 ₽'
  },
  {
    slug: 'redizayn',
    title: 'Ре-дизайн',
    description: 'Создание нового образа мебели с уважением к эпохе',
    priceFrom: '2 000 ₽'
  },
  {
    slug: 'peretyazhka-mebeli',
    title: 'Перетяжка мебели',
    description: 'Обновление обивки с использованием качественных материалов',
    priceFrom: '1 000 ₽'
  },
  {
    slug: 'remont-derevyannoy-mebeli',
    title: 'Ремонт деревянной мебели',
    description: 'Восстановление деревянных элементов мебели',
    priceFrom: '500 ₽'
  }
];




