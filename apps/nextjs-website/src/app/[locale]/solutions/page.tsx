import SolutionListTemplate from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { getSolutionListPage } from '@/lib/api';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { baseUrl } from '@/config';
import { SUPPORTED_LOCALES } from '../../../locales';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return makeMetadata({
    title: 'Soluzioni',
    url: `${baseUrl}/${locale}/solutions`,
    langCode: locale,
  });
}

export const dynamic = 'force-dynamic';

const Page = async (props: { params: Promise<{ locale: string }> }) => {
  const { locale } = await props.params;
  const solutionsList = await getSolutionListPage(locale);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: solutionsList.seo?.metaTitle,
        item: getItemFromPaths(locale, ['solutions']),
      },
    ],
    seo: solutionsList.seo,
  });

  return (
    <>
      {structuredData}
      <SolutionListTemplate
        hero={solutionsList.hero}
        solutions={solutionsList.solutions}
        features={solutionsList.features}
        successStories={solutionsList.successStories}
      />
    </>
  );
};

export default Page;
