import { getWebinar } from '@/lib/api';
import dynamic from 'next/dynamic';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import { getWebinarsProps } from '@/lib/cmsApi';

type Params = {
  webinarSlug: string;
};

// export async function generateStaticParams() {
//   const webinars = await getWebinarsProps();
//   return [...webinars].map(({ slug }) => ({
//     webinarSlug: slug,
//   }));
// }

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const webinar = await getWebinar(params?.webinarSlug);

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
    ssr: false,
    loading: () => <Spinner />,
  }
);

const Page = async ({ params }: { params: Params }) => {
  const webinar = await getWebinar(params?.webinarSlug);

  return <NotSsrWebinarDetailTemplate webinar={webinar} />;
};

export default Page;
