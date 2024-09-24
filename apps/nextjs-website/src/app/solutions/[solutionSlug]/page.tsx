import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getSolution } from '@/lib/api';
import SolutionTemplate from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { getSolutionsProps } from '@/lib/cmsApi';

type Params = {
  solutionSlug: string;
};

export async function generateStaticParams() {
  const solutions = await getSolutionsProps();
  return [...solutions].map(({ slug }) => ({
    solutionSlug: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const solution = await getSolution(params?.solutionSlug);

  if (solution.seo) {
    return makeMetadataFromStrapi(solution.seo);
  }

  return makeMetadata({
    title: solution.title,
    url: `${baseUrl}/solutions/${solution.slug}`,
    locale: 'it_IT',
  });
}

const Page = async ({ params }: { params: Params }) => {
  const solution = await getSolution(params?.solutionSlug);

  return <SolutionTemplate {...solution} />;
};

export default Page;
