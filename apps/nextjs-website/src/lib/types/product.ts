import { Media } from '@/lib/strapi/types/media';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

export type Product = {
  readonly slug: string;
  readonly shortName: string;
  readonly description: string | undefined;
  readonly logo?: Media;
  readonly name: string;
  readonly bannerLinks: readonly BannerLinkProps[];

  readonly hasApiDataListPage?: boolean;
  readonly apiDataListPageUrl?: string;

  readonly hasTutorialListPage?: boolean;
  readonly hasGuideListPage?: boolean;
  readonly hasOverviewPage?: boolean;
  readonly hasQuickstartGuidePage?: boolean;
  readonly hasReleaseNotePage?: boolean;
};
