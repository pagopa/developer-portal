import {
  makeHreflangAlternates,
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getCaseHistory } from '@/lib/api';
import CaseHistoryPageTemplate from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  convertSeoToStructuredDataArticle,
  getItemFromPaths,
} from '@/helpers/structuredData.helpers';
import { notFound } from 'next/navigation';
import { CaseHistoriesRepository } from '@/lib/caseHistories';

type Params = {
  locale: string;
  caseHistorySlug: string;
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, caseHistorySlug } = await props.params;
  const caseHistory = await getCaseHistory(locale, caseHistorySlug);

  if (!caseHistory) {
    notFound();
  }

  if (caseHistory.seo) {
    const metadata = makeMetadataFromStrapi(caseHistory.seo);

    if (!caseHistory.seo.canonicalURL) {
      return metadata;
    }

    const localizedPaths = await CaseHistoriesRepository.getLocalizedPaths(
      locale,
      caseHistory
    );

    return {
      ...metadata,
      alternates: {
        ...metadata.alternates,
        ...makeHreflangAlternates(caseHistory.seo.canonicalURL, localizedPaths),
      },
    };
  }

  return makeMetadata({
    title: caseHistory.title,
    url: `${baseUrl}/${locale}/case-histories/${caseHistory.slug}`,
    langCode: locale,
  });
}

const Page = async (props: { params: Promise<Params> }) => {
  const { locale, caseHistorySlug } = await props.params;
  const caseHistory = await getCaseHistory(locale, caseHistorySlug);

  if (!caseHistory) {
    notFound();
  }

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: caseHistory.seo?.metaTitle || caseHistory.title,
        item: getItemFromPaths(locale, ['case-histories', caseHistory.slug]),
      },
    ],
    seo: caseHistory.seo,
    things: [convertSeoToStructuredDataArticle(caseHistory.seo)],
  });

  return (
    <>
      {structuredData}
      <CaseHistoryPageTemplate {...caseHistory} />
    </>
  );
};

export default Page;
