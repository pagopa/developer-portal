import { Product } from '@/lib/types/product';
import { Metadata, ResolvingMetadata } from 'next';
import { getTutorialListPageProps } from '@/lib/api';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { Tutorial } from '@/lib/types/tutorialData';
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
import { FilteredGridLayout } from '@/components/organisms/FilteredGridLayout/FilteredGridLayout';

export type TutorialsPageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly tutorials: readonly Tutorial[];
  readonly seo?: SEO;
  readonly enableFilters?: boolean;
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
    title: [abstract?.title, product.name].filter(Boolean).join(' | '),
    description: abstract?.description,
    url: path,
    image: product.logo?.url,
  });
}

const TutorialsPage = async ({ params }: ProductParams) => {
  const { productSlug } = params;
  const {
    abstract,
    bannerLinks,
    path,
    tutorials,
    seo,
    product,
    enableFilters,
  } = await getTutorialListPageProps(productSlug);

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
  const mappedTutorials = tutorials.map((tutorial) => {
    return {
      tags: tutorial.tags || [],
      title: tutorial.title,
      date: {
        date: tutorial.publishedAt,
      },
      href: {
        label: 'shared.readTutorial',
        link: tutorial.path,
        translate: true,
      },
      img: {
        alt: tutorial.image?.alternativeText || '',
        src: tutorial.image?.url || '/images/news.png',
      },
    };
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
        <FilteredGridLayout
          items={mappedTutorials}
          tags={product.tags}
          enableFilters={enableFilters}
          noItemsMessageKey={'overview.tutorial.noTutorialMessage'}
        />
      )}
    </ProductLayout>
  );
};

export default TutorialsPage;
