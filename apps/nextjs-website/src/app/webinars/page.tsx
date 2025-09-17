import { getVisibleInListWebinars } from '@/lib/api';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import dynamic from 'next/dynamic';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { getWebinarCategoriesProps } from '@/lib/cmsApi';

export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: 'PagoPA DevPortal - Webinars',
    description: 'I nostri webinar',
    url: `${baseUrl}/webinars`,
    locale: 'it_IT'
  });
}

const NotSsrWebinarsTemplate = dynamic(
  () => import('@/components/organisms/WebinarsTemplate/WebinarsTemplate'),
  {
    loading: () => <Spinner />
  }
);

const Webinars = async () => {
  const webinars = await getVisibleInListWebinars();
  const categories = await getWebinarCategoriesProps();

  return <NotSsrWebinarsTemplate webinars={webinars} categories={categories} />;
};

export default Webinars;
