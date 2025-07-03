import { sitePathFromS3Path } from './sitePathFromS3Path';

export const URL_PARSING_METADATA_JSON_PATH =
  process.env.URL_PARSING_METADATA_JSON_PATH || 'url-parsing-metadata.json';
export interface StrapiGuide {
  readonly id: number;
  readonly attributes: {
    readonly slug: string;
    readonly title: string;
    readonly product?: {
      readonly data?: {
        readonly attributes?: {
          readonly slug: string;
        };
      };
    };
    readonly versions: readonly {
      readonly id: number;
      readonly main: boolean;
      readonly version: string;
      readonly dirName: string;
    }[];
  };
}

export function generateUrlPath(
  filePath: string,
  guideSlug: string,
  productSlug: string,
  versionName?: string,
  dirName?: string
): string {
  const restOfPath = sitePathFromS3Path(filePath, undefined, dirName);
  return [`/${productSlug}`, 'guides', guideSlug, versionName, restOfPath]
    .filter(Boolean)
    .join('/');
}

export type GuideInfo = {
  readonly versionName: string;
  readonly isMainVersion: boolean;
  readonly dirName: string;
  readonly guideSlug: string;
  readonly productSlug: string;
};
