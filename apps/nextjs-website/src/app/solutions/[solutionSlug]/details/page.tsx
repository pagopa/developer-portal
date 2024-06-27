import React from 'react';
import {
  gitBookPagesWithTitle,
  spaceToPrefixMap,
  urlReplacesMap,
} from '@/_contents/products';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { getSolutionsProps } from '@/lib/cmsApi';
import { getSolution } from '@/lib/solutions';
import SolutionDetailsPageTemplate, {
  SolutionDetailsPageTemplateProps,
} from '@/components/templates/SolutionDetailsPageTemplate/SolutionDetailsPageTemplate';

type Params = {
  solutionSlug: string;
};

export async function generateStaticParams() {
  const solutions = await getSolutionsProps();
  return solutions.map(({ solutionSlug }) => ({
    solutionSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const props = await getSolution(params?.solutionSlug);

  return makeMetadata({
    title: props?.solution?.title,
    url: `/solutions/${props?.solution.landingUseCaseFile}/${props?.solution?.slug}`,
  });
}

const Page = async ({ params }: { params: Params }) => {
  const solutionProps = await getSolution(params?.solutionSlug);

  if (!solutionProps) {
    return null;
  }

  const { page, solution, source, bannerLinks } = solutionProps;
  const props: SolutionDetailsPageTemplateProps = {
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

  return <SolutionDetailsPageTemplate {...props} />;
};

export default Page;
