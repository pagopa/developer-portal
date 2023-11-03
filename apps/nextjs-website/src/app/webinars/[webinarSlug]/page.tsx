import { translations } from '@/_contents/translations';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import SubscribeCta from '@/components/atoms/SubscribeCta/SubscribeCta';
import StartInfo from '@/components/organisms/StartInfo/StartInfo';
import { getWebinar, getWebinars } from '@/lib/api';
import { Button } from '@mui/material';

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
  const { webinar: webinarLabels } = translations;

  return (
    <>
      {webinar.subscribeCtaLabel && (
        <SubscribeCta label={webinar.subscribeCtaLabel}></SubscribeCta>
      )}
      {webinar.startInfo && (
        <StartInfo
          cardVariant='outlined'
          title={webinar.startInfo.title}
          cards={[...webinar.startInfo.cards]}
        />
      )}
      <RelatedLinks
        title={webinarLabels.relatedLinksTitle}
        links={
          webinar.relatedLinks?.map(({ path, name }) => ({
            text: name,
            href: path,
          })) || []
        }
      />
    </>
  );
};

export default Page;
