'use client';
import { translations } from '@/_contents/translations';
import { ProductGuidePageProps } from '@/app/[productSlug]/guides/[...productGuidePage]/page';
import GuideMenu from '@/components/atoms/GuideMenu/GuideMenu';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import ProductLayout from '@/components/organisms/ProductLayout/ProductLayout';
import {
  productPageToBreadcrumbs,
  solutionPageToBreadcrumbs,
} from '@/helpers/breadcrumbs.helpers';
import { Box, Stack } from '@mui/material';

type SolutionDetailPageProps = Pick<
  ProductGuidePageProps,
  'menu' | 'body' | 'bodyConfig' | 'path' | 'bannerLinks' | 'pathPrefix'
> & { solution: { name: string }; version: undefined; versions: undefined };

type GitBookTemplateProps = (
  | ProductGuidePageProps
  | SolutionDetailPageProps
) & { isProductPage: boolean };

const GitBookTemplate = ({ isProductPage, ...rest }: GitBookTemplateProps) => {
  const props = isProductPage
    ? (rest as ProductGuidePageProps)
    : (rest as SolutionDetailPageProps);

  const content = (
    <FragmentProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          margin: '0 auto',
          maxWidth: '1900px',
        }}
      >
        {props.menu && (
          <GuideMenu
            menu={props.menu}
            assetsPrefix={props.bodyConfig.assetsPrefix}
            linkPrefix={props.pathPrefix}
            name={
              isProductPage
                ? (props as ProductGuidePageProps).guide.name
                : (props as SolutionDetailPageProps).solution.name
            }
            versionName={props.version?.name}
            versions={props.versions}
          />
        )}
        <Stack
          sx={{
            margin: `75px auto`,
            paddingTop: 3,
            flexGrow: { lg: 1 },
            maxWidth: {
              xs: '100%',
              lg: '1008px',
            },
          }}
        >
          <Box sx={{ paddingX: '40px' }}>
            <ProductBreadcrumbs
              breadcrumbs={
                isProductPage
                  ? [
                      ...productPageToBreadcrumbs(
                        (props as ProductGuidePageProps).product,
                        props.path,
                        [
                          {
                            name: (props as ProductGuidePageProps).guide.name,
                            path: props.path,
                          },
                        ]
                      ),
                    ]
                  : [
                      ...solutionPageToBreadcrumbs([
                        {
                          name: (props as SolutionDetailPageProps).solution
                            .name,
                          path: props.path,
                        },
                      ]),
                    ]
              }
            />
          </Box>
          <Box sx={{ padding: '32px 40px' }}>
            <GitBookContent content={props.body} config={props.bodyConfig} />
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
              assetsPrefix={props.bodyConfig.assetsPrefix}
              pagePath={props.path}
              inPageMenu={props.body}
              title={translations.productGuidePage.onThisPage}
            />
          </Box>
        </Box>
      </Box>
    </FragmentProvider>
  );

  return isProductPage ? (
    <ProductLayout
      product={(props as ProductGuidePageProps).product}
      path={props.path}
      bannerLinks={props.bannerLinks}
    >
      {content}
    </ProductLayout>
  ) : (
    content
  );
};

export default GitBookTemplate;
