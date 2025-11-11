import createImageUrlBuilder from '@sanity/image-url';
import { getSanityClient } from './sanity.client';

export const urlFor = (source: any) => {
  const client = getSanityClient();
  if (!client) return createImageUrlBuilder({ projectId: 'dummy', dataset: 'production' } as any).image(source);
  return createImageUrlBuilder(client).image(source).auto('format').fit('crop');
};


