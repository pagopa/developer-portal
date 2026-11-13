import React from 'react';
import { Metadata } from 'next';
import {
  makeHreflangAlternates,
  makeMetadata,
} from '@/helpers/metadata.helpers';
import { getSolutionDetail } from '@/lib/api';
import GitBookTemplate from '@/components/templates/GitBookTemplate/GitBookTemplate';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { getUrlReplaceMap } from '@/lib/api';
import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';
import { notFound } from 'next/navigation';
import { SolutionRepository } from '@/lib/solutions';

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

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, solutionSlug, solutionSubPathSlugs } = await props.params;

  const solutionDetail = await getSolutionDetail(
    solutionSlug,
    locale,
    solutionSubPathSlugs
  );

  if (!solutionDetail) {
    notFound();
  }

  const metadata = makeMetadata({
    title: solutionDetail.title,
    url: `/${locale}/solutions/${
      solutionDetail.slug
    }/${solutionSubPathSlugs.join('/')}`,
  });

  if (!solutionDetail.seo?.canonicalURL) {
    return metadata;
  }

  const localizedPaths = await SolutionRepository.getLocalizedGitBookPaths(
    locale,
    solutionDetail,
    solutionDetail.page.path
  );

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      ...makeHreflangAlternates(
        solutionDetail.seo.canonicalURL,
        localizedPaths
      ),
    },
  };
}

const Page = async (props: { params: Promise<Params> }) => {
  const { locale, solutionSlug, solutionSubPathSlugs } = await props.params;
  const solutionDetail = await getSolutionDetail(
    solutionSlug,
    locale,
    solutionSubPathSlugs
  );

  if (!solutionDetail) {
    notFound();
  }

  const urlReplaceMap = await getUrlReplaceMap(locale);
  const solution = solutionDetail;
  const page = solution.page;
  const source = solution.source;
  const solutionDetailPageProps: SolutionDetailPageTemplateProps = {
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
        item: getItemFromPaths(locale, ['solutions']),
      },
      {
        name: solution.seo?.metaTitle,
        item: getItemFromPaths(locale, ['solutions', solution.slug]),
      },
      {
        name: page.title,
        item:
          solutionSubPathSlugs &&
          getItemFromPaths(locale, [
            'solutions',
            solution.slug,
            ...solutionSubPathSlugs,
          ]),
      },
    ],
    seo: solution.seo,
  });

  const initialBreadcrumbs = [
    ...pageToBreadcrumbs(locale, 'solutions', [
      {
        name: solutionDetailPageProps.solution.title,
        path: `/${locale}/solutions/${solutionDetailPageProps.solution.slug}`,
      },
      {
        name: page.title,
        path: `/${locale}/solutions/${
          solutionDetailPageProps.solution.slug
        }/details/${solutionSubPathSlugs.join('/')}`,
      },
    ]),
  ];

  return (
    <>
      {structuredData}
      <GitBookTemplate
        hasHeader={false}
        menuName={solutionDetailPageProps.solution.title}
        initialBreadcrumbs={initialBreadcrumbs}
        menuDistanceFromTop={0}
        contentMarginTop={0}
        hasProductHeader={false}
        {...solutionDetailPageProps}
      />
    </>
  );
};

export default Page;
