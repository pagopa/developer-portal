import { buildVisitKey } from "../modules/crawler";

describe("Crawler deduplication", () => {
  it("should treat URLs with and without anchors as the same page", () => {
    const url1 = "https://assistenza.notifichedigitali.it/hc/it";
    const url2 = "https://assistenza.notifichedigitali.it/hc/it#main-content";
    const parsedPages = new Map<string, string>();
    // Simulate crawling url1
    parsedPages.set(buildVisitKey(url1), "page1");
    // Simulate checking url2
    const visitKey2 = buildVisitKey(url2);
    expect(parsedPages.has(visitKey2)).toBe(true);
    // Simulate crawling url2 (should not crawl again)
    if (!parsedPages.has(visitKey2)) {
      parsedPages.set(visitKey2, "page2");
    }
    expect(parsedPages.size).toBe(1);
    expect(parsedPages.get(buildVisitKey(url1))).toBe("page1");
  });
});
