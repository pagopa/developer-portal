'use client';
import Hero from '@/editorialComponents/Hero/Hero';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import { Box } from '@mui/material';
import { Theme } from '@/editorialComponents/types/components';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import { StrapiApiData } from '@/lib/strapi/codecs/ApiDataCodec';
import { useTranslations } from 'next-intl';

export type ApiDataListTemplateProps = {
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
    readonly heigth?: string;
  };
  readonly product: {
    readonly name: string;
    readonly slug: string;
  };
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
  readonly apiData: StrapiApiData;
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
          cardVariant='outlined'
          cards={cards.map((card) => ({
            ...card,
            ctaLabel: t('apiDataListPage.explore'),
          }))}
          cardSvg={true}
          cardSize={{ xs: 12, md: 4 }}
        />
      </Box>
      <BannerLinks bannerLinks={bannerLinks} />
    </>
  );
};

export default ApiDataListTemplate;
