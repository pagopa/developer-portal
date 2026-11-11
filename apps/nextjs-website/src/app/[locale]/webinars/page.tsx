import { getVisibleInListWebinars } from '@/lib/api';
import { getWebinarCategories } from '@/lib/api';
import {
  makeHreflangAlternates,
  makeMetadata,
} from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { browserEnv } from '@/browserConfig';
import WebinarsTemplate from '@/components/organisms/WebinarsTemplate/WebinarsTemplate';
import { Suspense } from 'react';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { SUPPORTED_LOCALES } from '@/locales';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

  const localizedPaths = (
    await Promise.all(
      SUPPORTED_LOCALES.map(async ({ langCode }) => {
        const webinars = await getVisibleInListWebinars(langCode);

        return webinars.length > 0
          ? {
              langCode,
              path: `/${langCode}/webinars`,
            }
          : null;
      })
    )
  ).filter(
    (item): item is { readonly langCode: string; readonly path: string } =>
      item !== null
  );

  const canonicalURL = `${browserEnv.config.baseUrl}/${locale}/webinars`;

  return {
    ...makeMetadata({
      title: 'PagoPA DevPortal - Webinars',
      description: 'I nostri webinar',
      url: canonicalURL,
      langCode: locale,
    }),
    alternates: {
      canonical: canonicalURL,
      ...makeHreflangAlternates(browserEnv.config.baseUrl, localizedPaths),
    },
  };
}

const Webinars = async (props: { params: Promise<{ locale: string }> }) => {
  const { locale } = await props.params;
  const webinars = await getVisibleInListWebinars(locale);
  const categories = await getWebinarCategories(locale);

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
