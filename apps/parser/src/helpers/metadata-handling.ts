import { ParsedMetadata } from "../modules/types";
import { toIsoOrNull } from "./date-format";

export const extractDocumentMetadata = (): ParsedMetadata => {
  const getMeta = (name: string): string | null => {
    return (
      document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ||
      document
        .querySelector(`meta[property="${name}"]`)
        ?.getAttribute("content") ||
      null
    );
  };
  const metaTitle = getMeta("og:title") || getMeta("twitter:title");
  const documentTitle = document.title?.trim();
  const normalizedTitle = documentTitle?.length
    ? documentTitle
    : metaTitle || "";
  const normalizeText = (value: string | null | undefined): string => {
    return value ? value.replace(/\s+/g, " ").trim() : "";
  };
  const mainText = normalizeText(document.querySelector("main")?.innerText);
  const iframeTexts = Array.from(document.querySelectorAll("iframe"))
    .map((frame) => {
      try {
        return normalizeText(frame.contentDocument?.body?.innerText ?? "");
      } catch (_error) {
        return "";
      }
    })
    .filter((text) => text.length > 0);
  const prioritizedTextParts = [mainText, ...iframeTexts].filter(
    (text) => text.length > 0,
  );
  const prioritizedText = prioritizedTextParts.join("\n\n").trim();
  const fallbackBody = normalizeText(document.body?.innerText ?? "");
  const bodyText =
    prioritizedText.length >= 120 ? prioritizedText : fallbackBody;
  return {
    title: normalizedTitle,
    url: window.location.href,
    bodyText,
    lang: document.documentElement.lang || getMeta("og:locale") || null,
    keywords: getMeta("keywords") || getMeta("news_keywords"),
    datePublished:
      getMeta("article:published_time") ||
      getMeta("date") ||
      getMeta("publish-date"),
    lastModified:
      document.lastModified !== "01/01/1970 00:00:00"
        ? document.lastModified
        : getMeta("article:modified_time"),
  };
};

export function serializeMetadata(raw: ParsedMetadata): ParsedMetadata {
  return {
    url: raw.url,
    title: raw.title,
    bodyText: raw.bodyText,
    lang: raw.lang,
    keywords: raw.keywords,
    datePublished: toIsoOrNull(raw.datePublished),
    lastModified: toIsoOrNull(raw.lastModified),
  };
}
