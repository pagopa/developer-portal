export type EnvConfig = {
  readonly baseUrl: string;
  readonly sanitizedBaseUrl: string;
  readonly outputDirectory: string;
  readonly maxDepth: number | null;
  readonly validDomainVariants?: string[];
  readonly requestTimeoutMs: number;
  readonly shouldCreateFilesLocally: boolean;
  readonly S3BucketName?: string;
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

export type ParserConfig = {
  readonly OUTPUT_DIRECTORY: string;
  readonly MAX_DEPTH: number | null;
  readonly VALID_DOMAIN_VARIANTS: string[];
  readonly BASE_HOST_TOKEN: string;
  readonly REQUEST_TIMEOUT_MS: number;
};

export type SitemapXml = {
  readonly urlset?: { readonly url?: readonly string[] };
  readonly sitemapindex?: { readonly sitemap?: readonly string[] };
};
