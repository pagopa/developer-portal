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
  readonly updatedAt: string;
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
  props: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const resolvedParent = await parent;
  const tutorialListPage = await getTutorialListPageProps(params.productSlug);

  if (tutorialListPage?.seo) {
    return makeMetadataFromStrapi(tutorialListPage.seo);
  }

  return makeMetadata({
    parent: resolvedParent,
    title: [tutorialListPage?.abstract?.title, tutorialListPage?.product.name]
      .filter(Boolean)
      .join(' | '),
    description: tutorialListPage?.abstract?.description,
    url: tutorialListPage?.path,
    image: tutorialListPage?.product.logo?.url,
  });
}

const TutorialsPage = async (props: ProductParams) => {
  const params = await props.params;
  const { productSlug } = params;
  const tutorialListPage = await getTutorialListPageProps(productSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(params.locale, tutorialListPage?.product),
      {
        name:
          tutorialListPage?.seo?.metaTitle || tutorialListPage?.abstract?.title,
        item: breadcrumbItemByProduct(
          params.locale,
          tutorialListPage?.product,
          ['tutorials']
        ),
      },
    ],
    seo: tutorialListPage?.seo,
  });
  const mappedTutorials = tutorialListPage?.tutorials?.map((tutorial) => {
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
      product={tutorialListPage?.product}
      path={tutorialListPage?.path}
      bannerLinks={tutorialListPage?.bannerLinks}
      showBreadcrumbs
      structuredData={structuredData}
    >
      {tutorialListPage?.abstract && (
        <Abstract
          description={tutorialListPage?.abstract?.description}
          overline=''
          title={tutorialListPage?.abstract?.title}
        />
      )}
      {tutorialListPage?.tutorials && (
        <FilteredGridLayout
          items={mappedTutorials || []}
          tags={tutorialListPage?.product.tags}
          enableFilters={tutorialListPage?.enableFilters}
          noItemsMessageKey={'overview.tutorial.noTutorialMessage'}
        />
      )}
    </ProductLayout>
  );
};

export default TutorialsPage;
