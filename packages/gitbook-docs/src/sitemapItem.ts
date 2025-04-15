export interface SitemapItem {
  readonly path: string;
  readonly dirName: string;
  readonly contentS3Path: string;
  readonly manuS3Path: string;
  readonly title: string;
}
