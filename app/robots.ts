import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/how-it-works', '/safety', '/resources', '/privacy', '/crisis-card'],
      disallow: ['/app', '/chat', '/api/', '/check-ins', '/breathe', '/skills'],
    },
  };
}
