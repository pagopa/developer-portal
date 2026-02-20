import { Browser, Page } from "puppeteer";
import { ParsedNode, ParsedMetadata } from "./types";
import {
  RemoveAnchorsFromUrl,
  isWithinScope,
  buildVisitKey,
} from "../helpers/url-handling";
import { expandInteractiveSections } from "./dom-actions";
import { persistSnapshot } from "./output";
import {
  OUTPUT_DIRECTORY,
  MAX_DEPTH,
  VALID_DOMAIN_VARIANTS,
  BASE_HOST_TOKEN,
  REQUEST_TIMEOUT_MS,
} from "../main";
import {
  extractDocumentMetadata,
  serializeMetadata,
} from "../helpers/metadata-handling";

const PAGE_NAVIGATION_OPTIONS = {
  waitUntil: "networkidle2" as const,
  timeout: REQUEST_TIMEOUT_MS,
};

export async function exploreAndParsePages(
  browser: Browser,
  node: ParsedNode,
  depth: number,
  parsedPages: Map<string, ParsedMetadata>,
  scheduledPages: Set<string>,
  baseScope: string,
): Promise<Map<string, ParsedMetadata>> {
  const visitKey = buildVisitKey(node.url);
  scheduledPages.delete(visitKey);
  if (parsedPages.has(visitKey) || (MAX_DEPTH !== null && depth > MAX_DEPTH)) {
    return parsedPages;
  }
  const normalizedUrl = RemoveAnchorsFromUrl(node.url);
  if (!isWithinScope(normalizedUrl, baseScope, VALID_DOMAIN_VARIANTS)) {
    return parsedPages;
  }
  const metadata = await generatePageParsedMetadata(
    browser,
    node.url,
    baseScope,
  );
  if (!metadata) return parsedPages;
  parsedPages.set(visitKey, metadata);
  let page;
  let anchors: string[] = [];
  try {
    page = await browser.newPage();
    await page.goto(node.url, {
      ...PAGE_NAVIGATION_OPTIONS,
    });
    await expandInteractiveSections(page);
    anchors = (await page.evaluate((allowedToken: string) => {
      const anchors = Array.from(document.querySelectorAll("a[href]"));
      const iframeSources = Array.from(
        document.querySelectorAll("iframe[src]"),
      );
      const unique = new Set<string>();
      for (const anchor of anchors) {
        const href = (anchor as HTMLAnchorElement).href;
        if (!href || !href.startsWith("http")) continue;
        try {
          const target = new URL(href, window.location.href);
          const normalizedHref = target.href.toLowerCase();
          if (allowedToken && !normalizedHref.includes(allowedToken)) continue;
          if (target.href === window.location.href) continue;
          unique.add(target.href);
        } catch (error) {
          console.warn(`Failed to parse anchor href: ${href}`, error);
        }
      }
      for (const frame of iframeSources) {
        const src = (frame as HTMLIFrameElement).src;
        if (!src || !src.startsWith("http")) {
          continue;
        }
        try {
          const target = new URL(src, window.location.href);
          const normalizedSrc = target.href.toLowerCase();
          if (allowedToken && !normalizedSrc.includes(allowedToken)) continue;
          unique.add(target.href);
        } catch (error) {
          console.warn(`Failed to parse iframe src: ${src}`, error);
        }
      }
      return Array.from(unique);
    }, BASE_HOST_TOKEN)) as string[];
  } catch (error) {
    console.warn(`Failed to extract anchors from ${node.url}`, error);
  } finally {
    if (page) await page.close();
  }
  const nextChildren: ParsedNode[] = [];
  let newLinksCount = 0;
  for (const href of anchors) {
    const normalized = RemoveAnchorsFromUrl(href);
    const visitCandidate = buildVisitKey(normalized);
    if (parsedPages.has(visitCandidate) || scheduledPages.has(visitCandidate))
      continue;
    const lowerNormalized = normalized.toLowerCase();
    if (BASE_HOST_TOKEN && !lowerNormalized.includes(BASE_HOST_TOKEN)) {
      continue;
    }
    if (!isWithinScope(normalized, baseScope, VALID_DOMAIN_VARIANTS)) {
      continue;
    }
    scheduledPages.add(visitCandidate);
    newLinksCount += 1;
    nextChildren.push({ url: normalized });
  }
  node.children = nextChildren;
  const totalKnown = parsedPages.size + scheduledPages.size;
  console.log(
    `Completed parsing of page ${
      node.url
    }. Found ${newLinksCount} new links. Progress: ${
      parsedPages.size
    }/${totalKnown} (${((parsedPages.size / totalKnown) * 100).toFixed(2)}%)`,
  );
  if (!node.children || (MAX_DEPTH !== null && depth >= MAX_DEPTH)) {
    return parsedPages;
  }
  for (const child of node.children) {
    let newParsedPages = await exploreAndParsePages(
      browser,
      child,
      depth + 1,
      parsedPages,
      scheduledPages,
      baseScope,
    );
    parsedPages = new Map([...parsedPages, ...newParsedPages]);
  }
  return parsedPages;
}

export async function generatePageParsedMetadata(
  browser: Browser,
  url: string,
  baseScope: string,
): Promise<ParsedMetadata | null> {
  let page: Page | undefined;
  try {
    page = await browser.newPage();
    await page.goto(url, {
      ...PAGE_NAVIGATION_OPTIONS,
    });
    await expandInteractiveSections(page);
    const rawMetadata = await page.evaluate(extractDocumentMetadata);
    const snapshot = serializeMetadata(rawMetadata);
    await persistSnapshot(snapshot, baseScope, OUTPUT_DIRECTORY);
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
