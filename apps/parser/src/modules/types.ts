export type EnvConfig = {
  readonly baseUrl: string;
  readonly sanitizedBaseUrl: string;
  readonly outputDirectory: string;
  readonly maxDepth: number | null;
  readonly validDomainVariants?: string[];
  readonly requestTimeoutMs: number;
};

export type SanitizeOptions = {
  readonly replacement?: string;
  readonly lengthThreshold?: number;
};

export type ParsedMetadata = {
  readonly url: string;
  readonly title: string;
  readonly bodyText: string;
  readonly lang: string | null;
  readonly keywords: string | null;
  readonly datePublished: string | null;
  readonly lastModified: string | null;
};

export type ParsedNode = {
  readonly url: string;
  children?: ParsedNode[];
};

export type UrlEntry = { readonly loc?: readonly string[] };
export type UrlSetNode = { readonly url?: readonly UrlEntry[] };
export type SitemapIndexNode = { readonly sitemap?: readonly UrlEntry[] };
export type SitemapXml = { readonly urlset?: UrlSetNode; readonly sitemapindex?: SitemapIndexNode };
