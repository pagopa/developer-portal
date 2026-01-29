import { getVisibleInListWebinars } from '@/lib/api';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getWebinarCategoriesProps } from '@/lib/cmsApi';
import WebinarsTemplate from '@/components/organisms/WebinarsTemplate/WebinarsTemplate';
import { Suspense } from 'react';
import Spinner from '@/components/atoms/Spinner/Spinner';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return makeMetadata({
    title: 'PagoPA DevPortal - Webinars',
    description: 'I nostri webinar',
    url: `${baseUrl}/${params.locale}/webinars`,
    locale: 'it_IT',
  });
}

const Webinars = async (props: { params: Promise<{ locale: string }> }) => {
  const { locale } = await props.params;
  const webinars = await getVisibleInListWebinars(locale);
  const categories = await getWebinarCategoriesProps(locale);

  return (
    <Suspense fallback={<Spinner />}>
      <WebinarsTemplate
        locale={locale}
        webinars={webinars}
        categories={categories}
      />
    </Suspense>
  );
};

export default Webinars;
