import ApiDataListPageTemplate from '@/components/templates/ApiDataListPageTemplate/ApiDataListPageTemplate';
import { baseUrl } from '@/config';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { getApiDataListPages } from '@/lib/api';
import { getApiDataListPageProps } from '@/lib/cmsApi';
import { Typography } from '@mui/material';
import { Metadata } from 'next';

type Params = {
  productSlug: string;
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
  const apiDataListPage = await getApiDataListPages(params?.productSlug);

  return makeMetadata({
    title: apiDataListPage?.hero.title,
    url: `${baseUrl}/${apiDataListPage?.breadcrumbs.product.slug}/api-list-page`,
    locale: 'it_IT',
  });
}

const ApiDataListPage = async ({ params }: { params: Params }) => {
  console.log(params.productSlug);
  const ApiDataListPageProps = await getApiDataListPages(params.productSlug);
  if (ApiDataListPageProps)
    return (
      <>
        <Typography>{'ciao'}</Typography>
        <ApiDataListPageTemplate {...ApiDataListPageProps} />
      </>
    );
  else return <Typography>BUBBA</Typography>;
};

export default ApiDataListPage;
