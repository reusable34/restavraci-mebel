import groq from 'groq';

export const servicesQuery = groq`*[_type == "service"]|order(title asc){
  _id,
  "slug": slug.current,
  title,
  description,
  priceFrom
}`;

export const portfolioQuery = groq`*[_type == "portfolioImage"]|order(order asc){
  _id,
  image,
  alt,
  order
}`;







