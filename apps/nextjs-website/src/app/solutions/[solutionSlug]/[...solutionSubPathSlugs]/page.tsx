import React from 'react';
import {
  gitBookPagesWithTitle,
  spaceToPrefixMap,
  urlReplacesMap,
} from '@/_contents/products';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { getSolutionDetail, getSolutionSubPaths } from '@/lib/api';
import GitBookTemplate from '@/components/templates/GitBookTemplate/GitBookTemplate';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { getSolutionsProps } from '@/lib/cmsApi';
import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';

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

export async function generateStaticParams() {
  const solutions = await getSolutionsProps();
  return solutions.flatMap(getSolutionSubPaths);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const props = await getSolutionDetail(
    params?.solutionSlug,
    params?.solutionSubPathSlugs
  );

  return (
    {} ||
    makeMetadata({
      title: props?.solution.title,
      url: props
        ? `/solutions/${
            props?.solution.slug
          }/${params.solutionSubPathSlugs.join('/')}`
        : '',
    })
  );
}

const Page = async ({ params }: { params: Params }) => {
  const solutionProps = await getSolutionDetail(
    params?.solutionSlug,
    params?.solutionSubPathSlugs
  );

  if (!solutionProps) {
    return null;
  }

  const { page, solution, source } = solutionProps;
  const props: SolutionDetailPageTemplateProps = {
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
  );
};

export default Page;
