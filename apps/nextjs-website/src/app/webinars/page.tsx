import { getVisibleInListWebinars } from '@/lib/api';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getWebinarCategoriesProps } from '@/lib/cmsApi';
import WebinarsTemplate from '@/components/organisms/WebinarsTemplate/WebinarsTemplate';
import { Suspense } from 'react';
import Spinner from '@/components/atoms/Spinner/Spinner';

export const dynamic = 'force-dynamic';

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

  return (
    <Suspense fallback={<Spinner />}>
      <WebinarsTemplate webinars={webinars} categories={categories} />
    </Suspense>
  );
};

export default Webinars;
