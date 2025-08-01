export type Media = {
  readonly name: string;
  readonly alternativeText?: string;
  readonly caption?: string;
  readonly width?: number;
  readonly height?: number;
  readonly size: number;
  readonly ext: string;
  readonly mime: string;
  readonly url: string;
};

export type StrapiMedia = {
  readonly attributes: Media;
};
