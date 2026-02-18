
import { RemoveAnchorsFromUrl, isRemoteUrl } from '../helpers/url-handling';
import { parseStringPromise } from 'xml2js';
import http from 'node:http';
import https from 'node:https';
import { SitemapXml } from './types';


export function getSitemapUrl(baseUrl: string): string {
  const envUrl = process.env.SITEMAP_URL?.trim();
  if (envUrl) return envUrl;
  try {
    const base = new URL(baseUrl);
    return new URL('/sitemap.xml', base).toString();
  } catch (error) {
    console.warn(`Sitemap warning: Failed to derive sitemap URL from ${baseUrl}: ${(error as Error).message}`);
    return '';
  }
}


export async function fetchSitemapXml(location: string): Promise<string> {
  if (isRemoteUrl(location)) {
    return await fetchRemoteXml(location);
  }
  const { readFile } = await import('node:fs/promises');
  return await readFile(location, 'utf-8');
}


async function fetchRemoteXml(url: string, redirectLimit = 5): Promise<string> {
  if (redirectLimit < 0) {
    console.warn('Sitemap warning: Too many redirects while fetching sitemap');
    return '';
  }
  const transport = url.startsWith('https') ? https : http;
  return await new Promise<string>((resolve, reject) => {
    const request = transport.get(url, (response) => {
      const statusCode = response.statusCode ?? 0;
      if (statusCode >= 300 && statusCode < 400 && response.headers.location) {
        const redirectedUrl = new URL(response.headers.location, url).toString();
        response.resume();
        fetchRemoteXml(redirectedUrl, redirectLimit - 1).then(resolve).catch(reject);
        return;
      }
      if (statusCode >= 400) {
        console.warn(`Sitemap warning: Failed to fetch ${url}: status ${statusCode}`);
        resolve('');
        response.resume();
        return;
      }
      response.setEncoding('utf8');
      let fullData = '';

      response.on('data', (chunk: string) => {
      fullData += chunk;
      });

response.on('end', () => resolve(fullData));
    });
    request.on('error', (error) => reject(error));
    request.setTimeout(10000, () => {
      request.destroy();
      console.warn(`Sitemap warning: Timeout while fetching ${url}`);
      resolve('');
    });
  });
}


export async function parseSitemapXml(
  xml: string,
  location: string,
  fetchXml: (loc: string) => Promise<string> = fetchSitemapXml
): Promise<string[]> {
  const parsed = (await parseStringPromise(xml)) as SitemapXml;
  return await extractUrlsFromSitemap(parsed, location, fetchXml);
}


async function extractUrlsFromSitemap(
  doc: SitemapXml,
  location: string,
  fetchXml: (loc: string) => Promise<string>
): Promise<string[]> {
  if (doc.urlset?.url) {
    return doc.urlset.url
      .map((entry) => entry.loc?.[0])
      .filter((loc): loc is string => typeof loc === 'string')
      .map((loc) => RemoveAnchorsFromUrl(loc.replace(/\/$/, '')));
  }
  if (doc.sitemapindex?.sitemap) {
    const aggregated: string[] = [];
    for (const sitemapNode of doc.sitemapindex.sitemap) {
      const loc = sitemapNode.loc?.[0];
      if (!loc) continue;
      try {
        const nestedXml = await fetchXml(loc);
        const nestedDoc = (await parseStringPromise(nestedXml)) as SitemapXml;
        const nestedUrls = await extractUrlsFromSitemap(nestedDoc, loc, fetchXml);
        aggregated.push(...nestedUrls);
            } catch (error) {
        console.warn(`Sitemap warning: Failed to fetch nested sitemap from ${loc}: ${(error as Error).message}`);
            }
    }
    return aggregated;
  }
  console.warn(`Sitemap warning: Unknown sitemap format encountered while parsing ${location}`);
  return [];
}
