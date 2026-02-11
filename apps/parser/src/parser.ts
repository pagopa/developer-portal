
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import { resolveEnv } from './modules/config';
import { ensureDirectory, saveMetadata } from './modules/output';
import { handleError } from './modules/errors';
import { parsePages } from './modules/crawler';
import { expandInteractiveSections } from './modules/domActions';
import { ParseNode, ParseMetadata } from './modules/types';
import { normalizeUrl, stripUrlDecorations } from './utils/url';
import { sanitizeFilename } from './utils/sanitizeFilename';
import crypto from 'crypto';

puppeteer.use(StealthPlugin());

const NAVIGATION_TIMEOUT_MS = 30_000;
const REQUEST_TIMEOUT_MS = 10_000;

const env = resolveEnv();
const parsedPages = new Map<string, ParseMetadata>();

void (async () => {
  try {
    await assertReachable(env.baseUrl);
    ensureDirectory(env.outputDirectory);

    const browser = await puppeteer.launch({ headless: true });
    const root: ParseNode = { url: env.baseUrl };

    const baseUrlObject = new URL(env.baseUrl);
    const baseOrigin = baseUrlObject.origin;
    const baseScope = normalizeUrl(env.baseUrl);
    const baseHostToken = baseUrlObject.hostname.replace(/^www\./, '').toLowerCase();
    await parsePages(
      browser,
      root,
      0,
      env.maxDepth,
      parsedPages,
      parsePageFn,
      baseOrigin,
      baseScope,
      baseHostToken,
      NAVIGATION_TIMEOUT_MS
    );
    await browser.close();
    console.log(`Parsing complete! Data saved to ${env.outputDirectory}`);
  } catch (error) {
    handleError(error);
  }
})();


async function fetch(input: any, init?: any): Promise<any> {
  const { default: nodeFetch } = await import('node-fetch');
  return nodeFetch(input, init);
}


async function parsePageFn(browser: Browser, url: string): Promise<ParseMetadata | null> {
  let page: Page | undefined;
  try {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: NAVIGATION_TIMEOUT_MS });
    await expandInteractiveSections(page);
    const rawMetadata = await page.evaluate(extractDocumentMetadata);
    const snapshot = serializeMetadata(rawMetadata);
    await persistSnapshot(snapshot);
    return snapshot;
  } catch (error) {
    console.error(`Error while parsing ${url}:`, (error as Error).message);
    return null;
  } finally {
    if (page) {
      await page.close();
    }
  }
}


async function persistSnapshot(snapshot: ParseMetadata): Promise<void> {
  const subPath = deriveSubPath(snapshot.url);
  const preferredName = subPath === '/' ? 'root' : subPath;
  const sanitizedName = sanitizeFilename(preferredName, { replacement: '_' });
  const trimmedName = sanitizedName.replace(/^_+/, '') || sanitizedName;

  const FILENAME_LENGTH_THRESHOLD = 255;

  let finalName = trimmedName;
  if (trimmedName.length > FILENAME_LENGTH_THRESHOLD) {
    const normalizedUrl = normalizeUrl(snapshot.url);
    const hash = crypto.createHash('sha1').update(normalizedUrl).digest('hex').slice(0, 10);
    const prefix = trimmedName.slice(0, 240);
    finalName = `${prefix}_${hash}`;
  }

  await saveMetadata(env.outputDirectory, `${finalName}.json`, snapshot);
}


function deriveSubPath(targetUrl: string): string {
  const base = new URL(env.baseUrl);
  const target = new URL(targetUrl);
  let relPath = target.pathname;
  if (base.pathname !== '/' && relPath.startsWith(base.pathname)) {
    relPath = relPath.slice(base.pathname.length);
    if (!relPath.startsWith('/')) relPath = '/' + relPath;
  }
  if (stripUrlDecorations(targetUrl) === env.sanitizedBaseUrl || relPath === '/' || relPath === '') {
    return '/';
  }
  return `${relPath}${target.search}${target.hash}` || '/';
}


function serializeMetadata(raw: RawDocumentMetadata): ParseMetadata {
  return {
    url: raw.url,
    title: raw.title,
    bodyText: raw.bodyText,
    lang: raw.lang,
    keywords: raw.keywords,
    datePublished: toIsoOrNull(raw.datePublished),
    lastModified: toIsoOrNull(raw.lastModified),
  };
}


type RawDocumentMetadata = {
  readonly title: string;
  readonly url: string;
  readonly bodyText: string;
  readonly lang: string | null;
  readonly keywords: string | null;
  readonly datePublished: string | null;
  readonly lastModified: string | null;
};

const extractDocumentMetadata = (): RawDocumentMetadata => {
  const getMeta = (name: string): string | null => {
    return (
      document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ||
      document.querySelector(`meta[property="${name}"]`)?.getAttribute('content') ||
      null
    );
  };

  const metaTitle = getMeta('og:title') || getMeta('twitter:title');
  const documentTitle = document.title?.trim();
  const normalizedTitle = documentTitle?.length ? documentTitle : metaTitle || '';

  const normalizeText = (value: string | null | undefined): string => {
    return value ? value.replace(/\s+/g, ' ').trim() : '';
  };

  const mainText = normalizeText(document.querySelector('main')?.innerText);
  const iframeTexts = Array.from(document.querySelectorAll('iframe'))
    .map((frame) => {
      try {
        return normalizeText(frame.contentDocument?.body?.innerText ?? '');
      } catch (_error) {
        return '';
      }
    })
    .filter((text) => text.length > 0);

  const prioritizedTextParts = [mainText, ...iframeTexts].filter((text) => text.length > 0);
  const prioritizedText = prioritizedTextParts.join('\n\n').trim();
  const fallbackBody = normalizeText(document.body?.innerText ?? '');
  const bodyText = prioritizedText.length >= 120 ? prioritizedText : fallbackBody;

  return {
    title: normalizedTitle,
    url: window.location.href,
    bodyText,
    lang: document.documentElement.lang || getMeta('og:locale') || null,
    keywords: getMeta('keywords') || getMeta('news_keywords'),
    datePublished:
      getMeta('article:published_time') || getMeta('date') || getMeta('publish-date'),
    lastModified:
      document.lastModified !== '01/01/1970 00:00:00'
        ? document.lastModified
        : getMeta('article:modified_time'),
  };
};

function toIsoOrNull(value: string | null): string | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function assertReachable(url: string): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });

    const text = await res.text();

    // Detect Cloudflare challenge
    if (
      /cloudflare|just a moment|verify you are human/i.test(text)
    ) {
      console.warn('Cloudflare protection detected, skipping reachability check.');
      return;
    }

    if (!res.ok && res.status !== 405) {
      throw new Error(`Status ${res.status}`);
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Target ${url} is unreachable: request timed out`);
    }
    throw new Error(`Target ${url} is unreachable: ${(error as Error).message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}
