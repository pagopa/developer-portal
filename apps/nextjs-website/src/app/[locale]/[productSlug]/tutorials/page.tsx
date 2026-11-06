import { Product } from '@/lib/products/types';
import { Metadata, ResolvingMetadata } from 'next';
import { getTutorialListPageProps } from '@/lib/api';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import type { Tutorial } from '@/lib/tutorials/types';
import React from 'react';
import type { ProductParams } from '@/lib/products/types';
import {
  makeHreflangAlternates,
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import type { SEO } from '@/lib/seo/types';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import { FilteredGridLayout } from '@/components/organisms/FilteredGridLayout/FilteredGridLayout';
import { notFound } from 'next/navigation';
import { TutorialListPageRepository } from '@/lib/tutorialListPage';

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
  readonly documentId?: string;
} & ProductLayoutProps;

export async function generateMetadata(
  props: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale, productSlug } = await props.params;
  const resolvedParent = await parent;
  const tutorialListPage = await getTutorialListPageProps(locale, productSlug);

  if (!tutorialListPage) {
    notFound();
  }

  const { abstract, path, product, seo } = tutorialListPage;

  if (seo) {
    const metadata = makeMetadataFromStrapi(seo);

    if (!seo.canonicalURL) {
      return metadata;
    }

    const localizedPaths = await TutorialListPageRepository.getLocalizedPaths(
      locale,
      tutorialListPage
    );

    return {
      ...metadata,
      alternates: {
        ...metadata.alternates,
        ...makeHreflangAlternates(seo.canonicalURL, localizedPaths),
      },
    };
  }

  return makeMetadata({
    parent: resolvedParent,
    title: [abstract?.title, product.name].filter(Boolean).join(' | '),
    description: abstract?.description,
    url: path,
    image: product.logo?.url,
  });
}
const TutorialsPage = async (props: ProductParams) => {
  const { locale, productSlug } = await props.params;
  const tutorialListPage = await getTutorialListPageProps(locale, productSlug);

  if (!tutorialListPage) {
    notFound();
  }

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(locale, tutorialListPage?.product),
      {
        name:
          tutorialListPage?.seo?.metaTitle || tutorialListPage?.abstract?.title,
        item: breadcrumbItemByProduct(locale, tutorialListPage?.product, [
          'tutorials',
        ]),
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
        link: tutorial.redirectPath || tutorial.path,
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
