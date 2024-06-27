'use client';
import React from 'react';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { Box, Stack } from '@mui/material';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import GuideMenu from '@/components/atoms/GuideMenu/GuideMenu';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { Solution } from '@/lib/types/solutionData';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { translations } from '@/_contents/translations';

export type SolutionDetailsPageTemplateProps = {
  solution: Solution;
  bannerLinks: readonly BannerLinkProps[];
  path: string;
  pathPrefix: string;
  isIndex: boolean;
  menu: string;
  body: string;
  bodyConfig: ParseContentConfig;
};

const SolutionDetailsPageTemplate = (
  props: SolutionDetailsPageTemplateProps
) => {
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
        <GuideMenu
          menu={props.menu}
          assetsPrefix={props.bodyConfig.assetsPrefix}
          linkPrefix={props.pathPrefix}
          guideName={props.solution.title}
          productHeaderHeight={0}
        />
        <Stack
          sx={{
            margin: `auto`,
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
              breadcrumbs={[
                ...pageToBreadcrumbs('solutions', [
                  {
                    name: props.solution.title,
                    path: props.solution.slug,
                  },
                ]),
              ]}
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
};

export default SolutionDetailsPageTemplate;
