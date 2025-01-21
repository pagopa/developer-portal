'use client';
import { ProductGuidePageProps } from '@/app/[productSlug]/guides/[...productGuidePage]/page';
import GuideMenu from '@/components/atoms/GuideMenu/GuideMenu';
import { GuideMenuItemsProps } from '@/components/atoms/GuideMenu/Menu';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { BreadcrumbSegment } from '@/lib/types/path';
import { Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

export type GitBookTemplateProps = {
  menuName: string;
  breadcrumbs: BreadcrumbSegment[];
  menuDistanceFromTop?: number;
  contentMarginTop?: number;
  versions?: GuideMenuItemsProps['versions'];
  versionName?: GuideMenuItemsProps['versionName'];
  hasHeader?: boolean;
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
  contentMarginTop = 75,
  hasHeader = true,
}: GitBookTemplateProps) => {
  const t = useTranslations();
  const paddingTop = hasHeader ? '60px' : '-80px';

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
            margin: `${contentMarginTop} auto`,
            paddingTop: 3,
            flexGrow: { lg: 1 },
            maxWidth: {
              xs: '100%',
              lg: '1008px',
            },
          }}
        >
          <Box sx={{ paddingTop: paddingTop, paddingX: '40px' }}>
            <ProductBreadcrumbs breadcrumbs={breadcrumbs} />
          </Box>
          <Box sx={{ padding: '32px 40px' }}>
            <GitBookContent content={body} config={bodyConfig} />
          </Box>
        </Stack>
        <Box
          sx={{
            display: { xs: 'none', lg: 'initial' },
            position: 'relative',
            padding: { lg: hasHeader ? '80px 64px' : '48px 64px' },
            width: { lg: '378px' },
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              maxWidth: '378px',
              top: hasHeader ? 144 : 64,
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
      </Box>
    </FragmentProvider>
  );
};

export default GitBookTemplate;
