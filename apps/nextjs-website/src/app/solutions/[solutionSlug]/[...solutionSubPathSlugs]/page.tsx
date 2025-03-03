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

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const props = await getSolutionDetail(
    params?.solutionSlug,
    params?.solutionSubPathSlugs
  );

  return makeMetadata({
    title: props?.title,
    url: props
      ? `/solutions/${props?.slug}/${params.solutionSubPathSlugs.join('/')}`
      : '',
  });
}

const Page = async ({ params }: { params: Params }) => {
  const solutionProps = await getSolutionDetail(
    params?.solutionSlug,
    params?.solutionSubPathSlugs
  );

  const urlReplaceMap = await getUrlReplaceMapProps();
  if (!solutionProps) {
    return null;
  }

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
          params?.solutionSubPathSlugs &&
          getItemFromPaths([
            'solutions',
            solution.slug,
            ...params.solutionSubPathSlugs,
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
              }/details/${params.solutionSubPathSlugs.join('/')}`,
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
