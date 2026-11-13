import { getWebinar } from '@/lib/api';
import {
  makeHreflangAlternates,
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { browserEnv } from '@/browserConfig';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import WebinarDetailTemplate from '@/components/templates/WebinarDetailTemplate/WebinarDetailTemplate';
import { Suspense } from 'react';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { notFound } from 'next/navigation';
import { WebinarsRepository } from '@/lib/webinars';

type Params = {
  locale: string;
  webinarSlug: string;
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, webinarSlug } = await props.params;
  const webinar = await getWebinar(locale, webinarSlug);

  if (!webinar) {
    notFound();
  }

  if (webinar.seo) {
    const metadata = makeMetadataFromStrapi(webinar.seo);

    if (!webinar.seo.canonicalURL) {
      return metadata;
    }

    const localizedPaths = await WebinarsRepository.getLocalizedPaths(
      locale,
      webinar
    );

    return {
      ...metadata,
      alternates: {
        ...metadata.alternates,
        ...makeHreflangAlternates(webinar.seo.canonicalURL, localizedPaths),
      },
    };
  }

  return makeMetadata({
    title: webinar.title,
    url: `${browserEnv.config.baseUrl}/${locale}/webinars/${webinar.slug}`,
    langCode: locale,
    image: webinar.imagePath,
  });
}

const Page = async (props: { params: Promise<Params> }) => {
  const { locale, webinarSlug } = await props.params;
  const webinar = await getWebinar(locale, webinarSlug);

  if (!webinar) {
    notFound();
  }

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: 'Webinars',
        item: getItemFromPaths(locale, ['webinars']),
      },
      {
        name: webinar.seo?.metaTitle,
        item: getItemFromPaths(locale, ['webinars', webinar.slug]),
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
