import { Product } from '@/lib/types/product';
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { getGuideLists, getGuideListsPaths, getProducts } from '@/lib/api';
import {
  GuidesSection,
  GuidesSectionProps,
} from '@/components/molecules/GuidesSection/GuidesSection';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import { Box, useTheme } from '@mui/material';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: [...getGuideListsPaths()],
  fallback: false,
});

export type GuidesPageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly guidesSections?: GuidesSectionProps[];
} & LayoutProps;

export const getStaticProps: GetStaticProps<GuidesPageProps, Params> = ({
  params,
}): GetStaticPropsResult<GuidesPageProps> => {
  const props = getGuideLists(params?.productSlug);
  if (props) {
    return { props: { ...props, products: getProducts().concat() } };
  } else {
    return { notFound: true as const };
  }
};

const GuidesPage = ({
  abstract,
  guidesSections,
  product,
  products,
  path,
}: GuidesPageProps) => {
  const { palette } = useTheme();

  return (
    <Layout products={products} product={product} path={path}>
      {abstract && (
        <Abstract
          description={abstract?.description}
          overline=''
          title={abstract?.title}
          theme={palette.mode}
        />
      )}
      <Box bgcolor={palette.grey[100]}>
        {guidesSections?.length &&
          guidesSections.map((props, index) => (
            <GuidesSection key={index} {...props}></GuidesSection>
          ))}
      </Box>
    </Layout>
  );
};

export default GuidesPage;
