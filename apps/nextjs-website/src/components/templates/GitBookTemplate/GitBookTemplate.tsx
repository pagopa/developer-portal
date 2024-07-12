'use client';
import { translations } from '@/_contents/translations';
import { ProductGuidePageProps } from '@/app/[productSlug]/guides/[...productGuidePage]/page';
import GuideMenu from '@/components/atoms/GuideMenu/GuideMenu';
import { GuideMenuItemsProps } from '@/components/atoms/GuideMenu/Menu';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { useChatbot } from '@/helpers/chatbot.helper';
import { BreadcrumbSegment } from '@/lib/types/path';
import { Box, Stack } from '@mui/material';

export type GitBookTemplateProps = {
  menuName: string;
  breadcrumbs: BreadcrumbSegment[];
  menuDistanceFromTop?: number;
  contentMarginTop?: number;
  versions?: GuideMenuItemsProps['versions'];
  versionName?: GuideMenuItemsProps['versionName'];
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
}: GitBookTemplateProps) => {
  const { isLoaded } = useChatbot();
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
          <Box sx={{ paddingX: '40px' }}>
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
            padding: { lg: '80px 64px' },
            width: { lg: '270px' },
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              maxWidth: '270px',
              top: 144,
            }}
          >
            <GuideInPageMenu
              assetsPrefix={bodyConfig.assetsPrefix}
              pagePath={path}
              inPageMenu={body}
              title={translations.productGuidePage.onThisPage}
            />
          </Box>
        </Box>
      </Box>
    </FragmentProvider>
  );
};

export default GitBookTemplate;
