export type Media = {
  readonly name: string;
  readonly alternativeText?: string | null;
  readonly caption?: string | null;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly size: number;
  readonly ext: string;
  readonly mime: string;
  readonly url: string;
};

export type MediaAttributes = {
  readonly attributes: Media;
};
