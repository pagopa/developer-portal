import { allowCrawler } from '@/config';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  if (allowCrawler) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
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
