import { Product } from '@/lib/types/product';
import Hero from '@/editorialComponents/Hero/Hero';
import { Path } from '@/lib/types/path';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import BannerLinks, {
  BannerLinksProps,
} from '@/components/molecules/BannerLinks/BannerLinks';
import { Padding } from '@mui/icons-material';
import { Box } from '@mui/material';

export type ApiListPageTemplateProps = {
  readonly breadcrumbs: {
    readonly product: Product;
    readonly path: string;
    readonly paths: readonly Path[];
  };
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
  };
  readonly cards: {
    title: string;
    text: string;
    ctaLabel?: string;
    href?: string;
    icon: string;
    tags?: { readonly label: string }[];
  }[];
  readonly bannerLinks: BannerLinksProps;
  //Add banner links
};

const ApiListPageTemplate = ({
  breadcrumbs,
  hero,
  cards,
  bannerLinks,
}: ApiListPageTemplateProps) => {
  console.log(breadcrumbs.product.name);
  return (
    <>
      <EContainer sx={{ marginTop: 10, paddingTop: 3 }}>
        <ProductBreadcrumbs
          breadcrumbs={[
            ...productPageToBreadcrumbs(
              breadcrumbs.product,
              breadcrumbs.path,
              breadcrumbs.paths
            ),
          ]}
        />
      </EContainer>
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        theme={'light'}
        smallHeight='272px'
        gridTextSx={{
          justifyContent: 'center',
        }}
      />
      <Box paddingBottom={'80px'}>
        <CardsGrid
          cardVariant='outlined'
          cards={cards}
          cardSvg={true}
          cardSize={{ xs: 12, md: 16 / cards.length }}
        />
      </Box>
      <BannerLinks
        bannerLinkMaxWidth={bannerLinks.bannerLinkMaxWidth}
        banners={bannerLinks.banners}
      />
    </>
  );
};

export default ApiListPageTemplate;
