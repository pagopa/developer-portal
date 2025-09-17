import {
  makeMetadata,
  makeMetadataFromStrapi
} from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getSolution } from '@/lib/api';
import SolutionTemplate from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';
import { getSolutionsProps } from '@/lib/cmsApi';

type Params = {
  solutionSlug: string;
};
// TODO: remove when solutions metadata will be managed in strapi
export const revalidate = 300;
export async function generateStaticParams() {
  const solutions = await getSolutionsProps();
  return [...solutions].map(({ slug }) => ({
    solutionSlug: slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const solution = await getSolution(resolvedParams?.solutionSlug);

  if (solution.seo) {
    return makeMetadataFromStrapi(solution.seo);
  }

  return makeMetadata({
    title: solution.title,
    url: `${baseUrl}/solutions/${solution.slug}`,
    locale: 'it_IT'
  });
}

const Page = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params;
  const solution = await getSolution(resolvedParams?.solutionSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: 'Solutions',
        item: getItemFromPaths(['solutions'])
      },
      {
        name: solution.seo?.metaTitle,
        item: getItemFromPaths(['solutions', solution.slug])
      }
    ],
    seo: solution.seo
  });

  return (
    <>
      {structuredData}
      <SolutionTemplate {...solution} />
    </>
  );
};

export default Page;
