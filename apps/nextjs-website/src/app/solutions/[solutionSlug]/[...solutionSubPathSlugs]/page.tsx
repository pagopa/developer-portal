import React from 'react';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { getSolutionDetail } from '@/lib/api';
import GitBookTemplate from '@/components/templates/GitBookTemplate/GitBookTemplate';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { getUrlReplaceMapProps } from '@/lib/cmsApi';
import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';
import PageNotFound from '@/app/not-found';
import { getSolutionsMetadata } from '@/helpers/s3Metadata.helpers';

type SolutionDetailPageTemplateProps = {
  solution: SolutionTemplateProps;
  path: string;
  pathPrefix: string;
  isIndex: boolean;
  menu: string;
  body: string;
  bodyConfig: ParseContentConfig;
};

type Params = {
  solutionSlug: string;
  solutionSubPathSlugs: string[];
};
// TODO: remove when solutions metadata will be managed in strapi
export const revalidate = 3600;

const SOLUTION_SLUG_PATH_INDEX = 2;
const SOLUTION_SUB_PATH_INDEX = 3;
export async function generateStaticParams(): Promise<Params[]> {
  const solutions = await getSolutionsMetadata();
  const solutionParams = solutions
    .map(({ path }) => path.split('/'))
    .filter((paths) => paths.length > SOLUTION_SUB_PATH_INDEX)
    .map((paths) => {
      return {
        solutionSlug: paths[SOLUTION_SLUG_PATH_INDEX],
        solutionSubPathSlugs: paths.slice(SOLUTION_SUB_PATH_INDEX),
      };
    });
  return solutionParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const props = await getSolutionDetail(
    resolvedParams?.solutionSlug,
    resolvedParams?.solutionSubPathSlugs,
  );

  return makeMetadata({
    title: props?.title,
    url: props
      ? `/solutions/${props?.slug}/${resolvedParams.solutionSubPathSlugs.join(
          '/',
        )}`
      : '',
  });
}

const Page = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params;
  const solutionProps = await getSolutionDetail(
    resolvedParams?.solutionSlug,
    resolvedParams?.solutionSubPathSlugs,
  );

  if (!solutionProps) {
    return <PageNotFound />;
  }

  const urlReplaceMap = await getUrlReplaceMapProps();
  const solution = solutionProps;
  const page = solution.page;
  const source = solution.source;
  const props: SolutionDetailPageTemplateProps = {
    ...solution.page,
    solution,
    pathPrefix: source.pathPrefix,
    bodyConfig: {
      isPageIndex: page.isIndex,
      pagePath: page.path,
      assetsPrefix: source.assetsPrefix,
      urlReplaces: urlReplaceMap,
      gitBookPagesWithTitle: [],
      spaceToPrefix: [],
    },
  };

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: 'Solutions',
        item: getItemFromPaths(['solutions']),
      },
      {
        name: solution.seo?.metaTitle,
        item: getItemFromPaths(['solutions', solution.slug]),
      },
      {
        name: page.title,
        item:
          resolvedParams?.solutionSubPathSlugs &&
          getItemFromPaths([
            'solutions',
            solution.slug,
            ...resolvedParams.solutionSubPathSlugs,
          ]),
      },
    ],
    seo: solution.seo,
  });

  return (
    <>
      {structuredData}
      <GitBookTemplate
        hasHeader={false}
        menuName={props.solution.title}
        breadcrumbs={[
          ...pageToBreadcrumbs('solutions', [
            {
              name: props.solution.title,
              path: `/solutions/${props.solution.slug}`,
            },
            {
              name: page.title,
              path: `/solutions/${
                props.solution.slug
              }/details/${resolvedParams.solutionSubPathSlugs.join('/')}`,
            },
          ]),
        ]}
        menuDistanceFromTop={0}
        contentMarginTop={0}
        {...props}
      />
    </>
  );
};

export default Page;
