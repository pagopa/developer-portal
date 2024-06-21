import { Product } from '@/lib/types/product';
import Hero from '@/editorialComponents/Hero/Hero';
import { Path } from '@/lib/types/path';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';

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
    comingSoon?: boolean;
    title: string;
    text: string;
    href?: string;
    icon: string;
    iconColor?: string;
    tags?: { readonly label: string; readonly path?: string }[];
  }[];
  //Add banner links
};

const ApiListPageTemplate = ({
  breadcrumbs,
  hero,
  cards,
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
      <Hero title={hero.title} subtitle={hero.subtitle} theme={'light'} />
      <CardsGrid cards={cards} cardSize={{ xs: true, md: false }} />
    </>
  );
};

export default ApiListPageTemplate;
