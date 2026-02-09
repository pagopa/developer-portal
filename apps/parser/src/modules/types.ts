export type ParseMetadata = {
  readonly url: string;
  readonly title: string;
  readonly bodyText: string;
  readonly lang: string | null;
  readonly keywords: string | null;
  readonly datePublished: string | null;
  readonly lastModified: string | null;
};

export type ParseNode = {
  readonly url: string;
  title?: string;
  bodyText?: string;
  lang?: string | null;
  keywords?: string | null;
  datePublished?: string | null;
  lastModified?: string | null;
  children?: ParseNode[];
};
