import { parseSitemapXml } from "../src/modules/sitemap-parser";
import { RemoveAnchorsFromUrl } from "../src/helpers/url-handling";

describe("Sitemap parsing", () => {
  it("parses simple urlset sitemap", async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://www.w3.org/</loc></url>
        <url><loc>https://www.w3.org/standards/</loc></url>
      </urlset>`;
    const urls = await parseSitemapXml(xml, "https://www.w3.org/sitemap.xml");
    expect(urls).toEqual([
      "https://www.w3.org",
      "https://www.w3.org/standards",
    ]);
  });

  it("parses sitemapindex with nested sitemaps (mocked)", async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap><loc>https://www.w3.org/sitemap-section.xml</loc></sitemap>
      </sitemapindex>`;

    const mockFetchXml = async (
      loc: string,
    ) => `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://www.w3.org/section/</loc></url>
      </urlset>`;

    const urls = await parseSitemapXml(
      xml,
      "https://www.w3.org/sitemap.xml",
      mockFetchXml,
    );
    expect(urls).toEqual(["https://www.w3.org/section"]);
  });
  it("removes anchors from sitemap URLs and keeps normalized URLs unchanged", async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://www.w3.org/page#section</loc></url>
        <url><loc>https://www.w3.org/already-normalized</loc></url>
      </urlset>`;
    const urls = await parseSitemapXml(xml, "https://www.w3.org/sitemap.xml");
    expect(urls.map(RemoveAnchorsFromUrl)).toEqual([
      "https://www.w3.org/page",
      "https://www.w3.org/already-normalized",
    ]);
  });
  it("handles failed nested sitemap fetch gracefully", async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap><loc>https://www.w3.org/sitemap-fails.xml</loc></sitemap>
      </sitemapindex>`;
    const failingFetchXml = async (loc: string) => {
      throw new Error("Network error while fetching nested sitemap");
    };
    const urls = await parseSitemapXml(
      xml,
      "https://www.w3.org/sitemap.xml",
      failingFetchXml,
    );
    expect(urls).toEqual([]);
  });
  it("handles malformed XML in nested sitemap without throwing", async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap><loc>https://www.w3.org/sitemap-malformed.xml</loc></sitemap>
      </sitemapindex>`;
    const malformedFetchXml = async (loc: string) =>
      `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://www.w3.org/broken</loc>
      <!-- missing closing tags to simulate malformed XML -->`;
    const urls = await parseSitemapXml(
      xml,
      "https://www.w3.org/sitemap.xml",
      malformedFetchXml,
    );
    expect(Array.isArray(urls)).toBe(true);
  });
  it("returns empty list for empty nested sitemap", async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap><loc>https://www.w3.org/sitemap-empty.xml</loc></sitemap>
      </sitemapindex>`;
    const emptyFetchXml = async (loc: string) =>
      `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      </urlset>`;
    const urls = await parseSitemapXml(
      xml,
      "https://www.w3.org/sitemap.xml",
      emptyFetchXml,
    );
    expect(urls).toEqual([]);
  });
});
