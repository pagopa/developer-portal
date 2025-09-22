import { Media } from '@/lib/types/media';
import { BannerLinkData } from '@/components/atoms/BannerLink/BannerLink';

export type Product = {
  readonly slug: string;
  readonly shortName: string;
  readonly description?: string;
  readonly logo?: Media;
  readonly name: string;
  readonly bannerLinks: readonly BannerLinkData[];
  readonly hasApiDataListPage?: boolean;
  readonly apiDataListPageUrl?: string;
  readonly hasTutorialListPage?: boolean;
  readonly hasGuideListPage?: boolean;
  readonly hasOverviewPage?: boolean;
  readonly hasQuickstartGuidePage?: boolean;
  readonly hasReleaseNotePage?: boolean;
};
