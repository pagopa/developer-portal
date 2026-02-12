import {
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
import { SUPPORTED_LOCALES } from '@/locales';

type Params = {
  locale: string;
  caseHistorySlug: string;
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, caseHistorySlug } = await props.params;
  const caseHistory = await getCaseHistory(locale, caseHistorySlug);

  if (caseHistory?.seo) {
    return makeMetadataFromStrapi(caseHistory.seo);
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
