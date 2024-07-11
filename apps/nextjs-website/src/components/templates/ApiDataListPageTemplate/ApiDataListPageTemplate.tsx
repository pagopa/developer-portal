import Hero from '@/editorialComponents/Hero/Hero';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import { Box } from '@mui/material';
import { Theme } from '@/editorialComponents/types/components';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';

export type ApiDataListPageTemplateProps = {
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
};

const ApiDataListPageTemplate = ({
  hero,
  cards,
  bannerLinks,
  theme = 'light',
}: ApiDataListPageTemplateProps) => {
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
          cards={cards}
          cardSvg={true}
          cardSize={{ xs: 12, md: 16 / Math.max(cards.length, 3) }}
        />
      </Box>
      <BannerLinks bannerLinks={bannerLinks} />
    </>
  );
};

export default ApiDataListPageTemplate;
