import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getGuide, getGuidePaths, getProducts } from '@/lib/api';
import { Product } from '@/lib/types/product';
import { renderGitBookMarkdown } from '@/markdoc';
import { GetStaticPaths, GetStaticProps } from 'next/types';
import { Box, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import React, { ReactNode } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { translations } from '@/_contents/translations';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { HashProvider } from '@/components/organisms/HashProvider/HashProvider';

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
      ...props,
      ...props.page,
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

  const { productGuidePage, shared } = translations;

  const guideInPageMenu: ReactNode | null = GuideInPageMenu({
    assetsPrefix: props.assetsPrefix,
    pagePath: props.path,
    inPageMenu: props.body,
  });

  return (
    <Layout
      products={props.products}
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
      showBreadcrumbs={false}
    >
      <HashProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', lg: 'row' },
            maxWidth: '1900px',
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
                color: palette.action.active,
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
              padding: { lg: '0 32px' },
            }}
          >
            <GitBookContent
              assetsPrefix={props.assetsPrefix}
              pagePath={props.path}
              isPageIndex={props.isIndex}
              content={props.body}
            />
          </Box>
          <Box
            sx={{
              display: { xs: 'none', lg: 'initial' },
              position: 'relative',
              minWidth: '240px',
            }}
          >
            <Box sx={{ position: 'sticky', top: 20 }}>
              {guideInPageMenu && (
                <>
                  <Typography
                    color={palette.text.secondary}
                    fontSize={14}
                    fontWeight={700}
                    textTransform={'uppercase'}
                    marginBottom={'18px'}
                  >
                    {productGuidePage.onThisPage}
                  </Typography>
                  {guideInPageMenu}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </HashProvider>
    </Layout>
  );
};

export default Page;
