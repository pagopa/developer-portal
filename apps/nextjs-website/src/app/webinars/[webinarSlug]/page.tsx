import { getWebinar } from '@/lib/api';
import dynamic from 'next/dynamic';
import Spinner from '@/components/atoms/Spinner/Spinner';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';

type Params = {
  webinarSlug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
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

const NotSsrWebinarDetailTemplate = dynamic(
  () =>
    import(
      '@/components/templates/WebinarDetailTemplate/WebinarDetailTemplate'
    ),
  {
    loading: () => <Spinner />,
  }
);

const Page = async ({ params }: { params: Params }) => {
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
      <NotSsrWebinarDetailTemplate webinar={webinar} />
    </>
  );
};

export default Page;
