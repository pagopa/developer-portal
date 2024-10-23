import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getSolution } from '@/lib/api';
import SolutionTemplate from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { getSolutionsProps } from '@/lib/cmsApi';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';

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
    ],
    seo: solution.seo,
  });

  return (
    <>
      {structuredData}
      <SolutionTemplate {...solution} />
    </>
  );
};

export default Page;
