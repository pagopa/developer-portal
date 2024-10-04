'use client';
import Hero from '@/editorialComponents/Hero/Hero';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import { Box } from '@mui/material';
import { Theme } from '@/editorialComponents/types/components';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import { useTranslations } from 'next-intl';
import { SEO } from '@/lib/types/seo';
import { Product } from '@/lib/types/product';

export type ApiDataListTemplateProps = {
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
    readonly heigth?: string;
  };
  readonly product: Product;
  readonly apiRestDetailSlugs: readonly string[];
  readonly cards: {
    readonly target?: '_blank' | '_self' | '_parent' | '_top';
    readonly title: string;
    readonly text: string;
    readonly ctaLabel?: string;
    readonly href?: string;
    readonly externalUrl: boolean;
    readonly icon: string;
    readonly tags?: { label: string }[];
  }[];
  readonly bannerLinks: BannerLinkProps[];
  readonly theme?: Theme;
  readonly seo?: SEO;
};

const ApiDataListTemplate = ({
  hero,
  cards,
  bannerLinks,
  theme = 'light',
}: ApiDataListTemplateProps) => {
  const t = useTranslations('');

  return (
    <>
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        theme={theme}
        smallHeight={hero.heigth || '272px'}
        titleVariant='h4'
        gridTextSx={{
          justifyContent: 'center',
        }}
      />
      <Box paddingBottom={6}>
        <CardsGrid
          ctaButtonsVariant='outlined'
          cards={cards.map((card) => ({
            ...card,
            useSrc: true,
            ctaLabel: t('apiDataListPage.explore'),
          }))}
          cardSize={{ xs: 12, md: 4 }}
          containerSx={{
            pt: '22px',
            mt: '-22px',
          }}
        />
      </Box>
      <BannerLinks bannerLinks={bannerLinks} />
    </>
  );
};

export default ApiDataListTemplate;
