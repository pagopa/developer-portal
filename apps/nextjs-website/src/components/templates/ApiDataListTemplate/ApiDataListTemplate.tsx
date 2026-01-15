'use client';
import Hero from '@/editorialComponents/Hero/Hero';
import { FilteredGridLayout } from '@/components/organisms/FilteredGridLayout/FilteredGridLayout';
import { Box } from '@mui/material';
import { Theme } from '@/editorialComponents/types/components';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import { useTranslations } from 'next-intl';
import { SEO } from '@/lib/types/seo';
import { Product } from '@/lib/types/product';
import { Tag } from '@/lib/types/tag';
import { CardProps } from '@/components/molecules/CardsGrid/CardsGrid';
import { StrapiApiDataList } from '@/lib/strapi/types/apiDataList';

export type ApiDataListPageTemplateProps = {
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
    readonly height?: string;
  };
  readonly product: Product;
  readonly apiDetailSlugs: readonly string[];
  readonly cards: Pick<
    CardProps,
    'title' | 'text' | 'ctaLabel' | 'href' | 'icon' | 'labels' | 'tags'
  >[];
  readonly tags?: readonly Tag[];
  readonly enableFilters?: boolean;
  readonly updatedAt: string;
  readonly bannerLinks: BannerLinkProps[];
  readonly theme?: Theme;
  readonly api_data: StrapiApiDataList;
  readonly seo?: SEO;
};

const ApiDataListTemplate = ({
  hero,
  cards,
  bannerLinks,
  theme = 'light',
  tags = [],
  enableFilters,
}: ApiDataListPageTemplateProps) => {
  const t = useTranslations('');

  return (
    <>
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        theme={theme}
        smallHeight={hero.height || '272px'}
        titleVariant='h4'
        gridTextSx={{
          justifyContent: 'center',
        }}
      />
      <Box paddingBottom={6}>
        <FilteredGridLayout
          cards={cards.map((card) => ({
            ...card,
            useSrc: true,
            ctaLabel: t('apiDataListPage.explore'),
          }))}
          tags={tags}
          enableFilters={enableFilters}
          noItemsMessageKey={'apiDataListPage.noApiMessage'}
        />
      </Box>
      {bannerLinks && <BannerLinks bannerLinks={bannerLinks} />}
    </>
  );
};

export default ApiDataListTemplate;
