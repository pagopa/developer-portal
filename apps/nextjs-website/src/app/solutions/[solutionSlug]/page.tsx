import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getSolution } from '@/lib/api';
import SolutionTemplate from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { getFullSolutionsProps } from '@/lib/cmsApi';

type Params = {
  solutionSlug: string;
};

export async function generateStaticParams() {
  const solutions = await getFullSolutionsProps();
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
