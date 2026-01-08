import { getWebinar } from '@/lib/api';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import WebinarDetailTemplate from '@/components/templates/WebinarDetailTemplate/WebinarDetailTemplate';
import { Suspense } from 'react';
import Spinner from '@/components/atoms/Spinner/Spinner';

type Params = {
  webinarSlug: string;
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const params = await props.params;
  const webinar = await getWebinar(params?.webinarSlug);

  if (webinar.seo) {
    return makeMetadataFromStrapi(webinar.seo);
  }

  return makeMetadata({
    title: webinar.title,
    url: `${baseUrl}/webinars/${webinar.slug}`,
    locale: 'it_IT',
    image: webinar.imagePath,
  });
}

const Page = async (props: { params: Promise<Params> }) => {
  const params = await props.params;
  const webinar = await getWebinar(params?.webinarSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: 'Webinars',
        item: getItemFromPaths(['webinars']),
      },
      {
        name: webinar.seo?.metaTitle,
        item: getItemFromPaths(['webinars', webinar.slug]),
      },
    ],
    seo: webinar.seo,
  });

  return (
    <>
      {structuredData}
      <Suspense fallback={<Spinner />}>
        <WebinarDetailTemplate webinar={webinar} />
      </Suspense>
    </>
  );
};

export default Page;
