import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getGuide, getGuidePaths, getProducts } from '@/lib/api';
import { Product } from '@/lib/types/product';
import { renderGitBookMarkdown } from '@/markdoc';
import { GetStaticPaths, GetStaticProps } from 'next/types';
import { Box, useTheme } from '@mui/material';

type Params = {
  productSlug: string;
  productGuidePage: Array<string>;
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: getGuidePaths() as string[],
    fallback: false,
  };
};

type ProductGuidePageProps = {
  product: Product;
  path: string;
  pathPrefix: string;
  assetsPrefix: string;
  menu: string;
  body: string;
} & LayoutProps;

export const getStaticProps: GetStaticProps<ProductGuidePageProps, Params> = ({
  params,
}) => {
  const productSlug = params?.productSlug;
  const guidePath = params?.productGuidePage.join('/');
  const path = `/${productSlug}/guides/${guidePath}`;
  const props = getGuide(path);
  if (props) {
    const page = {
      ...props.page,
      product: props.product,
      pathPrefix: props.source.pathPrefix,
      assetsPrefix: props.source.assetsPrefix,
      products: getProducts().concat(),
    };
    return { props: page };
  } else {
    return { notFound: true as const };
  }
};

const Page = (props: ProductGuidePageProps) => {
  const { palette } = useTheme();

  return (
    <Layout
      products={props.products}
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', lg: 'row' },
        }}
      >
        <Box
          bgcolor={palette.grey[50]}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 0',
            flexBasis: { lg: '354px' },
            flexGrow: { lg: 0 },
            flexShrink: { lg: 0 },
          }}
        >
          {renderGitBookMarkdown(
            props.menu,
            props.pathPrefix,
            props.assetsPrefix,
            true
          )}
        </Box>
        <Box sx={{ padding: { xs: '80px 40px', lg: '80px 438px 80px 40px' } }}>
          {renderGitBookMarkdown(
            props.body,
            props.pathPrefix,
            props.assetsPrefix
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default Page;
