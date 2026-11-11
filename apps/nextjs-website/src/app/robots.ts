import { buildEnv } from '@/lib/buildEnv';
import { browserEnv } from '@/browserConfig';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  if (buildEnv.config.allowCrawler) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${browserEnv.config.baseUrl}/sitemap.xml`,
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
