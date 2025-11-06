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
import { useDynamicSeo } from '@/hooks/useDynamicSeo';

export type GitBookTemplateProps = {
  menuName: string;
  initialBreadcrumbs: BreadcrumbSegment[];
  generateBreadcrumbs: (
    segments: readonly { name: string; path: string }[]
  ) => Promise<BreadcrumbSegment[]>;
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
  initialBreadcrumbs,
  generateBreadcrumbs,
  menuDistanceFromTop,
  contentMarginTop,
  hasHeader = true,
  hasInPageMenu = true,
}: GitBookTemplateProps) => {
  const t = useTranslations();
  const responsiveContentMarginTop =
    (contentMarginTop && `${contentMarginTop}px`) || 0;
  const [dynamicContent, setDynamicContent] = useState({
    body,
    bodyConfig,
    path,
    menu,
  });
  const [dynamicBreadcrumbs, setDynamicBreadcrumbs] =
    useState<BreadcrumbSegment[]>(initialBreadcrumbs);
  const [dynamicSeo, setDynamicSeo] = useState<{
    metaTitle?: string;
    metaDescription?: string;
    canonical?: string;
  } | null>(null);

  const updateDynamicContent = (data: unknown): boolean => {
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
        menu: payload.page.menu ?? prev.menu,
      };
    });
    if (payload?.product && payload?.guide) {
      generateBreadcrumbs([
        { name: payload.guide.name, path: payload.guide.path },
      ]).then((guideCrumbs) => setDynamicBreadcrumbs(guideCrumbs));
    }
    if (payload?.solution) {
      generateBreadcrumbs([
        {
          name: payload.page.title,
          path: payload.page.path,
        },
      ]).then((solutionCrumbs) => setDynamicBreadcrumbs(solutionCrumbs));
    }
    // SEO
    const seo = payload?.seo;
    if (seo) {
      setDynamicSeo({
        metaTitle:
          seo.metaTitle || seo.seoTitle || seo.title || seo.metaTitleFallback,
        metaDescription: seo.metaDescription || seo.seoDescription || '',
        canonical: payload?.page?.path || undefined,
      });
    } else {
      const guideTitleBits = [
        payload?.guide?.name,
        payload?.version && !payload?.version?.main && payload?.version?.name,
        payload?.product?.name,
      ].filter(Boolean);
      const solutionTitleBits = [payload?.solution?.title].filter(Boolean);
      const entityTitle =
        guideTitleBits.length > 0
          ? guideTitleBits.join(' ')
          : solutionTitleBits.join(' ');
      const fallbackTitleParts = [
        payload?.page?.title || '',
        entityTitle,
      ].filter(Boolean);
      setDynamicSeo({
        metaTitle: fallbackTitleParts.join(' | '),
        metaDescription: '',
        canonical: payload?.page?.path || undefined,
      });
    }
    if (typeof window !== 'undefined' && payload?.page?.path) {
      if (window.location.pathname !== payload.page.path) {
        window.history.pushState({}, '', payload.page.path);
      }
    }
    return true;
  };

  useDynamicSeo(dynamicSeo);

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
            onGuideNavigate={updateDynamicContent}
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
            <ProductBreadcrumbs breadcrumbs={dynamicBreadcrumbs} />
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
