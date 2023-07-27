import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getGuide, getGuidePaths, getProducts } from '@/lib/api';
import { Product } from '@/lib/types/product';
import { renderGitBookMarkdown } from '@/markdoc';
import { GetStaticPaths, GetStaticProps } from 'next/types';
import { Box, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import React from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { translations } from '@/_contents/translations';
import GuideMenu from '@/components/atoms/GuideMenu/GuideMenu';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';

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
  guide: { name: string; path: string };
  version: {
    name: string;
    path: string;
  };
  versions: {
    name: string;
    path: string;
  }[];
  path: string;
  pathPrefix: string;
  assetsPrefix: string;
  isIndex: boolean;
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
      guide: props.guide,
      version: props.version,
      versions: props.versions,
      pathPrefix: props.source.pathPrefix,
      assetsPrefix: props.source.assetsPrefix,
      products: getProducts().concat(),
      bannerLinks: props.bannerLinks,
    };
    return { props: page };
  } else {
    return { notFound: true as const };
  }
};

const Page = (props: ProductGuidePageProps) => {
  const { palette } = useTheme();
  const { shared } = translations;

  return (
    <Layout
      products={props.products}
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
      showBreadcrumbs={false}
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
            padding: '80px 0',
            flexBasis: { lg: '354px' },
            flexGrow: { lg: 0 },
            flexShrink: { lg: 0 },
          }}
        >
          <Typography
            variant='h6'
            sx={{
              padding: '16px 32px',
              verticalAlign: 'middle',
            }}
          >
            {props.guide.name}
          </Typography>
          <Dropdown
            label={`${shared.version} ${props.version.name}`}
            items={props.versions.map((version) => ({
              href: version.path,
              label: version.name,
            }))}
            icons={{ opened: <ExpandLess />, closed: <ExpandMore /> }}
            buttonStyle={{
              color: '#5C6F82',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px 32px',
            }}
            menuStyle={{
              style: {
                width: '354px',
                maxWidth: '354px',
                left: 0,
                right: 0,
              },
            }}
            menuAnchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          />
          <Box
            sx={{
              margin: '32px 0 0 0',
            }}
          >
            <GuideMenu
              linkPrefix={props.pathPrefix}
              assetsPrefix={props.assetsPrefix}
              menu={props.menu}
            />
            {renderGitBookMarkdown(
              props.menu,
              props.pathPrefix,
              props.assetsPrefix,
              true
            )}
          </Box>
        </Box>
        <Box sx={{ padding: { xs: '80px 40px', lg: '80px 438px 80px 40px' } }}>
          <GitBookContent
            assetsPrefix={props.assetsPrefix}
            pagePath={props.path}
            isPageIndex={props.isIndex}
            content={props.body}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default Page;
