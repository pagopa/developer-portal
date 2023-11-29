import { getWebinar, getWebinars } from '@/lib/api';
import WebinarDetailTemplate from '@/components/organisms/WebinarDetailTemplate/WebinarDetailTemplate';

type Params = {
  webinarSlug: string;
};

export async function generateStaticParams() {
  const webinars = await getWebinars();
  return [...webinars].map(({ slug }) => ({
    webinarSlug: slug,
  }));
}

const Page = async ({ params }: { params: Params }) => {
  const webinar = await getWebinar(params?.webinarSlug);

  return <WebinarDetailTemplate webinar={webinar} />;
};

export default Page;
