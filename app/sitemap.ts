import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://steady.local';
  return [
    '',
    '/how-it-works',
    '/safety',
    '/resources',
    '/privacy',
    '/crisis-card',
  ].map((path) => ({
    url: `${base}${path || '/'}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.6,
  }));
}
