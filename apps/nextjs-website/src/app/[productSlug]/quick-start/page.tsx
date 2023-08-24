import { Product } from '@/lib/types/product';
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import { useTheme } from '@mui/material';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import {
  getProducts,
  getQuickStartGuide,
  getQuickStartGuidePaths,
} from '@/lib/api';
import React from 'react';
import QuickStartGuideStepper from '@/components/molecules/QuickStartGuideStepper/QuickStartGuideStepper';
import { Step } from '@/lib/types/step';
import { useRouter } from 'next/navigation';

type Params = {
  productSlug: string;
};

// export const getStaticPaths: GetStaticPaths<Params> = () => ({
//   paths: [...getQuickStartGuidePaths()],
//   fallback: false,
// });

export type QuickStartGuidePageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly defaultStepAnchor?: string;
  readonly steps?: ReadonlyArray<Step>;
} & LayoutProps;

const QuickStartGuidesPage = ({ params }: any) => {
  const { productSlug } = params;
  const products = [...getProducts()];

  const { abstract, bannerLinks, defaultStepAnchor, path, product, steps } =
    getQuickStartGuide(productSlug) as any;

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
