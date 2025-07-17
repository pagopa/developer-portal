import { getVisibleInListWebinars } from '@/lib/api';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getWebinarCategoriesProps } from '@/lib/cmsApi';
import WebinarsTemplate from '@/components/organisms/WebinarsTemplate/WebinarsTemplate';

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: 'PagoPA DevPortal - Webinars',
    description: 'I nostri webinar',
    url: `${baseUrl}/webinars`,
    locale: 'it_IT',
  });
}

const Webinars = async () => {
  const webinars = await getVisibleInListWebinars();
  const categories = await getWebinarCategoriesProps();

  // TODO: Add loader
  return <WebinarsTemplate webinars={webinars} categories={categories} />;
};

export default Webinars;
