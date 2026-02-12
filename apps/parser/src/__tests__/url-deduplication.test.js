const { UrlWithoutAnchors } = require("../helpers/url-handling");
const { buildVisitKey } = require("../modules/crawler");

describe("URL deduplication logic", () => {
  const urls = [
    "https://assistenza.notifichedigitali.it/hc/it",
    "https://assistenza.notifichedigitali.it/hc/it#main-content",
    "https://assistenza.notifichedigitali.it/hc/it/",
    "https://assistenza.notifichedigitali.it/hc/it/?",
    "https://assistenza.notifichedigitali.it/hc/it#foo",
    "https://assistenza.notifichedigitali.it/hc/it?bar=1#main-content",
    "https://assistenza.notifichedigitali.it/hc/it?bar=1",
  ];

  it("should deduplicate URLs differing only by anchor", () => {
    const keys = urls.map(buildVisitKey);
    const unique = new Set(keys);
    expect(unique.size).toBeLessThan(urls.length);
    expect(keys[0]).toEqual(keys[1]);
  });

  it("should match UrlWithoutAnchors and buildVisitKey for base URLs", () => {
    expect(UrlWithoutAnchors(urls[0])).toEqual(buildVisitKey(urls[0]));
    expect(UrlWithoutAnchors(urls[1])).toEqual(buildVisitKey(urls[1]));
  });
});
