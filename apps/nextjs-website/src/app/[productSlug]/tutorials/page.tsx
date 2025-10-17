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
import { TutorialsList } from '@/components/organisms/TutorialsList/TutorialsList';
import PageNotFound from '../../not-found';

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

  if (!product.isVisible) {
    return <PageNotFound />;
  }

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
        <TutorialsList
          tags={product.tags || []}
          tutorials={tutorials}
          enableFilters={enableFilters}
        />
      )}
    </ProductLayout>
  );
};

export default TutorialsPage;
