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
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import { gitBookPagesWithTitle } from '@/_contents/products';
import { PageTitlePath } from 'gitbook-docs/parseDoc';

type Params = {
  productSlug: string;
  productGuidePage: Array<string>;
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: [...getGuidePaths()],
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
  gitBookPagesWithTitle: ReadonlyArray<PageTitlePath>;
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
      ...props,
      ...props.page,
      pathPrefix: props.source.pathPrefix,
      assetsPrefix: props.source.assetsPrefix,
      products: [...getProducts()],
      gitBookPagesWithTitle,
    };
    return { props: page };
  } else {
    return { notFound: true as const };
  }
};

const Page = (props: ProductGuidePageProps) => {
  const { palette } = useTheme();
  const { productGuidePage, shared } = translations;

  return (
    <Layout
      products={props.products}
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
      showBreadcrumbs={false}
    >
      <FragmentProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', lg: 'row' },
            margin: '0 auto',
            maxWidth: '1900px',
          }}
        >
          <Box
            bgcolor={palette.grey[50]}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '80px 0',
              width: { lg: '347px' },
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
                color: palette.action.active,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 32px',
              }}
              menuStyle={{
                style: {
                  width: '347px',
                  maxWidth: '347px',
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
              {renderGitBookMarkdown(
                props.menu,
                props.pathPrefix,
                props.assetsPrefix,
                true
              )}
            </Box>
          </Box>
          <Box
            sx={{
              margin: '0 auto',
              maxWidth: '1008px',
              padding: '56px 40px',
              flexGrow: { lg: 1 },
            }}
          >
            <GitBookContent
              assetsPrefix={props.assetsPrefix}
              pagePath={props.path}
              isPageIndex={props.isIndex}
              content={props.body}
              gitBookPagesWithTitle={props.gitBookPagesWithTitle}
            />
          </Box>
          <Box
            sx={{
              display: { xs: 'none', lg: 'initial' },
              position: 'relative',
              padding: { lg: '80px 64px' },
              width: { lg: '270px' },
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                maxWidth: '270px',
                top: 20,
              }}
            >
              <GuideInPageMenu
                assetsPrefix={props.assetsPrefix}
                pagePath={props.path}
                inPageMenu={props.body}
                title={productGuidePage.onThisPage}
              />
            </Box>
          </Box>
        </Box>
      </FragmentProvider>
    </Layout>
  );
};

export default Page;
