import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { resolveEnv } from "./modules/config";
import { ensureDirectory } from "./modules/output";
import { handleError } from "./modules/errors";
import { exploreAndParsePages } from "./modules/parser";
import { ParsedNode, ParsedMetadata } from "./modules/types";
import {
  RemoveAnchorsFromUrl,
  buildVisitKey,
  setBaseScope,
} from "./helpers/url-handling";
import { assertReachable } from "./modules/network";

puppeteer.use(StealthPlugin());

const env = resolveEnv();
const parsedPages = new Map<string, ParsedMetadata>();
const scheduledPages = new Set<string>();
export const OUTPUT_DIRECTORY = env.outputDirectory;
export const MAX_DEPTH = env.maxDepth;
export const BASE_HOST_TOKEN = new URL(env.baseUrl).hostname
  .replace(/^www\./, "")
  .toLowerCase();
export const VALID_DOMAIN_VARIANTS = env.validDomainVariants || [];

let BASE_URL = env.baseUrl;
let BASE_SCOPE = RemoveAnchorsFromUrl(env.baseUrl);
setBaseScope(BASE_SCOPE);

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
        timeout: 30_000,
      });
      if (response) {
        finalUrl = response.url();
      }
    } catch (error) {
      console.warn(
        `Failed to detect redirect for base URL: ${env.baseUrl}`,
        error,
      );
    } finally {
      if (page) await page.close();
    }
    BASE_SCOPE = RemoveAnchorsFromUrl(finalUrl);
    setBaseScope(BASE_SCOPE);
    BASE_URL = finalUrl;
    const root: ParsedNode = { url: BASE_URL };
    scheduledPages.add(buildVisitKey(BASE_URL));
    await exploreAndParsePages(browser, root, 0, parsedPages, scheduledPages);
    await browser.close();
    console.log(`Parsing complete! Data saved to ${env.outputDirectory}`);
  } catch (error) {
    handleError(error);
  }
})();
