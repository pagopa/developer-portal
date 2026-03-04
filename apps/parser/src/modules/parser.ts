import { Browser, Page } from "puppeteer";
import { ParsedNode, ParsedMetadata, ParserConfig } from "./types";
import {
  RemoveAnchorsFromUrl,
  isWithinScope,
  buildVisitKey,
} from "../helpers/url-handling";
import { expandInteractiveSections } from "./dom-actions";
import { persistSnapshot } from "./output";
import {
  extractDocumentMetadata,
  serializeMetadata,
} from "../helpers/metadata-handling";

export async function exploreAndParsePages(
  browser: Browser,
  node: ParsedNode,
  depth: number,
  parsedPages: Map<string, ParsedMetadata>,
  scheduledPages: Set<string>,
  baseScope: string,
  parserConfig: ParserConfig,
): Promise<Map<string, ParsedMetadata>> {
  const visitKey = buildVisitKey(node.url);
  scheduledPages.delete(visitKey);
  if (parsedPages.has(visitKey) || (parserConfig.MAX_DEPTH !== null && depth > parserConfig.MAX_DEPTH)) {
    return parsedPages;
  }
  const normalizedUrl = RemoveAnchorsFromUrl(node.url);
  if (!isWithinScope(normalizedUrl, baseScope, parserConfig.VALID_DOMAIN_VARIANTS)) {
    return parsedPages;
  }
  const { metadata, anchors } = await generatePageParsedMetadata(
    browser,
    node.url,
    baseScope,
    parserConfig,
  );
  if (!metadata) return parsedPages;
  parsedPages.set(visitKey, metadata);
  const nextChildren: ParsedNode[] = [];
  let newLinksCount = 0;
  for (const href of anchors) {
    const normalized = RemoveAnchorsFromUrl(href);
    const visitCandidate = buildVisitKey(normalized);
    if (parsedPages.has(visitCandidate) || scheduledPages.has(visitCandidate))
      continue;
    const lowerNormalized = normalized.toLowerCase();
    if (parserConfig.BASE_HOST_TOKEN && !lowerNormalized.includes(parserConfig.BASE_HOST_TOKEN)) {
      continue;
    }
    if (!isWithinScope(normalized, baseScope, parserConfig.VALID_DOMAIN_VARIANTS)) {
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
  if (!node.children || (parserConfig.MAX_DEPTH !== null && depth >= parserConfig.MAX_DEPTH)) {
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
      parserConfig,
    );
    parsedPages = new Map([...parsedPages, ...newParsedPages]);
  }
  return parsedPages;
}

export async function generatePageParsedMetadata(
  browser: Browser,
  url: string,
  baseScope: string,
  parserConfig: { [key: string]: any },
): Promise<{ metadata: ParsedMetadata | null; anchors: string[] }> {
  const page = await browser.newPage();
  try {
    const redirect_url = await page.goto(url, {
      waitUntil: "networkidle2" as const,
      timeout: parserConfig.REQUEST_TIMEOUT_MS,
    });
    const normalizeUrl = (u: string) => u.replace(/\/+$/, "");
    if (redirect_url && normalizeUrl(redirect_url.url()) !== normalizeUrl(url)) {
      console.warn(
        `URL redirect after navigation: from ${url} to ${redirect_url?.url()}`,
      );
    }
    await expandInteractiveSections(page);
    const rawMetadata = await page.evaluate(extractDocumentMetadata);
    const snapshot = serializeMetadata(rawMetadata);
    await persistSnapshot(snapshot, baseScope, parserConfig.OUTPUT_DIRECTORY);
    let anchors: string[] = [];
    try {
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
      }, parserConfig.BASE_HOST_TOKEN)) as string[];
    } catch (error) {
      console.warn(`Failed to extract anchors from ${url}`, error);
    }
    return { metadata: snapshot, anchors: anchors };
  } catch (error) {
    console.error(`Error while parsing ${url}:`, (error as Error).message);
    return { metadata: null, anchors: [] };
  } finally {
    await page.close();
  }
}
