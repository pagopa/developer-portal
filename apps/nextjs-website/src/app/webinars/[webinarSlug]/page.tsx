import { getWebinar } from '@/lib/api';
import { NotSsrWebinarDetailTemplate } from '@/components/ClientDynamicComponents';
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
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const webinar = await getWebinar(resolvedParams?.webinarSlug);

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

const Page = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params;
  const webinar = await getWebinar(resolvedParams?.webinarSlug);

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
