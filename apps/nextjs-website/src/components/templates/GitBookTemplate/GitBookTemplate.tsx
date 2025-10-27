'use client';
import { ProductGuidePageProps } from '@/app/[productSlug]/guides/[...productGuidePage]/page';
import GuideMenu from '@/components/atoms/GuideMenu/GuideMenu';
import { GuideMenuItemsProps } from '@/components/atoms/GuideMenu/Menu';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { BreadcrumbSegment } from '@/lib/types/path';
import { Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { SITE_HEADER_HEIGHT } from '../../molecules/SiteHeader/SiteHeader';
import { PRODUCT_HEADER_HEIGHT } from '../../atoms/ProductHeader/ProductHeader';

export type GitBookTemplateProps = {
  menuName: string;
  breadcrumbs: BreadcrumbSegment[];
  menuDistanceFromTop?: number;
  contentMarginTop?: number;
  versions?: GuideMenuItemsProps['versions'];
  versionName?: GuideMenuItemsProps['versionName'];
  hasHeader?: boolean;
  hasInPageMenu?: boolean;
} & Pick<
  ProductGuidePageProps,
  'menu' | 'body' | 'bodyConfig' | 'path' | 'pathPrefix'
>;

const GitBookTemplate = ({
  menuName,
  body,
  bodyConfig,
  menu,
  path,
  pathPrefix,
  versionName,
  versions,
  breadcrumbs,
  menuDistanceFromTop,
  contentMarginTop,
  hasHeader = true,
  hasInPageMenu = true,
}: GitBookTemplateProps) => {
  const t = useTranslations();
  const paddingTop = hasHeader ? '60px' : '-80px';
  const responsiveContentMarginTop = (contentMarginTop &&
    `${contentMarginTop}px`) || {
    xs: '30px',
    md: '60px',
  };

  return (
    <FragmentProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          margin: '0 auto',
          maxWidth: '1900px',
        }}
      >
        {menu && (
          <GuideMenu
            hasHeader={hasHeader}
            menu={menu}
            assetsPrefix={bodyConfig.assetsPrefix}
            linkPrefix={pathPrefix}
            name={menuName}
            versionName={versionName}
            versions={versions}
            distanceFromTop={menuDistanceFromTop}
          />
        )}
        <Stack
          sx={{
            marginTop: responsiveContentMarginTop,
            paddingTop: 3,
            flexGrow: { lg: 1 },
            maxWidth: {
              xs: '100%',
              lg: '1008px',
            },
            minHeight: '100vh',
          }}
        >
          <Box sx={{ paddingTop: paddingTop, paddingX: '40px' }}>
            <ProductBreadcrumbs breadcrumbs={breadcrumbs} />
          </Box>
          <Box sx={{ padding: '32px 40px' }}>
            <GitBookContent content={body} config={bodyConfig} />
          </Box>
        </Stack>
        {hasInPageMenu && (
          <Box
            sx={{
              display: { xs: 'none', lg: 'initial' },
              position: 'relative',
              padding: { lg: '0px 64px' },
              width: { lg: '378px' },
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                maxWidth: '378px',
                top: SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT,
              }}
            >
              <GuideInPageMenu
                assetsPrefix={bodyConfig.assetsPrefix}
                pagePath={path}
                inPageMenu={body}
                title={t('productGuidePage.onThisPage')}
              />
            </Box>
          </Box>
        )}
      </Box>
    </FragmentProvider>
  );
};

export default GitBookTemplate;
