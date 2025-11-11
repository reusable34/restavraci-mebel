import { createClient } from 'next-sanity';

const projectId = process.env.SANITY_PROJECT_ID;

export const hasSanityConfig = Boolean(projectId);

export function getSanityClient() {
  if (!projectId) return null;
  return createClient({
    projectId,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
    useCdn: true
  });
}


