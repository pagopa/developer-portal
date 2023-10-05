import { Product } from '@/lib/types/product';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getProductsSlugs, getQuickStartGuide } from '@/lib/api';
import React from 'react';
import QuickStartGuideStepper from '@/components/molecules/QuickStartGuideStepper/QuickStartGuideStepper';
import { Step } from '@/lib/types/step';
import { ProductParams } from '@/lib/types/productParams';
import { Metadata, ResolvingMetadata } from 'next';
import { translations } from '@/_contents/translations';

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
} & LayoutProps;

export async function generateMetadata(
  { params }: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { shared } = translations;
  const previousTitle = (await parent).title || shared.siteTitle;
  const { abstract, path, product } = await getQuickStartGuide(
    params?.productSlug
  );
  const title = `${previousTitle} - ${abstract?.title}`;

  return {
    title,
    openGraph: {
      title,
      description: abstract?.description,
      url: path,
      images: product.svgPath,
    },
  };
}

const QuickStartGuidesPage = async ({ params }: ProductParams) => {
  const {
    abstract,
    bannerLinks,
    defaultStepAnchor,
    path,
    product,
    steps,
    products,
  } = await getQuickStartGuide(params?.productSlug);

  return (
    <Layout
      products={products}
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
    </Layout>
  );
};

export default QuickStartGuidesPage;
