import { allowCrawler } from '@/config';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  if (allowCrawler) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
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
