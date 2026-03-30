import { Media } from '@/lib/media/types';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { Tag } from '@/lib/tags/types';

export type Product = {
  readonly apiDataListPageUrl?: string;
  readonly bannerLinks: readonly BannerLinkProps[];
  readonly description?: string;
  readonly isVisible: boolean;
  readonly logo?: Media;
  readonly hasApiDataListPage?: boolean;
  readonly hasGuideListPage?: boolean;
  readonly hasOverviewPage?: boolean;
  readonly hasQuickstartGuidePage?: boolean;
  readonly hasReleaseNotePage?: boolean;
  readonly hasTutorialListPage?: boolean;
  readonly hasUseCaseListPage?: boolean;
  readonly name: string;
  readonly shortName: string;
  readonly slug: string;
  readonly tags?: readonly Tag[];
};

export type ProductParams = {
  readonly params: Promise<{
    readonly locale: string;
    readonly productSlug: string;
  }>;
};
