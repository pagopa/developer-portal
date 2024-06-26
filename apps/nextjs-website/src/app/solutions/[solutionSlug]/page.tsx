import { Box, Stack } from '@mui/material';
import React from 'react';
import GuideMenu from '@/components/atoms/GuideMenu/GuideMenu';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import {
  gitBookPagesWithTitle,
  spaceToPrefixMap,
  urlReplacesMap,
} from '@/_contents/products';
import { translations } from '@/_contents/translations';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { solutionPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { getSolutionsProps } from '@/lib/cmsApi';
import { getSolution } from '@/lib/solutions';
import { Solution } from '@/lib/types/solutionData';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { SITE_HEADER_HEIGHT } from '@/components/molecules/SiteHeader/SiteHeader';

type Params = {
  solutionSlug: string;
};

export async function generateStaticParams() {
  const solutions = await getSolutionsProps();
  return solutions.map(({ solutionSlug }) => ({
    solutionSlug,
  }));
}

export type SolutionDetailsPageProps = {
  solution: Solution;
  bannerLinks: readonly BannerLinkProps[];
  path: string;
  pathPrefix: string;
  isIndex: boolean;
  menu: string;
  body: string;
  bodyConfig: ParseContentConfig;
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const props = await getSolution(params?.solutionSlug);

  return makeMetadata({
    title: props?.solution?.title,
    url: `/solutions/${props?.solution?.slug}`,
  });
}

const Page = async ({ params }: { params: Params }) => {
  const solutionProps = await getSolution(params?.solutionSlug);

  if (!solutionProps) {
    return null;
  }

  const { page, solution, source, bannerLinks } = solutionProps;
  const props: SolutionDetailsPageProps = {
    ...page,
    solution,
    bannerLinks,
    pathPrefix: source.pathPrefix,
    bodyConfig: {
      isPageIndex: page.isIndex,
      pagePath: page.path,
      assetsPrefix: source.assetsPrefix,
      gitBookPagesWithTitle,
      spaceToPrefix: spaceToPrefixMap,
      urlReplaces: urlReplacesMap,
    },
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
                ...solutionPageToBreadcrumbs([
                  {
                    name: solution.title,
                    path: solution.slug,
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

export default Page;
