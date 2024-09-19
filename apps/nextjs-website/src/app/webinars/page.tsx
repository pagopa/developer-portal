import { getVisibleInListWebinars } from '@/lib/api';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import dynamic from 'next/dynamic';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: 'PagoPA DevPortal - Webinars',
    description: 'I nostri webinar',
    url: `${baseUrl}/webinars`,
    locale: 'it_IT',
  });
}

const NotSsrWebinarsTemplate = dynamic(
  () => import('@/components/organisms/WebinarsTemplate/WebinarsTemplate'),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

const Webinars = async () => {
  const webinars = await getVisibleInListWebinars();

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: 'Webinars',
        item: getItemFromPaths(['webinars']),
      },
    ],
    seo: undefined, // TODO: add SEO when available
  });

  return (
    <>
      {structuredData}
      <NotSsrWebinarsTemplate webinars={webinars} />
    </>
  );
};

export default Webinars;
