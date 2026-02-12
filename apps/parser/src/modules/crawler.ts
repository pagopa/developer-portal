import { Browser } from 'puppeteer';
import { ParseNode, ParseMetadata } from './types';
import { normalizeUrl } from '../utils/url';
import { expandInteractiveSections } from './domActions';

export async function parsePages(
  browser: Browser,
  node: ParseNode,
  depth: number,
  maxDepth: number,
  parsedPages: Map<string, ParseMetadata>,
  parsePageFn: (browser: Browser, url: string) => Promise<ParseMetadata | null>,
  baseOrigin: string,
  baseScope: string,
  baseHostToken: string
): Promise<void> {
  const visitKey = buildVisitKey(node.url);
  if (parsedPages.has(visitKey) || depth > maxDepth) {
    return;
  }

  const normalizedUrl = normalizeUrl(node.url);
  if (!isWithinScope(normalizedUrl, baseScope, baseHostToken)) {
    return;
  }

  const metadata = await parsePageFn(browser, node.url);
  if (!metadata) return;

  parsedPages.set(visitKey, metadata);
  node.title = metadata.title;
  node.bodyText = metadata.bodyText;
  node.lang = metadata.lang;
  node.keywords = metadata.keywords;
  node.datePublished = metadata.datePublished;
  node.lastModified = metadata.lastModified;

  let page;
  let anchors: string[] = [];
  try {
    page = await browser.newPage();
    await page.goto(node.url, { waitUntil: 'networkidle2', timeout: 45000 });
    await expandInteractiveSections(page);
    anchors = await page.evaluate((allowedToken: string) => {
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      const iframeSources = Array.from(document.querySelectorAll('iframe[src]'));
      const unique = new Set<string>();
      for (const anchor of anchors) {
        const href = (anchor as HTMLAnchorElement).href;
        if (!href || !href.startsWith('http')) continue;
        try {
          const target = new URL(href, window.location.href);
          const normalizedHref = target.href.toLowerCase();
          if (allowedToken && !normalizedHref.includes(allowedToken)) continue;
          if (target.href === window.location.href) continue;
          unique.add(target.href);
        } catch (_) {}
      }

      for (const frame of iframeSources) {
        const src = (frame as HTMLIFrameElement).src;
        if (!src || !src.startsWith('http')) {
          continue;
        }
        try {
          const target = new URL(src, window.location.href);
          const normalizedSrc = target.href.toLowerCase();
          if (allowedToken && !normalizedSrc.includes(allowedToken)) continue;
          unique.add(target.href);
        } catch (_) {}
      }
      return Array.from(unique);
    }, baseHostToken) as string[];
  } catch (error) {
    // Ignore anchor extraction errors
  } finally {
    if (page) await page.close();
  }


  const scheduled = new Set<string>();
  const nextChildren: ParseNode[] = [];
  for (const href of anchors) {
    const normalized = normalizeUrl(href);
    const visitCandidate = buildVisitKey(href);
    if (parsedPages.has(visitCandidate) || scheduled.has(visitCandidate)) continue;
    const lowerNormalized = normalized.toLowerCase();
    if (baseHostToken && !lowerNormalized.includes(baseHostToken)) {
      continue;
    }
    if (!isWithinScope(normalized, baseScope, baseHostToken)) {
      continue;
    }
    scheduled.add(visitCandidate);
    nextChildren.push({ url: href });
  }
  node.children = nextChildren;

  if (!node.children || depth >= maxDepth) return;
  for (const child of node.children) {
    await parsePages(
      browser,
      child,
      depth + 1,
      maxDepth,
      parsedPages,
      parsePageFn,
      baseOrigin,
      baseScope,
      baseHostToken
    );
  }
}

function isWithinScope(url: string, scope: string, hostToken: string): boolean {
  if (hostToken && url.toLowerCase().includes(hostToken)) {
    return true;
  }
  if (!scope) {
    return true;
  }
  const lowerUrl = url.toLowerCase();
  const lowerScope = scope.toLowerCase();
  if (lowerUrl === lowerScope) {
    return true;
  }
  if (!lowerUrl.startsWith(lowerScope)) {
    return false;
  }
  const nextChar = lowerUrl.charAt(lowerScope.length);
  return nextChar === '/' || nextChar === '?' || nextChar === '#';
}

export function buildVisitKey(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.hash = '';
    return normalizeUrl(url.toString());
  } catch (_error) {
    return rawUrl;
  }
}
