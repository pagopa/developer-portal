import { Media } from '@/lib/types/media';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { Tag } from '@/lib/types/tag';

export type Product = {
  readonly apiDataListPageUrl?: string;
  readonly bannerLinks: readonly BannerLinkProps[];
  readonly description?: string;
  readonly isVisible: boolean;
  readonly logo?: Media;
  readonly name: string;
  readonly hasApiDataListPage?: boolean;
  readonly hasGuideListPage?: boolean;
  readonly hasOverviewPage?: boolean;
  readonly hasQuickstartGuidePage?: boolean;
  readonly hasReleaseNotePage?: boolean;
  readonly hasTutorialListPage?: boolean;
  readonly hasUseCaseListPage?: boolean;
  readonly shortName: string;
  readonly slug: string;
  readonly tags?: readonly Tag[];
};
