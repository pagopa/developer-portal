export type SEO = {
  readonly id?: number;
  readonly metaTitle?: string;
  readonly metaDescription?: string;
  readonly keywords?: string;
  readonly metaRobots?: string;
  readonly structuredData?:
    | {
        readonly [key: string]: string;
      }
    | unknown;
  readonly metaViewport?: string;
  readonly canonicalURL?: string;
  readonly metaImage?: {
    readonly id?: number;
    readonly name?: string;
    readonly alternativeText?: string | null;
    readonly caption?: string | null;
    readonly width?: number;
    readonly height?: number;
    readonly formats?: {
      readonly thumbnail?: ImageFormat;
      readonly small?: ImageFormat;
      readonly medium?: ImageFormat;
    };
    readonly hash?: string;
    readonly ext?: string;
    readonly mime?: string;
    readonly size?: number;
    readonly url?: string;
    readonly previewUrl?: string | null;
    readonly provider?: string;
    readonly provider_metadata?: unknown;
    readonly createdAt?: string;
    readonly updatedAt?: string;
  };
  readonly metaSocial?: ReadonlyArray<{
    readonly id?: number;
    readonly socialNetwork?: string;
    readonly title?: string;
    readonly description?: string;
    readonly card?: string;
    readonly site?: string;
    readonly creator?: string;
  }>;
};

type ImageFormat = {
  readonly name?: string;
  readonly hash?: string;
  readonly ext?: string;
  readonly mime?: string;
  readonly path?: string | null;
  readonly width?: number;
  readonly height?: number;
  readonly size?: number;
  readonly sizeInBytes?: number;
  readonly url?: string;
};
