import React from 'react';
import {
  gitBookPagesWithTitle,
  spaceToPrefixMap,
  urlReplacesMap,
} from '@/_contents/products';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { getSolution } from '@/lib/solutions';
import GitBookTemplate from '@/components/templates/GitBookTemplate/GitBookTemplate';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { Solution } from '@/lib/types/solution';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { getDetailSolutionsProps } from '@/lib/cmsApi';

type SolutionDetailsPageTemplateProps = {
  solution: Solution;
  path: string;
  pathPrefix: string;
  isIndex: boolean;
  menu: string;
  body: string;
  bodyConfig: ParseContentConfig;
};

type Params = {
  solutionSlug: string;
  solutionDetailsPage: Array<string>;
};

export async function generateStaticParams() {
  const solutions = await getDetailSolutionsProps();
  return solutions.map(({ solutionSlug }) => ({
    solutionSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const props = await getSolution(
    params?.solutionSlug,
    params?.solutionDetailsPage ?? ['']
  );

  return (
    {} ||
    makeMetadata({
      title: props?.solution.title,
      url: props
        ? `/solutions/${
            props?.solution.slug
          }/details/${params.solutionDetailsPage.join('/')}`
        : '',
    })
  );
}

const Page = async ({ params }: { params: Params }) => {
  const solutionProps = await getSolution(params?.solutionSlug);

  if (!solutionProps) {
    return null;
  }

  const { page, solution, source } = solutionProps;
  const props: SolutionDetailsPageTemplateProps = {
    ...page,
    solution,
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
    <GitBookTemplate
      menuName={props.solution.title}
      breadcrumbs={[
        ...pageToBreadcrumbs('solutions', [
          {
            name: props.solution.title,
            path: props.solution.slug,
          },
        ]),
      ]}
      menuDistanceFromTop={0}
      contentMarginTop={0}
      {...props}
    />
  );
};

export default Page;
