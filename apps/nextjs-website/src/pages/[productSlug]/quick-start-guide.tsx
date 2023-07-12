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

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: getQuickStartGuidePaths() as string[],
  fallback: false,
});

export type QuickStartGuidePageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly defaultStepAnchor?: string;
  readonly steps?: ReadonlyArray<Step>;
} & LayoutProps;

export const getStaticProps: GetStaticProps<
  QuickStartGuidePageProps,
  Params
> = ({ params }): GetStaticPropsResult<QuickStartGuidePageProps> => {
  const props = getQuickStartGuide(params?.productSlug);
  if (props) {
    return { props: { ...props, products: [...getProducts()] } };
  } else {
    return { notFound: true as const };
  }
};
const QuickStartGuidesPage = ({
  abstract,
  bannerLinks,
  defaultStepAnchor,
  path,
  product,
  products,
  steps,
}: QuickStartGuidePageProps) => {
  const { palette } = useTheme();

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
          theme={palette.mode}
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
