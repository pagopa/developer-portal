import { getWebinar, getWebinars } from '@/lib/api';
import dynamic from 'next/dynamic';
import Spinner from '@/components/atoms/Spinner/Spinner';

type Params = {
  webinarSlug: string;
};

export async function generateStaticParams() {
  const webinars = await getWebinars();
  return [...webinars].map(({ slug }) => ({
    webinarSlug: slug,
  }));
}

const NotSsrWebinarDetailTemplate = dynamic(
  () =>
    import(
      '@/components/organisms/WebinarDetailTemplate/WebinarDetailTemplate'
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
