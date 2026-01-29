import { Product } from '@/lib/types/product';
import { Metadata, ResolvingMetadata } from 'next';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
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
import { UseCase } from '@/lib/types/useCaseData';
import { getUseCaseListPageProps } from '@/lib/api';
import { FilteredGridLayout } from '@/components/organisms/FilteredGridLayout/FilteredGridLayout';

export type UseCasesPageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly useCases: readonly UseCase[];
  readonly seo?: SEO;
  readonly enableFilters: boolean | undefined;
} & ProductLayoutProps;

export async function generateMetadata(
  props: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const resolvedParent = await parent;
  const { product, abstract, path, seo } = await getUseCaseListPageProps(
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

const UseCasesPage = async (props: ProductParams) => {
  const params = await props.params;
  const { productSlug } = params;
  const { abstract, bannerLinks, path, useCases, seo, product, enableFilters } =
    await getUseCaseListPageProps(productSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(params.locale, product),
      {
        name: seo?.metaTitle || abstract?.title,
        item: breadcrumbItemByProduct(params.locale, product, ['use-cases']),
      },
    ],
    seo: seo,
  });

  const mappedUseCases = useCases.map((useCase) => {
    return {
      tags: useCase.tags || [],
      title: useCase.title,
      date: {
        date: useCase.publishedAt,
      },
      href: {
        label: 'shared.readUseCase',
        link: useCase.path,
        translate: true,
      },
      img: {
        alt: useCase.coverImage?.alternativeText || '',
        src: useCase.coverImage?.url || '/images/news.png',
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
      {useCases && (
        <FilteredGridLayout
          items={mappedUseCases}
          tags={product.tags}
          enableFilters={enableFilters}
          noItemsMessageKey={'overview.useCases.noUseCaseMessage'}
        />
      )}
    </ProductLayout>
  );
};

export default UseCasesPage;
