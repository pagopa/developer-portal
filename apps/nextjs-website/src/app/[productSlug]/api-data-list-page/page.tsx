import ApiListPageTemplate from '@/components/templates/ApiDataListPageTemplate/ApiDataListPageTemplate';
import { baseUrl } from '@/config';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { getApiDataListPages } from '@/lib/api';
import { getApiDataListPageProps } from '@/lib/cmsApi';
import { Typography } from '@mui/material';
import { Metadata } from 'next';

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  const apiDataList = await getApiDataListPageProps();
  return [...apiDataList].map(({ breadcrumbs }) => ({
    slug: breadcrumbs.product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const apiListPage = await getApiDataListPages(params?.slug);

  return makeMetadata({
    title: apiListPage?.hero.title,
    url: `${baseUrl}/${apiListPage?.breadcrumbs.product.slug}/api-list-page`,
    locale: 'it_IT',
  });
}

const ApiListPage = async ({ params }: { params: Params }) => {
  const ApiListPageProps = await getApiDataListPages(params.slug);
  if (ApiListPageProps)
    return (
      <>
        <Typography>{'ciao'}</Typography>
        <ApiListPageTemplate {...ApiListPageProps} />
      </>
    );
};

export default ApiListPage;
