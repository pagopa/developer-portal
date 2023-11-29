import { Product } from '@/lib/types/product';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { getProductsSlugs, getQuickStartGuide } from '@/lib/api';
import React from 'react';
import QuickStartGuideStepper from '@/components/molecules/QuickStartGuideStepper/QuickStartGuideStepper';
import { Step } from '@/lib/types/step';
import { ProductParams } from '@/lib/types/productParams';
import { Metadata, ResolvingMetadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';

export async function generateStaticParams() {
  return [...getProductsSlugs('quickStart')].map((productSlug) => ({
    productSlug,
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
} & ProductLayoutProps;

export async function generateMetadata(
  { params }: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParent = await parent;
  const { abstract, path, product } = await getQuickStartGuide(
    params?.productSlug
  );

  return makeMetadata({
    parent: resolvedParent,
    title: abstract?.title,
    description: abstract?.description,
    url: path,
    image: product.pngPath,
  });
}

const QuickStartGuidesPage = async ({ params }: ProductParams) => {
  const { abstract, bannerLinks, defaultStepAnchor, path, product, steps } =
    await getQuickStartGuide(params?.productSlug);

  return (
    <ProductLayout
      product={product}
      path={path}
      showBreadcrumbs={false}
      bannerLinks={bannerLinks}
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
