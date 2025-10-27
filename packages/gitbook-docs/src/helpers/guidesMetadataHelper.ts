export enum MetadataType {
  Guide = 0,
  ReleaseNote = 1,
  Solution = 2,
}

export type MetadataInfo = {
  readonly versionName: string;
  readonly isMainVersion: boolean;
  readonly dirName: string;
  readonly slug: string;
  readonly productSlug: string;
  readonly metadataType?: MetadataType;
};
