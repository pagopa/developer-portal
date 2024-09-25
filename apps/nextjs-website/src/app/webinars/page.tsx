import { getVisibleInListWebinars } from '@/lib/api';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import dynamic from 'next/dynamic';
import Spinner from '@/components/atoms/Spinner/Spinner';

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

  return <NotSsrWebinarsTemplate webinars={webinars} />;
};

export default Webinars;
