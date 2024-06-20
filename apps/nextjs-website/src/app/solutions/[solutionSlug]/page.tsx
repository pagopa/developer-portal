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

type Params = {
  solutionSlug: string;
};

export async function generateStaticParams() {
  const solutions = await getSolutionsProps();
  return solutions.map(({ slug }) => ({
    solutionSlug: slug,
  }));
}

export type SolutionDetailsPageProps = {
  solution: { name: string; path: string };
  path: string;
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const {
    page: { path, title },
  } = await getSolution(params?.solutionSlug);

  return makeMetadata({
    title,
    url: path,
  });
}

const Page = async ({ params }: { params: Params }) => {
  const solutionProps = await getSolution(params?.solutionSlug);

  const { page, solution, version, versions, source, bannerLinks } =
    solutionProps;
  const props: SolutionDetailsPageProps = {
    ...page,
    solution,
    version,
    versions: Array.from(versions),
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
          guideName={props.solution.name}
        />
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
              breadcrumbs={[
                ...solutionPageToBreadcrumbs([
                  {
                    name: solution.name,
                    path: solution.path,
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
