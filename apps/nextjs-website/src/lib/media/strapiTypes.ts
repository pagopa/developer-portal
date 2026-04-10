export type StrapiMedia = {
  readonly name: string;
  readonly ext: string;
  readonly mime: string;
  readonly size: number;
  readonly url: string;
  readonly alternativeText?: string;
  readonly caption?: string;
  readonly height?: number;
  readonly width?: number;
};
