import ApiListPageTemplate from '@/components/templates/ApiListPageTemplate/ApiListPageTemplate';
import { baseUrl } from '@/config';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { getApiListPages } from '@/lib/api';
import { getApiListPageProps } from '@/lib/cmsApi';
import { Typography } from '@mui/material';
import { Metadata } from 'next';

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  const caseHistories = await getApiListPageProps();
  return [...caseHistories].map(({ product }) => ({
    slug: product,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const apiListPage = await getApiListPages(params?.slug);

  return makeMetadata({
    title: apiListPage?.hero.title,
    url: `${baseUrl}/${apiListPage?.product}/api-list-page`,
    locale: 'it_IT',
  });
}

const ApiListPage = async ({ params }: { params: Params }) => {
  const ApiListPageProps = await getApiListPages(params.slug);
  if (ApiListPageProps)
    return (
      <>
        <Typography>{'ciao'}</Typography>
        <ApiListPageTemplate {...ApiListPageProps} />
      </>
    );
};

export default ApiListPage;
