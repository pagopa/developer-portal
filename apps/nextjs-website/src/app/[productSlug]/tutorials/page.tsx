import { Product } from '@/lib/types/product';
import { Metadata, ResolvingMetadata } from 'next';
import { getTutorialListPageProps } from '@/lib/api';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import { Box } from '@mui/material';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { Tutorial } from '@/lib/types/tutorialData';
import Newsroom from '@/editorialComponents/Newsroom/Newsroom';
import React from 'react';
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
import { getTutorialListPagesProps } from '@/lib/cmsApi';

export async function generateStaticParams() {
  return (await getTutorialListPagesProps()).map(({ product }) => ({
    productSlug: product.slug,
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
    image: product.logo?.url,
  });
}

const TutorialsPage = async ({ params }: ProductParams) => {
  const { productSlug } = params;
  const { abstract, bannerLinks, path, tutorials, seo, product } =
    await getTutorialListPageProps(productSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(product),
      {
        name: seo?.metaTitle || abstract?.title,
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
      {tutorials && (
        <Box>
          <Newsroom
            items={tutorials.map((tutorial) => ({
              title: tutorial.title,
              date: {
                date: tutorial.publishedAt,
              },
              href: {
                label: 'shared.readTutorial',
                link: tutorial.path,
                translate: true,
              },
              img: tutorial.image
                ? {
                    alt: tutorial.image?.alternativeText || '',
                    src: tutorial.image?.url || '/images/news.png',
                  }
                : undefined,
            }))}
          />
        </Box>
      )}
    </ProductLayout>
  );
};

export default TutorialsPage;
