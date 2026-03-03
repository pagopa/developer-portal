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

export type SitemapXml = {
  readonly urlset?: { readonly url?: readonly string[] };
  readonly sitemapindex?: { readonly sitemap?: readonly string[] };
};
