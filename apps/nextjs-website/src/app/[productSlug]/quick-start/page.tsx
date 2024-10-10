import { Product } from '@/lib/types/product';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { getProduct, getProducts, getQuickStartGuide } from '@/lib/api';
import React from 'react';
import QuickStartGuideStepper from '@/components/molecules/QuickStartGuideStepper/QuickStartGuideStepper';
import { Step } from '@/lib/types/step';
import { ProductParams } from '@/lib/types/productParams';
import { Metadata, ResolvingMetadata } from 'next';
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
  const products = await getProducts();
  return products.map((product) => ({
    productSlug: product.slug,
  }));
}
export type QuickStartGuidePageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly defaultStepAnchor?: string;
  readonly steps?: ReadonlyArray<Step>;
  readonly seo?: SEO;
} & ProductLayoutProps;

export async function generateMetadata(
  { params }: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParent = await parent;
  const { abstract, path, product, seo } = await getQuickStartGuide(
    params?.productSlug
  );

  if (seo) {
    return makeMetadataFromStrapi(seo);
  }

  return makeMetadata({
    parent: resolvedParent,
    title: abstract?.title,
    description: abstract?.description,
    url: path,
    image: product.logo.url,
  });
}

const QuickStartGuidesPage = async ({ params }: ProductParams) => {
  const { abstract, bannerLinks, defaultStepAnchor, path, steps, seo } =
    await getQuickStartGuide(params?.productSlug);

  const product = await getProduct(params.productSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(product),
      {
        name: seo?.metaTitle,
        item: breadcrumbItemByProduct(product, ['quick-start']),
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
