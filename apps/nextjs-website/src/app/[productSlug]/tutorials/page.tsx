import { Product } from '@/lib/types/product';
import { Metadata, ResolvingMetadata } from 'next';
import { getProductsSlugs, getTutorialListPageProps } from '@/lib/api';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import { Box } from '@mui/material';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { Tutorial } from '@/lib/types/tutorialData';
import Newsroom from '@/editorialComponents/Newsroom/Newsroom';
import React from 'react';
import { translations } from '@/_contents/translations';
import { ProductParams } from '@/lib/types/productParams';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { SEO } from '@/lib/types/seo';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';

export async function generateStaticParams() {
  return [...getProductsSlugs('tutorials')].map((productSlug) => ({
    productSlug,
  }));
}

export type TutorialsPageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly tutorials: readonly Tutorial[];
  readonly seo?: SEO;
} & ProductLayoutProps;

export async function generateMetadata(
  { params }: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParent = await parent;
  const { product, abstract, path, seo } = await getTutorialListPageProps(
    params.productSlug
  );

  if (seo) {
    return makeMetadataFromStrapi(seo);
  }

  return makeMetadata({
    parent: resolvedParent,
    title: product.name,
    description: abstract?.description,
    url: path,
    image: product.logo.url,
  });
}

const TutorialsPage = async ({ params }: ProductParams) => {
  const { productSlug } = params;
  const { abstract, bannerLinks, path, product, tutorials, seo } =
    await getTutorialListPageProps(productSlug);

  const { shared } = translations;

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(product),
      {
        name: seo?.metaTitle,
        item: breadcrumbItemByProduct(product, ['tutorials']),
      },
    ],
    seo: seo,
  });

  return (
    <ProductLayout
      product={product}
      path={path}
      bannerLinks={bannerLinks}
      showBreadcrumbs
      structuredData={structuredData}
    >
      {abstract && (
        <Abstract
          description={abstract?.description}
          overline=''
          title={abstract?.title}
        />
      )}
      {product.subpaths.tutorials && tutorials && (
        <Box>
          <Newsroom
            items={tutorials.map((tutorial) => ({
              title: tutorial.title,
              date: {
                date: tutorial.publishedAt,
              },
              href: {
                label: shared.readTutorial,
                link: tutorial.path,
                title: shared.readTutorial,
              },
              img: {
                alt: tutorial.image?.alternativeText || '',
                src: tutorial.image?.url || '/images/news.png',
              },
            }))}
          />
        </Box>
      )}
    </ProductLayout>
  );
};

export default TutorialsPage;
