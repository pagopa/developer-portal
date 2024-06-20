import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getCaseHistoriesProps } from '@/lib/cmsApi';
import { getCaseHistory } from '@/lib/api';
import CaseHistoryPageTemplate from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';

type Params = {
  caseHistorySlug: string;
};

export async function generateStaticParams() {
  const caseHistories = await getCaseHistoriesProps();
  return [...caseHistories].map(({ slug }) => ({
    caseHistorySlug: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const caseHistory = await getCaseHistory(params?.caseHistorySlug);

  return makeMetadata({
    title: caseHistory.title,
    url: `${baseUrl}/case-histories/${caseHistory.slug}`,
    locale: 'it_IT',
  });
}

const Page = async ({ params }: { params: Params }) => {
  const caseHistory = await getCaseHistory(params?.caseHistorySlug);

  return <CaseHistoryPageTemplate {...caseHistory} />;
};

export default Page;
