'use client';
import GuideMenu from '@/components/atoms/GuideMenu/GuideMenu';
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
  pageToBreadcrumbs,
  productPageToBreadcrumbs,
} from '@/helpers/breadcrumbs.helpers';
import { compact } from 'lodash';
import { GitBookContentData } from '@/lib/types/gitBookContent';
import { useParams } from 'next/navigation';

export type GitBookTemplateProps = {
  body: string;
  contentMarginTop?: number;
  hasHeader?: boolean;
  hasInPageMenu?: boolean;
  hasProductHeader?: boolean;
  initialBreadcrumbs: BreadcrumbSegment[];
  menu: string;
  menuDistanceFromTop?: number;
  menuName: string;
  path: string;
  pathPrefix: string;
  versionName?: string;
} & GitBookContentData;

const GitBookTemplate = ({
  menuName,
  body,
  bodyConfig,
  menu,
  path,
  pathPrefix,
  versions,
  initialBreadcrumbs,
  menuDistanceFromTop,
  contentMarginTop,
  hasHeader = true,
  hasInPageMenu = true,
  hasProductHeader = true,
  versionName,
}: GitBookTemplateProps) => {
  const t = useTranslations();
  const locale = useParams<{ locale: string }>().locale;
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
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo({ top: 0 });
    }
  }, [content.path]);

  const updateContent = useCallback(
    (payload: GitBookContentData): boolean => {
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
          body: payload.page?.body || prev.body,
          bodyConfig: mergedBodyConfig,
          path: payload.page?.path ?? prev.path,
          menu: payload.page?.menu ?? prev.menu,
        };
      });

      const buildBreadcrumbs = (segments: readonly BreadcrumbSegment[]) => {
        if (!payload?.product) {
          return segments; // fallback
        }
        return productPageToBreadcrumbs(locale, payload.product, [
          {
            translate: true,
            name: 'devPortal.productHeader.guides',
            path: payload.product.hasGuideListPage
              ? `/${locale}/${payload.product.slug}/guides`
              : `/${locale}`,
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
        const solutionCrumbs = pageToBreadcrumbs(locale, 'solutions', [
          {
            name: payload.solution.title || '',
            path: `/${locale}/solutions/${payload.solution.slug}`,
          },
          {
            name: payload.page.title,
            path: `/${locale}/solutions/${payload.solution.slug}/details/${payload.page?.path}`,
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
      if (payload?.seo) {
        setSeo({
          metaTitle: payload?.seo.metaTitle,
          metaDescription: payload?.seo.metaDescription || '',
          canonical: payload?.page?.path,
        });
      } else {
        const guideTitleBits = compact([
          payload?.guide?.name,
          payload?.version && payload?.version?.name,
          payload?.product?.name,
        ]);
        const solutionTitleBits = compact([payload?.solution?.title]);
        const releaseNoteTitleBits = compact([payload.title]);
        const entityTitle = [
          ...guideTitleBits,
          ...solutionTitleBits,
          ...releaseNoteTitleBits,
        ].join(' ');
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
    },
    [locale]
  );

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
            versions={versions && [...versions]}
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
