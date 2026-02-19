import { RemoveAnchorsFromUrl } from "../helpers/url-handling";
import { parseStringPromise } from "xml2js";
import http from "node:http";
import https from "node:https";
import { SitemapXml } from "./types";

export function getSitemapUrl(baseUrl: string): string {
  const envUrl = process.env.SITEMAP_URL?.trim();
  if (envUrl) return envUrl;
  try {
    const base = new URL(baseUrl);
    return new URL("/sitemap.xml", base).toString();
  } catch (error) {
    console.warn(
      `Sitemap warning: Failed to derive sitemap URL from ${baseUrl}: ${
        (error as Error).message
      }`,
    );
    return "";
  }
}

export async function fetchRemoteXml(
  url: string,
  redirectLimit = 5,
): Promise<string> {
  let currentUrl = url;
  let remainingRedirects = redirectLimit;
  while (remainingRedirects >= 0) {
    const transport = currentUrl.startsWith("https") ? https : http;
    const result = await new Promise<{ data: string; redirect?: string }>(
      (resolve, reject) => {
        const request = transport.get(currentUrl, (response) => {
          const statusCode = response.statusCode ?? 0;
          if (
            statusCode >= 300 &&
            statusCode < 400 &&
            response.headers.location
          ) {
            const redirectedUrl = new URL(
              response.headers.location,
              currentUrl,
            ).toString();
            response.resume();
            resolve({ data: "", redirect: redirectedUrl });
            return;
          }
          if (statusCode >= 400) {
            console.warn(
              `Sitemap warning: Failed to fetch ${currentUrl}: status ${statusCode}`,
            );
            resolve({ data: "" });
            response.resume();
            return;
          }
          response.setEncoding("utf8");
          let fullData = "";
          response.on("data", (chunk: string) => {
            fullData += chunk;
          });
          response.on("end", () => resolve({ data: fullData }));
        });
        request.on("error", (error) => reject(error));
        request.setTimeout(10000, () => {
          request.destroy();
          console.warn(`Sitemap warning: Timeout while fetching ${currentUrl}`);
          resolve({ data: "" });
        });
      },
    );
    if (result.redirect) {
      currentUrl = result.redirect;
      remainingRedirects--;
    } else {
      return result.data;
    }
  }
  console.warn("Sitemap warning: Too many redirects while fetching sitemap");
  return "";
}

export async function parseSitemapXml(
  xml: string,
  location: string,
  fetchXml: (loc: string) => Promise<string> = fetchRemoteXml,
): Promise<string[]> {
  const parsed = (await parseStringPromise(xml, {
    explicitArray: false,
    ignoreAttrs: true,
    xmlns: false,
  })) as SitemapXml;
  return await extractUrlsFromSitemap(parsed, location, fetchXml);
}

async function extractUrlsFromSitemap(
  doc: SitemapXml,
  location: string,
  fetchXml: (loc: string) => Promise<string>,
): Promise<string[]> {
  if (doc.urlset?.url) {
    const urls = Array.isArray(doc.urlset.url)
      ? doc.urlset.url
      : [doc.urlset.url];
    return urls
      .map((entry) => (typeof entry === "string" ? entry : entry?.loc))
      .filter(Boolean)
      .map((loc) => RemoveAnchorsFromUrl(loc.replace(/\/$/, "")));
  }
  if (doc.sitemapindex?.sitemap) {
    const aggregated: string[] = [];
    const sitemaps = Array.isArray(doc.sitemapindex.sitemap)
      ? doc.sitemapindex.sitemap
      : [doc.sitemapindex.sitemap];
    for (const entry of sitemaps) {
      const loc = typeof entry === "string" ? entry : entry?.loc;
      if (!loc) continue;
      try {
        const nestedXml = await fetchXml(loc);
        const nestedDoc = (await parseStringPromise(nestedXml, {
          explicitArray: false,
          ignoreAttrs: true,
          xmlns: false,
        })) as SitemapXml;
        const nestedUrls = await extractUrlsFromSitemap(
          nestedDoc,
          loc,
          fetchXml,
        );
        aggregated.push(...nestedUrls);
      } catch (error) {
        console.warn(
          `Sitemap warning: Failed to fetch nested sitemap from ${loc}: ${
            (error as Error).message
          }`,
        );
      }
    }
    return aggregated;
  }
  console.warn(
    `Sitemap warning: Unknown sitemap format encountered while parsing ${location}`,
  );
  return [];
}
