import { getVisibleInListWebinars } from '@/lib/api';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import nextDynamic from 'next/dynamic';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { getWebinarCategoriesProps } from '@/lib/cmsApi';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: 'PagoPA DevPortal - Webinars',
    description: 'I nostri webinar',
    url: `${baseUrl}/webinars`,
    locale: 'it_IT',
  });
}

const NotSsrWebinarsTemplate = nextDynamic(
  () => import('@/components/organisms/WebinarsTemplate/WebinarsTemplate'),
  {
    loading: () => <Spinner />,
  }
);

const Webinars = async () => {
  const webinars = await getVisibleInListWebinars();
  const categories = await getWebinarCategoriesProps();

  return <NotSsrWebinarsTemplate webinars={webinars} categories={categories} />;
};

export default Webinars;
