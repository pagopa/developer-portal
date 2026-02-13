import { Browser } from "puppeteer";
import { ParsedNode, ParsedMetadata } from "./types";
import { UrlWithoutAnchors } from "../helpers/url-handling";
import { expandInteractiveSections } from "./dom-actions";

export async function exploreAndParsePages(
  browser: Browser,
  node: ParsedNode,
  depth: number,
  maxDepth: number,
  parsedPages: Map<string, ParsedMetadata>,
  scheduledPages: Set<string>,
  parsePageFn: (
    browser: Browser,
    url: string,
  ) => Promise<ParsedMetadata | null>,
  baseOrigin: string,
  baseScope: string,
  baseHostToken: string,
  validDomainVariants: string[] = [],
  navigationTimeout = 30000,
): Promise<void> {
  const visitKey = buildVisitKey(node.url);
  scheduledPages.delete(visitKey);
  if (parsedPages.has(visitKey) || depth > maxDepth) {
    return;
  }
  const normalizedUrl = UrlWithoutAnchors(node.url);
  if (!isWithinScope(normalizedUrl, baseScope, validDomainVariants)) {
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
    await page.goto(node.url, {
      waitUntil: "networkidle2",
      timeout: navigationTimeout,
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
    }, baseHostToken)) as string[];
  } catch (error) {
    console.warn(`Failed to extract anchors from ${node.url}`, error);
  } finally {
    if (page) await page.close();
  }
  const nextChildren: ParsedNode[] = [];
  let newLinksCount = 0;
  for (const href of anchors) {
    const normalized = UrlWithoutAnchors(href);
    const visitCandidate = buildVisitKey(normalized);
    if (parsedPages.has(visitCandidate) || scheduledPages.has(visitCandidate))
      continue;
    const lowerNormalized = normalized.toLowerCase();
    if (baseHostToken && !lowerNormalized.includes(baseHostToken)) {
      continue;
    }
    if (!isWithinScope(normalized, baseScope, validDomainVariants)) {
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
  if (!node.children || depth >= maxDepth) return;
  for (const child of node.children) {
    await exploreAndParsePages(
      browser,
      child,
      depth + 1,
      maxDepth,
      parsedPages,
      scheduledPages,
      parsePageFn,
      baseOrigin,
      baseScope,
      baseHostToken,
      validDomainVariants,
    );
  }
}

function isWithinScope(
  url: string,
  scope: string,
  validDomainVariants: string[] = [],
): boolean {
  if (!scope) {
    return true;
  }
  // TODO: This function could be generalized to better handle edge cases. For now it performs a basic check to see if the URL is within the same domain or valid subdomain variants as the scope.
  try {
    const urlObj = new URL(url);
    const scopeObj = new URL(scope);
    const urlDomain = urlObj.hostname.replace(/^www\./, "");
    const scopeDomain = scopeObj.hostname.replace(/^www\./, "");
    if (urlDomain === scopeDomain) {
      return true;
    }
    const urlParts = urlDomain.split(".");
    const scopeParts = scopeDomain.split(".");
    if (urlParts.length > scopeParts.length) {
      const subdomain = urlParts[0];
      const domainWithoutSubdomain = urlParts.slice(1).join(".");
      if (
        domainWithoutSubdomain === scopeDomain &&
        validDomainVariants.includes(subdomain)
      ) {
        return true;
      }
    }
    return false;
  } catch (_error) {
    return false;
  }
}

export function buildVisitKey(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.hash = "";
    url.hostname = url.hostname.replace(/^www\./, "");
    return UrlWithoutAnchors(url.toString());
  } catch (_error) {
    return rawUrl;
  }
}
