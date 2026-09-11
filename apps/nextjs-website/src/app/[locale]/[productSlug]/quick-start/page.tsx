import { Product } from '@/lib/products/types';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { getQuickStartGuide } from '@/lib/api';
import React from 'react';
import QuickStartGuideStepper from '@/components/molecules/QuickStartGuideStepper/QuickStartGuideStepper';
import type { Step } from '@/lib/quickStartGuides/types';
import type { ProductParams } from '@/lib/products/types';
import { Metadata, ResolvingMetadata } from 'next';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import type { SEO } from '@/lib/seo/types';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import { notFound } from 'next/navigation';

export type QuickStartGuidePageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly updatedAt?: string;
  readonly defaultStepAnchor?: string;
  readonly steps?: ReadonlyArray<Step>;
  readonly seo?: SEO;
} & ProductLayoutProps;

export async function generateMetadata(
  props: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const resolvedParent = await parent;
  const quickStartGuide = await getQuickStartGuide(
    params.locale,
    params.productSlug
  );

  if (!quickStartGuide) {
    notFound();
  }

  const { abstract, path, product, seo } = quickStartGuide;

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

const QuickStartGuidesPage = async (props: ProductParams) => {
  const params = await props.params;
  const quickStartGuide = await getQuickStartGuide(
    params.locale,
    params?.productSlug
  );

  if (!quickStartGuide) {
    notFound();
  }

  const {
    abstract,
    bannerLinks,
    defaultStepAnchor,
    path,
    steps,
    seo,
    product,
  } = quickStartGuide;

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(params.locale, product),
      {
        name: seo?.metaTitle || abstract?.title,
        item: breadcrumbItemByProduct(params.locale, product, ['quick-start']),
      },
    ],
    seo: seo,
  });

  return (
    <ProductLayout
      product={product}
      path={path}
      showBreadcrumbs
      bannerLinks={bannerLinks}
      structuredData={structuredData}
    >
      {abstract && (
        <Abstract
          description={abstract?.description}
          overline=''
          title={abstract?.title}
        />
      )}
      <QuickStartGuideStepper
        defaultStepAnchor={defaultStepAnchor}
        steps={steps}
      />
    </ProductLayout>
  );
};

export default QuickStartGuidesPage;
