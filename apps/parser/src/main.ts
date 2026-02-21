import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { resolveEnv } from "./modules/config";
import { ensureDirectory } from "./modules/output";
import { handleError } from "./modules/errors";
import { exploreAndParsePages } from "./modules/parser";
import { ParsedNode, ParsedMetadata } from "./modules/types";
import { RemoveAnchorsFromUrl, buildVisitKey } from "./helpers/url-handling";
import { assertReachable } from "./modules/network";

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
    const allParsedPages = await exploreAndParsePages(
      browser,
      root,
      0,
      parsedPages,
      scheduledPages,
      BASE_SCOPE,
    );
    await browser.close();
    console.log(
      `Parsing complete! Parsed ${allParsedPages.size} pages. Data saved to ${env.outputDirectory}`,
    );
  } catch (error) {
    handleError(error);
  }
})();
