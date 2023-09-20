import { Product } from '@/lib/types/product';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getProductsSlugs, getQuickStartGuide } from '@/lib/api';
import React from 'react';
import QuickStartGuideStepper from '@/components/molecules/QuickStartGuideStepper/QuickStartGuideStepper';
import { Step } from '@/lib/types/step';
import { ProductParams } from '@/lib/types/productParams';
import { useTranslations } from 'next-intl';

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

const QuickStartGuidesPage = async ({ params }: ProductParams) => {
  const t = useTranslations('GuidesPage');
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
          description={t(abstract?.description)}
          overline=''
          title={t(abstract?.title)}
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
