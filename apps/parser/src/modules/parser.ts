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
  BASE_SCOPE,
} from "../main";
import {
  extractDocumentMetadata,
  serializeMetadata,
} from "../helpers/metadata-handling";

const NAVIGATION_TIMEOUT_MS = 30_000;
const PAGE_NAVIGATION_OPTIONS = {
  waitUntil: "networkidle2" as const,
};

export async function exploreAndParsePages(
  browser: Browser,
  node: ParsedNode,
  depth: number,
  parsedPages: Map<string, ParsedMetadata>,
  scheduledPages: Set<string>,
): Promise<void> {
  const visitKey = buildVisitKey(node.url);
  scheduledPages.delete(visitKey);
  if (parsedPages.has(visitKey) || depth > MAX_DEPTH) {
    return;
  }
  const normalizedUrl = RemoveAnchorsFromUrl(node.url);
  if (!isWithinScope(normalizedUrl, BASE_SCOPE, VALID_DOMAIN_VARIANTS)) {
    return;
  }
  const metadata = await generatePageParsedMetadata(browser, node.url);
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
    await page.goto(node.url, {
      ...PAGE_NAVIGATION_OPTIONS,
      timeout: NAVIGATION_TIMEOUT_MS,
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
    if (!isWithinScope(normalized, BASE_SCOPE, VALID_DOMAIN_VARIANTS)) {
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
  if (!node.children || depth >= MAX_DEPTH) return;
  for (const child of node.children) {
    await exploreAndParsePages(
      browser,
      child,
      depth + 1,
      parsedPages,
      scheduledPages,
    );
  }
}

async function generatePageParsedMetadata(
  browser: Browser,
  url: string,
): Promise<ParsedMetadata | null> {
  let page: Page | undefined;
  try {
    page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    await expandInteractiveSections(page);
    const rawMetadata = await page.evaluate(extractDocumentMetadata);
    const snapshot = serializeMetadata(rawMetadata);
    await persistSnapshot(snapshot, OUTPUT_DIRECTORY);
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
