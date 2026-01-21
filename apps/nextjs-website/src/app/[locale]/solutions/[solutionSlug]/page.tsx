import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getSolution } from '@/lib/api';
import SolutionTemplate from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';

type Params = {
  locale: string;
  solutionSlug: string;
};
export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const params = await props.params;
  const solution = await getSolution(params.locale, params?.solutionSlug);

  if (solution.seo) {
    return makeMetadataFromStrapi(solution.seo);
  }

  return makeMetadata({
    title: solution.title,
    url: `${baseUrl}/solutions/${solution.slug}`,
    locale: 'it_IT',
  });
}

const Page = async (props: { params: Promise<Params> }) => {
  const params = await props.params;
  const solution = await getSolution(params.locale, params?.solutionSlug);

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
