import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { resolveEnv } from "./modules/config";
import { ensureDirectory } from "./modules/output";
import { handleError } from "./modules/errors";
import {
  exploreAndParsePages,
  generatePageParsedMetadata,
} from "./modules/parser";
import { ParsedNode, ParsedMetadata } from "./modules/types";
import { RemoveAnchorsFromUrl, buildVisitKey } from "./helpers/url-handling";
import { assertReachable } from "./modules/network";
import {
  fetchRemoteXml,
  getSitemapUrl,
  parseSitemapXml,
} from "./modules/sitemap-parser";

puppeteer.use(StealthPlugin());

const env = resolveEnv();
const parsedPages = new Map<string, ParsedMetadata>();
const scheduledPages = new Set<string>();
export const OUTPUT_DIRECTORY = env.outputDirectory;
export const MAX_DEPTH = env.maxDepth;
export const REQUEST_TIMEOUT_MS = env.requestTimeoutMs;
export const BASE_HOST_TOKEN = new URL(env.baseUrl).hostname
  .replace(/www\./, "")
  .toLowerCase();
export const VALID_DOMAIN_VARIANTS = env.validDomainVariants || [];

let BASE_URL = env.baseUrl;

void (async () => {
  try {
    await assertReachable(env.baseUrl);
    ensureDirectory(env.outputDirectory);
    const browser = await puppeteer.launch({ headless: true });
    let finalUrl = env.baseUrl;
    let page;
    try {
      page = await browser.newPage();
      const response = await page.goto(env.baseUrl, {
        waitUntil: "networkidle2",
        timeout: REQUEST_TIMEOUT_MS,
      });
      if (response) {
        finalUrl = response.url();
      }
    } catch (error) {
      console.warn(`Failed to reach the URL: ${env.baseUrl}`, error);
      process.exit(1);
    } finally {
      if (page) await page.close();
    }
    if (
      new URL(env.baseUrl).hostname.replace(/www\./, "") !==
      new URL(finalUrl).hostname.replace(/www\./, "")
    ) {
      console.error(
        `Domain mismatch: original ${new URL(env.baseUrl).hostname} != final ${
          new URL(finalUrl).hostname
        }`,
      );
      await browser.close();
      process.exit(1);
    }
    const BASE_SCOPE = RemoveAnchorsFromUrl(finalUrl);
    BASE_URL = finalUrl;
    const root: ParsedNode = { url: BASE_URL };
    scheduledPages.add(buildVisitKey(BASE_URL));
    let allParsedPages = await exploreAndParsePages(
      browser,
      root,
      0,
      parsedPages,
      scheduledPages,
      BASE_SCOPE,
    );
    console.log("Crawling complete. Checking sitemap for unparsed URLs...");
    let sitemapUrls: string[] = [];
    try {
      const sitemapUrl = getSitemapUrl(env.baseUrl);
      let sitemapXml = "";
      try {
        sitemapXml = await fetchRemoteXml(sitemapUrl);
      } catch (err) {
        console.warn(
          `Sitemap warning: Failed to fetch ${sitemapUrl}: ${
            (err as Error).message
          }`,
        );
      }
      if (sitemapXml) {
        try {
          sitemapUrls = await parseSitemapXml(sitemapXml, sitemapUrl);
        } catch (err) {
          console.warn(
            `Sitemap warning: Failed to parse sitemap XML from ${sitemapUrl}: ${
              (err as Error).message
            }`,
          );
        }
      }
    } catch (err) {
      console.warn(
        `Sitemap warning: Could not resolve sitemap URL: ${
          (err as Error).message
        }`,
      );
    }
    const alreadyParsed = new Set(Array.from(allParsedPages.keys()));
    const toParse = sitemapUrls.filter(
      (url) => !alreadyParsed.has(buildVisitKey(url)),
    );
    if (toParse.length > 0) {
      console.log(
        `Parsing ${toParse.length} URLs from sitemap ${getSitemapUrl(
          env.baseUrl,
        )} not seen in crawl...`,
      );
      const pagesFromCrawlSize = allParsedPages.size;
      for (const url of toParse) {
        try {
          const metadata = await generatePageParsedMetadata(
            browser,
            url,
            BASE_SCOPE,
          );
          if (!metadata) continue;
          allParsedPages.set(buildVisitKey(url), metadata);
          console.log(
            `Completed parsing of page ${url}. Progress: ${
              allParsedPages.size - pagesFromCrawlSize
            } / ${toParse.length} pages parsed (${(
              ((allParsedPages.size - pagesFromCrawlSize) / toParse.length) *
              100
            ).toFixed(2)}%)`,
          );
        } catch (err) {
          console.warn(
            `Failed to parse sitemap URL: ${url}:`,
            (err as Error).message,
          );
        }
      }
    } else {
      console.log("No additional URLs found in sitemap.");
    }
    await browser.close();
    console.log(
      `Parsing complete! Parsed ${allParsedPages.size} pages. Data saved to ${env.outputDirectory}`,
    );
  } catch (error) {
    handleError(error);
  }
})();
