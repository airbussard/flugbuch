import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/flights/', '/settings/'],
    },
    sitemap: 'https://log-k.com/sitemap.xml',
  }
}