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
import PageNotFound from '@/app/[locale]/not-found';

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
  locale: string;
  solutionSlug: string;
  solutionSubPathSlugs: string[];
};
export const dynamic = 'force-dynamic';

export async function generateMetadata(props0: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const params = await props0.params;
  const props = await getSolutionDetail(
    params?.solutionSlug,
    params?.locale,
    params?.solutionSubPathSlugs
  );

  return makeMetadata({
    title: props?.title,
    url: props
      ? `/${params.locale}/solutions/${
          props?.slug
        }/${params.solutionSubPathSlugs.join('/')}`
      : `/${params.locale}`,
  });
}

const Page = async (props0: { params: Promise<Params> }) => {
  const params = await props0.params;
  const solutionProps = await getSolutionDetail(
    params?.solutionSlug,
    params?.locale,
    params?.solutionSubPathSlugs
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
        item: getItemFromPaths(params.locale, ['solutions']),
      },
      {
        name: solution.seo?.metaTitle,
        item: getItemFromPaths(params.locale, ['solutions', solution.slug]),
      },
      {
        name: page.title,
        item:
          params?.solutionSubPathSlugs &&
          getItemFromPaths(params.locale, [
            'solutions',
            solution.slug,
            ...params.solutionSubPathSlugs,
          ]),
      },
    ],
    seo: solution.seo,
  });

  const initialBreadcrumbs = [
    ...pageToBreadcrumbs(params.locale, 'solutions', [
      {
        name: props.solution.title,
        path: `/${params.locale}/solutions/${props.solution.slug}`,
      },
      {
        name: page.title,
        path: `/${params.locale}/solutions/${
          props.solution.slug
        }/details/${params.solutionSubPathSlugs.join('/')}`,
      },
    ]),
  ];

  return (
    <>
      {structuredData}
      <GitBookTemplate
        hasHeader={false}
        menuName={props.solution.title}
        initialBreadcrumbs={initialBreadcrumbs}
        menuDistanceFromTop={0}
        contentMarginTop={0}
        hasProductHeader={false}
        {...props}
      />
    </>
  );
};

export default Page;
