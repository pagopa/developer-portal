export interface MetadataItem {
  readonly path: string;
  readonly dirName: string;
  readonly contentS3Path: string;
  readonly menuS3Path: string;
  readonly title: string;
  readonly version?: string;
}
