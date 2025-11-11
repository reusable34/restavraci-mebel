import { type SchemaTypeDefinition } from 'sanity';

export const schemaTypes: SchemaTypeDefinition[] = [
  {
    name: 'service',
    title: 'Услуга',
    type: 'document',
    fields: [
      { name: 'slug', title: 'Слаг', type: 'slug', options: { source: 'title', maxLength: 96 } },
      { name: 'title', title: 'Название', type: 'string', validation: (Rule: any) => Rule.required() },
      { name: 'description', title: 'Описание', type: 'text' },
      { name: 'priceFrom', title: 'Цена от', type: 'string' }
    ]
  },
  {
    name: 'portfolioImage',
    title: 'Фото портфолио',
    type: 'document',
    fields: [
      { name: 'image', title: 'Изображение', type: 'image', options: { hotspot: true } },
      { name: 'alt', title: 'Alt‑текст', type: 'string' },
      { name: 'order', title: 'Порядок', type: 'number' }
    ],
    orderings: [
      {
        name: 'orderAsc',
        title: 'По порядку',
        by: [{ field: 'order', direction: 'asc' }]
      }
    ]
  }
];




