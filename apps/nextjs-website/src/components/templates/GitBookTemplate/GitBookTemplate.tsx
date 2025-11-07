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
import { useState, useEffect, useCallback } from 'react';
import { useDynamicSeo } from '@/hooks/useDynamicSeo';
import {
  gitBookPageToBreadcrumbs,
  productPageToBreadcrumbs,
} from '@/helpers/breadcrumbs.helpers';

export type GitBookTemplateProps = {
  menuName: string;
  initialBreadcrumbs: BreadcrumbSegment[];
  menuDistanceFromTop?: number;
  contentMarginTop?: number;
  versions?: GuideMenuItemsProps['versions'];
  versionName?: GuideMenuItemsProps['versionName'];
  hasHeader?: boolean;
  hasInPageMenu?: boolean;
  hasProductHeader?: boolean;
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
  menuDistanceFromTop,
  contentMarginTop,
  hasHeader = true,
  hasInPageMenu = true,
  hasProductHeader = true,
}: GitBookTemplateProps) => {
  const t = useTranslations();
  const responsiveContentMarginTop =
    (contentMarginTop && `${contentMarginTop}px`) || 0;
  const [content, setContent] = useState({
    body,
    bodyConfig,
    path,
    menu,
  });
  const [breadcrumbs, setBreadcrumbs] =
    useState<BreadcrumbSegment[]>(initialBreadcrumbs);
  const [seo, setSeo] = useState<{
    metaTitle?: string;
    metaDescription?: string;
    canonical?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0 });
    }
  }, [content.path]);

  const updateContent = useCallback((data: unknown): boolean => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = data as any;
    if (!payload?.page?.body) {
      return false;
    }

    setContent((prev) => {
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

    const buildBreadcrumbs = (segments: readonly BreadcrumbSegment[]) => {
      if (!payload?.product) {
        return segments; // fallback
      }
      return productPageToBreadcrumbs(payload.product, [
        {
          translate: true,
          name: 'devPortal.productHeader.guides',
          path: payload.product.hasGuideListPage
            ? `/${payload.product.slug}/guides`
            : '/',
        },
        ...segments,
      ]);
    };

    // Dynamic breadcrumbs cases
    if (payload?.product && payload?.guide) {
      const guideCrumbs = buildBreadcrumbs([
        { name: payload.guide.name, path: payload.guide.path },
      ]);
      setBreadcrumbs([...guideCrumbs]);
    } else if (payload?.solution) {
      const solutionCrumbs = buildBreadcrumbs([
        {
          name: payload.page.title,
          path: payload.page.path,
        },
      ]);
      setBreadcrumbs([...solutionCrumbs]);
    } else if (!payload?.guide && !payload?.solution && payload?.title) {
      const isReleaseNote = (payload.page?.path || '').includes(
        '/release-note'
      );
      if (isReleaseNote && payload.bodyConfig) {
        const gbPageSegments = gitBookPageToBreadcrumbs(
          payload.bodyConfig.pagePath,
          payload.bodyConfig.gitBookPagesWithTitle
        );
        const rnCrumbs = buildBreadcrumbs(gbPageSegments);
        setBreadcrumbs([...rnCrumbs]);
      }
    }

    // SEO
    const seo = payload?.seo;
    if (seo) {
      setSeo({
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
      const releaseNoteTitleBits =
        !payload?.guide && !payload?.solution && payload?.title
          ? [payload.title]
          : [];
      const entityTitle =
        guideTitleBits.length > 0
          ? guideTitleBits.join(' ')
          : solutionTitleBits.length > 0
          ? solutionTitleBits.join(' ')
          : releaseNoteTitleBits.join(' ');
      const fallbackTitleParts = [
        payload?.page?.title || '',
        entityTitle,
      ].filter(Boolean);
      setSeo({
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
  }, []);

  useDynamicSeo(seo);

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
            key='menu'
            hasHeader={hasHeader}
            menu={menu}
            assetsPrefix={bodyConfig.assetsPrefix}
            linkPrefix={pathPrefix}
            name={menuName}
            versionName={versionName}
            versions={versions}
            distanceFromTop={menuDistanceFromTop}
            onGuideNavigate={updateContent}
            hasProductHeader={hasProductHeader}
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
              content={content.body}
              config={content.bodyConfig}
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
                top:
                  SITE_HEADER_HEIGHT +
                  (hasProductHeader ? PRODUCT_HEADER_HEIGHT : 0),
              }}
            >
              <GuideInPageMenu
                assetsPrefix={content.bodyConfig.assetsPrefix}
                pagePath={content.path}
                inPageMenu={content.body}
                title={t('productGuidePage.onThisPage')}
                hasProductHeader={hasProductHeader}
              />
            </Box>
          </Box>
        )}
      </Box>
    </FragmentProvider>
  );
};

export default GitBookTemplate;
