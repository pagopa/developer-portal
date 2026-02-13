export type EnvConfig = {
  readonly baseUrl: string;
  readonly sanitizedBaseUrl: string;
  readonly outputDirectory: string;
  readonly maxDepth: number | null;
  readonly validDomainVariants?: string[];
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
  title?: string;
  bodyText?: string;
  lang?: string | null;
  keywords?: string | null;
  datePublished?: string | null;
  lastModified?: string | null;
  children?: ParsedNode[];
};
