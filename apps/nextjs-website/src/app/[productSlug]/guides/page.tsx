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

// export const getStaticPaths: GetStaticPaths<Params> = () => ({
//   paths: [...getGuideListsPaths()],
//   fallback: false,
// });

export type GuidesPageProps = any;

const GuidesPage = ({ params }: any) => {
  const { productSlug } = params;
  const props = getGuideLists(productSlug);

  const products = [...getProducts()];
  const { abstract, bannerLinks, guidesSections, path, product } = props as any;

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
      <Box>
        {guidesSections?.length &&
          guidesSections.map((props: any, index: any) => (
            <GuidesSection key={index} {...props}></GuidesSection>
          ))}
      </Box>
    </Layout>
  );
};

export default GuidesPage;
