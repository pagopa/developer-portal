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
import { PRODUCT_HEADER_HEIGHT, SITE_HEADER_HEIGHT } from '@/config';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { useState } from 'react';

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
  const responsiveContentMarginTop =
    (contentMarginTop && `${contentMarginTop}px`) || 0;

  // Local dynamic state (initialised from server props)
  const [dynamicContent, setDynamicContent] = useState({
    body,
    bodyConfig,
    path,
  });

  // Expose global updater (simple approach without new context plumbing)
  const updateGuideContent = (data: unknown): boolean => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = data as any;
    if (!payload?.page?.body) return false;
    setDynamicContent((prev) => {
      const mergedBodyConfig = {
        ...prev.bodyConfig,
        ...payload.bodyConfig,
        urlReplaces: prev.bodyConfig.urlReplaces,
      };
      return {
        body: payload.page.body,
        bodyConfig: mergedBodyConfig,
        path: payload.page.path ?? prev.path,
      };
    });
    return true;
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
            onGuideNavigate={updateGuideContent}
          />
        )}
        <Stack
          sx={{
            marginTop: responsiveContentMarginTop,
            paddingTop: { xs: '68px', sm: '78px', md: '24px' },
            flexGrow: { lg: 1 },
            maxWidth: {
              xs: '100%',
              lg: '1008px',
            },
            minHeight: '100vh',
          }}
        >
          <Box sx={{ paddingX: '40px' }}>
            <ProductBreadcrumbs breadcrumbs={breadcrumbs} />
          </Box>
          <Box sx={{ padding: '0 40px 32px 40px' }}>
            <GitBookContent
              content={dynamicContent.body}
              config={dynamicContent.bodyConfig}
            />
          </Box>
        </Stack>
        {hasInPageMenu && (
          <Box
            sx={{
              display: { lg: 'none', xl: 'initial' },
              position: 'relative',
              padding: { lg: '0 32px', xl: '0 64px 0 32px' },
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
                assetsPrefix={dynamicContent.bodyConfig.assetsPrefix}
                pagePath={dynamicContent.path}
                inPageMenu={dynamicContent.body}
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
