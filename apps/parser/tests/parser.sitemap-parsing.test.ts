import { parseSitemapXml } from '../src/modules/sitemap';
import { UrlWithoutAnchors } from '../src/helpers/url-handling';

describe('Sitemap parsing', () => {
  it('parses simple urlset sitemap', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://www.w3.org/</loc></url>
        <url><loc>https://www.w3.org/standards/</loc></url>
      </urlset>`;
    const urls = await parseSitemapXml(xml, 'https://www.w3.org/sitemap.xml');
    expect(urls.map(UrlWithoutAnchors)).toEqual([
      'https://www.w3.org',
      'https://www.w3.org/standards',
    ]);
  });

  it('parses sitemapindex with nested sitemaps (mocked)', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap><loc>https://www.w3.org/sitemap-section.xml</loc></sitemap>
      </sitemapindex>`;

    const mockFetchXml = async (loc: string) => `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://www.w3.org/section/</loc></url>
      </urlset>`;

    const urls = await parseSitemapXml(xml, 'https://www.w3.org/sitemap.xml', mockFetchXml);
    expect(urls.map(UrlWithoutAnchors)).toEqual([
      'https://www.w3.org/section',
    ]);
  });
});
