import { allowCrawler, baseUrl } from '@/config';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  if (allowCrawler) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  } else {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }
}
